/**
 * Herramientas que uso (09/11/2026). Lo usa src/pages/herramientas.astro.
 *
 * Son las mismas de la portada (home.ts → herramientas) y del llms.txt. Qué
 * es cada una y para qué la uso, sin precios (cambian y dependen del uso) y
 * sin decir que hay acuerdos comerciales con ninguna. Si el cliente ya usa
 * otra, primero se revisa si se puede conectar.
 */
export interface Herramienta {
  nombre: string;
  grupo: "Automatización" | "CRM, ventas y correo" | "Conversaciones e IA" | "Cobros y publicidad";
  queEs: string;
  paraQue: string;
  /** Servicios donde aparece (slugs de servicios.ts). */
  servicios: string[];
}

export const HERRAMIENTAS: Herramienta[] = [
  {
    nombre: "Make",
    grupo: "Automatización",
    queEs: "Plataforma de automatización con un editor visual donde cada flujo se arma como un diagrama.",
    paraQue: "Flujos con varios pasos, condiciones y rutas distintas según el caso.",
    servicios: ["automatizacion"],
  },
  {
    nombre: "n8n",
    grupo: "Automatización",
    queEs: "Plataforma de automatización que se puede instalar en un servidor propio o usar en la nube.",
    paraQue: "Cuando conviene tener los datos en tu propio servidor o hay mucho volumen de trabajo.",
    servicios: ["automatizacion"],
  },
  {
    nombre: "Zapier",
    grupo: "Automatización",
    queEs: "Plataforma de automatización con una biblioteca muy grande de integraciones listas para usar.",
    paraQue: "Flujos cortos y directos entre herramientas populares.",
    servicios: ["automatizacion"],
  },
  {
    nombre: "GoHighLevel",
    grupo: "CRM, ventas y correo",
    queEs: "Plataforma todo en uno con CRM, embudos, calendarios, correos y mensajes.",
    paraQue: "Tener captación, agenda y seguimiento en un mismo lugar.",
    servicios: ["crm-seguimiento-leads", "funnels-conversion"],
  },
  {
    nombre: "ActiveCampaign",
    grupo: "CRM, ventas y correo",
    queEs: "Herramienta de email marketing y automatización, con un CRM de ventas.",
    paraQue: "Secuencias de correo según lo que hace cada contacto.",
    servicios: ["email-marketing", "crm-seguimiento-leads"],
  },
  {
    nombre: "Airtable",
    grupo: "CRM, ventas y correo",
    queEs: "Base de datos con la comodidad de una hoja de cálculo.",
    paraQue: "Ordenar los datos de un proceso, un CRM sencillo o la fuente de un panel.",
    servicios: ["crm-seguimiento-leads", "paneles-de-metricas"],
  },
  {
    nombre: "WhatsApp",
    grupo: "Conversaciones e IA",
    queEs: "El canal por donde llegan muchas consultas. Para automatizarlo se usa la versión para empresas.",
    paraQue: "Que un agente de IA responda y agende, con plantillas aprobadas cuando WhatsApp las pide.",
    servicios: ["agentes-ia"],
  },
  {
    nombre: "ManyChat",
    grupo: "Conversaciones e IA",
    queEs: "Herramienta para automatizar conversaciones en Instagram, Facebook Messenger y WhatsApp.",
    paraQue: "Responder mensajes y comentarios en redes y llevar a la persona al siguiente paso.",
    servicios: ["agentes-ia", "funnels-conversion"],
  },
  {
    nombre: "ChatGPT",
    grupo: "Conversaciones e IA",
    queEs: "Modelos de IA de OpenAI.",
    paraQue: "Agentes que conversan, clasifican mensajes o redactan; elijo el modelo según el caso.",
    servicios: ["agentes-ia", "consultoria-ia"],
  },
  {
    nombre: "Claude",
    grupo: "Conversaciones e IA",
    queEs: "Modelos de IA de Anthropic.",
    paraQue: "Agentes que conversan y agendan. Es el modelo que usa Flora, la asistente de esta web.",
    servicios: ["agentes-ia", "consultoria-ia"],
  },
  {
    nombre: "Stripe",
    grupo: "Cobros y publicidad",
    queEs: "Plataforma de cobros online: pagos, suscripciones y enlaces de pago.",
    paraQue: "Cobrar y que cada pago avise al resto del sistema (CRM, correo, panel).",
    servicios: ["automatizacion"],
  },
  {
    nombre: "Meta Ads",
    grupo: "Cobros y publicidad",
    queEs: "La publicidad de Facebook e Instagram.",
    paraQue: "Llegar a personas que encajan con tu cliente, con la medición bien puesta antes de invertir.",
    servicios: ["trafico-de-pago"],
  },
  {
    nombre: "Google Ads",
    grupo: "Cobros y publicidad",
    queEs: "La publicidad en el buscador de Google y su red.",
    paraQue: "Aparecer cuando alguien ya está buscando lo que ofreces.",
    servicios: ["trafico-de-pago"],
  },
];

export const GRUPOS = ["Automatización", "CRM, ventas y correo", "Conversaciones e IA", "Cobros y publicidad"] as const;
