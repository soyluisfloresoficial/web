/**
 * Contenido de cada página de servicio. Parte del HTML de producción
 * (18/10/2026) y se pasó a español latino neutro el 21/10/2026, a pedido del
 * titular, sin añadir datos nuevos.
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
    h1: "Agentes de IA que atienden y agendan a tus clientes 24/7",
    intro:
      "A tu negocio le escriben y le llaman fuera de horario, en medio de una reunión o cuando todo el equipo está ocupado. Un agente de IA contesta en el momento, resuelve las preguntas de siempre y deja la cita agendada en tu calendario.",
    resultado: [
      "Tus clientes reciben respuesta al instante, también fuera de horario.",
      "Menos espacios vacíos en la agenda, porque las citas se agendan y se confirman solas.",
      "Tu equipo deja de contestar lo mismo todo el día y se dedica a lo que sí necesita una persona.",
    ],
    paraQuien: [
      "Negocios que trabajan con citas, como clínicas, centros de estética, consultorios, academias o servicios a domicilio.",
      "Empresas que reciben muchas preguntas repetidas por WhatsApp, Instagram, la web o el teléfono.",
      "Equipos pequeños que pierden clientes porque no alcanzan a responder a tiempo.",
    ],
    queIncluye: [
      "Agente de chat para tu web, WhatsApp e Instagram y, si tiene sentido, un agente de voz para las llamadas.",
      "Atención las 24 horas, con respuestas basadas solo en la información que tú apruebas.",
      "Conexión con tu CRM y tu calendario para registrar contactos y agendar citas.",
      "Paso a una persona cuando la consulta lo necesita o cuando el cliente lo pide.",
      "Reglas para que el agente nunca invente precios, horarios ni disponibilidad.",
      "Documentación de cómo funciona y de cuándo pasa la conversación a tu equipo.",
    ],
    faq: [
      {
        pregunta: "¿El agente de IA puede inventar información?",
        respuesta:
          "Lo configuro para que responda solo con la información que tú apruebas. Si no sabe algo, lo dice y pasa la conversación a una persona. Los precios, horarios y disponibilidad salen de tus datos, nunca de suposiciones.",
      },
      {
        pregunta: "¿Qué pasa si el cliente quiere hablar con una persona?",
        respuesta:
          "El agente lo detecta y pasa la conversación a tu equipo por el canal que elijamos, con todo lo que se habló, para que el cliente no tenga que repetir nada.",
      },
      {
        pregunta: "¿Se conecta con mi calendario y mi CRM?",
        respuesta:
          "Sí, siempre que esas herramientas tengan integración o API. Antes de empezar revisamos lo que usas para confirmar qué se puede hacer y cómo.",
      },
      {
        pregunta: "¿Funciona por chat y por teléfono?",
        respuesta:
          "Sí. Normalmente empezamos por el chat, porque se prueba más rápido. El agente de voz lo sumamos cuando tu negocio recibe muchas llamadas.",
      },
    ],
  },

  "funnels-conversion": {
    h1: "Funnels de conversión que convierten visitas en clientes",
    intro:
      "Atraer visitas no sirve de mucho si después nadie les da seguimiento. Un embudo de ventas bien armado capta el contacto, le manda mensajes útiles y te muestra en qué paso se te escapan los clientes.",
    resultado: [
      "Dejas de perder contactos por no darles seguimiento a tiempo.",
      "Sabes en qué paso se enfría cada cliente potencial y por qué.",
      "Tu proceso de ventas sigue funcionando aunque tú no estés pendiente.",
    ],
    paraQuien: [
      "Negocios que consiguen contactos pero no tienen un seguimiento ordenado.",
      "Emprendedores que venden servicios o cursos y necesitan un proceso de venta claro.",
      "Empresas que invierten en publicidad y no saben en qué etapa se les cae la venta.",
    ],
    queIncluye: [
      "Página de captación (landing page) con un solo objetivo y un botón claro.",
      "Formularios conectados a tu CRM.",
      "Secuencias de seguimiento por correo y WhatsApp.",
      "Puntuación de contactos para saber a quién llamar primero.",
      "Métricas por etapa: visitas, registros, citas y ventas.",
      "Documentación del embudo y de sus automatizaciones.",
    ],
    faq: [
      {
        pregunta: "¿Qué diferencia hay entre una página web y un funnel?",
        respuesta:
          "La web presenta tu negocio. El funnel tiene un solo objetivo, por ejemplo agendar una llamada, y un seguimiento automático para quien no se decide la primera vez.",
      },
      {
        pregunta: "¿Necesito hacer publicidad para que funcione?",
        respuesta:
          "No necesariamente. Lo puedes alimentar con redes sociales, contenido o tu lista de contactos. La publicidad acelera las cosas, pero conviene invertir cuando el embudo ya vende.",
      },
      {
        pregunta: "¿Qué es la puntuación de contactos?",
        respuesta:
          "Es un sistema que le suma puntos a cada contacto según lo que hace, como abrir correos, visitar páginas o contestar mensajes. Así tu equipo sabe a quién atender primero.",
      },
      {
        pregunta: "¿Puedo ver en qué etapa se cae la venta?",
        respuesta:
          "Sí. Cada etapa tiene su métrica, así ves dónde se pierden los clientes y decidimos con datos qué mejorar.",
      },
    ],
  },

  automatizacion: {
    h1: "Automatización de procesos para recuperar horas cada semana",
    intro:
      "Copiar datos de una herramienta a otra, mandar el mismo correo una y otra vez o revisar a mano si alguien ya pagó se come horas de tu semana. Todo eso se puede automatizar con flujos confiables y documentados.",
    resultado: [
      "Recuperas horas cada semana que hoy se van en trabajo manual.",
      "Se acaban los errores de copiar y pegar datos entre herramientas.",
      "Tus procesos siguen funcionando igual aunque crezca el volumen de trabajo.",
    ],
    paraQuien: [
      "Pymes que usan varias herramientas que no se comunican entre sí.",
      "Equipos que dedican horas a tareas repetitivas de administración o seguimiento.",
      "Negocios que ya automatizaron algo y necesitan que funcione sin fallas.",
    ],
    queIncluye: [
      "Mapa de tus procesos y selección de lo que conviene automatizar primero.",
      "Flujos en Make, n8n o Zapier, según tu caso y lo que quieras gastar en herramientas.",
      "Avisos automáticos cuando algo falla.",
      "Control de duplicados para no crear contactos ni registros repetidos.",
      "Documentación de cada flujo para que tu equipo entienda qué hace.",
    ],
    faq: [
      {
        pregunta: "¿Qué herramienta es mejor, Make, n8n o Zapier?",
        respuesta:
          "Depende del caso. Make es muy visual y flexible, n8n lo puedes instalar en tu propio servidor y Zapier es sencillo para flujos cortos. Elijo según tus herramientas, el volumen de trabajo y tu presupuesto.",
      },
      {
        pregunta: "¿Qué pasa si una automatización falla?",
        respuesta:
          "Cada flujo guarda un registro de errores y manda un aviso, para corregir el problema antes de que llegue a tus clientes.",
      },
      {
        pregunta: "¿Mi equipo va a entender las automatizaciones?",
        respuesta:
          "Sí. Cada flujo se entrega documentado: qué lo activa, qué hace en cada paso y qué revisar si algo cambia.",
      },
      {
        pregunta: "¿Qué procesos se suelen automatizar primero?",
        respuesta:
          "Los que se repiten muchas veces y siguen siempre las mismas reglas. Por ejemplo, el registro de contactos nuevos, el seguimiento, la confirmación de citas, la facturación y los avisos internos.",
      },
    ],
  },

  "webs-ia": {
    h1: "Páginas web con IA rápidas, claras y hechas para vender",
    intro:
      "La mayoría de las visitas entra desde el celular y decide en pocos segundos si se queda. Una página rápida, clara y con un solo objetivo por página vende más que una web muy bonita que nadie entiende.",
    resultado: [
      "Una web que carga rápido y vende también desde el celular.",
      "Cada página con un objetivo claro, en lugar de un folleto que nadie lee.",
      "La base técnica de SEO lista para que te encuentren en Google.",
    ],
    paraQuien: [
      "Negocios sin página web o con una web lenta que no trae contactos.",
      "Profesionales que necesitan una presencia clara para vender sus servicios.",
      "Empresas que quieren sumar un asistente de IA a su sitio.",
    ],
    queIncluye: [
      "Diseño pensado primero para celular y carga rápida.",
      "Accesibilidad: buen contraste, navegación con teclado y textos alternativos en las imágenes.",
      "Un objetivo y un botón principal en cada página.",
      "SEO técnico básico: títulos, descripciones, datos estructurados y mapa del sitio.",
      "Chatbot de IA opcional, conectado a tu calendario y tu CRM.",
    ],
    faq: [
      {
        pregunta: "¿Qué quiere decir que una web esté pensada primero para celular?",
        respuesta:
          "Que se diseña primero para la pantalla del teléfono y después se adapta a pantallas grandes. Desde ahí entra la mayoría de las visitas y ahí es donde más se nota una web lenta o confusa.",
      },
      {
        pregunta: "¿El chatbot es obligatorio?",
        respuesta:
          "No. Es opcional, y solo lo recomiendo si recibes preguntas repetidas que se pueden contestar sin una persona.",
      },
      {
        pregunta: "¿Puedo hacerle cambios a la web después?",
        respuesta:
          "Sí. Al terminar te enseño a hacer los cambios más comunes y te dejo la documentación necesaria.",
      },
      {
        pregunta: "¿La web incluye SEO?",
        respuesta:
          "Incluye la base técnica: encabezados bien ordenados, títulos y descripciones únicos, datos estructurados, mapa del sitio y buena velocidad. Para posicionarte a largo plazo también hace falta contenido.",
      },
    ],
  },

  "trafico-de-pago": {
    h1: "Publicidad en Meta Ads y Google Ads, medida desde el primer día",
    intro:
      "Pagar anuncios sin medir es apostar a ciegas. Primero dejamos la medición bien configurada y después invertimos más solo en las campañas que traen clientes rentables.",
    resultado: [
      "Sabes qué campaña te trae clientes y cuál no.",
      "Dejas de pagar a ciegas, porque la medición va primero.",
      "Subes la inversión solo en lo que demuestra ser rentable, sin quemar presupuesto.",
    ],
    paraQuien: [
      "Negocios con una oferta que ya se vende y que quieren más clientes.",
      "Empresas que ya pagan anuncios y no saben cuánto les devuelven.",
      "Embudos de venta que ya funcionan y necesitan visitas constantes.",
    ],
    queIncluye: [
      "Campañas en Meta Ads y Google Ads, según dónde esté tu cliente.",
      "Configuración de la medición: píxel, conversiones y eventos clave.",
      "Anuncios y textos alineados con tu oferta.",
      "Revisión periódica de resultados con métricas claras.",
      "Más inversión solo en lo que demuestra ser rentable.",
    ],
    faq: [
      {
        pregunta: "¿Cuánto debería invertir en publicidad?",
        respuesta:
          "Depende de tu sector, tu oferta y tu margen. En la llamada revisamos tu caso y te propongo una inversión inicial de prueba que puedas asumir sin arriesgar de más.",
      },
      {
        pregunta: "¿Me conviene Meta Ads o Google Ads?",
        respuesta:
          "Google Ads llega a quien ya está buscando lo que vendes. Meta Ads despierta el interés de personas que se parecen a tu cliente ideal. Muchas veces conviene combinar los dos.",
      },
      {
        pregunta: "¿Garantizas resultados con los anuncios?",
        respuesta:
          "No. Nadie puede garantizar resultados en publicidad. Lo que sí te aseguro es una medición bien hecha y decisiones basadas en datos.",
      },
      {
        pregunta: "¿Necesito un embudo de ventas antes de hacer anuncios?",
        respuesta:
          "Es lo más recomendable. Mandar visitas a una página que no vende, o sin ningún seguimiento, suele ser dinero perdido.",
      },
    ],
  },

  "consultoria-ia": {
    h1: "Consultoría de IA: qué automatizar primero en tu negocio",
    intro:
      "Hay cientos de herramientas de IA y es fácil perder tiempo y dinero probando sin rumbo. En la consultoría ordenamos las prioridades: qué hacer primero, con qué herramienta y qué resultado esperar.",
    resultado: [
      "Terminas con un plan claro de qué hacer primero y con qué herramienta.",
      "Dejas de gastar tiempo y dinero probando herramientas al azar.",
      "Tu equipo usa la IA con un mismo criterio, en lugar de que cada uno haga lo suyo.",
    ],
    paraQuien: [
      "Pymes que quieren empezar a usar IA pero no saben por dónde.",
      "Emprendedores que prefieren tener un plan antes de contratar una implementación.",
      "Equipos que ya usan IA sin orden y quieren un criterio común.",
    ],
    queIncluye: [
      "Diagnóstico de procesos, herramientas y cuellos de botella.",
      "Oportunidades concretas de IA y automatización para tu negocio.",
      "Un plan ordenado según el impacto y lo fácil que es implementar cada cosa.",
      "Recomendación de herramientas para tu caso.",
      "Un documento final que tu equipo puede llevar a cabo por su cuenta o conmigo.",
    ],
    faq: [
      {
        pregunta: "¿Qué me llevo al final de la consultoría?",
        respuesta:
          "Un plan por escrito con las oportunidades ordenadas por prioridad, las herramientas recomendadas y el orden para implementarlas.",
      },
      {
        pregunta: "¿Después tengo que contratar la implementación contigo?",
        respuesta:
          "No. El plan está pensado para que lo lleves a cabo con tu equipo, con otro proveedor o conmigo, como prefieras.",
      },
      {
        pregunta: "¿Necesito conocimientos técnicos?",
        respuesta:
          "No. Te explico cada recomendación en palabras simples y con ejemplos de tu propio negocio.",
      },
      {
        pregunta: "¿La consultoría sirve para negocios pequeños?",
        respuesta:
          "Sí. En un negocio pequeño es todavía más importante elegir bien por dónde empezar, porque el tiempo y el presupuesto son limitados.",
      },
    ],
  },
  // ---------------------------------------------------------------------
  // Servicios añadidos el 21/10/2026. Redactados a partir de lo que ya dice
  // la web (herramientas, método, estándares). Los datos que solo sabe el
  // titular se resolvieron con él el 21/10/2026.

  "crm-seguimiento-leads": {
    h1: "Un CRM para que no se te pierda ningún contacto",
    intro:
      "Los contactos te llegan por la web, WhatsApp, Instagram o por teléfono, y terminan repartidos entre el correo, el celular y una hoja de cálculo. Configuro un CRM donde cada contacto tiene su etapa, su historial y su siguiente paso, y los recordatorios salen solos.",
    resultado: [
      "Todos tus contactos en un solo lugar, con su historial completo.",
      "Sabes en qué etapa está cada oportunidad y qué sigue después.",
      "Los seguimientos se programan solos y ya no dependen de tu memoria.",
    ],
    paraQuien: [
      "Negocios que reciben contactos por varios canales y los manejan a mano.",
      "Equipos de ventas pequeños que necesitan saber quién atiende a cada cliente.",
      "Negocios que ya tienen un CRM pero no lo usan porque está desordenado.",
    ],
    queIncluye: [
      "CRM configurado con las etapas de tu proceso de ventas, en GoHighLevel, ActiveCampaign o Airtable según tu caso.",
      "Entrada automática de los contactos desde la web, los formularios y los mensajes.",
      "Etiquetas y campos para separar a los contactos por interés, origen o etapa.",
      "Tareas y recordatorios automáticos para cada seguimiento.",
      "Importación de tus contactos actuales, sin duplicados.",
      "Documentación y una explicación del funcionamiento para tu equipo.",
    ],
    faq: [
      {
        pregunta: "¿Qué CRM me recomiendas?",
        respuesta:
          "El que se adapte a tu forma de trabajar y a lo que ya usas. Trabajo sobre todo con GoHighLevel, ActiveCampaign y Airtable. Si ya tienes otro, primero reviso si se puede aprovechar antes de sugerirte un cambio.",
      },
      {
        pregunta: "¿Puedo pasar al CRM los contactos que ya tengo?",
        respuesta:
          "Sí, siempre que se puedan exportar. Antes de importarlos quitamos los duplicados y decidimos qué datos vale la pena guardar.",
      },
      {
        pregunta: "¿Mi equipo va a saber usarlo?",
        respuesta:
          "El CRM se arma con las etapas y los nombres que ustedes ya usan en el día a día, no al revés. Al terminar queda documentado y te explico cómo funciona en palabras simples.",
      },
      {
        pregunta: "¿Qué pasa con los datos de mis clientes?",
        respuesta:
          "Solo se guardan los datos necesarios y para un fin claro. Cada país tiene su ley de protección de datos (en Europa, el RGPD), así que para la parte legal te recomiendo consultar con un profesional. Yo me encargo de la parte técnica.",
      },
    ],
  },

  "email-marketing": {
    h1: "Email marketing y secuencias automáticas que acompañan hasta la venta",
    intro:
      "Casi nadie compra el primer día. Una buena secuencia de correos le escribe a cada persona en el momento justo, con información útil, y se adapta a lo que hace: si abre el correo, si hace clic o si ya compró.",
    resultado: [
      "Cada contacto nuevo recibe la bienvenida al instante, sin que tengas que escribirle tú.",
      "Los contactos que se enfriaron vuelven a saber de ti con algo que les sirve.",
      "Ves qué correos funcionan y cuáles no, con aperturas, clics y respuestas.",
    ],
    paraQuien: [
      "Negocios que consiguen contactos pero nunca les vuelven a escribir.",
      "Emprendedores que venden servicios o cursos y necesitan generar confianza antes de vender.",
      "Negocios con una lista de contactos olvidada que quieren reactivar, siempre con permiso.",
    ],
    queIncluye: [
      "Secuencia de bienvenida para cada contacto nuevo.",
      "Secuencias de seguimiento y de reactivación según lo que hace cada persona.",
      "Segmentación por interés, origen o etapa, conectada con tu CRM.",
      "Configuración en ActiveCampaign o en la herramienta que ya uses, si se puede conectar.",
      "La estructura de cada secuencia. Los textos de los correos los escribo yo o trabajo con los tuyos, según lo que acordemos en la propuesta.",
      "Medición de aperturas, clics y respuestas para corregir lo que no funciona.",
    ],
    faq: [
      {
        pregunta: "¿Esto no termina siendo spam?",
        respuesta:
          "No, si se hace bien. Solo se le escribe a quien dio su permiso, cada correo trae algo concreto y darse de baja está a un clic. La idea es que quieran seguir leyéndote.",
      },
      {
        pregunta: "¿Puedo escribirles a los contactos que ya tengo?",
        respuesta:
          "Solo a los que aceptaron recibir tus correos. Antes de empezar revisamos de dónde viene cada lista, y los contactos sin permiso quedan fuera.",
      },
      {
        pregunta: "¿Cuántos correos tiene una secuencia?",
        respuesta:
          "Los que necesite según su objetivo, no hay un número fijo. Lo definimos en el diagnóstico y después lo ajustamos con los datos de aperturas, clics y respuestas.",
      },
      {
        pregunta: "¿Se puede combinar con WhatsApp?",
        respuesta:
          "Sí, siempre que el contacto lo haya autorizado. Decidimos qué mensajes van por cada canal para no repetir lo mismo en los dos.",
      },
    ],
  },

  "paneles-de-metricas": {
    h1: "Paneles de métricas para ver tu negocio en una sola pantalla",
    intro:
      "Los números de tu negocio están repartidos entre el CRM, las campañas, los pagos y la web, y juntarlos a mano cada semana te toma horas. Conecto esas fuentes en un panel que se actualiza solo y muestra las pocas cifras que te sirven para decidir.",
    resultado: [
      "Ves de un vistazo cuántas visitas, contactos, citas y clientes tienes en cada etapa.",
      "Dejas de copiar datos a mano en hojas de cálculo.",
      "Detectas en qué etapa se te va la gente y mejoras esa primero.",
    ],
    paraQuien: [
      "Negocios que deciden por intuición porque no tienen los datos a la mano.",
      "Equipos que pierden horas cada semana armando reportes.",
      "Negocios que invierten en campañas y quieren saber cuáles les traen clientes.",
    ],
    queIncluye: [
      "Diagnóstico de qué números importan en cada etapa de tu negocio.",
      "Conexión con las herramientas que ya usas, como tu CRM, Meta Ads, Google Ads, los pagos de Stripe o tu web, siempre que tengan integración o API.",
      "Un panel con pocas cifras, ordenadas por etapa, que se actualiza solo, en la herramienta que mejor encaje con lo que ya usas.",
      "Documentación de qué mide cada cifra y de dónde sale.",
    ],
    faq: [
      {
        pregunta: "¿Qué datos puedo ver en el panel?",
        respuesta:
          "Los de las herramientas que ya usas: contactos y etapas del CRM, resultados de las campañas, pagos o visitas de la web. Antes de empezar revisamos cuáles tienen integración o API para confirmar qué se puede hacer.",
      },
      {
        pregunta: "¿Tengo que cambiar de herramientas?",
        respuesta:
          "No. El panel toma los datos de lo que ya usas. Solo te sugeriría un cambio si alguna herramienta no deja sacar sus datos.",
      },
      {
        pregunta: "¿Cada cuánto se actualizan los datos?",
        respuesta:
          "Depende de cada fuente. Algunas se actualizan casi al instante y otras una vez al día. Te lo dejo por escrito antes de empezar, para que sepas qué esperar.",
      },
      {
        pregunta: "¿Qué métricas debería revisar?",
        respuesta:
          "Pocas y por etapa: de visitas a contactos, de contactos a citas y de citas a clientes. Las de tu negocio en particular las definimos en el diagnóstico.",
      },
    ],
  },
};

/** Title y meta description por servicio, 50-60 y 150-160 caracteres. */
export const metas: Record<string, { title: string; description: string }> = {
  "agentes-ia": {
    title: "Agentes de IA para WhatsApp, chat y voz | Luis Flores",
    description:
      "Agentes de IA que atienden a tus clientes por WhatsApp, chat o teléfono las 24 horas, agendan citas y se conectan con tu CRM. No inventan precios ni horarios.",
  },
  // [VERIFICAR en Search Console / Keyword Planner] qué pesa más en cada país:
  // «funnel de ventas», «embudo de ventas» o «funnel de conversión». El title
  // usa las dos formas mientras no haya datos.
  "funnels-conversion": {
    title: "Funnels de conversión y embudos de venta | Luis Flores",
    description:
      "Embudos de venta con página de captación, seguimiento por correo y WhatsApp y puntuación de contactos. Cada etapa se mide para saber qué vende y qué no.",
  },
  automatizacion: {
    title: "Automatización de procesos con Make y n8n | Luis Flores",
    description:
      "Automatización de procesos con Make, n8n y Zapier. Flujos que conectan tus herramientas, avisan si algo falla, evitan duplicados y quedan documentados.",
  },
  "webs-ia": {
    title: "Páginas web con IA hechas para vender | Luis Flores",
    description:
      "Páginas web con IA pensadas primero para celular, rápidas y fáciles de usar, con un objetivo claro por página y un chatbot opcional conectado a tu calendario.",
  },
  "trafico-de-pago": {
    title: "Publicidad en Meta Ads y Google Ads | Luis Flores",
    description:
      "Campañas en Meta Ads y Google Ads con la medición bien configurada desde el primer día. Solo se invierte más en lo que demuestra ser rentable para tu negocio.",
  },
  "consultoria-ia": {
    title: "Consultoría de IA para pymes y emprendedores | Luis Flores",
    description:
      "Consultoría de IA para pymes y emprendedores: diagnóstico de tu negocio y un plan ordenado para empezar a usar inteligencia artificial donde más te conviene.",
  },
  "crm-seguimiento-leads": {
    title: "CRM y seguimiento de clientes potenciales | Luis Flores",
    description:
      "Configuro tu CRM en GoHighLevel, ActiveCampaign o Airtable: cada contacto en su etapa, con su historial y recordatorios automáticos para no perder ninguno.",
  },
  "email-marketing": {
    title: "Email marketing y secuencias automáticas | Luis Flores",
    description:
      "Secuencias de correo de bienvenida, seguimiento y reactivación que se envían solas, solo a contactos que dieron su permiso, y medidas por clics y respuestas.",
  },
  "paneles-de-metricas": {
    title: "Paneles de métricas y reportes para negocios | Luis Flores",
    description:
      "Paneles que juntan en una pantalla los datos de tu CRM, tus campañas y tus pagos. Se actualizan solos y muestran los números de cada etapa de tu negocio.",
  },
};
