/**
 * Glosario de IA y automatización para negocios (09/11/2026). Lo usa
 * src/pages/glosario.astro (con su JSON-LD DefinedTermSet) y el llms.txt.
 *
 * Definiciones en palabras simples, coherentes con lo que ya explican las
 * páginas de servicio y el blog. Sin cifras ni promesas. Cada término enlaza
 * con el servicio o el artículo donde se explica con más detalle.
 */
export interface Termino {
  /** Ancla de la página: /glosario#<id>. */
  id: string;
  termino: string;
  /** Otros nombres con los que se conoce. */
  tambien?: string;
  definicion: string;
  ejemplo?: string;
  enlace?: { texto: string; href: string };
}

export const TERMINOS: Termino[] = [
  {
    id: "agente-de-ia",
    termino: "Agente de IA",
    definicion:
      "Un asistente que atiende a tus clientes por chat o por teléfono y agenda sus citas de forma automática. Responde con la información que tú apruebas y pasa la conversación a una persona cuando hace falta.",
    ejemplo: "Alguien escribe por WhatsApp a las 22:00 preguntando por horarios y el agente le propone dos horas y deja la cita en tu calendario.",
    enlace: { texto: "Agentes de IA", href: "/servicios/agentes-ia" },
  },
  {
    id: "chatbot",
    termino: "Chatbot",
    definicion:
      "Un programa que conversa por chat. Los más simples siguen un menú de opciones fijas; un agente de IA entiende lo que escribe la persona y puede consultar tus herramientas.",
    enlace: { texto: "Agente de IA en WhatsApp", href: "/blog/agente-de-ia-en-whatsapp" },
  },
  {
    id: "alucinacion",
    termino: "Alucinación",
    definicion:
      "Cuando una IA completa lo que no sabe con algo que le suena, por ejemplo un precio o un horario inventado. Se evita dándole una sola fuente de información, datos en tiempo real y una regla para cuando no sabe.",
    enlace: { texto: "Agentes de IA que no inventan información", href: "/blog/agentes-ia-sin-inventar" },
  },
  {
    id: "prompt",
    termino: "Prompt",
    tambien: "Instrucciones",
    definicion:
      "Las instrucciones que recibe una IA: qué hacer, con qué información y qué no hacer. En un agente de negocio incluye tus servicios, tus límites y cuándo pasar la conversación a una persona.",
  },
  {
    id: "automatizacion",
    termino: "Automatización de procesos",
    definicion:
      "Lograr que tus herramientas se pasen datos y hagan las tareas repetitivas sin que nadie tenga que intervenir.",
    ejemplo: "Llega un formulario de la web, el contacto se guarda en el CRM, recibe un correo de bienvenida y tu equipo recibe un aviso.",
    enlace: { texto: "Automatización de procesos", href: "/servicios/automatizacion" },
  },
  {
    id: "flujo",
    termino: "Flujo de trabajo",
    tambien: "Workflow, escenario o zap",
    definicion:
      "La secuencia de pasos que hace una automatización: qué la activa, qué hace en cada paso y qué pasa si algo falla. Cada herramienta le da su nombre: escenario en Make, zap en Zapier, workflow en n8n.",
    enlace: { texto: "Cómo conectar tus herramientas sin que nada se rompa", href: "/blog/conectar-herramientas-sin-romper" },
  },
  {
    id: "integracion",
    termino: "Integración",
    definicion:
      "La conexión entre dos herramientas para que compartan datos, por ejemplo tu formulario web con tu CRM o tu calendario con tu agente de IA.",
    enlace: { texto: "Herramientas que uso", href: "/herramientas" },
  },
  {
    id: "api",
    termino: "API",
    definicion:
      "La puerta que ofrece una herramienta para que otros programas lean o escriban datos en ella. Gracias a las API, un agente puede consultar tu calendario o tu CRM.",
  },
  {
    id: "webhook",
    termino: "Webhook",
    definicion:
      "Un aviso automático que una herramienta manda a otra en el momento en que pasa algo, por ejemplo cuando alguien agenda una cita o paga.",
  },
  {
    id: "crm",
    termino: "CRM",
    tambien: "Gestión de la relación con el cliente",
    definicion:
      "El sistema donde guardas cada contacto con su historial, su etapa y el siguiente paso a dar.",
    enlace: { texto: "CRM para pymes: qué es y cómo empezar", href: "/blog/crm-para-pymes-por-donde-empezar" },
  },
  {
    id: "lead",
    termino: "Lead",
    tambien: "Contacto interesado o cliente potencial",
    definicion:
      "Una persona que mostró interés en tu negocio y dejó una forma de contacto, por ejemplo al escribirte, pedir una guía o agendar una llamada.",
    enlace: { texto: "CRM y seguimiento de leads", href: "/servicios/crm-seguimiento-leads" },
  },
  {
    id: "funnel",
    termino: "Funnel de conversión",
    tambien: "Embudo de ventas",
    definicion:
      "El camino que sigue una persona desde que te conoce hasta que te compra, con cada paso medido.",
    enlace: { texto: "Funnels de conversión", href: "/servicios/funnels-conversion" },
  },
  {
    id: "landing-page",
    termino: "Página de captación",
    tambien: "Landing page",
    definicion:
      "Una página con un solo objetivo, por ejemplo agendar una llamada o pedir una guía, sin distracciones que compitan con esa acción.",
    enlace: { texto: "Qué revisar en tu web para que te traiga clientes", href: "/blog/que-revisar-en-tu-web" },
  },
  {
    id: "tasa-de-conversion",
    termino: "Tasa de conversión",
    definicion:
      "De cada cien personas que llegan a un paso, cuántas dan el siguiente: por ejemplo, cuántas de las que visitan tu página dejan sus datos.",
    enlace: { texto: "Qué medir en tu negocio", href: "/blog/que-medir-en-cada-etapa" },
  },
  {
    id: "secuencia-de-email",
    termino: "Secuencia de email",
    definicion:
      "Una serie de correos que se envían solos, en orden y según lo que hace cada contacto, para acompañarlo hasta la compra. Solo se envía a quien dio su permiso.",
    enlace: { texto: "Email marketing", href: "/servicios/email-marketing" },
  },
  {
    id: "panel-de-metricas",
    termino: "Panel de métricas",
    tambien: "Dashboard",
    definicion:
      "Una pantalla que junta los números de cada etapa de tu negocio, tomados de las herramientas que ya usas, para que decidas con datos.",
    enlace: { texto: "Paneles de métricas", href: "/servicios/paneles-de-metricas" },
  },
  {
    id: "utm",
    termino: "Parámetros UTM",
    definicion:
      "Etiquetas que se añaden al final de un enlace (utm_source, utm_campaign…) para saber de qué anuncio, red o correo llegó cada visita y cada contacto.",
  },
  {
    id: "pixel",
    termino: "Píxel de conversión",
    definicion:
      "Un fragmento de código de Meta o Google que avisa a la plataforma cuando alguien hace algo valioso en tu web, como agendar o comprar. Con eso la plataforma aprende a quién mostrar tus anuncios.",
    enlace: { texto: "Antes de pagar anuncios en Meta o Google", href: "/blog/antes-de-pagar-anuncios" },
  },
];
