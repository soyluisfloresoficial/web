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
      "Un agente de IA es un sistema que atiende a tus clientes por voz o chat y gestiona citas de forma automática.",
    resumen: "Atienden por chat y voz 24/7 y agendan citas por ti.",
    color: "--svc-agentes-ia",
    imagen: "agentes-ia",
    icono: "robot",
    imagenAlt: "Agente de IA respondiendo a un cliente por chat",
  },
  {
    slug: "funnels-conversion",
    nombre: "Funnels de conversión",
    definicion:
      "Un funnel de conversión es el recorrido ordenado que lleva a un desconocido a convertirse en cliente, con cada paso medido.",
    resumen: "Landing, captación y seguimiento por email y WhatsApp.",
    color: "--svc-funnels-conversion",
    imagen: "funnels-conversion",
    icono: "embudo",
    imagenAlt: "Embudo de conversión con las etapas medidas",
  },
  {
    slug: "automatizacion",
    nombre: "Automatización de procesos",
    definicion:
      "La automatización de procesos consiste en que tus herramientas se pasen datos y ejecuten tareas repetitivas sin intervención manual.",
    resumen: "Flujos con Make, n8n y Zapier, con control de errores.",
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
      "Un CRM es el sistema donde se guarda cada contacto con su historial, su etapa y la siguiente acción, para que ningún lead se quede sin respuesta.",
    resumen: "Cada contacto en su etapa y con su siguiente paso, sin hojas sueltas.",
    color: "--svc-crm-seguimiento-leads",
    imagen: "",
    icono: "usuarios",
    imagenAlt: "Ilustración de un CRM con los contactos organizados por etapas",
  },
  {
    slug: "email-marketing",
    nombre: "Email marketing y secuencias",
    definicion:
      "Una secuencia de email es una serie de correos que se envían solos, en orden y según lo que hace cada contacto, para acompañarle hasta la compra.",
    resumen: "Bienvenida, seguimiento y recuperación de contactos, con su consentimiento.",
    color: "--svc-email-marketing",
    imagen: "",
    icono: "email",
    imagenAlt: "Ilustración de una secuencia de correos en una línea de tiempo",
  },
  {
    slug: "paneles-de-metricas",
    nombre: "Paneles de métricas e informes",
    definicion:
      "Un panel de métricas reúne en una sola pantalla los números de cada etapa del negocio, sacados de las herramientas que ya usas, para decidir con datos.",
    resumen: "Las cifras de cada etapa en una sola pantalla, sin copiar a mano.",
    color: "--svc-paneles-de-metricas",
    imagen: "",
    icono: "grafica",
    imagenAlt: "Ilustración de un panel con indicadores y gráficas",
  },
  {
    slug: "webs-ia",
    nombre: "Webs con IA",
    definicion:
      "Una web con IA es un sitio rápido y orientado a un objetivo que puede incluir un asistente que responde y capta contactos.",
    resumen: "Rápidas, accesibles y con un objetivo claro por página.",
    color: "--svc-webs-ia",
    imagen: "webs-ia",
    icono: "web",
    imagenAlt: "Web mobile-first con formulario de contacto",
  },
  {
    slug: "trafico-de-pago",
    nombre: "Tráfico de pago",
    definicion:
      "El tráfico de pago es la publicidad en plataformas como Meta y Google para llevar a tu oferta a personas con interés real.",
    resumen: "Meta Ads y Google Ads con medición correcta desde el día uno.",
    color: "--svc-trafico-de-pago",
    imagen: "trafico-de-pago",
    icono: "megafono",
    imagenAlt: "Panel de campañas de Meta Ads y Google Ads",
  },
  {
    slug: "consultoria-ia",
    nombre: "Consultoría IA",
    definicion:
      "La consultoría de IA es un diagnóstico de tu negocio que termina en una hoja de ruta priorizada para adoptar inteligencia artificial.",
    resumen: "Diagnóstico y hoja de ruta priorizada para tu negocio.",
    color: "--svc-consultoria-ia",
    imagen: "consultoria-ia",
    icono: "brujula",
    imagenAlt: "Hoja de ruta de adopción de IA priorizada",
  },
];

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
  // [COMPLETAR: número real de WhatsApp. En producción el enlace es
  // https://wa.me/34XXXXXXXXX, un marcador sin sustituir, así que aquí no se
  // pone ningún enlace de WhatsApp hasta tener el número.]
  localidad: "Manresa",
  region: "Cataluña",
  pais: "ES",
  lema: "Menos tareas repetitivas. Más tiempo para ti.",
  /** Definición extraíble: la frase que debe poder citar un buscador de IA
   *  cuando le preguntan qué hace Luis Flores. Va en el JSON-LD de Person. */
  descripcion:
    "Luis Carlos Flores implementa agentes de IA, automatizaciones, funnels de conversión, CRM, email marketing y paneles de métricas para pymes y emprendedores de España y Latinoamérica, desde Manresa.",
  perfiles: [
    "https://www.linkedin.com/in/soyluisflores/",
    "https://www.instagram.com/soyluisflores_/",
    "https://www.tiktok.com/@soyluisfloresoficial",
    "https://novafunnels.es",
    "https://smilbot.com",
  ],
} as const;

/**
 * Área servida, igual en todos los nodos de schema. Antes se mezclaban un
 * código ISO ("ES") y texto libre ("Latinoamérica") en el mismo array.
 */
export const AREA_SERVIDA = [
  { "@type": "Country", name: "España" },
  { "@type": "Place", name: "Latinoamérica" },
];

/**
 * Proyectos propios. [COMPLETAR: frase factual de Nova Funnels; hoy
 * novafunnels.es no devuelve title, description ni h1 legibles.]
 */
export const proyectos = [
  {
    nombre: "Smilbot",
    url: "https://smilbot.com",
    descripcion: "Recepcionista de IA para clínicas dentales, disponible 24/7.",
  },
  {
    nombre: "Nova Funnels",
    url: "https://novafunnels.es",
    descripcion: "",
  },
];
