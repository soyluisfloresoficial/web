/**
 * Validación del formulario de /contacto (9/11/2026), sin dependencias para
 * poder probarla en tools/probar-agenda.mjs. La usa mensaje.ts.
 */
const CORREO = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

function texto(v: unknown, max: number): string | null {
  if (v === undefined || v === null) return "";
  if (typeof v !== "string") return null;
  const limpio = v.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").trim();
  return limpio.length > max ? null : limpio;
}

export interface Mensaje {
  nombre: string;
  correo: string;
  mensaje: string;
  origen: string;
}

/** Valida lo que llega del formulario. Null si no vale; «trampa» si lo mandó un programa. */
export function aMensaje(datos: unknown): Mensaje | "trampa" | null {
  if (!datos || typeof datos !== "object") return null;
  const d = datos as Record<string, unknown>;
  if (typeof d.web === "string" && d.web.trim() !== "") return "trampa";
  if (d.acepto !== true) return null;
  const nombre = texto(d.nombre, 80);
  const correo = texto(d.correo, 120);
  const mensaje = texto(d.mensaje, 1000);
  const origen = texto(d.origen, 300) ?? "";
  if (!nombre || nombre.length < 2) return null;
  if (!correo || !CORREO.test(correo)) return null;
  if (!mensaje || mensaje.length < 10) return null;
  return { nombre, correo: correo.toLowerCase(), mensaje, origen: origen ?? "" };
}

