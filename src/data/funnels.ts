/**
 * Funnels de captación para campañas (28/10/2026). Ver FUNNELS.md.
 *
 * Una landing por servicio en /diagnostico/[servicio], con la identidad lima
 * de /diagnostico, para usar como destino de anuncios en Meta Ads y Google
 * Ads. El objetivo de todas es el mismo: agendar la llamada de diagnóstico
 * gratis de 30 minutos.
 *
 * Aquí va solo lo propio de cada funnel: el gancho, los problemas que
 * reconoce el cliente y lo que se lleva de la llamada. Lo que incluye el
 * servicio, lo que cambia, para quién es y sus preguntas salen de
 * servicios-detalle.ts, para que la web diga lo mismo en todas partes.
 *
 * Sin cifras, casos ni promesas nuevas.
 */

interface Bloque {
  titulo: string;
  texto: string;
}

export interface Funnel {
  /** Descripción para buscadores y vista previa al compartir. */
  description: string;
  /** Texto corto tras «Diagnóstico gratis ·» en la etiqueta del hero. */
  etiqueta: string;
  titulo: string;
  entrada: string;
  ventana: string;
  etapas: [string, string, string];
  dolores: [Bloque, Bloque, Bloque];
  llevas: [Bloque, Bloque, Bloque];
  /** Título de la sección «Qué implemento». */
  solucion: string;
}

export const funnels: Record<string, Funnel> = {
  "agentes-ia": {
    description:
      "Videollamada gratis de 30 minutos para ver cómo un agente de IA puede atender a tus clientes por WhatsApp, chat o teléfono y agendar sus citas.",
    etiqueta: "Agentes de IA",
    titulo: "Descubre en 30 minutos cómo un agente de IA puede atender y agendar a tus clientes.",
    entrada:
      "Me cuentas por dónde te escriben, qué te preguntan y cómo agendas hoy. Te digo qué puede llevar un agente de IA, en qué canal conviene empezar y qué necesitarías, trabajes conmigo o no.",
    ventana: "agente-ia",
    etapas: ["Cómo te llegan los clientes", "Qué puede atender el agente", "Tu plan para empezar"],
    dolores: [
      {
        titulo: "Mensajes fuera de horario",
        texto: "Te escriben de noche o el fin de semana y, cuando contestas, ese cliente ya le escribió a otro.",
      },
      {
        titulo: "Las mismas preguntas todo el día",
        texto: "Precios, horarios, dirección, disponibilidad. Tu equipo contesta lo mismo una y otra vez en lugar de atender.",
      },
      {
        titulo: "Huecos en la agenda",
        texto: "Las citas se agendan a mano, se olvidan o no se confirman, y la agenda queda con espacios vacíos.",
      },
    ],
    llevas: [
      {
        titulo: "Qué puede responder el agente",
        texto: "Qué consultas puede atender solo y cuáles conviene que pasen a una persona de tu equipo.",
      },
      {
        titulo: "El canal para empezar",
        texto: "Si conviene arrancar por WhatsApp, la web, Instagram o el teléfono, según cómo te llegan hoy los clientes.",
      },
      {
        titulo: "Qué se conecta con qué",
        texto: "Cómo se uniría con tu calendario y tu CRM, revisando lo que ya usas.",
      },
    ],
    solucion: "Un agente que contesta al momento y deja la cita en tu calendario.",
  },

  "funnels-conversion": {
    description:
      "Videollamada gratis de 30 minutos para ver en qué paso se te escapan los clientes y qué embudo de ventas armaría para tu negocio.",
    etiqueta: "Funnels de conversión",
    titulo: "Descubre en 30 minutos dónde se te escapan los clientes en tu proceso de venta.",
    entrada:
      "Me cuentas cómo te llegan los contactos y qué pasa después. Te digo en qué paso se enfrían, qué embudo armaría y cómo lo mediríamos, trabajes conmigo o no.",
    ventana: "funnel",
    etapas: ["Cómo captas hoy", "Dónde se enfrían", "Tu embudo paso a paso"],
    dolores: [
      {
        titulo: "Contactos sin seguimiento",
        texto: "Alguien deja sus datos o pregunta un precio y nadie vuelve a escribirle a tiempo.",
      },
      {
        titulo: "No sabes qué funciona",
        texto: "Recibes visitas y mensajes, pero no sabes qué paso trae clientes y cuál los pierde.",
      },
      {
        titulo: "Todo depende de ti",
        texto: "Si tú no estás pendiente de cada conversación, la venta se queda a medias.",
      },
    ],
    llevas: [
      {
        titulo: "Dónde se cae la venta",
        texto: "El paso de tu proceso donde hoy pierdes más contactos y por qué pasa.",
      },
      {
        titulo: "El embudo que armaría",
        texto: "Página de captación, mensajes de seguimiento y en qué orden, adaptado a cómo vendes.",
      },
      {
        titulo: "Cómo medirlo",
        texto: "Qué cifras mirar en cada etapa para saber qué mejorar primero.",
      },
    ],
    solucion: "Un embudo que capta, da seguimiento y te muestra cada paso.",
  },

  automatizacion: {
    description:
      "Videollamada gratis de 30 minutos para ver qué tareas repetitivas de tu negocio se pueden automatizar primero y con qué herramienta.",
    etiqueta: "Automatización",
    titulo: "Descubre en 30 minutos qué tareas de tu negocio se pueden hacer solas.",
    entrada:
      "Me cuentas qué haces a mano cada semana y con qué herramientas trabajas. Te digo qué automatizaría primero, con qué herramienta y qué cambia en tu día, trabajes conmigo o no.",
    ventana: "automatizacion",
    etapas: ["Tus tareas repetidas", "Qué se puede automatizar", "Por dónde empezar"],
    dolores: [
      {
        titulo: "Copiar y pegar datos",
        texto: "Pasas la misma información de una herramienta a otra y, de vez en cuando, se cuela un error.",
      },
      {
        titulo: "Tareas que se comen la semana",
        texto: "Correos repetidos, recordatorios y revisiones a mano que hay que hacer, pero no hacen crecer el negocio.",
      },
      {
        titulo: "Herramientas que no se hablan",
        texto: "Usas varias aplicaciones, cada una va por su lado y tú terminas haciendo de puente.",
      },
    ],
    llevas: [
      {
        titulo: "La primera tarea a automatizar",
        texto: "La que más tiempo te devuelve con menos esfuerzo de puesta en marcha.",
      },
      {
        titulo: "Con qué herramienta",
        texto: "Make, n8n, Zapier u otra, según lo que ya usas y lo que necesita tu proceso.",
      },
      {
        titulo: "Cómo saber que funciona",
        texto: "Qué avisos dejar para enterarte si algo falla y cómo medir el tiempo que recuperas.",
      },
    ],
    solucion: "Flujos confiables que hacen el trabajo repetitivo por ti.",
  },

  "crm-seguimiento-leads": {
    description:
      "Videollamada gratis de 30 minutos para ordenar tus contactos en un CRM, con etapas claras y recordatorios que salen solos.",
    etiqueta: "CRM y seguimiento",
    titulo: "Descubre en 30 minutos cómo ordenar tus contactos para que no se te pierda ninguno.",
    entrada:
      "Me cuentas por dónde te llegan los contactos y dónde los anotas hoy. Te digo cómo armaría tu CRM, qué etapas tendría y qué recordatorios saldrían solos, trabajes conmigo o no.",
    ventana: "crm",
    etapas: ["Dónde están tus contactos", "Las etapas de tu venta", "Tu CRM ordenado"],
    dolores: [
      {
        titulo: "Contactos repartidos",
        texto: "Unos en el correo, otros en el celular y otros en una hoja de cálculo. Nadie tiene la foto completa.",
      },
      {
        titulo: "Seguimientos que se olvidan",
        texto: "Quedaste en volver a escribir, se pasó la semana y ese cliente se enfrió.",
      },
      {
        titulo: "No sabes cómo va cada venta",
        texto: "Cuesta saber quién está por comprar, quién necesita un empujón y quién ya no responde.",
      },
    ],
    llevas: [
      {
        titulo: "Las etapas de tu proceso",
        texto: "Cómo dividir tu venta en pasos claros para ver dónde está cada contacto.",
      },
      {
        titulo: "Qué CRM te conviene",
        texto: "GoHighLevel, ActiveCampaign, Airtable u otro, según cómo trabajas y lo que ya usas.",
      },
      {
        titulo: "Qué recordatorios automatizar",
        texto: "Los avisos y mensajes que saldrían solos para que nadie se quede sin respuesta.",
      },
    ],
    solucion: "Un CRM donde cada contacto tiene su etapa y su siguiente paso.",
  },

  "email-marketing": {
    description:
      "Videollamada gratis de 30 minutos para ver qué secuencias de correo automáticas armaría primero para tu negocio y cómo medirlas.",
    etiqueta: "Email marketing",
    titulo: "Descubre en 30 minutos qué correos automáticos te ayudarían a vender.",
    entrada:
      "Me cuentas a quién le escribes hoy y qué pasa después de que alguien te deja su correo. Te digo qué secuencia armaría primero y cómo sabríamos si funciona, trabajes conmigo o no.",
    ventana: "email",
    etapas: ["Tu lista y tus correos", "Qué secuencia falta", "Tu plan de envíos"],
    dolores: [
      {
        titulo: "Contactos que nunca reciben nada",
        texto: "Juntas correos en la web, en redes o en persona, pero después nadie les escribe.",
      },
      {
        titulo: "Correos cuando hay tiempo",
        texto: "Mandas mensajes cuando te acuerdas, sin un orden ni un momento pensado para cada persona.",
      },
      {
        titulo: "No sabes si alguien los lee",
        texto: "Envías, pero no ves quién abre, quién hace clic ni quién terminó comprando.",
      },
    ],
    llevas: [
      {
        titulo: "La primera secuencia",
        texto: "Bienvenida, seguimiento o reactivación: la que más sentido tiene para tu negocio hoy.",
      },
      {
        titulo: "Qué decir en cada correo",
        texto: "El orden de los mensajes y el momento de enviarlos según lo que hace cada persona.",
      },
      {
        titulo: "Cómo medirlo",
        texto: "Qué mirar en clics y respuestas para saber qué correo mejorar.",
      },
    ],
    solucion: "Secuencias que escriben en el momento justo y se envían solas.",
  },

  "paneles-de-metricas": {
    description:
      "Videollamada gratis de 30 minutos para ver qué cifras de tu negocio conviene juntar en un panel que se actualice solo.",
    etiqueta: "Paneles de métricas",
    titulo: "Descubre en 30 minutos qué números necesitas ver para decidir mejor.",
    entrada:
      "Me cuentas dónde están hoy tus datos y cuánto te cuesta juntarlos. Te digo qué panel armaría, qué fuentes conectaría y qué cifras pondría primero, trabajes conmigo o no.",
    ventana: "metricas",
    etapas: ["Dónde están tus datos", "Qué cifras importan", "Tu panel en una pantalla"],
    dolores: [
      {
        titulo: "Datos repartidos",
        texto: "El CRM por un lado, las campañas por otro y los pagos en otro sitio. Nunca ves todo junto.",
      },
      {
        titulo: "Horas armando informes",
        texto: "Cada semana copias números a una hoja de cálculo para entender cómo vas.",
      },
      {
        titulo: "Decisiones a ojo",
        texto: "Sin una vista clara, cuesta saber qué campaña, canal o servicio te conviene más.",
      },
    ],
    llevas: [
      {
        titulo: "Las cifras que importan",
        texto: "Las pocas métricas que te sirven para decidir en cada etapa de tu negocio.",
      },
      {
        titulo: "Qué fuentes conectar",
        texto: "Qué herramientas se pueden unir en un panel y cuáles necesitan un paso previo.",
      },
      {
        titulo: "Cómo se vería tu panel",
        texto: "Qué mirarías cada semana y cada mes, en una sola pantalla.",
      },
    ],
    solucion: "Un panel que se actualiza solo y muestra lo que importa.",
  },

  "webs-ia": {
    description:
      "Videollamada gratis de 30 minutos para revisar tu web y ver qué cambiar primero para que te traiga contactos y clientes.",
    etiqueta: "Páginas web",
    titulo: "Descubre en 30 minutos qué necesita tu web para traerte clientes.",
    entrada:
      "Me cuentas para qué usas hoy tu web y cómo te llegan los clientes. Te digo qué cambiaría primero, qué páginas harían falta y cómo mediríamos los resultados, trabajes conmigo o no.",
    ventana: "web",
    etapas: ["Cómo está tu web hoy", "Qué le falta para vender", "Tu plan de páginas"],
    dolores: [
      {
        titulo: "Una web que no trae contactos",
        texto: "Tienes página, pero casi nadie escribe ni agenda desde ahí.",
      },
      {
        titulo: "Lenta o difícil en el celular",
        texto: "Tarda en cargar o cuesta encontrar lo importante desde el teléfono, que es por donde muchos te buscan.",
      },
      {
        titulo: "Sin un objetivo claro",
        texto: "Cada página dice un poco de todo y quien entra no sabe qué hacer después.",
      },
    ],
    llevas: [
      {
        titulo: "Qué cambiar primero",
        texto: "Lo que más frena hoy a tus visitas, revisado en el celular y en la computadora.",
      },
      {
        titulo: "Las páginas que hacen falta",
        texto: "Qué página necesita cada servicio u oferta y qué debe pedir cada una.",
      },
      {
        titulo: "Cómo medirla",
        texto: "Qué acciones contar para saber si la web te está trayendo clientes.",
      },
    ],
    solucion: "Una web rápida, clara y con un objetivo en cada página.",
  },

  "trafico-de-pago": {
    description:
      "Videollamada gratis de 30 minutos para revisar tu publicidad en Meta Ads y Google Ads y dejar la medición bien puesta antes de invertir más.",
    etiqueta: "Meta Ads y Google Ads",
    titulo: "Descubre en 30 minutos cómo invertir en Meta Ads y Google Ads sin apostar a ciegas.",
    entrada:
      "Me cuentas qué vendes, si ya hiciste anuncios y cómo mides hoy los resultados. Te digo qué revisaría primero, por dónde empezaría y qué mediríamos desde el primer día, trabajes conmigo o no.",
    ventana: "anuncios",
    etapas: ["Qué vendes y a quién", "Cómo se mide hoy", "Tu plan de campañas"],
    dolores: [
      {
        titulo: "Gastas sin saber qué vuelve",
        texto: "Pagas anuncios, pero no sabes cuáles traen clientes y cuáles solo traen clics.",
      },
      {
        titulo: "La medición no está bien puesta",
        texto: "Los contactos y las ventas no llegan a las plataformas, así que los anuncios no aprenden de ellos.",
      },
      {
        titulo: "Contactos que nadie atiende",
        texto: "Llegan mensajes por los anuncios, pero el seguimiento no da abasto y se pierden.",
      },
    ],
    llevas: [
      {
        titulo: "Qué revisar antes de invertir",
        texto: "La medición, la página de destino y el seguimiento que hacen falta para que cada campaña se pueda medir.",
      },
      {
        titulo: "Dónde empezar",
        texto: "Si te conviene más Meta Ads, Google Ads o los dos, según tu cliente y tu oferta.",
      },
      {
        titulo: "Qué medir desde el primer día",
        texto: "Las cifras que dicen si una campaña es rentable, más allá de los clics.",
      },
    ],
    solucion: "Campañas medidas desde el primer día.",
  },

  "consultoria-ia": {
    description:
      "Videollamada gratis de 30 minutos para ver por dónde empezar con la IA en tu negocio, con qué herramienta y qué resultado esperar.",
    etiqueta: "Consultoría de IA",
    titulo: "Descubre en 30 minutos por dónde empezar con la IA en tu negocio.",
    entrada:
      "Me cuentas cómo trabajas hoy y qué te gustaría resolver. Te digo dónde la IA te ahorraría más tiempo, con qué herramienta empezaría y qué puedes esperar, trabajes conmigo o no.",
    ventana: "consultoria",
    etapas: ["Cómo trabajas hoy", "Dónde ayuda la IA", "Tus prioridades"],
    dolores: [
      {
        titulo: "Demasiadas herramientas",
        texto: "Cada semana aparece una IA nueva y no sabes cuál vale la pena para tu negocio.",
      },
      {
        titulo: "Pruebas sin rumbo",
        texto: "Probaste algunas cosas, pero no se volvieron algo que tu equipo use cada día.",
      },
      {
        titulo: "Miedo a equivocarte",
        texto: "No quieres pagar por algo que después no encaja con cómo trabajas.",
      },
    ],
    llevas: [
      {
        titulo: "Tus prioridades",
        texto: "Qué conviene hacer primero con la IA y qué puede esperar.",
      },
      {
        titulo: "Las herramientas adecuadas",
        texto: "Con qué empezar, aprovechando lo que ya usas siempre que se pueda conectar.",
      },
      {
        titulo: "Qué resultado esperar",
        texto: "Cómo mediríamos el cambio, antes y después, con tus propios datos.",
      },
    ],
    solucion: "Un plan ordenado para usar la IA donde más te conviene.",
  },
};

/** Lo que no encaja, igual en todos los funnels. */
export const todaviaNoFunnel = [
  "Buscas resultados garantizados de la noche a la mañana.",
  "Todavía no tienes una oferta clara ni una forma de conseguir contactos.",
  "Quieres probar la herramienta de moda sin tener claro para qué.",
];
