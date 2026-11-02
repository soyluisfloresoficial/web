/**
 * Recordatorio por WhatsApp 1 hora antes de la llamada (2/11/2026), con
 * Twilio. Ver «Recordatorio por WhatsApp» en AGENDA.md.
 *
 * Está apagado hasta que existan los cuatro secretos en Cloudflare:
 * TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM (el número de
 * WhatsApp Business, por ejemplo «whatsapp:+34600000000») y
 * TWILIO_PLANTILLA_1H (el Content SID «HX…» de la plantilla aprobada por
 * Meta). Sin ellos no se manda nada y el recordatorio por correo sigue igual.
 *
 * WhatsApp solo deja escribir primero con una plantilla aprobada. La
 * plantilla tiene tres variables: {{1}} nombre, {{2}} hora de la llamada en
 * la zona del cliente y {{3}} enlace de la videollamada.
 *
 * Solo se manda si el cliente dejó su WhatsApp con prefijo del país. En los
 * registros queda si salió o no, nunca el número.
 */
export interface EnvWhatsApp {
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_WHATSAPP_FROM?: string;
  TWILIO_PLANTILLA_1H?: string;
}

export function whatsappActivo(env: EnvWhatsApp): boolean {
  return Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_WHATSAPP_FROM && env.TWILIO_PLANTILLA_1H);
}

/** «+57 300 000 0000» → «+573000000000». Null si no lleva prefijo de país o no parece un número. */
export function numeroE164(telefono: string): string | null {
  const limpio = telefono.replace(/[\s().-]/g, "").replace(/^00/, "+");
  return /^\+[1-9]\d{7,14}$/.test(limpio) ? limpio : null;
}

export async function recordatorioWhatsApp(
  env: EnvWhatsApp,
  telefono: string,
  variables: { nombre: string; hora: string; enlace: string },
): Promise<boolean> {
  if (!whatsappActivo(env)) return false;
  const numero = numeroE164(telefono);
  if (!numero) return false;
  const desde = env.TWILIO_WHATSAPP_FROM!.startsWith("whatsapp:") ? env.TWILIO_WHATSAPP_FROM! : `whatsapp:${env.TWILIO_WHATSAPP_FROM}`;
  try {
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: desde,
        To: `whatsapp:${numero}`,
        ContentSid: env.TWILIO_PLANTILLA_1H!,
        ContentVariables: JSON.stringify({ 1: variables.nombre, 2: variables.hora, 3: variables.enlace }),
      }),
    });
    console.log(JSON.stringify({ whatsapp: "recordatorio-1h", estado: r.ok ? "enviado" : r.status }));
    return r.ok;
  } catch {
    console.error(JSON.stringify({ whatsapp: "recordatorio-1h", estado: "fallo-red" }));
    return false;
  }
}
