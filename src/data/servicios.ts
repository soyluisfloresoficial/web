/**
 * Origen único de los servicios.
 *
 * La home, el pie, /servicios y el llms.txt leen de aquí. En el sitio anterior
 * cada sitio tenía su propia lista y por eso la home y el pie enseñaban cuatro
 * de los seis que había. Con un solo array eso no puede volver a pasar.
 */

export interface Servicio {
  slug: string;
  nombre: string;
  /** Frase definitoria, la que abre la página del servicio. */
  definicion: string;
  /** Resumen corto para las tarjetas de la home y de /servicios. */
  resumen: string;
  /** Variable CSS con el color propio del servicio. */
  color: string;
  /** Nombre del fichero en src/assets, sin extensión. Vacío si el servicio
   *  usa una ilustración de src/data/ilustraciones.ts en vez de foto. */
  imagen: string;
  /** Icono del distintivo de la tarjeta (nombre de Icono.astro). */
  icono: "robot" | "embudo" | "flujo" | "web" | "megafono" | "brujula" | "usuarios" | "email" | "grafica";
  /** Alt descriptivo y único. [VERIFICAR: que coincide con la imagen real.] */
  imagenAlt: string;
}

export const servicios: Servicio[] = [
  {
    slug: "agentes-ia",
    nombre: "Agentes de IA",
    definicion:
      "Un agente de IA es un asistente que atiende a tus clientes por chat o por teléfono y agenda sus citas de forma automática.",
    resumen: "Atienden por chat y por teléfono las 24 horas y agendan citas por ti.",
    color: "--svc-agentes-ia",
    imagen: "agentes-ia",
    icono: "robot",
    imagenAlt: "Agente de IA respondiendo a un cliente por chat",
  },
  {
    slug: "funnels-conversion",
    nombre: "Funnels de conversión",
    definicion:
      "Un funnel de conversión, o embudo de ventas, es el camino que sigue una persona desde que te conoce hasta que te compra, con cada paso medido.",
    resumen: "Página de captación y seguimiento por correo y WhatsApp.",
    color: "--svc-funnels-conversion",
    imagen: "funnels-conversion",
    icono: "embudo",
    imagenAlt: "Embudo de conversión con las etapas medidas",
  },
  {
    slug: "automatizacion",
    nombre: "Automatización de procesos",
    definicion:
      "Automatizar procesos es lograr que tus herramientas se pasen datos y hagan las tareas repetitivas sin que nadie tenga que intervenir.",
    resumen: "Flujos en Make, n8n o Zapier que conectan tus herramientas y te avisan si algo falla.",
    color: "--svc-automatizacion",
    imagen: "automatizacion",
    icono: "flujo",
    imagenAlt: "Flujo de automatización conectando varias herramientas",
  },
  // Tres servicios añadidos el 21/10/2026. Usan ilustración, no foto: no hay
  // fotos propias de estos trabajos y no se ponen de banco que no correspondan.
  {
    slug: "crm-seguimiento-leads",
    nombre: "CRM y seguimiento de leads",
    definicion:
      "Un CRM es el sistema donde guardas cada contacto con su historial, su etapa y el siguiente paso a dar.",
    resumen: "Cada contacto en su etapa y con su siguiente paso, sin hojas de cálculo sueltas.",
    color: "--svc-crm-seguimiento-leads",
    imagen: "",
    icono: "usuarios",
    imagenAlt: "Ilustración de un CRM con los contactos organizados por etapas",
  },
  {
    slug: "email-marketing",
    nombre: "Email marketing y secuencias",
    definicion:
      "Una secuencia de email es una serie de correos que se envían solos, en orden y según lo que hace cada contacto, para acompañarlo hasta la compra.",
    resumen: "Correos de bienvenida, seguimiento y reactivación, solo a quien dio su permiso.",
    color: "--svc-email-marketing",
    imagen: "",
    icono: "email",
    imagenAlt: "Ilustración de una secuencia de correos en una línea de tiempo",
  },
  {
    slug: "paneles-de-metricas",
    nombre: "Paneles de métricas e informes",
    definicion:
      "Un panel de métricas junta en una sola pantalla los números de cada etapa de tu negocio, tomados de las herramientas que ya usas, para que decidas con datos.",
    resumen: "Los números de cada etapa en una pantalla, sin copiar datos a mano.",
    color: "--svc-paneles-de-metricas",
    imagen: "",
    icono: "grafica",
    imagenAlt: "Ilustración de un panel con indicadores y gráficas",
  },
  {
    slug: "webs-ia",
    nombre: "Páginas web con IA",
    definicion:
      "Una página web con IA es un sitio rápido, con un objetivo claro, que puede incluir un asistente que responde y capta contactos.",
    resumen: "Rápidas, fáciles de usar y con un objetivo claro en cada página, también desde el celular.",
    color: "--svc-webs-ia",
    imagen: "webs-ia",
    icono: "web",
    imagenAlt: "Página web pensada para celular con formulario de contacto",
  },
  {
    slug: "trafico-de-pago",
    nombre: "Publicidad en Meta y Google",
    definicion:
      "La publicidad pagada en Meta (Facebook e Instagram) y Google lleva tu oferta a personas que de verdad pueden estar interesadas.",
    resumen: "Campañas en Meta Ads y Google Ads, bien medidas desde el primer día.",
    color: "--svc-trafico-de-pago",
    imagen: "trafico-de-pago",
    icono: "megafono",
    imagenAlt: "Panel de campañas de Meta Ads y Google Ads",
  },
  {
    slug: "consultoria-ia",
    nombre: "Consultoría de IA",
    definicion:
      "La consultoría de IA es un diagnóstico de tu negocio que termina en un plan ordenado por prioridades para empezar a usar inteligencia artificial.",
    resumen: "Un diagnóstico de tu negocio y un plan claro de qué automatizar primero y con qué herramienta.",
    color: "--svc-consultoria-ia",
    imagen: "consultoria-ia",
    icono: "brujula",
    imagenAlt: "Plan de adopción de IA ordenado por prioridades",
  },
];

/**
 * Los tres frentes en los que se agrupan los servicios (23/10/2026).
 *
 * Sirven para que quien llega sepa por dónde entrar sin leerse las nueve
 * tarjetas: primero que te lleguen consultas, luego que no se enfríen y
 * por último que el proceso aguante sin ti.
 */
export interface Pilar {
  id: "captar" | "convertir" | "escalar";
  nombre: string;
  /** Qué se resuelve en este frente, en una frase. */
  descripcion: string;
  icono: "embudo" | "chat" | "flujo";
  /** Slugs de los servicios de este frente, en el orden en que se muestran. */
  slugs: string[];
}

export const PILARES: Pilar[] = [
  {
    id: "captar",
    nombre: "Captar",
    descripcion: "Que te encuentren y te escriban.",
    icono: "embudo",
    slugs: ["webs-ia", "trafico-de-pago", "funnels-conversion"],
  },
  {
    id: "convertir",
    nombre: "Convertir",
    descripcion: "Que quien escribe no se quede sin respuesta ni sin seguimiento.",
    icono: "chat",
    slugs: ["agentes-ia", "crm-seguimiento-leads", "email-marketing"],
  },
  {
    id: "escalar",
    nombre: "Escalar",
    descripcion: "Que el proceso aguante más trabajo sin depender de ti.",
    icono: "flujo",
    slugs: ["automatizacion", "paneles-de-metricas", "consultoria-ia"],
  },
];

/** Los servicios de un frente, en el orden declarado en PILARES. */
export function serviciosDe(pilar: Pilar): Servicio[] {
  return pilar.slugs.map((slug) => {
    const servicio = servicios.find((s) => s.slug === slug);
    if (!servicio) {
      throw new Error(
        `PILARES apunta al servicio «${slug}», que no existe en servicios (src/data/servicios.ts).`,
      );
    }
    return servicio;
  });
}

// Si se añade un servicio y se olvida asignarlo a un frente, el build falla
// aquí en vez de dejarlo fuera de la home y de /servicios sin avisar.
{
  const asignados = PILARES.flatMap((p) => p.slugs);
  const huerfanos = servicios.filter((s) => !asignados.includes(s.slug));
  if (huerfanos.length > 0) {
    throw new Error(
      `Servicios sin frente asignado en PILARES: ${huerfanos.map((s) => s.slug).join(", ")} (src/data/servicios.ts).`,
    );
  }
}

export const SITIO = {
  url: "https://soyluisflores.es",
  nombre: "Luis Flores",
  nombreCompleto: "Luis Carlos Flores",
  email: "hola@soyluisflores.es",
  calendly: "https://calendly.com/soyluisfloresoficial/nueva-reunion",
  // ID de Google Tag Manager, desde la variable de entorno PUBLIC_GTM_ID
  // (por ejemplo en Cloudflare Pages → Settings → Environment variables).
  // [COMPLETAR: el ID real. Mientras esté vacío no se carga GTM ni se
  // muestra el banner de cookies, porque no hay nada para lo que pedir permiso.]
  gtm: (import.meta.env.PUBLIC_GTM_ID ?? "") as string,
  // WhatsApp del titular (21/10/2026). El enlace abre el chat con un primer
  // mensaje escrito, que la persona puede cambiar antes de enviarlo.
  whatsapp: "https://wa.me/34631654919?text=" + encodeURIComponent("Hola, Luis. Vengo de tu web y quiero hablar de mi negocio."),
  whatsappVisible: "+34 631 65 49 19",
  telefono: "+34631654919",
  localidad: "Manresa",
  // Igual que el domicilio público del aviso legal: «Manresa, Barcelona, España».
  region: "Barcelona",
  pais: "ES",
  lema: "Menos tareas repetitivas. Más tiempo para ti.",
  /** Definición extraíble: la frase que debe poder citar un buscador de IA
   *  cuando le preguntan qué hace Luis Flores. Va en el JSON-LD de Person. */
  descripcion:
    "Luis Carlos Flores implementa agentes de IA, automatizaciones, embudos de venta, CRM, email marketing y paneles de métricas para pymes y emprendedores de Latinoamérica y España.",
  perfiles: [
    "https://www.linkedin.com/in/soyluisflores/",
    "https://www.instagram.com/soyluisflores_/",
    "https://www.tiktok.com/@soyluisfloresoficial",
    "https://smilbot.com",
  ],
} as const;

/**
 * Área servida, igual en todos los nodos de schema. Antes se mezclaban un
 * código ISO ("ES") y texto libre ("Latinoamérica") en el mismo array.
 */
export const AREA_SERVIDA = [
  { "@type": "Place", name: "Latinoamérica" },
  { "@type": "Country", name: "España" },
];

/**
 * Productos propios. Nova Funnels se retiró el 21/10/2026 porque
 * novafunnels.es ya no está activo.
 */
export const proyectos = [
  {
    nombre: "Smilbot",
    url: "https://smilbot.com",
    descripcion: "Recepcionista de IA para clínicas dentales, disponible 24/7.",
  },
];
