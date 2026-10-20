/**
 * Contenido de cada página de servicio, extraído del HTML de producción el
 * 18/10/2026. Textos literales, no reescritos.
 *
 * La sección "Herramientas" que tenía el sitio anterior se ha dejado fuera a
 * propósito: la extracción no la recuperó de forma fiable y prefiero no
 * inventar qué herramientas aparecían en cada servicio.
 * [COMPLETAR: lista de herramientas por servicio, si se quiere recuperar.]
 */

import type { Pregunta } from "./home";

export interface DetalleServicio {
  h1: string;
  intro: string;
  resultado: string[];
  paraQuien: string[];
  queIncluye: string[];
  faq: Pregunta[];
}

export const detalles: Record<string, DetalleServicio> = {
  "agentes-ia": {
    h1: "Agentes de IA para atender y agendar clientes 24/7",
    intro:
      "Tu negocio recibe mensajes y llamadas fuera de horario, en mitad de una reunión o cuando todo el equipo está ocupado. Un agente de IA responde al momento, resuelve las dudas frecuentes y deja la cita reservada en tu agenda.",
    resultado: [
      "Tus clientes reciben respuesta al instante, también fuera de horario.",
      "Menos huecos vacíos: las citas se agendan y se confirman solas.",
      "Tu equipo deja de repetir lo mismo y se centra en lo que de verdad necesita una persona.",
    ],
    paraQuien: [
      "Negocios con citas: clínicas, centros de estética, consultas, academias o servicios a domicilio.",
      "Empresas que reciben muchas consultas repetidas por WhatsApp, Instagram, web o teléfono.",
      "Equipos pequeños que pierden oportunidades porque no pueden responder a tiempo.",
    ],
    queIncluye: [
      "Agente de chat para web, WhatsApp e Instagram y, si encaja, agente de voz para llamadas.",
      "Atención 24/7 con respuestas basadas solo en la información que tú validas.",
      "Integración con tu CRM y tu agenda para registrar contactos y reservar citas.",
      "Derivación a una persona cuando la consulta lo requiere o el cliente lo pide.",
      "Reglas para que el agente nunca invente precios, horarios ni disponibilidad.",
      "Documentación del funcionamiento y del flujo de derivación.",
    ],
    faq: [
      {
        pregunta: "¿El agente de IA puede inventar información?",
        respuesta:
          "Se configura para responder solo con la información que tú apruebas. Si no sabe algo, lo dice y deriva la conversación a una persona. Precios, horarios y disponibilidad salen de tus datos, nunca de suposiciones.",
      },
      {
        pregunta: "¿Qué pasa si el cliente quiere hablar con una persona?",
        respuesta:
          "El agente detecta la petición y deriva la conversación a tu equipo por el canal que definamos, con el contexto de lo hablado para que nadie tenga que repetir nada.",
      },
      {
        pregunta: "¿Se integra con mi agenda y mi CRM?",
        respuesta:
          "Sí, siempre que la herramienta tenga integración o API. Antes de empezar revisamos qué usas para confirmar qué es posible y cómo.",
      },
      {
        pregunta: "¿Funciona en voz y en chat?",
        respuesta:
          "Sí. El chat suele ser el primer paso porque es más rápido de validar. El agente de voz se añade cuando tu negocio recibe muchas llamadas.",
      },
    ],
  },

  "funnels-conversion": {
    h1: "Funnels de conversión que convierten visitas en clientes",
    intro:
      "Atraer tráfico no sirve si después nadie hace seguimiento. Un funnel bien montado capta el contacto, lo nutre con mensajes útiles y te dice en qué punto se pierden las oportunidades.",
    resultado: [
      "Dejas de perder contactos por no hacer seguimiento a tiempo.",
      "Sabes en qué punto se enfría cada lead y por qué.",
      "Tu proceso comercial sigue funcionando aunque tú no estés delante.",
    ],
    paraQuien: [
      "Negocios que generan contactos pero no tienen un seguimiento ordenado.",
      "Emprendedores que venden servicios o formación y necesitan un proceso comercial claro.",
      "Empresas que invierten en publicidad y no saben qué etapa falla.",
    ],
    queIncluye: [
      "Landing page con un objetivo y una llamada a la acción.",
      "Formularios y captación conectados a tu CRM.",
      "Secuencias de email y WhatsApp para el seguimiento.",
      "Puntuación de leads para priorizar a quién llamar primero.",
      "Métrica por etapa: visitas, registros, citas y ventas.",
      "Documentación del funnel y de sus automatizaciones.",
    ],
    faq: [
      {
        pregunta: "¿Qué diferencia hay entre una web y un funnel?",
        respuesta:
          "Una web presenta tu negocio. Un funnel tiene un único objetivo, como reservar una llamada, y un seguimiento automático para quien no convierte a la primera.",
      },
      {
        pregunta: "¿Necesito publicidad para que funcione un funnel?",
        respuesta:
          "No necesariamente. Puede alimentarse con redes sociales, contenido o tu base de contactos. La publicidad acelera, pero solo tiene sentido cuando el funnel ya convierte.",
      },
      {
        pregunta: "¿Qué es la puntuación de leads?",
        respuesta:
          "Es un sistema que asigna puntos a cada contacto según lo que hace: abrir emails, visitar páginas o responder mensajes. Así tu equipo sabe a quién atender primero.",
      },
      {
        pregunta: "¿Puedo ver qué etapa del funnel falla?",
        respuesta:
          "Sí. Cada etapa tiene su métrica para que veas dónde se pierden las oportunidades y decidamos qué mejorar con datos.",
      },
    ],
  },

  automatizacion: {
    h1: "Automatización de procesos para recuperar horas cada semana",
    intro:
      "Copiar datos entre herramientas, enviar el mismo email una y otra vez o revisar a mano si algo se ha pagado consume horas. Esas tareas se pueden automatizar con flujos fiables y documentados.",
    resultado: [
      "Recuperas horas cada semana que hoy se van en tareas manuales.",
      "Se acaban los errores de copiar y pegar datos entre herramientas.",
      "Tus procesos siguen funcionando igual aunque crezca el volumen.",
    ],
    paraQuien: [
      "Pymes que trabajan con varias herramientas que no se hablan entre sí.",
      "Equipos que dedican horas a tareas repetitivas de administración o seguimiento.",
      "Negocios que ya automatizaron algo y necesitan que sea estable.",
    ],
    queIncluye: [
      "Mapa de procesos y selección de lo que conviene automatizar primero.",
      "Flujos en Make, n8n o Zapier según el caso y tu presupuesto de herramientas.",
      "Manejo de errores con avisos cuando algo falla.",
      "Control de duplicados para no crear contactos ni registros repetidos.",
      "Documentación de cada flujo para que tu equipo entienda qué hace.",
    ],
    faq: [
      {
        pregunta: "¿Qué herramienta es mejor: Make, n8n o Zapier?",
        respuesta:
          "Depende del caso. Make es muy visual y flexible, n8n permite alojarlo por tu cuenta y Zapier es sencillo para flujos cortos. Elijo según tus herramientas, volumen y presupuesto.",
      },
      {
        pregunta: "¿Qué pasa si un flujo falla?",
        respuesta:
          "Cada flujo incluye manejo de errores: se registra el fallo y se envía un aviso para corregirlo antes de que afecte a tus clientes.",
      },
      {
        pregunta: "¿Mi equipo podrá entender las automatizaciones?",
        respuesta:
          "Sí. Cada flujo se entrega documentado: qué lo activa, qué hace en cada paso y qué revisar si algo cambia.",
      },
      {
        pregunta: "¿Qué procesos se suelen automatizar primero?",
        respuesta:
          "Los que se repiten muchas veces y siguen siempre las mismas reglas: alta de contactos, seguimiento de leads, confirmaciones de cita, facturación y avisos internos.",
      },
    ],
  },

  "webs-ia": {
    h1: "Webs con IA rápidas, claras y pensadas para convertir",
    intro:
      "La mayoría de visitas llegan desde el móvil y deciden en segundos. Una web rápida, clara y con un solo objetivo por página convierte más que una web bonita que nadie entiende.",
    resultado: [
      "Una web rápida que carga y convierte también desde el móvil.",
      "Cada página con un objetivo claro, no un folleto bonito que nadie lee.",
      "La base técnica de SEO lista para que te puedan encontrar.",
    ],
    paraQuien: [
      "Negocios sin web o con una web lenta que no genera contactos.",
      "Profesionales que necesitan una presencia clara para vender sus servicios.",
      "Empresas que quieren sumar un asistente de IA a su web.",
    ],
    queIncluye: [
      "Diseño mobile-first y carga rápida.",
      "Accesibilidad: contraste, navegación por teclado y textos alternativos.",
      "Un objetivo y una llamada a la acción por página.",
      "SEO técnico básico: títulos, descripciones, datos estructurados y sitemap.",
      "Chatbot de IA opcional conectado a tu agenda y tu CRM.",
    ],
    faq: [
      {
        pregunta: "¿Qué significa que una web sea mobile-first?",
        respuesta:
          "Que se diseña primero para el móvil y después se adapta a pantallas grandes. Es donde llega la mayoría de visitas y donde más se nota una web lenta o confusa.",
      },
      {
        pregunta: "¿El chatbot es obligatorio?",
        respuesta:
          "No. Es opcional y solo lo recomiendo si recibes consultas repetidas que se pueden resolver sin intervención humana.",
      },
      {
        pregunta: "¿Puedo editar la web después?",
        respuesta:
          "Sí. Al terminar te explico cómo hacer los cambios habituales y te entrego la documentación necesaria.",
      },
      {
        pregunta: "¿La web incluye SEO?",
        respuesta:
          "Incluye la base técnica: estructura de encabezados, títulos y descripciones únicos, datos estructurados, sitemap y buena velocidad. El posicionamiento a largo plazo depende también del contenido.",
      },
    ],
  },

  "trafico-de-pago": {
    h1: "Tráfico de pago en Meta Ads y Google Ads, medido de verdad",
    intro:
      "Invertir en anuncios sin medir es pagar por adivinar. Primero dejamos la medición bien configurada y después escalamos solo las campañas que traen clientes rentables.",
    resultado: [
      "Sabes exactamente qué campaña te trae clientes y cuál no.",
      "Dejas de pagar por adivinar: la medición va primero.",
      "Escalas solo lo que demuestra ser rentable, sin quemar presupuesto.",
    ],
    paraQuien: [
      "Negocios con una oferta validada que quieren más volumen de clientes.",
      "Empresas que ya invierten en anuncios y no saben qué retorno obtienen.",
      "Funnels que ya convierten y necesitan tráfico constante.",
    ],
    queIncluye: [
      "Campañas en Meta Ads y Google Ads según dónde esté tu cliente.",
      "Configuración de medición: píxel, conversiones y eventos clave.",
      "Creatividades y textos alineados con tu oferta.",
      "Revisión periódica de resultados con métricas claras.",
      "Escalado solo de lo que demuestra ser rentable.",
    ],
    faq: [
      {
        pregunta: "¿Cuánto debo invertir en publicidad?",
        respuesta:
          "Depende de tu sector, tu oferta y tu margen. En la llamada revisamos tu caso y te propongo una inversión inicial de prueba que puedas asumir sin riesgo excesivo.",
      },
      {
        pregunta: "¿Meta Ads o Google Ads?",
        respuesta:
          "Google Ads capta a quien ya busca lo que ofreces. Meta Ads genera demanda entre personas que encajan con tu cliente ideal. Muchas veces se combinan.",
      },
      {
        pregunta: "¿Garantizas resultados con los anuncios?",
        respuesta:
          "No. Nadie puede garantizar resultados en publicidad. Lo que sí garantizo es una medición correcta y decisiones basadas en datos, no en intuiciones.",
      },
      {
        pregunta: "¿Necesito un funnel antes de hacer anuncios?",
        respuesta:
          "Es lo recomendable. Llevar tráfico a una página que no convierte o sin seguimiento suele desperdiciar presupuesto.",
      },
    ],
  },

  "consultoria-ia": {
    h1: "Consultoría de IA: qué automatizar primero en tu negocio",
    intro:
      "Hay cientos de herramientas de IA y es fácil perder tiempo y dinero probando sin rumbo. La consultoría ordena las prioridades: qué hacer primero, con qué herramienta y qué esperar.",
    resultado: [
      "Sales con un plan claro de qué hacer primero y con qué herramienta.",
      "Dejas de perder tiempo y dinero probando herramientas al azar.",
      "Tu equipo trabaja con un criterio común sobre IA, no cada uno a su manera.",
    ],
    paraQuien: [
      "Pymes que quieren adoptar IA pero no saben por dónde empezar.",
      "Emprendedores que prefieren decidir con un plan antes de contratar una implementación.",
      "Equipos que ya usan IA de forma desordenada y quieren un criterio común.",
    ],
    queIncluye: [
      "Diagnóstico de procesos, herramientas y cuellos de botella.",
      "Identificación de oportunidades de IA y automatización.",
      "Hoja de ruta priorizada por impacto y facilidad de implementación.",
      "Recomendación de herramientas adaptadas a tu caso.",
      "Documento final que tu equipo puede ejecutar por su cuenta o conmigo.",
    ],
    faq: [
      {
        pregunta: "¿Qué obtengo al final de la consultoría?",
        respuesta:
          "Una hoja de ruta por escrito con las oportunidades priorizadas, las herramientas recomendadas y el orden de implementación.",
      },
      {
        pregunta: "¿Tengo que contratar después la implementación contigo?",
        respuesta:
          "No. La hoja de ruta está pensada para que puedas ejecutarla con tu equipo, con otro proveedor o conmigo.",
      },
      {
        pregunta: "¿Necesito conocimientos técnicos?",
        respuesta:
          "No. Te explico cada recomendación en lenguaje claro y con ejemplos de tu propio negocio.",
      },
      {
        pregunta: "¿La consultoría sirve para negocios pequeños?",
        respuesta:
          "Sí. En negocios pequeños es aún más importante priorizar, porque el tiempo y el presupuesto son limitados.",
      },
    ],
  },
  // ---------------------------------------------------------------------
  // Servicios añadidos el 21/10/2026. Redactados a partir de lo que ya dice
  // la web (herramientas, método, estándares). Lo que solo sabe el titular va
  // marcado con [VERIFICAR] y se resolvió con el titular el 21/10/2026.

  "crm-seguimiento-leads": {
    h1: "CRM y seguimiento de leads para que ningún contacto se pierda",
    intro:
      "Los contactos llegan por la web, WhatsApp, Instagram o por teléfono, y acaban repartidos entre el correo, el móvil y una hoja de cálculo. Monto un CRM donde cada lead tiene su etapa, su historial y su siguiente paso, y los recordatorios salen solos.",
    resultado: [
      "Todos los contactos en un mismo sitio, con su historial completo.",
      "Sabes en qué etapa está cada oportunidad y qué toca hacer después.",
      "Los seguimientos se programan solos y ninguno depende de tu memoria.",
    ],
    paraQuien: [
      "Negocios que reciben contactos por varios canales y los gestionan a mano.",
      "Equipos comerciales pequeños que necesitan saber quién lleva cada cliente.",
      "Negocios que ya tienen un CRM pero no lo usan porque está desordenado.",
    ],
    queIncluye: [
      "CRM configurado con las etapas de tu proceso comercial, en GoHighLevel, ActiveCampaign o Airtable según tu caso.",
      "Entrada automática de los contactos desde la web, los formularios y los mensajes.",
      "Etiquetas y campos para segmentar por interés, origen o etapa.",
      "Tareas y recordatorios automáticos para cada seguimiento.",
      "Importación de tus contactos actuales, con limpieza de duplicados.",
      "Documentación y explicación del funcionamiento para tu equipo.",
    ],
    faq: [
      {
        pregunta: "¿Qué CRM me recomiendas?",
        respuesta:
          "El que encaje con tu forma de trabajar y con lo que ya usas. Trabajo sobre todo con GoHighLevel, ActiveCampaign y Airtable. Si ya tienes otro, primero reviso si se puede aprovechar antes de proponerte cambiar nada.",
      },
      {
        pregunta: "¿Puedo pasar al CRM los contactos que ya tengo?",
        respuesta:
          "Sí, siempre que se puedan exportar. Antes de importarlos se limpian los duplicados y se decide qué datos tiene sentido guardar.",
      },
      {
        pregunta: "¿Mi equipo sabrá usarlo?",
        respuesta:
          "El CRM se monta con las etapas y los nombres que ya usáis en el día a día, no al revés. Al terminar queda documentado y te explico cómo funciona en lenguaje claro.",
      },
      {
        pregunta: "¿Cómo quedan los datos y el RGPD?",
        respuesta:
          "Solo se guardan los datos necesarios y con una finalidad clara. Para el detalle legal de tu caso te recomiendo revisarlo con un profesional; yo me ocupo de la parte técnica.",
      },
    ],
  },

  "email-marketing": {
    h1: "Email marketing y secuencias automáticas que acompañan hasta la venta",
    intro:
      "La mayoría de los contactos no compra el primer día. Una secuencia de email bien planteada les escribe en el momento justo, con información útil, y se adapta a lo que hace cada persona: si abre, si hace clic o si ya ha comprado.",
    resultado: [
      "Cada contacto nuevo recibe la bienvenida al momento, sin que tengas que escribirle.",
      "Los contactos que se enfrían vuelven a saber de ti con algo útil.",
      "Ves qué correos funcionan y cuáles no, con aperturas, clics y respuestas.",
    ],
    paraQuien: [
      "Negocios que captan contactos pero no vuelven a escribirles.",
      "Emprendedores que venden servicios o formación y necesitan nutrir antes de vender.",
      "Negocios con una lista parada que quieren reactivarla, siempre con consentimiento.",
    ],
    queIncluye: [
      "Secuencia de bienvenida para cada contacto nuevo.",
      "Secuencias de seguimiento y de recuperación según lo que hace cada persona.",
      "Segmentación por interés, origen o etapa, conectada con tu CRM.",
      "Configuración en ActiveCampaign o en la herramienta que ya uses, si se puede integrar.",
      "Estructura de cada secuencia. Los textos de los correos los redacto yo o trabajo con los tuyos, según lo que acordemos en la propuesta.",
      "Medición de aperturas, clics y respuestas para ajustar lo que no rinde.",
    ],
    faq: [
      {
        pregunta: "¿Esto no acaba siendo spam?",
        respuesta:
          "No, si se hace bien. Solo se escribe a quien ha dado su consentimiento, cada correo aporta algo concreto y darse de baja está a un clic. El objetivo es que quieran seguir leyéndote.",
      },
      {
        pregunta: "¿Puedo escribir a los contactos que ya tengo?",
        respuesta:
          "Solo a los que dieron su consentimiento para recibir comunicaciones. Antes de empezar revisamos de dónde viene cada lista, y los contactos sin consentimiento se quedan fuera.",
      },
      {
        pregunta: "¿Cuántos correos tiene una secuencia?",
        respuesta:
          "Los que necesite su objetivo, no un número fijo. Se define en el diagnóstico y se ajusta después con los datos de aperturas, clics y respuestas.",
      },
      {
        pregunta: "¿Se puede combinar con WhatsApp?",
        respuesta:
          "Sí, siempre que el contacto lo haya autorizado. Se decide qué mensajes van por cada canal para no repetir lo mismo en los dos.",
      },
    ],
  },

  "paneles-de-metricas": {
    h1: "Paneles de métricas para ver tu negocio en una sola pantalla",
    intro:
      "Los números de tu negocio están repartidos entre el CRM, las campañas, los pagos y la web, y juntarlos a mano cada semana lleva horas. Conecto esas fuentes en un panel que se actualiza solo y enseña las pocas cifras que de verdad sirven para decidir.",
    resultado: [
      "Ves de un vistazo cuántas visitas, contactos, citas y clientes tienes en cada etapa.",
      "Dejas de copiar datos a mano en hojas de cálculo.",
      "Detectas en qué etapa se pierde la gente y mejoras esa primero.",
    ],
    paraQuien: [
      "Negocios que deciden a ojo porque no tienen los datos a mano.",
      "Equipos que pierden horas cada semana preparando informes.",
      "Negocios que invierten en campañas y quieren saber qué les trae clientes.",
    ],
    queIncluye: [
      "Diagnóstico de qué cifras importan en cada etapa de tu negocio.",
      "Conexión con las herramientas que ya usas: CRM, Meta Ads, Google Ads, pagos con Stripe o tu web, siempre que tengan integración o API.",
      "Un panel con pocas cifras, ordenadas por etapa, que se actualiza solo, en la herramienta que mejor encaje con lo que ya usas.",
      "Documentación de qué mide cada cifra y de dónde sale.",
    ],
    faq: [
      {
        pregunta: "¿Qué datos puedo ver en el panel?",
        respuesta:
          "Los de las herramientas que ya usas: contactos y etapas del CRM, resultados de las campañas, pagos o visitas de la web. Antes de empezar revisamos qué tiene integración o API para confirmar qué es posible.",
      },
      {
        pregunta: "¿Tengo que cambiar de herramientas?",
        respuesta:
          "No. El panel se alimenta de lo que ya usas. Solo te propondría cambiar algo si una herramienta no permite sacar sus datos.",
      },
      {
        pregunta: "¿Cada cuánto se actualizan los datos?",
        respuesta:
          "Depende de cada fuente: algunas se sincronizan casi al momento y otras una vez al día. Te lo dejo por escrito antes de empezar, para que sepas qué esperar.",
      },
      {
        pregunta: "¿Qué métricas debería mirar?",
        respuesta:
          "Pocas y por etapa: de las visitas a los contactos, de los contactos a las citas y de las citas a los clientes. Las concretas de tu negocio las definimos en el diagnóstico.",
      },
    ],
  },

};

/** Title y meta description por servicio, 50-60 y 150-160 caracteres. */
export const metas: Record<string, { title: string; description: string }> = {
  "agentes-ia": {
    title: "Agentes de IA de voz y chat para negocios | Luis Flores",
    description:
      "Agentes de IA de voz y chat que atienden a tus clientes 24/7, gestionan citas y se integran con tu CRM y tu agenda. Sin inventar precios ni disponibilidad.",
  },
  // [VERIFICAR en Search Console / Keyword Planner] antes de cambiar este title
  // por "Embudos de venta y funnels de conversión | Luis Flores". En España
  // "embudo de ventas" suele pesar más que "funnel", pero no hay volumen
  // comprobado, así que se mantiene el de producción.
  "funnels-conversion": {
    title: "Funnels de conversión para captar clientes | Luis Flores",
    description:
      "Funnels de conversión con landing, captación, secuencias de email y WhatsApp y puntuación de leads. Cada etapa se mide para saber qué funciona y qué no.",
  },
  automatizacion: {
    title: "Automatización de procesos con Make y n8n | Luis Flores",
    description:
      "Automatización de procesos con Make, n8n y Zapier: flujos que conectan tus herramientas, controlan errores y duplicados y quedan documentados paso a paso.",
  },
  "webs-ia": {
    title: "Webs con IA rápidas y orientadas a conversión | Luis Flores",
    description:
      "Webs con IA mobile-first, rápidas y accesibles, con un objetivo y una llamada a la acción por página. Chatbot opcional conectado a tu agenda y a tu CRM.",
  },
  "trafico-de-pago": {
    title: "Tráfico de pago con Meta Ads y Google Ads | Luis Flores",
    description:
      "Campañas de tráfico de pago en Meta Ads y Google Ads con medición correcta desde el primer día. Escalo solo lo que demuestra ser rentable para tu negocio.",
  },
  "consultoria-ia": {
    title: "Consultoría de IA para pymes y emprendedores | Luis Flores",
    description:
      "Consultoría de IA para pymes y emprendedores: diagnóstico de tu negocio y hoja de ruta priorizada para adoptar la inteligencia artificial donde más rinde.",
  },
  "crm-seguimiento-leads": {
    title: "CRM y seguimiento de leads para negocios | Luis Flores",
    description:
      "Monto tu CRM con GoHighLevel, ActiveCampaign o Airtable: cada contacto en su etapa, con su historial y recordatorios automáticos para que ningún lead se pierda.",
  },
  "email-marketing": {
    title: "Email marketing y secuencias automáticas | Luis Flores",
    description:
      "Secuencias de email de bienvenida, seguimiento y recuperación que se envían solas, solo a contactos con consentimiento y medidas por clics y respuestas.",
  },
  "paneles-de-metricas": {
    title: "Paneles de métricas e informes para negocios | Luis Flores",
    description:
      "Paneles que reúnen en una pantalla los datos de tu CRM, tus campañas y tus pagos, se actualizan solos y enseñan las cifras de cada etapa de tu negocio.",
  },
};
