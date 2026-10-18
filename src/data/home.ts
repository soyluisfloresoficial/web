/**
 * Contenido de la home. Los textos son los del sitio en producción, extraídos
 * del HTML el 18/10/2026. No están reescritos: si algo hay que cambiar, se
 * cambia aquí y afecta a la página y al schema a la vez.
 */

export const fugas = [
  {
    titulo: "Respondes tarde y el lead se enfría",
    texto:
      "Llega una consulta a mediodía y la contestas por la noche, cuando ya han escrito a otro. El primero que responde suele llevarse al cliente.",
  },
  {
    titulo: "El día se va en tareas que se repiten",
    texto:
      "Agendar, confirmar, pasar datos de un sitio a otro, responder siempre lo mismo. Trabajo necesario que no deja tiempo para lo que de verdad hace crecer el negocio.",
  },
  {
    titulo: "Huecos vacíos por citas que no aparecen",
    texto:
      "Reservas que nadie confirma y recordatorios que se envían a mano (o no se envían). Cada no-show es una hora perdida que no vuelve.",
  },
];

export const publicos = [
  { titulo: "Coaches y consultores online", texto: "Más leads, menos tareas manuales." },
  { titulo: "Infoproductores y formadores", texto: "Funnels que captan y nutren." },
  { titulo: "Clínicas y negocios con cita", texto: "Agenda ordenada, menos no-shows." },
  { titulo: "Agencias y pequeñas empresas", texto: "Procesos que escalan." },
];

export const herramientas = [
  "Make",
  "n8n",
  "Zapier",
  "GoHighLevel",
  "ManyChat",
  "ActiveCampaign",
  "Airtable",
  "Stripe",
  "WhatsApp",
  "ChatGPT",
  "Claude",
  "Meta Ads",
  "Google Ads",
];

export const estandares = [
  {
    titulo: "Diagnóstico antes de proponer",
    texto:
      "Primero entiendo cómo funciona tu negocio. Solo después decido qué tiene sentido automatizar y qué no.",
  },
  {
    titulo: "Se integra con lo que ya usas",
    texto:
      "Reviso tus herramientas actuales antes de proponerte cambiar nada. Menos fricción para tu equipo.",
  },
  {
    titulo: "Control de errores y avisos",
    texto:
      "Cada flujo registra los fallos y avisa antes de que afecten a tus clientes.",
  },
  {
    titulo: "La IA no inventa",
    texto:
      "Los agentes responden solo con la información que tú validas. Si no saben algo, derivan a una persona.",
  },
  {
    titulo: "Documentación incluida",
    texto:
      "Entrego cada sistema documentado para que tu equipo sepa qué hace y cómo mantenerlo.",
  },
  {
    titulo: "Decisiones con datos",
    texto:
      "Mido cada etapa desde el primer día y mejoro primero lo que más impacto tiene en tu cuenta de resultados.",
  },
];

export const proceso = [
  {
    numero: "01",
    titulo: "Diagnóstico",
    texto:
      "Analizo tus procesos, tus herramientas y dónde se pierde tiempo o dinero. Sales con prioridades claras.",
    yo: "Reviso tu operativa y priorizo qué automatizar primero.",
    tu: "Me enseñas cómo trabajas hoy en una llamada de 30 min.",
    imagen: "proceso-diagnostico",
    imagenAlt: "Luis Carlos Flores revisando el proceso de un cliente",
  },
  {
    numero: "02",
    titulo: "Implementación",
    texto:
      "Construyo la solución, la conecto a tus herramientas y la pruebo contigo con casos reales. La documentación está incluida.",
    yo: "Monto, conecto y pruebo todo, y lo dejo documentado.",
    tu: "Me das acceso a las herramientas y validas con un caso real.",
    imagen: "proceso-implementacion",
    imagenAlt: "Configuración de una automatización en pantalla",
  },
  {
    numero: "03",
    titulo: "Medición y mejora",
    texto:
      "Mido los resultados con datos y ajusto lo que no rinde. Se mejora lo que se mide.",
    yo: "Mido los resultados y ajusto lo que no rinde.",
    tu: "Me cuentas qué notas en el día a día del negocio.",
    imagen: "proceso-medicion",
    imagenAlt: "Panel de métricas de un sistema ya en marcha",
  },
];

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export interface GrupoFaq {
  grupo: string;
  preguntas: Pregunta[];
}

export const faq: GrupoFaq[] = [
  {
    grupo: "Antes de empezar",
    preguntas: [
      {
        pregunta: "¿Esto sirve para un negocio pequeño como el mío?",
        respuesta:
          "Sí. Cuanto más limitados están el tiempo y el equipo, más importa automatizar lo correcto primero. Empezamos por una sola cosa que te libere tiempo o deje de perder clientes.",
      },
      {
        pregunta: "¿Necesito saber de tecnología?",
        respuesta:
          "No. Yo lo implemento y te lo explico en lenguaje claro, con ejemplos de tu propio negocio. Al terminar queda documentado para que tu equipo sepa qué hace y cómo mantenerlo.",
      },
      {
        pregunta: "¿Qué se puede automatizar en mi negocio?",
        respuesta:
          "Lo que se repite y sigue reglas claras: responder consultas frecuentes, agendar y confirmar citas, seguimiento de leads, pasar datos entre herramientas o enviar recordatorios. Lo que requiere criterio humano se queda en tu equipo.",
      },
    ],
  },
  {
    grupo: "Cómo trabajamos",
    preguntas: [
      {
        pregunta: "¿Cómo es la primera llamada?",
        respuesta:
          "Son 30 minutos por videollamada. Me cuentas cómo funciona tu negocio y dónde pierdes tiempo u oportunidades, y te digo qué automatizaría primero. Sin compromiso.",
      },
      {
        pregunta: "¿Qué pasa después del diagnóstico?",
        respuesta:
          "Si encaja, te paso una propuesta por escrito. Trabajo en tres fases: diagnóstico, implementación (con la documentación incluida) y medición con datos para ajustar lo que no rinde.",
      },
      {
        pregunta: "¿Trabajas con negocios fuera de España?",
        respuesta:
          "Sí, en remoto con España y Latinoamérica. Las llamadas y la documentación son en español y adapto los horarios a tu zona.",
      },
    ],
  },
  {
    grupo: "Precio y plazos",
    preguntas: [
      {
        pregunta: "¿Cuánto cuesta?",
        respuesta:
          "Depende del alcance: no es lo mismo una automatización concreta que un sistema completo. Tras la llamada de diagnóstico recibes una propuesta cerrada por escrito, sin sorpresas.",
      },
      {
        pregunta: "¿Cuánto tarda un proyecto?",
        respuesta:
          "Depende de lo que montemos y de las herramientas que ya uses. Te doy una estimación por escrito tras la primera llamada; no prometo plazos cerrados sin conocer tu caso.",
      },
      {
        pregunta: "¿Hay permanencia o cuotas obligatorias?",
        respuesta:
          "Lo definimos en la propuesta según tu caso, sin letra pequeña. Algunas herramientas tienen su propia suscripción (la contratas tú y a tu nombre); te lo digo con claridad antes de empezar.",
      },
    ],
  },
  {
    grupo: "Tecnología y privacidad",
    preguntas: [
      {
        pregunta: "¿Qué herramientas usas?",
        respuesta:
          "Sobre todo Make, n8n, Zapier, GoHighLevel, ManyChat, ActiveCampaign, Airtable y Stripe. Si ya usas otras, reviso si se pueden integrar antes de proponerte cambiar nada.",
      },
      {
        pregunta: "¿La IA puede inventar información?",
        respuesta:
          "Se configura para responder solo con la información que tú validas. Si no sabe algo, lo dice y deriva a una persona. Precios, horarios y disponibilidad salen de tus datos, nunca de suposiciones.",
      },
      {
        pregunta: "¿Cómo quedan los datos y el RGPD?",
        respuesta:
          "Monto los sistemas con el consentimiento y la finalidad claros, y sin pedir datos sensibles. Para el detalle legal de tu caso te recomiendo revisarlo con un profesional; yo me ocupo de la parte técnica.",
      },
    ],
  },
];

/** Las 12 preguntas en plano, para el FAQPage del schema. */
export const faqPlana: Pregunta[] = faq.flatMap((g) => g.preguntas);
