/**
 * Envío de cada reserva al panel (panel.soyluisflores.es) como lead
 * (29/10/2026). Ver «Conectar con el panel» en AGENDA.md.
 *
 * Llama al webhook webhookFormulario del panel (Firebase), con el secreto en
 * la cabecera x-panel-secreto. Va desde el servidor de la web, nunca desde
 * el navegador: el secreto no puede llegar al cliente.
 *
 * - Sin PANEL_WEBHOOK_URL y PANEL_SECRETO no se envía nada y la reserva
 *   funciona igual.
 * - Si el panel falla, la reserva no se pierde: está en Google Calendar y en
 *   el aviso por correo. En los registros solo queda el código de respuesta.
 */

export interface EnvPanel {
  /** Variable: https://europe-west1-<proyecto>.cloudfunctions.net/webhookFormulario */
  PANEL_WEBHOOK_URL?: string;
  /** Secreto: el mismo valor que SECRETO_FORMULARIO en el panel. */
  PANEL_SECRETO?: string;
}

export interface LeadParaPanel {
  nombre: string;
  correo: string;
  mensaje: string;
}

export async function enviarAlPanel(env: EnvPanel, lead: LeadParaPanel): Promise<boolean> {
  if (!env.PANEL_WEBHOOK_URL || !env.PANEL_SECRETO) return false;
  try {
    const r = await fetch(env.PANEL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-panel-secreto": env.PANEL_SECRETO },
      body: JSON.stringify({
        marca: "soyluisflores",
        nombre: lead.nombre,
        email: lead.correo,
        mensaje: lead.mensaje.slice(0, 2000),
      }),
    });
    console.log(JSON.stringify({ panel: "lead", estado: r.status }));
    return r.ok;
  } catch {
    console.error(JSON.stringify({ panel: "lead", estado: "fallo-red" }));
    return false;
  }
}
