/**
 * Recursos gratuitos de los CTA de videos y carruseles (17/11/2026).
 * Ver RECURSOS.md.
 *
 * Cada recurso tiene:
 * - Su contenido en video/recursos/<slug>.md (se lee aquí y se muestra en la web).
 * - Su PDF en public/recursos/<slug>.pdf (node tools/generar-recursos.mjs).
 * - Su página en /recursos/<slug>: la que se envía por ManyChat o WhatsApp.
 *
 * Para añadir uno: escribe el .md, genera el PDF y añade aquí su ficha.
 */

export type SeccionRecurso = { titulo: string; puntos: string[]; texto: string[] };

export type Recurso = {
  slug: string;
  /** Título corto para la web (el del .md se usa como titular). */
  titulo: string;
  /** 70 a 160 caracteres: es la meta description. */
  descripcion: string;
  /** Formato del recurso, se muestra como etiqueta. */
  formato: "Checklist" | "Plantilla" | "Guía" | "Prompts";
  /** De dónde sale: video o carrusel y su número o título. */
  origen: string;
  /** Palabra que se comenta o escribe para recibirlo (vacía si se descarga desde el enlace del perfil). */
  palabraClave: string;
  /** Servicio relacionado (para la guía y la llamada). Ver src/data/servicios. */
  servicio: string;
  /** Fecha de publicación (AAAA-MM-DD). */
  fecha: string;
};

export const RECURSOS: Recurso[] = [
  {
    slug: "plantilla-preguntas-de-clientes",
    titulo: "Analiza las preguntas de tus clientes con IA",
    descripcion: "Plantilla gratuita para agrupar con IA las preguntas reales de tus clientes, ver cuáles se repiten y descubrir qué información falta en tu web.",
    formato: "Plantilla",
    origen: "Video · Episodio 04 «No le pidas ideas a la IA»",
    palabraClave: "",
    servicio: "consultoria-ia",
    fecha: "2026-11-20",
  },
  {
    slug: "plantilla-primera-automatizacion",
    titulo: "Diseña tu primera automatización en 5 pasos",
    descripcion: "Plantilla gratuita para diseñar tu primera automatización: disparador, datos, reglas, acciones y seguimiento, con lo que conviene probar antes de activarla.",
    formato: "Plantilla",
    origen: "Video · Episodio 03 «Un formulario. Cinco tareas automáticas»",
    palabraClave: "FLUJO",
    servicio: "automatizacion",
    fecha: "2026-11-17",
  },
  {
    slug: "checklist-organizar-archivos",
    titulo: "Organiza tus archivos antes de conectarlos a una IA",
    descripcion: "Checklist gratuita para ordenar contratos, manuales y procedimientos antes de conectarlos a una IA: inventario, limpieza, nombres, permisos y pruebas.",
    formato: "Checklist",
    origen: "Video · Episodio 01 «La IA puede consultar tus documentos»",
    palabraClave: "DOCUMENTOS",
    servicio: "consultoria-ia",
    fecha: "2026-11-16",
  },
];

// Contenido de cada recurso, leído del .md en el momento de compilar.
const archivos = import.meta.glob("../../video/recursos/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

/** Titular, entradilla y secciones del .md de un recurso. */
export function contenidoRecurso(slug: string): { titular: string; entradilla: string; secciones: SeccionRecurso[]; cierre: string[] } {
  const md = archivos[`../../video/recursos/${slug}.md`];
  if (!md) throw new Error(`Falta video/recursos/${slug}.md`);
  let titular = "";
  let entradilla = "";
  const secciones: SeccionRecurso[] = [];
  const cierre: string[] = [];
  for (const linea of md.split(/\r?\n/)) {
    const l = linea.trim();
    if (!l) continue;
    if (l.startsWith("# ")) titular = l.slice(2);
    else if (l.startsWith("## ")) secciones.push({ titulo: l.slice(3), puntos: [], texto: [] });
    else if (l.startsWith("- [ ] ")) secciones.at(-1)?.puntos.push(l.slice(6));
    else if (!secciones.length && !entradilla) entradilla = l;
    else if (secciones.length) secciones.at(-1)!.texto.push(l);
    else cierre.push(l);
  }
  // El último párrafo suelto de la última sección es la nota final.
  const ultima = secciones.at(-1);
  if (ultima && ultima.texto.length) cierre.push(...ultima.texto.splice(0));
  return { titular, entradilla, secciones, cierre };
}

export const pdfRecurso = (slug: string) => `/recursos/${slug}.pdf`;
