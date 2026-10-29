/**
 * Envío de los correos de la agenda con Resend (29/10/2026). Ver AGENDA.md.
 *
 * - Sin la clave RESEND_API_KEY no se envía nada y la reserva sigue
 *   funcionando: Google manda igualmente su invitación con el enlace de Meet.
 * - Salen de hola@soyluisflores.es (o de CORREO_REMITENTE) y las respuestas
 *   llegan a hola@. El dominio tiene que estar verificado en Resend: si no,
 *   tu DMARC (p=reject) hace que los rechacen.
 * - En los registros solo queda si salió o no, nunca a quién ni qué decía.
 */
import { CONTACTO, type Correo } from "./correo-plantillas";

export interface EnvCorreo {
  /** Secreto del Worker, en el panel de Cloudflare. */
  RESEND_API_KEY?: string;
  /** Opcional: otro remitente, por ejemplo "Luis Flores <agenda@soyluisflores.es>". */
  CORREO_REMITENTE?: string;
  /** Opcional: a dónde llegan los avisos de reservas. Por defecto, hola@. */
  CORREO_AVISOS?: string;
}

export function correoAvisos(env: EnvCorreo): string {
  return env.CORREO_AVISOS || CONTACTO.correo;
}

export async function enviar(env: EnvCorreo, para: string, correo: Correo, tipo: string): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    console.log(JSON.stringify({ correo: tipo, estado: "sin-clave" }));
    return false;
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CORREO_REMITENTE || `Luis Flores <${CONTACTO.correo}>`,
        to: [para],
        reply_to: CONTACTO.correo,
        subject: correo.asunto,
        html: correo.html,
        text: correo.texto,
        tags: [{ name: "tipo", value: tipo }],
      }),
    });
    console.log(JSON.stringify({ correo: tipo, estado: r.ok ? "enviado" : r.status }));
    return r.ok;
  } catch {
    console.error(JSON.stringify({ correo: tipo, estado: "fallo-red" }));
    return false;
  }
}
