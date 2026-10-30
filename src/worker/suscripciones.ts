/**
 * Lista de correo de la guía gratis (30/10/2026). Ver EMAIL-MARKETING.md.
 *
 * POST /api/suscribir             → alta con consentimiento; manda el correo
 *                                   para confirmar (doble confirmación).
 * POST /api/suscribir/confirmar   → confirma, manda la guía y avisa al panel.
 * POST /api/correo/baja?e=&f=     → baja (botón de la página o «baja en un
 *                                   clic» de Gmail y Outlook).
 * Cron cada 10 minutos            → secuencia() manda el correo que toque.
 *
 * Datos en el KV SUSCRIPTORES, una entrada por correo (clave «s:<correo>»):
 * - Sin confirmar caduca sola a los 7 días.
 * - De baja se conservan solo el correo y la fecha, para no volver a
 *   escribirle.
 * Los enlaces van firmados con la clave de Resend: sin ella no hay lista.
 */
import { enviar, type EnvCorreo } from "./correo";
import { CONTACTO } from "./correo-plantillas";
import { confirmarSuscripcion, guiaPedida, proximoEnvio, SECUENCIA, TEXTO_CONSENTIMIENTO } from "./secuencia";
import { tituloGuia } from "../data/guias";
import { enviarAlPanel, type EnvPanel } from "./panel";

interface KV {
  get(clave: string, tipo: "json"): Promise<unknown>;
  put(clave: string, valor: string, opciones?: { expirationTtl?: number; metadata?: unknown }): Promise<void>;
  list(opciones: { prefix: string; cursor?: string; limit?: number }): Promise<{
    keys: { name: string; metadata?: unknown }[];
    list_complete: boolean;
    cursor?: string;
  }>;
}

export interface EnvSuscripciones extends EnvCorreo, EnvPanel {
  SUSCRIPTORES?: KV;
  LIMITE_AGENDA?: { limit(opciones: { key: string }): Promise<{ success: boolean }> };
}

type Estado = "pendiente" | "activo" | "terminado" | "baja";

interface Suscriptor {
  correo: string;
  nombre: string;
  estado: Estado;
  alta: number;
  /** Texto exacto que aceptó y cuándo: prueba del consentimiento. */
  consentimiento: { texto: string; fecha: number };
  origen: string;
  /** Guía que pidió (src/data/guias.ts). */
  guia?: string;
  confirmado?: number;
  paso: number;
  proximo?: number;
  baja?: number;
}

const CORREO = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const SIETE_DIAS = 7 * 86_400;
const POR_VUELTA = 40;

type Responder = (cuerpo: unknown, estado?: number) => Response;

const codificar = new TextEncoder();

async function firmar(env: EnvSuscripciones, uso: string, correo: string): Promise<string> {
  const clave = await crypto.subtle.importKey(
    "raw",
    codificar.encode(`lista:${env.RESEND_API_KEY ?? ""}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const firma = await crypto.subtle.sign("HMAC", clave, codificar.encode(`${uso}:${correo}`));
  let s = "";
  for (const b of new Uint8Array(firma)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "").slice(0, 32);
}

async function firmaValida(env: EnvSuscripciones, uso: string, correo: string, firma: string): Promise<boolean> {
  const buena = await firmar(env, uso, correo);
  if (firma.length !== buena.length) return false;
  let diferencia = 0;
  for (let i = 0; i < buena.length; i++) diferencia |= buena.charCodeAt(i) ^ firma.charCodeAt(i);
  return diferencia === 0;
}

async function enlaceFirmado(env: EnvSuscripciones, ruta: string, uso: string, correo: string): Promise<string> {
  return `${CONTACTO.web}${ruta}?e=${encodeURIComponent(correo)}&f=${await firmar(env, uso, correo)}`;
}

/**
 * Enlaces de baja: la página con el botón va al pie del correo; la dirección
 * del servidor, a la cabecera List-Unsubscribe (el botón de baja de Gmail y
 * Outlook la llama directamente, sin abrir nada).
 */
async function enlacesBaja(env: EnvSuscripciones, correo: string) {
  const pagina = await enlaceFirmado(env, "/correo/baja", "baja", correo);
  return { pagina, servidor: pagina.replace("/correo/baja", "/api/correo/baja") };
}

async function guardar(env: EnvSuscripciones, s: Suscriptor, ttl?: number) {
  await env.SUSCRIPTORES!.put(`s:${s.correo}`, JSON.stringify(s), {
    ...(ttl ? { expirationTtl: ttl } : {}),
    // En la lista se ve si toca enviar sin leer cada entrada.
    metadata: { estado: s.estado, proximo: s.proximo ?? 0 },
  });
}

async function leer(env: EnvSuscripciones, correo: string): Promise<Suscriptor | null> {
  return ((await env.SUSCRIPTORES!.get(`s:${correo}`, "json")) as Suscriptor | null) ?? null;
}

function texto(v: unknown, max: number): string | null {
  if (v === undefined || v === null) return "";
  if (typeof v !== "string") return null;
  const limpio = v.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return limpio.length > max ? null : limpio;
}

async function limite(env: EnvSuscripciones, request: Request, tipo: string): Promise<boolean> {
  if (!env.LIMITE_AGENDA) return true;
  const ip = request.headers.get("CF-Connecting-IP") ?? "sin-ip";
  const { success } = await env.LIMITE_AGENDA.limit({ key: `${tipo}:${ip}` });
  return success;
}

/** Manda el correo del paso actual y deja apuntado el siguiente. */
async function enviarPaso(env: EnvSuscripciones, s: Suscriptor): Promise<void> {
  const paso = SECUENCIA[s.paso];
  if (!paso || !s.confirmado) return;
  const baja = await enlacesBaja(env, s.correo);
  const ok = await enviar(
    env,
    s.correo,
    paso.crear({ nombre: s.nombre, baja: baja.pagina, guia: guiaPedida(s.guia) }),
    `secuencia-${paso.nombre}`,
    baja.servidor,
  );
  if (!ok) return; // se reintenta en la siguiente vuelta del cron
  s.paso += 1;
  const proximo = proximoEnvio(s.confirmado, s.paso);
  if (proximo === null) {
    s.estado = "terminado";
    delete s.proximo;
  } else {
    s.proximo = proximo;
  }
  await guardar(env, s);
}

export async function suscripciones(
  request: Request,
  env: EnvSuscripciones,
  json: Responder,
  origenPermitido: (origen: string | null) => boolean,
  ctx: { waitUntil(p: Promise<unknown>): void },
): Promise<Response> {
  const { pathname, searchParams } = new URL(request.url);
  if (request.method !== "POST") return json({ error: "metodo" }, 405);
  if (!env.SUSCRIPTORES || !env.RESEND_API_KEY) return json({ error: "sin-correo" }, 503);
  if (!(await limite(env, request, "lista"))) return json({ error: "limite" }, 429);

  // ------------------------------------------------------------------ Baja
  if (pathname === "/api/correo/baja") {
    // Llega desde la página (JSON) o desde el botón de baja de Gmail y
    // Outlook (formulario «List-Unsubscribe=One-Click»), sin Origin propio.
    const correo = (searchParams.get("e") ?? "").toLowerCase();
    const firma = searchParams.get("f") ?? "";
    if (!correo || !(await firmaValida(env, "baja", correo, firma))) return json({ error: "enlace" }, 403);
    const s = await leer(env, correo);
    if (s && s.estado !== "baja") {
      await guardar(env, {
        correo,
        nombre: "",
        estado: "baja",
        alta: s.alta,
        consentimiento: s.consentimiento,
        origen: "",
        paso: s.paso,
        baja: Date.now(),
      });
      console.log(JSON.stringify({ lista: "baja" }));
    }
    return json({ ok: true });
  }

  if (!origenPermitido(request.headers.get("Origin"))) return json({ error: "origen" }, 403);
  let datos: Record<string, unknown>;
  try {
    datos = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalido" }, 400);
  }

  // -------------------------------------------------------------- Confirmar
  if (pathname === "/api/suscribir/confirmar") {
    const correo = (texto(datos.e, 120) ?? "").toLowerCase();
    const firma = texto(datos.f, 64) ?? "";
    if (!correo || !(await firmaValida(env, "confirmar", correo, firma))) return json({ error: "enlace" }, 403);
    const s = await leer(env, correo);
    if (!s || s.estado === "baja") return json({ error: "caducado" }, 410);
    if (s.estado !== "pendiente") return json({ ok: true, ya: true });
    s.estado = "activo";
    s.confirmado = Date.now();
    s.paso = 0;
    s.proximo = s.confirmado;
    await guardar(env, s);
    console.log(JSON.stringify({ lista: "confirmado" }));
    ctx.waitUntil(
      Promise.all([
        enviarPaso(env, s),
        enviarAlPanel(env, {
          nombre: s.nombre,
          correo: s.correo,
          mensaje: [
            `Se suscribió a la guía «${tituloGuia(guiaPedida(s.guia))}» desde la web.`,
            s.origen ? `Llegó desde: ${s.origen}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      ]),
    );
    return json({ ok: true });
  }

  // ------------------------------------------------------------------ Alta
  if (pathname !== "/api/suscribir") return json({ error: "no-existe" }, 404);
  if (typeof datos.web === "string" && datos.web.trim() !== "") return json({ ok: true }); // campo trampa
  const nombre = texto(datos.nombre, 80);
  const correo = (texto(datos.correo, 120) ?? "").toLowerCase();
  const origen = texto(datos.origen, 300) ?? "";
  const guia = guiaPedida(typeof datos.guia === "string" ? datos.guia : undefined);
  if (nombre === null || !correo || !CORREO.test(correo)) return json({ error: "invalido" }, 400);
  if (datos.acepto !== true) return json({ error: "consentimiento" }, 400);

  const existente = await leer(env, correo);
  // Ya está dentro (confirmó antes): se le manda directamente la guía que
  // pide ahora, sin volver a empezar la serie.
  if (existente && (existente.estado === "activo" || existente.estado === "terminado")) {
    const baja = await enlacesBaja(env, correo);
    ctx.waitUntil(
      enviar(env, correo, SECUENCIA[0].crear({ nombre: existente.nombre, baja: baja.pagina, guia }), "guia-extra", baja.servidor),
    );
    return json({ ok: true });
  }

  const s: Suscriptor = {
    correo,
    nombre,
    estado: "pendiente",
    alta: Date.now(),
    consentimiento: { texto: TEXTO_CONSENTIMIENTO, fecha: Date.now() },
    origen,
    guia: guia.slug,
    paso: 0,
  };
  await guardar(env, s, SIETE_DIAS);
  const confirmar = await enlaceFirmado(env, "/correo/confirmar", "confirmar", correo);
  const ok = await enviar(env, correo, confirmarSuscripcion(nombre, confirmar, guia), "confirmar-suscripcion");
  console.log(JSON.stringify({ lista: "alta", correo_enviado: ok }));
  return ok ? json({ ok: true }) : json({ error: "fallo" }, 502);
}

/** Lo ejecuta el cron cada 10 minutos: manda los correos de la serie que tocan. */
export async function secuencia(env: EnvSuscripciones): Promise<void> {
  if (!env.SUSCRIPTORES || !env.RESEND_API_KEY) return;
  const ahora = Date.now();
  let enviados = 0;
  let cursor: string | undefined;
  do {
    const pagina = await env.SUSCRIPTORES.list({ prefix: "s:", cursor, limit: 1000 });
    for (const k of pagina.keys) {
      const m = k.metadata as { estado?: Estado; proximo?: number } | undefined;
      if (m?.estado !== "activo" || !m.proximo || m.proximo > ahora) continue;
      const s = await leer(env, k.name.slice(2));
      if (s?.estado !== "activo") continue;
      await enviarPaso(env, s);
      if (++enviados >= POR_VUELTA) return; // el resto, en la siguiente vuelta
    }
    cursor = pagina.list_complete ? undefined : pagina.cursor;
  } while (cursor);
}
