/**
 * Origen único de los servicios.
 *
 * La home, el pie, /servicios y el llms.txt leen de aquí. En el sitio anterior
 * cada sitio tenía su propia lista y por eso la home y el pie enseñaban cuatro
 * de los seis. Con un solo array eso no puede volver a pasar.
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
  /** Nombre del fichero en src/assets, sin extensión. */
  imagen: string;
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
    imagenAlt: "Flujo de automatización conectando varias herramientas",
  },
  {
    slug: "webs-ia",
    nombre: "Webs con IA",
    definicion:
      "Una web con IA es un sitio rápido y orientado a un objetivo que puede incluir un asistente que responde y capta contactos.",
    resumen: "Rápidas, accesibles y con un objetivo claro por página.",
    color: "--svc-webs-ia",
    imagen: "webs-ia",
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
    imagenAlt: "Hoja de ruta de adopción de IA priorizada",
  },
];

export const SITIO = {
  url: "https://soyluisflores.es",
  nombre: "Luis Flores",
  nombreCompleto: "Luis Carlos Flores",
  email: "hola@soyluisflores.es",
  localidad: "Manresa",
  region: "Cataluña",
  pais: "ES",
  lema: "Menos tareas repetitivas. Más tiempo para ti.",
  perfiles: [
    "https://www.linkedin.com/in/soyluisflores/",
    "https://www.instagram.com/soyluisflores_/",
    "https://www.tiktok.com/@soyluisfloresoficial",
    "https://novafunnels.es",
    "https://smilbot.com",
  ],
} as const;

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
