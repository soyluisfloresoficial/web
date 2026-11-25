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

/** Bloques de una sección, en orden: casilla (- [ ]), viñeta (- ), subtítulo (###), prompt (> , varias líneas seguidas) o párrafo. */
export type BloqueRecurso = { tipo: "casilla" | "vineta" | "subtitulo" | "prompt" | "texto"; texto: string };
export type SeccionRecurso = { titulo: string; bloques: BloqueRecurso[] };

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
    slug: "guia-agente-whatsapp",
    titulo: "Tu agente de IA para WhatsApp, paso a paso",
    descripcion: "Guía gratis para montar un agente de IA en WhatsApp: qué debe saber, qué nunca responde, cuándo te pasa la conversación y el prompt listo para copiar.",
    formato: "Guía",
    origen: "Reel 01 «Vende por WhatsApp mientras duermes»",
    palabraClave: "WHATSAPP",
    servicio: "agentes-ia",
    fecha: "2026-11-25",
  },
  {
    slug: "checklist-web",
    titulo: "25 puntos para que tu web venda",
    descripcion: "Checklist gratis de 25 puntos para revisar tu web desde el celular: mensaje, botón, velocidad, confianza y qué pasa después del formulario.",
    formato: "Checklist",
    origen: "Reel 02 «Por qué tu web no vende»",
    palabraClave: "WEB",
    servicio: "webs-ia",
    fecha: "2026-11-25",
  },
  {
    slug: "guia-crm-whatsapp",
    titulo: "Tu CRM conectado a WhatsApp en una semana",
    descripcion: "Guía gratis para conectar WhatsApp a un CRM en una semana: etapas, etiquetas, avisos de seguimiento y la lista de a quién llamar cada día.",
    formato: "Guía",
    origen: "Reel 03 «Tu WhatsApp no es un CRM»",
    palabraClave: "CRM",
    servicio: "crm-seguimiento-leads",
    fecha: "2026-11-25",
  },
  {
    slug: "comparativa-make-n8n",
    titulo: "Make o n8n: comparativa con precios",
    descripcion: "Comparativa gratis de Make y n8n con precios de noviembre de 2026, cómo calcular tu consumo y cuál elegir según el volumen de tus flujos.",
    formato: "Guía",
    origen: "Reel 04 «¿Make o n8n?»",
    palabraClave: "MAKE",
    servicio: "automatizacion",
    fecha: "2026-11-25",
  },
  {
    slug: "mapa-embudo-4-etapas",
    titulo: "Mapa del embudo de ventas en 4 etapas",
    descripcion: "Mapa gratis del embudo de ventas en 4 etapas: atraer, captar, nutrir y convertir, con qué montar en cada una y qué número medir.",
    formato: "Guía",
    origen: "Reel 05 «A tu embudo le faltan dos etapas»",
    palabraClave: "EMBUDO",
    servicio: "funnels-conversion",
    fecha: "2026-11-25",
  },
  {
    slug: "guia-agente-voz",
    titulo: "Agente de voz para tu negocio",
    descripcion: "Guía gratis para poner un agente de voz con IA en tu teléfono: guion, límites, aviso de que es una IA, derivación a una persona y resumen de cada llamada.",
    formato: "Guía",
    origen: "Reel 06 «Deja de perder llamadas»",
    palabraClave: "LLAMADAS",
    servicio: "agentes-ia",
    fecha: "2026-11-25",
  },
  {
    slug: "plantilla-landing",
    titulo: "Estructura de una landing que convierte",
    descripcion: "Plantilla gratis con los 7 bloques de una landing que convierte, el formulario mínimo y un texto listo para rellenar con tu oferta.",
    formato: "Plantilla",
    origen: "Reel 07 «Cinco cambios para tu landing»",
    palabraClave: "LANDING",
    servicio: "funnels-conversion",
    fecha: "2026-11-25",
  },
  {
    slug: "flujo-cobros-stripe",
    titulo: "Cobros y facturas automáticas con Stripe",
    descripcion: "Plantilla gratis del flujo de cobros automáticos con Stripe: factura, enlace de pago, recordatorios amables y aviso cuando el cliente paga.",
    formato: "Plantilla",
    origen: "Reel 08 «¿Te llegó la factura?»",
    palabraClave: "COBROS",
    servicio: "automatizacion",
    fecha: "2026-11-25",
  },
  {
    slug: "preguntas-cualificar-leads",
    titulo: "12 preguntas para cualificar leads con IA",
    descripcion: "Plantilla gratis con 12 preguntas para que un agente de IA cualifique tus leads por necesidad, urgencia y presupuesto, con su puntuación.",
    formato: "Plantilla",
    origen: "Reel 09 «Tres preguntas que filtran»",
    palabraClave: "FILTRO",
    servicio: "agentes-ia",
    fecha: "2026-11-25",
  },
  {
    slug: "plantilla-dashboard-5-numeros",
    titulo: "Dashboard con los 5 números de tu negocio",
    descripcion: "Plantilla gratis de un dashboard con los 5 números que conviene revisar cada lunes: ventas, contactos, presupuestos, cierre y cobros.",
    formato: "Plantilla",
    origen: "Reel 10 «Cinco números, un panel»",
    palabraClave: "PANEL",
    servicio: "paneles-de-metricas",
    fecha: "2026-11-25",
  },
  {
    slug: "secuencia-4-correos",
    titulo: "4 correos después de tu lead magnet",
    descripcion: "Plantilla gratis con los 4 correos que conviene enviar después de tu lead magnet, con asuntos, textos listos para adaptar y cuándo enviarlos.",
    formato: "Plantilla",
    origen: "Reel 11 «Cuatro correos detrás de tu PDF»",
    palabraClave: "CORREOS",
    servicio: "email-marketing",
    fecha: "2026-11-25",
  },
  {
    slug: "plantilla-tablero-ventas",
    titulo: "Tablero de ventas en Airtable",
    descripcion: "Plantilla gratis de un tablero de ventas en Airtable: columnas, campos, avisos de propuestas sin respuesta y el total por etapa.",
    formato: "Plantilla",
    origen: "Reel 12 «¿Cuánto cierras este mes?»",
    palabraClave: "VENTAS",
    servicio: "crm-seguimiento-leads",
    fecha: "2026-11-25",
  },
  {
    slug: "prompts-contenido-1-a-10",
    titulo: "1 idea, 10 piezas de contenido: prompts",
    descripcion: "Prompts gratis para convertir una sola idea en 10 piezas de contenido: reels, carrusel, historias, post de LinkedIn y correo.",
    formato: "Prompts",
    origen: "Reel 13 «Una idea, diez piezas»",
    palabraClave: "CONTENIDO",
    servicio: "consultoria-ia",
    fecha: "2026-11-25",
  },
  {
    slug: "plantilla-que-automatizar-primero",
    titulo: "Qué automatizar primero",
    descripcion: "Plantilla gratis para decidir qué automatizar primero en tu negocio según las horas que te quita cada tarea y el riesgo si falla.",
    formato: "Plantilla",
    origen: "Reel 14 «Automatiza lo aburrido primero»",
    palabraClave: "PRIORIDAD",
    servicio: "automatizacion",
    fecha: "2026-11-25",
  },
  {
    slug: "plantilla-preguntas-de-clientes",
    titulo: "Analiza las preguntas de tus clientes con IA",
    descripcion: "Plantilla gratis con prompts listos por tipo de negocio, un ejemplo resuelto y un plan de 7 días para saber qué no entienden tus clientes y qué cambiar primero.",
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
    const bloques = secciones.at(-1)?.bloques;
    if (l.startsWith("# ")) titular = l.slice(2);
    else if (l.startsWith("## ")) secciones.push({ titulo: l.slice(3), bloques: [] });
    else if (!bloques) {
      if (!entradilla) entradilla = l;
      else cierre.push(l);
    } else if (l.startsWith("### ")) bloques.push({ tipo: "subtitulo", texto: l.slice(4) });
    else if (l.startsWith("- [ ] ")) bloques.push({ tipo: "casilla", texto: l.slice(6) });
    else if (l.startsWith("- ")) bloques.push({ tipo: "vineta", texto: l.slice(2) });
    else if (l.startsWith(">")) {
      const t = l.replace(/^>\s?/, "");
      const previo = bloques.at(-1);
      if (previo?.tipo === "prompt") previo.texto += `\n${t}`;
      else bloques.push({ tipo: "prompt", texto: t });
    } else bloques.push({ tipo: "texto", texto: l });
  }
  // Los párrafos sueltos al final de la última sección son la nota final.
  const ultima = secciones.at(-1)?.bloques;
  while (ultima?.length && ultima.at(-1)!.tipo === "texto") cierre.unshift(ultima.pop()!.texto);
  return { titular, entradilla, secciones, cierre };
}

export const pdfRecurso = (slug: string) => `/recursos/${slug}.pdf`;
