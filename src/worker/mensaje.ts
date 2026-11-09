/**
 * Formulario corto de /contacto (9/11/2026): POST /api/mensaje.
 *
 * Para quien quiere escribir sin agendar todavía. Con cada mensaje:
 * - entra como lead en el panel (panel.ts), con el origen al principio;
 * - llega un aviso a CORREO_AVISOS (hola@ por defecto);
 * - quien escribió recibe un acuse con el plazo de respuesta.
 *
 * Mismas defensas que la agenda: solo desde la propia web, límite por IP
 * (LIMITE_AGENDA, tipo «mensaje»), campo trampa y la casilla de privacidad
 * obligatoria. En los registros nunca queda lo que escribió nadie.
 */
import type { EnvAgenda } from "./agenda";
import { enviar, correoAvisos } from "./correo";
import { acuseMensaje, avisoMensaje } from "./correo-plantillas";
import { enviarAlPanel } from "./panel";
import { describirOrigen, lineasOrigen } from "./origen";
import { aMensaje } from "./mensaje-validar";

export async function mensaje(
  request: Request,
  env: EnvAgenda,
  json: (cuerpo: unknown, estado?: number) => Response,
  origenPermitido: (origen: string | null) => boolean,
  ctx: { waitUntil(p: Promise<unknown>): void },
): Promise<Response> {
  if (request.method !== "POST") return json({ error: "metodo" }, 405);
  if (!origenPermitido(request.headers.get("Origin"))) return json({ error: "origen" }, 403);
  if (env.LIMITE_AGENDA) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "sin-ip";
    const { success } = await env.LIMITE_AGENDA.limit({ key: `mensaje:${ip}` });
    if (!success) return json({ error: "limite" }, 429);
  }
  const m = aMensaje(await request.json().catch(() => null));
  // A los programas que rellenan el campo trampa se les dice que sí, sin hacer nada.
  if (m === "trampa") return json({ ok: true });
  if (!m) return json({ error: "invalido" }, 400);

  const origen = describirOrigen(m.origen || "formulario-contacto", "mensaje");
  const lineas = lineasOrigen(origen);
  console.log(JSON.stringify({ mensaje: "recibido" }));
  ctx.waitUntil(
    Promise.all([
      enviarAlPanel(env, { nombre: m.nombre, correo: m.correo, mensaje: [...lineas, `Mensaje: ${m.mensaje}`].join("\n") }),
      enviar(env, correoAvisos(env), avisoMensaje({ ...m, origen: lineas }), "aviso-mensaje"),
      enviar(env, m.correo, acuseMensaje(m.nombre), "acuse-mensaje"),
    ]),
  );
  return json({ ok: true });
}
