/**
 * Worker de soyluisflores.es (27/10/2026).
 *
 * La web sigue siendo estática: los archivos de dist/ los sirve Cloudflare
 * directamente y este código no se ejecuta para ellos. Solo /api/* pasa por
 * aquí (run_worker_first en wrangler.jsonc).
 *
 * GET y POST /api/agenda: la agenda propia conectada a Google Calendar
 * (agenda.ts, ver AGENDA.md).
 *
 * POST /api/chat: el asistente de IA de la web. Manda la conversación a
 * Claude con las instrucciones (instrucciones.ts) y la base de conocimiento
 * (/agente/conocimiento.txt, generada en el build).
 *
 * - Sin la clave ANTHROPIC_API_KEY responde 503 y el chat de la web vuelve a
 *   las respuestas de las preguntas frecuentes, como antes. Así la web nunca
 *   se queda con un chat roto.
 * - No guarda las conversaciones ni las escribe en los registros: solo anota
 *   los tokens usados, para seguir el costo.
 * - Solo acepta peticiones desde la propia web, con un límite por IP y
 *   mensajes de tamaño acotado.
 */
import Anthropic from "@anthropic-ai/sdk";
import { INSTRUCCIONES } from "./instrucciones";
import { agenda, citaAgenda, configAgenda, recordatorios, zonaValida, type EnvAgenda } from "./agenda";
import { HERRAMIENTAS, usarHerramienta, type CitaPropuesta } from "./chat-agenda";
import { contar, resumenSemanal } from "./estadisticas";
import { secuencia, suscripciones, type EnvSuscripciones } from "./suscripciones";
import { voz, type EnvVoz } from "./voz";

interface Env extends EnvAgenda, EnvSuscripciones, EnvVoz {
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Secreto del Worker, en el panel de Cloudflare. Ver AGENTE.md. */
  ANTHROPIC_API_KEY?: string;
  /** Modelo del chat (wrangler.jsonc). Desde el 2/11/2026, claude-haiku-5-5. */
  MODELO_CHAT?: string;
  /** Tope de mensajes con IA al día en toda la web (wrangler.jsonc). */
  LIMITE_DIARIO_CHAT?: string;
  /** Solo para pruebas locales contra un servidor simulado. */
  ANTHROPIC_BASE_URL?: string;
  LIMITE_CHAT?: { limit(opciones: { key: string }): Promise<{ success: boolean }> };
}

// Ahorro (2/11/2026): Haiku 5.5 cuesta 0,10 $ / 0,50 $ por millón de tokens,
// veinte veces menos que Sonnet 5.5, y basta para orientar y agendar.
const MODELO = "claude-haiku-5-5";
// Respuestas de unas 60 palabras: 800 tokens es un techo de seguridad, no
// el gasto normal.
const MAX_SALIDA = 800;
// Si se pasa este número de mensajes con IA en un día (hora UTC), el chat
// sigue con las preguntas frecuentes, sin IA, hasta el día siguiente.
const LIMITE_DIARIO = 300;
// Modelos que aceptan el reintento automático en otro modelo si Claude
// rechaza una petición por seguridad (fallbacks: "default").
const CON_RESPALDO = new Set(["claude-opus-5-5", "claude-opus-5", "claude-fable-5-1", "claude-sonnet-5-5"]);

const ORIGENES = new Set(["https://soyluisflores.es", "https://www.soyluisflores.es"]);
// Una conversación que termina en cita tiene más turnos: nombre, correo, hora…
const MAX_MENSAJES = 24;
const MAX_CARACTERES = 800;
// Las respuestas del asistente llevan enlaces y la línea de opciones.
const MAX_CARACTERES_ASISTENTE = 1500;
const MAX_TOTAL = 14000;
// Vueltas máximas de herramientas por mensaje (ver horarios, preparar cita).
const MAX_VUELTAS = 4;

const AVISO_FALLO =
  "Ahora mismo no puedo responder. Puedes agendar la llamada en https://soyluisflores.es/contacto o escribir a Luis por WhatsApp al +34 631 65 49 19.";

type Mensaje = { rol: "usuario" | "asistente"; texto: string };

function json(cuerpo: unknown, estado = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

function origenPermitido(origen: string | null): boolean {
  if (!origen) return false;
  if (ORIGENES.has(origen)) return true;
  // Desarrollo local (wrangler dev, astro dev).
  try {
    const { hostname, protocol } = new URL(origen);
    return protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1");
  } catch {
    return false;
  }
}

/** Valida la conversación y la pasa al formato de la API. Null si no vale. */
function aMensajes(datos: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  if (!datos || typeof datos !== "object") return null;
  const lista = (datos as { mensajes?: unknown }).mensajes;
  if (!Array.isArray(lista) || lista.length === 0) return null;

  const validos: Mensaje[] = [];
  for (const m of lista.slice(-MAX_MENSAJES)) {
    if (!m || typeof m !== "object") return null;
    const { rol, texto } = m as Partial<Mensaje>;
    if ((rol !== "usuario" && rol !== "asistente") || typeof texto !== "string") return null;
    const limpio = texto.trim();
    if (!limpio || limpio.length > (rol === "asistente" ? MAX_CARACTERES_ASISTENTE : MAX_CARACTERES)) return null;
    validos.push({ rol, texto: limpio });
  }
  // La API exige empezar por el usuario y alternar; el último es la pregunta.
  while (validos.length && validos[0].rol !== "usuario") validos.shift();
  if (!validos.length || validos[validos.length - 1].rol !== "usuario") return null;
  if (validos.reduce((n, m) => n + m.texto.length, 0) > MAX_TOTAL) return null;
  for (let i = 1; i < validos.length; i++) {
    if (validos[i].rol === validos[i - 1].rol) return null;
  }
  return validos.map((m) => ({ role: m.rol === "usuario" ? "user" : "assistant", content: m.texto }));
}

/**
 * Tope diario de gasto: cuenta los mensajes con IA del día en el KV de la
 * agenda. Es aproximado (el KV tarda unos segundos en verse igual en todo el
 * mundo), suficiente para que un abuso no vacíe el crédito. Sin KV, no limita.
 */
async function dentroDelTopeDiario(env: Env): Promise<boolean> {
  const kv = env.AGENDA_CONFIG;
  if (!kv) return true;
  const tope = Number(env.LIMITE_DIARIO_CHAT) || LIMITE_DIARIO;
  const clave = `ia:dia:${new Date().toISOString().slice(0, 10)}`;
  const usados = Number(await kv.get(clave, "json")) || 0;
  if (usados >= tope) return false;
  await kv.put(clave, String(usados + 1), { expirationTtl: 3 * 86_400 });
  return true;
}

// La base de conocimiento cambia solo con cada publicación: se lee una vez
// por instancia del Worker.
let conocimiento: string | null = null;
async function leerConocimiento(env: Env, base: string): Promise<string> {
  if (conocimiento) return conocimiento;
  const r = await env.ASSETS.fetch(new Request(new URL("/agente/conocimiento.txt", base)));
  if (!r.ok) throw new Error(`Base de conocimiento: ${r.status}`);
  conocimiento = await r.text();
  return conocimiento;
}

async function chat(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== "POST") return json({ error: "metodo" }, 405);
  if (!origenPermitido(request.headers.get("Origin"))) return json({ error: "origen" }, 403);
  if (!env.ANTHROPIC_API_KEY) return json({ error: "sin-ia" }, 503);

  if (env.LIMITE_CHAT) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "sin-ip";
    const { success } = await env.LIMITE_CHAT.limit({ key: `chat:${ip}` });
    if (!success) {
      return json({ error: "limite", respuesta: "Vas muy rápido. Espera un minuto y vuelve a preguntarme." }, 429);
    }
  }

  let datos: unknown;
  try {
    datos = await request.json();
  } catch {
    return json({ error: "invalido" }, 400);
  }
  const messages = aMensajes(datos);
  if (!messages) return json({ error: "invalido" }, 400);
  if (!(await dentroDelTopeDiario(env))) {
    console.log(JSON.stringify({ chat: "tope-diario" }));
    // «sin-ia»: el chat pasa a responder con las preguntas frecuentes.
    return json({ error: "sin-ia" }, 503);
  }
  // Antes del bucle de herramientas, que añade turnos a «messages».
  const primerMensaje = messages.length === 1;

  const modelo = env.MODELO_CHAT || MODELO;
  const client = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
    baseURL: env.ANTHROPIC_BASE_URL || undefined,
    maxRetries: 1,
    timeout: 25_000,
  });

  // Zona horaria del visitante (la manda el chat), para hablarle en su hora.
  const zonaPedida = (datos as { zona?: unknown }).zona;
  const zona = typeof zonaPedida === "string" && zonaPedida.length <= 64 && zonaValida(zonaPedida) ? zonaPedida : "Europe/Madrid";
  const hoy = new Intl.DateTimeFormat("es", {
    timeZone: zona,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(Date.now());

  try {
    const base = await leerConocimiento(env, request.url);
    let cita: CitaPropuesta | undefined;
    let respuesta: Anthropic.Beta.BetaMessage | undefined;

    // Bucle de herramientas: Claude puede mirar horarios y preparar la cita
    // antes de contestar. Como mucho MAX_VUELTAS por mensaje.
    for (let vuelta = 0; vuelta < MAX_VUELTAS; vuelta++) {
      respuesta = await client.beta.messages.create({
        model: modelo,
        max_tokens: MAX_SALIDA,
        output_config: { effort: "low" },
        // Sin razonamiento interno: se cobra como salida y para respuestas de
        // 60 palabras no hace falta. Haiku acepta «disabled»; Sonnet 5.5 lo
        // rechaza y usa «between_tools» (solo piensa entre herramientas).
        thinking: { type: modelo.startsWith("claude-haiku") ? "disabled" : "between_tools" },
        // Instrucciones y conocimiento son iguales en todas las peticiones de
        // una misma publicación: van en caché y se cobran a una décima parte.
        // La fecha va detrás, fuera de la caché.
        system: [
          { type: "text", text: INSTRUCCIONES },
          { type: "text", text: base, cache_control: { type: "ephemeral" } },
          { type: "text", text: `Ahora para el visitante es ${hoy} (zona ${zona}).` },
        ],
        tools: HERRAMIENTAS,
        messages,
        ...(CON_RESPALDO.has(modelo)
          ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
          : {}),
      });

      const u = respuesta.usage;
      console.log(
        JSON.stringify({
          chat: "ok",
          vuelta,
          modelo: respuesta.model,
          entrada: u.input_tokens,
          cache_leida: u.cache_read_input_tokens,
          cache_escrita: u.cache_creation_input_tokens,
          salida: u.output_tokens,
        }),
      );

      if (respuesta.stop_reason !== "tool_use") break;
      const usos = respuesta.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      const resultados: Anthropic.Beta.BetaToolResultBlockParam[] = [];
      for (const uso of usos) {
        const r = await usarHerramienta(env, uso.name, uso.input, zona);
        if (r.cita) cita = r.cita;
        console.log(JSON.stringify({ chat: "herramienta", nombre: uso.name, error: Boolean(r.error) }));
        resultados.push({ type: "tool_result", tool_use_id: uso.id, content: r.texto, ...(r.error ? { is_error: true } : {}) });
      }
      // Todo el contenido de vuelta tal cual (también el razonamiento) y
      // todos los resultados en un solo mensaje.
      messages.push({ role: "assistant", content: respuesta.content });
      messages.push({ role: "user", content: resultados });
    }
    if (!respuesta) throw new Error("sin-respuesta");

    const texto = respuesta.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (respuesta.stop_reason === "refusal" || !texto) {
      return json({
        respuesta:
          "Eso no lo puedo responder aquí. Si tiene que ver con tu negocio, Luis lo ve contigo en la llamada: https://soyluisflores.es/contacto",
      });
    }
    // Solo números para el resumen semanal (estadisticas.ts).
    if (primerMensaje) ctx.waitUntil(contar(env, "conversaciones"));
    if (cita) ctx.waitUntil(contar(env, "tarjetas"));
    return json({ respuesta: texto, ...(cita ? { cita } : {}) });
  } catch (error) {
    // Sin el contenido de la conversación: solo el tipo de fallo.
    if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
      console.error(JSON.stringify({ chat: "clave", estado: error.status }));
      return json({ error: "sin-ia" }, 503);
    }
    if (error instanceof Anthropic.RateLimitError) {
      console.error(JSON.stringify({ chat: "limite-anthropic" }));
      return json({ error: "ocupado", respuesta: AVISO_FALLO }, 503);
    }
    if (error instanceof Anthropic.APIError) {
      console.error(JSON.stringify({ chat: "api", estado: error.status }));
    } else {
      console.error(JSON.stringify({ chat: "fallo", tipo: error instanceof Error ? error.name : "desconocido" }));
    }
    return json({ error: "fallo", respuesta: AVISO_FALLO }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/chat") return chat(request, env, ctx);
    if (pathname === "/api/voz") return voz(request, env, json, origenPermitido);
    if (pathname === "/api/agenda") return agenda(request, env, json, origenPermitido, ctx);
    if (pathname === "/api/agenda/cita" || pathname === "/api/agenda/cancelar") {
      return citaAgenda(request, env, json, origenPermitido, ctx);
    }
    if (pathname === "/api/suscribir" || pathname === "/api/suscribir/confirmar" || pathname === "/api/correo/baja") {
      return suscripciones(request, env, json, origenPermitido, ctx);
    }
    if (pathname === "/api/agenda/config") return configAgenda(request, env, json);
    if (pathname.startsWith("/api/")) return json({ error: "no-existe" }, 404);
    // Cualquier otra ruta: los archivos de la web (y su página 404).
    return env.ASSETS.fetch(request);
  },

  // Cron cada 10 minutos (wrangler.jsonc): recordatorios de la agenda,
  // correos de la secuencia de la guía y, los lunes, el resumen semanal.
  async scheduled(_evento: unknown, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(Promise.all([recordatorios(env), secuencia(env), resumenSemanal(env)]));
  },
};

interface ExecutionContext {
  waitUntil(promesa: Promise<unknown>): void;
}
