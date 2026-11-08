/**
 * Voz de Flora (02/11/2026): POST /api/voz convierte en audio las respuestas
 * del chat con Deepgram Aura-2 en español, servido por Workers AI (binding
 * AI de wrangler.jsonc). No hace falta ninguna clave: se cobra en la cuenta
 * de Cloudflare, a unos 0,03 $ por cada 1.000 caracteres (una respuesta
 * normal del chat ronda los 300).
 *
 * Voz por defecto: «celeste» (la eligió el titular el 08/11/2026), femenina y con acento latino.
 * Se cambia con la variable VOZ_FLORA de wrangler.jsonc. Solo se aceptan las
 * voces femeninas de la lista: así nadie usa la ruta para otra cosa.
 *
 * Solo responde a la propia web, con límite por IP y un tope de caracteres
 * al día en toda la web (LIMITE_DIARIO_VOZ, topes.ts), y no guarda el texto.
 * Si falla, el chat sigue por escrito, sin voz (desde el 08/11/2026 ya no
 * lee con la voz del navegador, que sonaba robótica).
 */
import type { EnvAgenda } from "./agenda";
import { avisarTope, dentroTopeVoz } from "./topes";

export interface EnvVoz {
  AI?: { run(modelo: string, entrada: Record<string, unknown>, opciones?: { returnRawResponse?: boolean }): Promise<unknown> };
  VOZ_FLORA?: string;
  LIMITE_VOZ?: { limit(opciones: { key: string }): Promise<{ success: boolean }> };
  /** Caracteres de voz al día en toda la web (wrangler.jsonc). */
  LIMITE_DIARIO_VOZ?: string;
}

const MODELO = "@cf/deepgram/aura-2-es";
/** Femeninas de Aura-2 en español. Latinas: selena, celeste, estrella. De España: diana, carina. */
export const VOCES_FEMENINAS = ["selena", "celeste", "estrella", "diana", "carina"] as const;
const POR_DEFECTO = "celeste";
const MAX_CARACTERES = 1200;
// Si falta la variable: unos 0,45 $ al día como mucho en el plan de pago.
const TOPE_DIARIO = 15000;

export async function voz(
  request: Request,
  env: EnvVoz & EnvAgenda,
  json: (cuerpo: unknown, estado?: number) => Response,
  origenPermitido: (origen: string | null) => boolean,
  ctx: { waitUntil(promesa: Promise<unknown>): void },
): Promise<Response> {
  if (request.method !== "POST") return json({ error: "metodo" }, 405);
  if (!origenPermitido(request.headers.get("Origin"))) return json({ error: "origen" }, 403);
  if (!env.AI) return json({ error: "sin-voz" }, 503);

  if (env.LIMITE_VOZ) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "sin-ip";
    const { success } = await env.LIMITE_VOZ.limit({ key: `voz:${ip}` });
    if (!success) return json({ error: "limite" }, 429);
  }

  const datos = (await request.json().catch(() => null)) as { texto?: unknown; voz?: unknown } | null;
  const texto = typeof datos?.texto === "string" ? datos.texto.trim() : "";
  if (!texto || texto.length > MAX_CARACTERES) return json({ error: "invalido" }, 400);

  const tope = Number(env.LIMITE_DIARIO_VOZ) || TOPE_DIARIO;
  const { dentro, usados } = await dentroTopeVoz(env, texto.length, tope);
  ctx.waitUntil(avisarTope(env, "voz", dentro ? usados : tope, tope));
  if (!dentro) {
    console.log(JSON.stringify({ voz: "tope-diario" }));
    return json({ error: "tope" }, 503);
  }

  // La voz de prueba solo puede ser una de la lista; si no, la configurada.
  const configurada = VOCES_FEMENINAS.find((v) => v === env.VOZ_FLORA) ?? POR_DEFECTO;
  const elegida = VOCES_FEMENINAS.find((v) => v === datos?.voz) ?? configurada;

  try {
    const r = (await env.AI.run(MODELO, { text: texto, speaker: elegida, encoding: "mp3" }, { returnRawResponse: true })) as Response;
    if (!r.ok || !r.body) throw new Error(`Aura ${r.status}`);
    return new Response(r.body, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
  } catch (e) {
    console.error(JSON.stringify({ voz: "fallo", motivo: String(e).slice(0, 200) }));
    return json({ error: "fallo" }, 502);
  }
}
