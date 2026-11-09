/**
 * De dónde llega cada lead, en palabras (2/11/2026).
 *
 * La web anota el origen en bruto («blog-articulo · /blog/x · source=ig ·
 * campaign=guia»; «funnel-agentes-ia · source=meta»; «chat-asistente ·
 * /contacto»). Aquí se traduce a tres datos que se entienden de un vistazo:
 *
 * - medio: cómo dejó sus datos (guía gratis, agenda de la web, chat de Flora).
 * - seccion: en qué parte de la web lo hizo.
 * - campana: de dónde venía la visita (anuncio, correo, red social) o
 *   «visita directa» si no trae parámetros de campaña.
 *
 * Va al principio del mensaje del lead: así lo ven la campana del panel
 * (que solo enseña los primeros caracteres), el correo «Lead nuevo» y la
 * ficha. También da la clave «seccion» para el resumen semanal.
 *
 * Sin dependencias, para probarlo con Node (tools/probar-agenda.mjs).
 */
// Nombres de los servicios (los de src/data/servicios.ts). No se importa ese
// fichero porque usa import.meta.env de Astro, que no existe en el Worker.
// Si cambia un nombre o se añade un servicio, cámbialo también aquí.
const SERVICIOS: Record<string, string> = {
  "agentes-ia": "Agentes de IA",
  "funnels-conversion": "Funnels de conversión",
  automatizacion: "Automatización de procesos",
  "crm-seguimiento-leads": "CRM y seguimiento de leads",
  "email-marketing": "Email marketing y secuencias",
  "paneles-de-metricas": "Paneles de métricas e informes",
  "webs-ia": "Páginas web con IA",
  "trafico-de-pago": "Publicidad en Meta y Google",
  "consultoria-ia": "Consultoría de IA",
};

export interface Origen {
  medio: string;
  seccion: string;
  campana: string;
  /** Clave corta y estable de la sección, para contar en el resumen semanal. */
  clave: string;
}

const nombreServicio = (slug: string) => SERVICIOS[slug] ?? slug;

const FUENTES: [RegExp, string][] = [
  [/^(ig|instagram)$/i, "Instagram"],
  [/^(fb|facebook)$/i, "Facebook"],
  [/^meta$/i, "Meta (Facebook o Instagram)"],
  [/^google$/i, "Google"],
  [/^(tiktok|tt)$/i, "TikTok"],
  [/^linkedin$/i, "LinkedIn"],
  [/^(wa|whatsapp)$/i, "WhatsApp"],
  [/^email$/i, "un correo de la serie"],
  [/^guia$/i, "una guía gratis"],
];

function campana(partes: string[]): string {
  const valor = (k: string) => partes.find((p) => p.startsWith(`${k}=`))?.slice(k.length + 1) ?? "";
  const fuente = valor("source");
  const nombreFuente = FUENTES.find(([re]) => re.test(fuente))?.[1] ?? fuente;
  const medio = valor("medium");
  const nombre = valor("campaign");
  const pago = /cpc|paid|ads|pago/i.test(medio) || partes.some((p) => p.startsWith("clic de"));
  const trozos: string[] = [];
  if (nombreFuente) trozos.push(`${pago ? "Anuncio en " : ""}${nombreFuente}`);
  else if (partes.includes("clic de Meta")) trozos.push("Anuncio en Meta");
  else if (partes.includes("clic de Google Ads")) trozos.push("Anuncio en Google");
  if (nombre) trozos.push(`campaña «${nombre}»`);
  return trozos.length ? trozos.join(", ") : "Visita directa o búsqueda (sin campaña)";
}

/** tipo: «guia» para suscripciones, «cita» para llamadas agendadas, «mensaje» para el formulario de /contacto. */
export function describirOrigen(origen: string, tipo: "guia" | "cita" | "mensaje", guia?: string): Origen {
  const partes = origen
    .split(" · ")
    .map((p) => p.trim())
    .filter(Boolean);
  const primero = partes[0] ?? "";
  const ruta = partes.find((p) => p.startsWith("/")) ?? "";

  let seccion = "No consta";
  let clave = "otro";
  if (primero === "chat-asistente") {
    seccion = `Chat de Flora${ruta ? ` en ${ruta}` : ""}`;
    clave = "chat";
  } else if (primero === "agenda-contacto") {
    seccion = "Agenda de la página de contacto";
    clave = "contacto";
  } else if (primero === "formulario-contacto") {
    seccion = "Formulario de la página de contacto";
    clave = "formulario";
  } else if (primero === "agenda-diagnostico") {
    seccion = "Landing de anuncios /diagnostico";
    clave = "diagnostico";
  } else if (primero.startsWith("funnel-")) {
    const slug = primero.slice("funnel-".length);
    seccion = `Landing de anuncios de ${nombreServicio(slug)}`;
    clave = `funnel-${slug}`;
  } else if (primero.startsWith("servicio-")) {
    const slug = primero.slice("servicio-".length);
    seccion = `Página del servicio ${nombreServicio(slug)}`;
    clave = `servicio-${slug}`;
  } else if (primero === "blog-articulo") {
    seccion = `Artículo del blog${ruta ? ` ${ruta}` : ""}`;
    clave = "blog-articulo";
  } else if (primero === "blog-indice") {
    seccion = "Página principal del blog";
    clave = "blog-indice";
  } else if (primero === "pagina-guia") {
    seccion = "Página de la guía gratis (/guia)";
    clave = "pagina-guia";
  }

  const medio =
    tipo === "mensaje"
      ? "Escribió por el formulario de contacto"
      : tipo === "guia"
      ? `Pidió la guía gratis${guia ? ` «${guia}»` : ""}`
      : clave === "chat"
        ? "Agendó la llamada con Flora, en el chat"
        : "Agendó la llamada en la agenda de la web";

  return { medio, seccion, campana: campana(partes), clave };
}

/** Las líneas que encabezan el mensaje del lead en el panel. */
export function lineasOrigen(o: Origen): string[] {
  return [`Origen: ${o.medio}`, `Sección: ${o.seccion}`, `Llegó por: ${o.campana}`];
}

/** Nombre legible de una clave de sección, para el resumen semanal. */
export function nombreSeccion(clave: string): string {
  if (clave === "chat") return "Chat de Flora";
  if (clave === "contacto") return "Agenda de contacto";
  if (clave === "diagnostico") return "Landing /diagnostico";
  if (clave === "blog-articulo") return "Artículos del blog";
  if (clave === "blog-indice") return "Página principal del blog";
  if (clave === "pagina-guia") return "Página /guia";
  if (clave.startsWith("funnel-")) return `Landing de ${nombreServicio(clave.slice(7))}`;
  if (clave.startsWith("servicio-")) return `Servicio ${nombreServicio(clave.slice(9))}`;
  return "Sin dato";
}
