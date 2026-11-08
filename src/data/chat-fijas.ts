/**
 * Respuestas fijas del chat de Flora (08/11/2026).
 *
 * Las tres sugerencias del saludo se contestan con un texto fijo, sin gastar
 * IA (ver Chat.astro). Como siempre dicen lo mismo, su voz se graba una sola
 * vez (tools/grabar-voces.mjs) y se sirve como archivo desde /voz/: suena al
 * instante, con la misma voz de Flora, y no gasta el cupo diario de voz.
 *
 * Este archivo lo leen el chat (en el navegador) y el script que graba las
 * voces (en Node), así que no puede depender de nada del navegador.
 */

/** Pregunta del botón → respuesta de Flora. La línea «Opciones:» no se lee en voz alta. */
export const FIJAS: Record<string, string> = {
  "¿Qué se puede automatizar en mi negocio?":
    "Lo más habitual: contestar WhatsApp a tiempo, recordatorios de citas y seguimiento de clientes.\n\n¿A qué se dedica tu negocio?\nOpciones: Clínica o salud | Tienda o ecommerce | Servicios profesionales | Otro sector",
  "¿Cuánto cuesta?":
    "Depende de lo que haya que hacer, por eso Luis no publica precios. Tras una llamada gratis de 30 minutos te manda el precio cerrado por escrito.\n\n¿A qué se dedica tu negocio?\nOpciones: Clínica o salud | Tienda o ecommerce | Servicios profesionales | Otro sector",
  "¿Cómo es la llamada gratis?":
    "Es una videollamada gratis de 30 minutos por Google Meet. Luis revisa contigo qué automatizar primero y luego te manda una propuesta por escrito.\n\n¿Quieres que te la agende aquí?\nOpciones: Agéndala aquí | Prefiero el formulario | Ahora no",
};

/**
 * Lo que se lee en voz alta de una respuesta: sin la línea de opciones, sin
 * viñetas y con los espacios normalizados. Es lo mismo que hace decir() en
 * Chat.astro antes de pedir la voz.
 */
export function textoDeVoz(respuesta: string): string {
  const m = /\n\s*Opciones:\s*(.+)\s*$/i.exec(respuesta);
  const base = m ? respuesta.slice(0, m.index).trim() : respuesta;
  return base.replace(/^[-•*]\s+/gm, "").replace(/\s+/g, " ").trim().slice(0, 1200);
}

/**
 * Huella corta de un texto (hash djb2 en hexadecimal). Da el nombre del
 * archivo de voz: si el texto cambia, cambia el nombre y el chat deja de usar
 * el audio viejo y vuelve a pedir la voz en vivo, sin quedarse con una voz
 * que dice otra cosa.
 */
export function huella(texto: string): string {
  let h = 5381;
  for (let i = 0; i < texto.length; i++) h = ((h * 33) ^ texto.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0");
}
