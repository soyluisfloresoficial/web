/**
 * Contenido de la home. Parten de los textos de producción (18/10/2026) y se
 * pasaron a español latino neutro el 21/10/2026, a pedido del titular. Si algo
 * hay que cambiar, se cambia aquí y afecta a la página y al schema a la vez.
 */

export const fugas = [
  {
    titulo: "Respondes tarde y el cliente se va",
    texto:
      "Te escriben al mediodía y contestas en la noche. Para entonces ya le escribieron a otro, y casi siempre se queda con el cliente el primero que responde.",
  },
  {
    titulo: "El día se te va en tareas repetidas",
    texto:
      "Agendar, confirmar, pasar datos de una herramienta a otra, contestar las mismas preguntas. Hay que hacerlo, pero te quita el tiempo que necesitas para hacer crecer el negocio.",
  },
  {
    titulo: "Citas agendadas que nadie atiende",
    texto:
      "Nadie confirma las citas y los recordatorios se mandan a mano, cuando alguien se acuerda. Cada persona que no llega es una hora de agenda que ya no recuperas.",
  },
];

export const publicos = [
  { titulo: "Coaches y consultores online", texto: "Más clientes potenciales, menos trabajo manual." },
  { titulo: "Creadores de cursos y mentores", texto: "Embudos que captan y hacen seguimiento." },
  { titulo: "Clínicas y negocios con citas", texto: "Agenda en orden y menos inasistencias." },
  { titulo: "Agencias y pequeñas empresas", texto: "Procesos que aguantan cuando creces." },
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
    titulo: "Primero el diagnóstico",
    texto:
      "Antes de proponerte algo, entiendo cómo funciona tu negocio. Después vemos juntos qué conviene automatizar y qué es mejor dejar como está.",
  },
  {
    titulo: "Uso lo que ya tienes",
    texto:
      "Reviso tus herramientas actuales antes de sugerir un cambio. Así tu equipo no tiene que aprender todo desde cero.",
  },
  {
    titulo: "Avisos cuando algo falla",
    texto:
      "Cada automatización guarda un registro de errores y te avisa antes de que el problema llegue a tus clientes.",
  },
  {
    titulo: "La IA no inventa respuestas",
    texto:
      "Los agentes contestan solo con la información que tú apruebas. Si no saben algo, pasan la conversación a una persona.",
  },
  {
    titulo: "Todo queda documentado",
    texto:
      "Te entrego cada sistema con su documentación, para que tu equipo sepa qué hace y cómo mantenerlo.",
  },
  {
    titulo: "Decisiones con datos",
    texto:
      "Mido cada etapa desde el primer día y empiezo a mejorar por lo que más pesa en tus ventas y tus costos.",
  },
];

export const proceso = [
  {
    numero: "01",
    titulo: "Diagnóstico",
    texto:
      "Reviso tus procesos y tus herramientas, y busco dónde se te van el tiempo y el dinero. Terminas con una lista clara de prioridades.",
    yo: "Analizo cómo trabajas y ordeno qué automatizar primero.",
    tu: "Me muestras tu día a día en una llamada de 30 minutos.",
    imagen: "proceso-diagnostico",
    imagenAlt: "Luis Carlos Flores revisando el proceso de un cliente",
  },
  {
    numero: "02",
    titulo: "Implementación",
    texto:
      "Armo la solución, la conecto con tus herramientas y la probamos juntos con casos reales. La documentación va incluida.",
    yo: "Configuro, conecto y pruebo cada parte, y la dejo documentada.",
    tu: "Me das acceso a las herramientas y revisas un caso real.",
    imagen: "proceso-implementacion",
    imagenAlt: "Configuración de una automatización en pantalla",
  },
  {
    numero: "03",
    titulo: "Medición y mejora",
    texto:
      "Revisamos los resultados con datos y ajustamos lo que no está funcionando.",
    yo: "Mido los resultados y corrijo lo que no rinde.",
    tu: "Me cuentas qué cambios notas en el día a día.",
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
          "Sí. Cuando el tiempo y el equipo son pocos, elegir bien qué automatizar importa todavía más. Empezamos por una sola cosa que te ahorre horas o evite que se te escapen clientes.",
      },
      {
        pregunta: "¿Necesito saber de tecnología?",
        respuesta:
          "No. Yo me encargo de la parte técnica y te explico todo con ejemplos de tu propio negocio. Al final te dejo la documentación para que tu equipo sepa cómo funciona y cómo mantenerlo.",
      },
      {
        pregunta: "¿Qué se puede automatizar en mi negocio?",
        respuesta:
          "Todo lo que se repite y sigue reglas claras. Por ejemplo, responder preguntas frecuentes, agendar y confirmar citas, dar seguimiento a contactos, pasar datos entre herramientas o mandar recordatorios. Lo que necesita criterio humano lo sigue haciendo tu equipo.",
      },
    ],
  },
  {
    grupo: "Cómo trabajamos",
    preguntas: [
      {
        pregunta: "¿Cómo es la primera llamada?",
        respuesta:
          "Es una videollamada de 30 minutos. Me cuentas cómo funciona tu negocio y dónde pierdes tiempo o clientes, y te digo qué automatizaría primero. No tienes que contratar nada.",
      },
      {
        pregunta: "¿Qué pasa después del diagnóstico?",
        respuesta:
          "Si tiene sentido trabajar juntos, te mando una propuesta por escrito. El trabajo tiene tres fases: diagnóstico, implementación con documentación incluida, y medición para corregir lo que no funcione.",
      },
      {
        pregunta: "¿Trabajas con negocios de mi país?",
        respuesta:
          "Sí. Trabajo en remoto con negocios de España y de toda Latinoamérica. Las llamadas y la documentación son en español, y acomodo los horarios a tu zona.",
      },
    ],
  },
  {
    grupo: "Precio y plazos",
    preguntas: [
      {
        pregunta: "¿Cuánto cuesta?",
        respuesta:
          "Depende de lo que haya que hacer. Una automatización puntual no cuesta lo mismo que un sistema completo. Después de la llamada te mando una propuesta por escrito con el precio cerrado.",
      },
      {
        pregunta: "¿Cuánto tarda un proyecto?",
        respuesta:
          "Depende de lo que armemos y de las herramientas que ya uses. Después de la primera llamada te doy una estimación por escrito. Sin conocer tu caso no te puedo prometer una fecha.",
      },
      {
        pregunta: "¿Hay contrato de permanencia o pagos mensuales obligatorios?",
        respuesta:
          "Eso lo definimos en la propuesta, según tu caso, y queda todo por escrito. Algunas herramientas tienen su propia suscripción, que contratas tú y queda a tu nombre. Te lo digo antes de empezar.",
      },
    ],
  },
  {
    grupo: "Tecnología y privacidad",
    preguntas: [
      {
        pregunta: "¿Qué herramientas usas?",
        respuesta:
          "Sobre todo Make, n8n, Zapier, GoHighLevel, ManyChat, ActiveCampaign, Airtable y Stripe. Si ya usas otras, primero reviso si se pueden conectar antes de sugerirte un cambio.",
      },
      {
        pregunta: "¿La IA puede inventar información?",
        respuesta:
          "La configuro para que responda solo con la información que tú apruebas. Si no sabe algo, lo dice y pasa la conversación a una persona. Los precios, horarios y disponibilidad salen de tus datos, nunca de suposiciones.",
      },
      {
        pregunta: "¿Qué pasa con los datos de mis clientes?",
        respuesta:
          "Configuro los sistemas para pedir solo los datos necesarios, con consentimiento y para un fin claro. Cada país tiene su ley de protección de datos (en Europa, el RGPD), así que para la parte legal te recomiendo consultar con un profesional. Yo me encargo de la parte técnica.",
      },
    ],
  },
];

/** Las 12 preguntas en plano, para el FAQPage del schema. */
export const faqPlana: Pregunta[] = faq.flatMap((g) => g.preguntas);

/**
 * Cifras de implementaciones propias. Salen en la home y en /sobre-mi, y el
 * asterisco de las dos lleva a /sobre-mi#como-mido.
 * [COMPLETAR: periodo, número de negocios y método de cada cifra.]
 */
export const metricas = [
  { cifra: "73%", texto: "de los contactos reciben respuesta al instante" },
  { cifra: "12 h", texto: "liberadas por semana" },
  { cifra: "40%", texto: "menos inasistencias en negocios con citas" },
];
