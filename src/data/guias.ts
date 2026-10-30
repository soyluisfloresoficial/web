/**
 * Guías gratis para captar contactos (30/10/2026). Ver EMAIL-MARKETING.md.
 *
 * Una por servicio (la de automatización es la general, «qué automatizar
 * primero»). Cada una se pide con su formulario (CapturaGuia.astro), llega
 * por correo y se lee en /guia/<slug>. El último correo de la serie invita a
 * la llamada desde el funnel de su servicio.
 *
 * Los contenidos salen de lo que ya dice la web: las fichas de cada servicio
 * (servicios-detalle.ts) y los artículos del blog. Sin cifras ni casos.
 *
 * Sin dependencias: lo usan también el servidor (correos) y las pruebas.
 */

export interface PuntoGuia {
  titulo: string;
  texto: string;
  /** Pregunta para que la persona lo aplique a su caso. */
  pregunta: string;
}

export interface Guia {
  slug: string;
  /** Servicio relacionado: su funnel es el destino del último correo. */
  servicio: string;
  /** Titular: la primera parte en blanco y «destacado» en degradado. */
  titulo: string;
  destacado: string;
  /** Una frase: para los correos, el formulario y la descripción. */
  resumen: string;
  entrada: string;
  /** Lo que trae, para el formulario. */
  incluye: [string, string, string, string];
  criterio: { titulo: string; puntos: [PuntoGuia, PuntoGuia, PuntoGuia] };
  hoja: { titulo: string; texto: string; columnas: string[]; filas: number };
  ideas: { titulo: string; grupos: { nombre: string; icono: string; items: string[] }[] };
  plan: { titulo: string; pasos: string[]; cierre?: string };
  alto: { titulo: string; items: string[] };
  /** Artículo del blog relacionado. */
  articulo?: { texto: string; href: string };
}

const lista: Guia[] = [
  {
    slug: "que-automatizar-primero",
    servicio: "automatizacion",
    titulo: "Qué automatizar primero",
    destacado: "en tu negocio",
    resumen: "Un criterio sencillo para elegir tu primera automatización, con una hoja para aplicarlo a tu caso.",
    entrada:
      "Elegir bien la primera automatización es lo que hace que funcione y que tu equipo le tenga confianza. Esta guía te da un criterio sencillo y una hoja para aplicarlo a tu caso en una semana.",
    incluye: [
      "El criterio de las tres condiciones para elegir bien",
      "Una hoja para anotar las tareas de una semana",
      "Ideas de primeras automatizaciones por área",
      "Un plan de cinco pasos para empezar sin complicarte",
    ],
    criterio: {
      titulo: "Una buena primera tarea cumple tres condiciones",
      puntos: [
        {
          titulo: "Se repite seguido",
          texto: "Si pasa una vez al mes, casi nunca compensa armarla y mantenerla. Si pasa varias veces al día, cada minuto que ahorras se multiplica.",
          pregunta: "¿Cuántas veces por semana la haces y cuántos minutos te toma cada vez?",
        },
        {
          titulo: "Sigue reglas claras",
          texto: "Siempre entra lo mismo y siempre sale lo mismo: confirmar una cita, registrar un contacto, mandar un recordatorio. Lo que necesita criterio humano se queda en tu equipo.",
          pregunta: "¿Se resuelve siempre igual o depende de cada caso?",
        },
        {
          titulo: "Afecta a tus clientes",
          texto: "Contestar tarde a un cliente potencial tiene un costo directo. Por eso la atención y el seguimiento suelen ser el mejor primer paso.",
          pregunta: "Si esta tarea se retrasa, ¿lo nota un cliente?",
        },
      ],
    },
    hoja: {
      titulo: "Anota tus tareas repetidas",
      texto: "No hace falta precisión: alcanza con una idea aproximada. Al final de la semana, la que tenga más marcas y más minutos suele ser tu primera candidata.",
      columnas: ["Tarea", "Veces por semana", "Minutos cada vez", "¿Reglas claras?", "¿Afecta al cliente?"],
      filas: 6,
    },
    ideas: {
      titulo: "Primeras automatizaciones que suelen cumplir las tres",
      grupos: [
        { nombre: "Atención", icono: "chat", items: ["Responder preguntas frecuentes con la información que tú apruebas", "Confirmar y recordar citas", "Avisar a una persona cuando la consulta lo necesita"] },
        { nombre: "Ventas", icono: "embudo", items: ["Registrar cada contacto nuevo en el CRM, con su origen", "Hacer seguimiento de presupuestos que no tuvieron respuesta", "Mandar la información que pidió un cliente potencial"] },
        { nombre: "Administración", icono: "flujo", items: ["Pasar los datos de un formulario a tus herramientas", "Avisar de pagos recibidos o pendientes", "Ordenar documentos que llegan por correo"] },
        { nombre: "Equipo", icono: "usuarios", items: ["Avisar al responsable cuando entra un contacto importante", "Repartir tareas nuevas según reglas fijas", "Un resumen semanal con las cifras que importan"] },
      ],
    },
    plan: {
      titulo: "Cinco pasos, de una en una",
      pasos: [
        "Anota las tareas repetitivas de una semana normal en la hoja.",
        "Marca las que cumplen las tres condiciones.",
        "Elige una sola y mide cuánto tiempo te toma hoy.",
        "Automatízala y vuelve a medir a las dos o tres semanas.",
        "Recién ahí pasa a la siguiente.",
      ],
      cierre: "Ir de una en una parece lento, pero es lo que hace que funcione de verdad. En mi propio negocio lo hice exactamente así.",
    },
    alto: {
      titulo: "Todavía no conviene automatizarla si…",
      items: [
        "Pasa una vez al mes o menos.",
        "Cada vez se resuelve distinto y necesita criterio humano: negociar, evaluar un caso complicado o dar una mala noticia.",
        "Todavía no tienes claro cómo debería hacerse a mano. Primero ordena el proceso; después se automatiza.",
      ],
    },
    articulo: { texto: "Leer el artículo completo", href: "/blog/que-automatizar-primero" },
  },

  {
    slug: "preparar-un-agente-de-ia",
    servicio: "agentes-ia",
    titulo: "Prepara tu negocio",
    destacado: "para un agente de IA",
    resumen: "Qué preparar antes de poner un agente de IA a atender a tus clientes, para que responda bien y no invente.",
    entrada:
      "Un agente de IA atiende bien cuando sabe qué responder, qué no y cuándo pasar la conversación a una persona. Esta guía te ayuda a preparar eso antes de configurarlo.",
    incluye: [
      "Las tres señales de que te conviene",
      "Una hoja para juntar las preguntas que te hacen",
      "Lo que el agente debe saber y lo que nunca debe hacer",
      "Un plan de cinco pasos para probarlo sin riesgos",
    ],
    criterio: {
      titulo: "Un agente de IA te conviene si…",
      puntos: [
        {
          titulo: "Te preguntan lo mismo muchas veces",
          texto: "Precios, horarios, ubicación, disponibilidad. Si las respuestas se repiten, un agente las puede dar al momento con la información que tú apruebas.",
          pregunta: "¿Cuáles son las cinco preguntas que más te hacen?",
        },
        {
          titulo: "Te escriben fuera de horario",
          texto: "Si llegan mensajes de noche o el fin de semana y contestas horas después, un agente responde en el momento y deja la cita agendada.",
          pregunta: "¿A qué horas te llegan los mensajes que tardas en contestar?",
        },
        {
          titulo: "Trabajas con citas",
          texto: "Cuando el objetivo de la conversación es una cita, el agente la puede proponer y dejarla en tu calendario.",
          pregunta: "¿Cómo agendas hoy y cuántos mensajes hacen falta para cerrar una cita?",
        },
      ],
    },
    hoja: {
      titulo: "Junta las preguntas que te hacen",
      texto: "Durante una semana anota cada pregunta que te llega por WhatsApp, Instagram, la web o el teléfono, con su respuesta correcta. Esa lista es la base de lo que sabrá el agente.",
      columnas: ["Pregunta", "Canal", "Veces en la semana", "Respuesta correcta", "¿Siempre igual?"],
      filas: 6,
    },
    ideas: {
      titulo: "Lo que debe saber y lo que nunca debe hacer",
      grupos: [
        { nombre: "Información que tú apruebas", icono: "check", items: ["Tus servicios y lo que incluye cada uno", "Horarios, ubicación y formas de pago", "Cómo se agenda y qué datos pide"] },
        { nombre: "Cuándo pasa a una persona", icono: "persona", items: ["Cuando el cliente lo pide", "Quejas o casos delicados", "Preguntas que no están en su información"] },
        { nombre: "Lo que nunca debe hacer", icono: "escudo", items: ["Inventar precios, horarios o disponibilidad", "Prometer resultados", "Pedir datos que no necesita"] },
        { nombre: "Con qué conectarlo", icono: "flujo", items: ["Tu calendario, para agendar", "Tu CRM, para registrar cada contacto", "El canal por donde más te escriben"] },
      ],
    },
    plan: {
      titulo: "Cinco pasos para empezar sin riesgos",
      pasos: [
        "Junta en la hoja las preguntas de una semana y sus respuestas correctas.",
        "Decide qué responde el agente y qué pasa a una persona.",
        "Empieza por un solo canal, normalmente el chat, que se prueba más rápido.",
        "Revisa las conversaciones de las primeras semanas y corrige lo que haga falta.",
        "Recién entonces suma otro canal o el agente de voz.",
      ],
    },
    alto: {
      titulo: "Todavía no conviene si…",
      items: [
        "Casi no recibes mensajes ni consultas.",
        "Cada consulta es distinta y necesita que alguien la evalúe.",
        "Todavía no tienes clara la información que quieres dar: servicios, precios y horarios.",
      ],
    },
    articulo: { texto: "Agentes de IA que no inventan información", href: "/blog/agentes-ia-sin-inventar" },
  },

  {
    slug: "embudo-de-ventas-paso-a-paso",
    servicio: "funnels-conversion",
    titulo: "Tu embudo de ventas,",
    destacado: "paso a paso",
    resumen: "Cómo dibujar tu embudo de ventas, ver en qué paso se cae la venta y decidir qué mejorar primero.",
    entrada:
      "Un embudo de ventas es el camino que sigue una persona desde que te conoce hasta que te compra. Esta guía te ayuda a dibujar el tuyo, ver en qué paso se cae la venta y decidir qué mejorar primero.",
    incluye: [
      "Las tres cosas que tiene un embudo que funciona",
      "Una hoja para dibujar tu embudo actual",
      "Qué conviene en cada etapa",
      "Un plan de cinco pasos para mejorarlo",
    ],
    criterio: {
      titulo: "Un embudo funciona cuando tiene tres cosas",
      puntos: [
        {
          titulo: "Un solo objetivo",
          texto: "Cada página pide una sola cosa, por ejemplo agendar una llamada, con un botón claro. Si pide muchas, la persona no hace ninguna.",
          pregunta: "¿Qué quieres que haga quien llega a tu página?",
        },
        {
          titulo: "Seguimiento para quien no se decide",
          texto: "Casi nadie compra la primera vez. Un seguimiento por correo o WhatsApp acompaña a quien dejó sus datos hasta que esté listo.",
          pregunta: "¿Qué le pasa hoy a alguien que pregunta y no compra?",
        },
        {
          titulo: "Una cifra por etapa",
          texto: "Visitas, registros, citas y ventas. Con una cifra por etapa ves dónde se pierden los clientes y qué mejorar.",
          pregunta: "¿Sabes qué parte de tus contactos llega a agendar?",
        },
      ],
    },
    hoja: {
      titulo: "Dibuja tu embudo de hoy",
      texto: "Anota cada etapa por la que pasa un cliente y qué pasa en ella. Si no sabes una cifra, déjala en blanco: eso ya es un hallazgo.",
      columnas: ["Etapa", "Qué pasa hoy", "Cuántos llegan (si lo sabes)", "¿Hay seguimiento?", "Qué mejorarías"],
      filas: 5,
    },
    ideas: {
      titulo: "Qué conviene en cada etapa",
      grupos: [
        { nombre: "Atraer", icono: "megafono", items: ["Contenido o anuncios que hablen del problema de tu cliente", "Un enlace claro a una sola página", "Saber de dónde llega cada visita"] },
        { nombre: "Captar", icono: "embudo", items: ["Una página con un objetivo y un botón", "Un formulario corto, conectado a tu CRM", "Algo útil a cambio de los datos, como una guía"] },
        { nombre: "Dar seguimiento", icono: "email", items: ["Correos de bienvenida y seguimiento, solo con permiso", "Mensajes por WhatsApp si el contacto lo autorizó", "Puntuación de contactos para saber a quién llamar primero"] },
        { nombre: "Cerrar", icono: "calendarioOk", items: ["Una llamada fácil de agendar", "Recordatorios para que la cita no se olvide", "Una propuesta por escrito, clara y con el precio cerrado"] },
      ],
    },
    plan: {
      titulo: "Cinco pasos para mejorar tu embudo",
      pasos: [
        "Dibuja tu embudo actual en la hoja.",
        "Busca la etapa donde se pierden más contactos.",
        "Mejora solo esa etapa: la página, el formulario o el seguimiento.",
        "Mide durante unas semanas con la misma cifra.",
        "Recién entonces pasa a la siguiente etapa.",
      ],
    },
    alto: {
      titulo: "Todavía no conviene invertir en anuncios si…",
      items: [
        "La página no tiene un objetivo claro.",
        "Nadie da seguimiento a quien deja sus datos.",
        "No sabes cuántos contactos llegan a agendar o a comprar.",
      ],
    },
    articulo: { texto: "Funnels que venden sin hacer spam", href: "/blog/funnels-sin-spam" },
  },

  {
    slug: "ordenar-tus-contactos-en-un-crm",
    servicio: "crm-seguimiento-leads",
    titulo: "Ordena tus contactos",
    destacado: "en un CRM",
    resumen: "Cómo pasar de contactos repartidos a un CRM que tu equipo use de verdad, sin complicarte.",
    entrada:
      "Cuando los contactos están en el correo, el celular y una hoja de cálculo, los seguimientos se olvidan. Esta guía te ayuda a definir las etapas de tu venta y a preparar tus contactos antes de elegir un CRM.",
    incluye: [
      "Las tres señales de que ya necesitas un CRM",
      "Una hoja para definir las etapas de tu venta",
      "Qué datos guardar y cuáles no",
      "Un plan de cinco pasos para empezar sin complicarte",
    ],
    criterio: {
      titulo: "Ya necesitas un CRM si…",
      puntos: [
        {
          titulo: "Tus contactos están repartidos",
          texto: "Unos en el correo, otros en el celular y otros en una hoja de cálculo. Nadie tiene la foto completa.",
          pregunta: "¿Dónde está hoy la lista de tus clientes potenciales?",
        },
        {
          titulo: "Se te olvidan seguimientos",
          texto: "Quedas en volver a escribir y se pasa la semana. Un CRM te recuerda cada seguimiento a tiempo.",
          pregunta: "¿Cuántos contactos esperan hoy una respuesta tuya?",
        },
        {
          titulo: "No sabes cómo va cada venta",
          texto: "Cuesta saber quién está por comprar y quién ya no responde. Con etapas, se ve de un vistazo.",
          pregunta: "¿Podrías decir ahora en qué etapa está cada contacto?",
        },
      ],
    },
    hoja: {
      titulo: "Define las etapas de tu venta",
      texto: "Escribe los pasos por los que pasa un cliente, con los nombres que ya usan en tu equipo. Esas serán las etapas del CRM.",
      columnas: ["Etapa (con tu nombre)", "Qué tiene que pasar para avanzar", "Quién se encarga", "Recordatorio que necesita"],
      filas: 6,
    },
    ideas: {
      titulo: "Qué datos guardar",
      grupos: [
        { nombre: "Datos de contacto", icono: "persona", items: ["Nombre, correo y teléfono", "Por dónde prefiere que le escriban", "Si aceptó recibir tus correos"] },
        { nombre: "De dónde viene", icono: "tendencia", items: ["Canal: web, WhatsApp, Instagram o recomendación", "Campaña o anuncio, si llegó por publicidad", "Fecha del primer contacto"] },
        { nombre: "Cómo va", icono: "embudo", items: ["Etapa actual", "Próximo paso y su fecha", "Notas de cada conversación"] },
        { nombre: "Lo que no hace falta", icono: "escudo", items: ["Datos que no vas a usar", "Información sensible que no necesitas", "Contactos repetidos: se limpian antes de importar"] },
      ],
    },
    plan: {
      titulo: "Cinco pasos para empezar",
      pasos: [
        "Define las etapas en la hoja, con los nombres de tu equipo.",
        "Exporta los contactos que ya tienes y quita los repetidos.",
        "Elige un CRM que encaje con lo que ya usas.",
        "Conecta la entrada de contactos nuevos desde la web y los mensajes.",
        "Automatiza los recordatorios de seguimiento.",
      ],
    },
    alto: {
      titulo: "Todavía no hace falta si…",
      items: [
        "Recibes muy pocos contactos y los sigues bien a mano.",
        "Todavía no tienes claro cómo vendes ni sus pasos.",
        "Nadie en tu equipo lo va a mantener al día.",
      ],
    },
    articulo: { texto: "CRM para pymes: por dónde empezar", href: "/blog/crm-para-pymes-por-donde-empezar" },
  },

  {
    slug: "tu-primera-secuencia-de-correos",
    servicio: "email-marketing",
    titulo: "Tu primera secuencia",
    destacado: "de correos",
    resumen: "Cómo planear una secuencia de bienvenida que acompaña hasta la venta, sin hacer spam.",
    entrada:
      "Casi nadie compra el primer día. Una secuencia de correos le escribe a cada persona en el momento justo, con algo útil. Esta guía te ayuda a planear la primera, sin hacer spam.",
    incluye: [
      "Las tres reglas para no terminar en spam",
      "Una hoja para planear cada correo",
      "Ideas de qué contar en cada uno",
      "Un plan de cinco pasos para lanzarla",
    ],
    criterio: {
      titulo: "Una buena secuencia cumple tres reglas",
      puntos: [
        {
          titulo: "Solo a quien dio su permiso",
          texto: "Escribe solo a quien aceptó recibir tus correos. Los contactos sin permiso quedan fuera, aunque los tengas.",
          pregunta: "¿Sabes de dónde viene cada contacto de tu lista?",
        },
        {
          titulo: "Cada correo trae algo concreto",
          texto: "Un consejo, una respuesta, un ejemplo. Si un correo no aporta nada, sobra.",
          pregunta: "¿Qué le enseñarías a un cliente nuevo en sus primeros días?",
        },
        {
          titulo: "Darse de baja está a un clic",
          texto: "Que salir sea fácil hace que los que se quedan sí quieran leerte.",
          pregunta: "¿Tus correos tienen el enlace de baja a la vista?",
        },
      ],
    },
    hoja: {
      titulo: "Planea tu secuencia",
      texto: "Una fila por correo: cuándo sale, de qué habla y qué le pides a quien lo lee. Un solo pedido por correo.",
      columnas: ["Día", "Asunto", "Qué aporta", "Qué le pides (un solo botón)"],
      filas: 6,
    },
    ideas: {
      titulo: "Qué contar en cada correo",
      grupos: [
        { nombre: "Bienvenida", icono: "email", items: ["Lo que prometiste al pedir el correo", "Quién eres y qué puede esperar", "Una primera idea útil"] },
        { nombre: "Seguimiento", icono: "chat", items: ["Respuestas a las dudas más comunes", "Un error frecuente y cómo evitarlo", "Cómo trabajas, paso a paso"] },
        { nombre: "Invitación", icono: "calendario", items: ["Una propuesta clara para el siguiente paso", "Un solo botón", "Avisar cuándo es el último correo"] },
        { nombre: "Medición", icono: "grafica", items: ["Aperturas, para saber si el asunto funciona", "Clics, para saber si el contenido interesa", "Respuestas: la mejor señal de todas"] },
      ],
    },
    plan: {
      titulo: "Cinco pasos para lanzarla",
      pasos: [
        "Decide el objetivo de la secuencia: por ejemplo, agendar una llamada.",
        "Planea los correos en la hoja, uno por fila.",
        "Escríbelos con tu voz y un solo pedido en cada uno.",
        "Conéctala para que empiece sola cuando alguien deja su correo con permiso.",
        "Revisa aperturas, clics y respuestas, y mejora el correo más flojo.",
      ],
    },
    alto: {
      titulo: "Todavía no conviene si…",
      items: [
        "Tu lista es de contactos que no dieron su permiso.",
        "No tienes nada útil que contar más allá de vender.",
        "Nadie va a contestar a quien responda un correo.",
      ],
    },
    articulo: { texto: "Secuencias de email que venden", href: "/blog/secuencias-de-email-que-venden" },
  },

  {
    slug: "las-cifras-de-tu-negocio",
    servicio: "paneles-de-metricas",
    titulo: "Las cifras de tu negocio",
    destacado: "en una sola pantalla",
    resumen: "Qué números mirar en cada etapa para decidir con datos, sin armar informes a mano.",
    entrada:
      "Medir de más abruma y medir de menos te deja a ciegas. Esta guía te ayuda a elegir las pocas cifras que te sirven para decidir y a saber de dónde sale cada una.",
    incluye: [
      "Las tres condiciones de una cifra que sirve",
      "Una hoja para elegir tus cifras",
      "Qué mirar en cada etapa",
      "Un plan de cinco pasos para tu primer panel",
    ],
    criterio: {
      titulo: "Una cifra que sirve cumple tres condiciones",
      puntos: [
        {
          titulo: "Te ayuda a decidir",
          texto: "Si al verla no cambiarías nada, no hace falta mirarla.",
          pregunta: "¿Qué decisión tomarías si esta cifra sube o baja?",
        },
        {
          titulo: "Es de una etapa clara",
          texto: "De visitas a contactos, de contactos a citas, de citas a clientes. Una cifra por etapa basta para ver dónde mejorar.",
          pregunta: "¿A qué etapa de tu negocio pertenece?",
        },
        {
          titulo: "Sale sola de tus herramientas",
          texto: "Si cada semana la copias a mano, terminas dejando de mirarla. Lo ideal es que se actualice sola.",
          pregunta: "¿De qué herramienta sale y cada cuánto se actualiza?",
        },
      ],
    },
    hoja: {
      titulo: "Elige tus cifras",
      texto: "Anota las cifras que miras hoy o que te gustaría mirar. Quédate solo con las que cumplen las tres condiciones.",
      columnas: ["Cifra", "Etapa", "De dónde sale", "Cada cuánto la miras", "¿Qué decidirías con ella?"],
      filas: 6,
    },
    ideas: {
      titulo: "Qué mirar en cada etapa",
      grupos: [
        { nombre: "Atraer", icono: "megafono", items: ["Visitas a la web y de dónde llegan", "Resultados de cada campaña", "Personas que llegan por cada canal"] },
        { nombre: "Captar", icono: "embudo", items: ["Contactos nuevos", "Qué parte de las visitas deja sus datos", "Contactos según su origen"] },
        { nombre: "Vender", icono: "calendarioOk", items: ["Citas agendadas", "Qué parte de los contactos agenda", "Clientes nuevos"] },
        { nombre: "Cobrar", icono: "tendencia", items: ["Ventas del mes", "Pagos pendientes", "Clientes que vuelven a comprar"] },
      ],
    },
    plan: {
      titulo: "Cinco pasos para tu primer panel",
      pasos: [
        "Elige las cifras en la hoja: pocas y una por etapa.",
        "Apunta de qué herramienta sale cada una.",
        "Comprueba cuáles se pueden conectar solas.",
        "Júntalas en una sola pantalla que se actualice sola.",
        "Revísala cada semana y anota qué decidiste.",
      ],
    },
    alto: {
      titulo: "Todavía no conviene un panel si…",
      items: [
        "Tus datos todavía no se guardan en ninguna herramienta.",
        "No sabes qué decisión tomarías con las cifras.",
        "Nadie lo va a mirar con regularidad.",
      ],
    },
    articulo: { texto: "Un panel de métricas para tu negocio", href: "/blog/panel-de-metricas-para-tu-negocio" },
  },

  {
    slug: "una-web-que-trae-clientes",
    servicio: "webs-ia",
    titulo: "Una web que",
    destacado: "te trae clientes",
    resumen: "Qué revisar en tu web para que deje de ser solo una presentación y empiece a traerte contactos.",
    entrada:
      "Muchas webs presentan bien el negocio, pero casi no traen contactos. Esta guía te ayuda a revisar la tuya con ojos de cliente y a decidir qué cambiar primero.",
    incluye: [
      "Las tres cosas que tiene una web que trae clientes",
      "Una hoja para revisar cada página",
      "Lo básico de SEO técnico, en simple",
      "Un plan de cinco pasos para mejorarla",
    ],
    criterio: {
      titulo: "Una web que trae clientes cumple tres cosas",
      puntos: [
        {
          titulo: "Funciona bien en el celular",
          texto: "Carga rápido y lo importante se encuentra sin hacer zoom. En el teléfono es donde más se nota una web lenta o confusa.",
          pregunta: "¿Cuánto tarda tu web en abrir en tu celular con datos móviles?",
        },
        {
          titulo: "Cada página pide una cosa",
          texto: "Un objetivo y un botón principal por página. Si la página pide muchas cosas, la persona no hace ninguna.",
          pregunta: "¿Qué quieres que haga quien entra a esta página?",
        },
        {
          titulo: "Se puede medir",
          texto: "Sabes cuántas personas escriben o agendan desde la web, y desde qué página.",
          pregunta: "¿Sabes cuántos contactos te trajo la web el último mes?",
        },
      ],
    },
    hoja: {
      titulo: "Revisa cada página",
      texto: "Abre tu web en el celular y revisa una página por fila. Empieza por la de inicio y la de contacto.",
      columnas: ["Página", "¿Carga rápido en el celular?", "¿Tiene un objetivo claro?", "¿El botón se ve sin bajar?", "Qué cambiarías"],
      filas: 6,
    },
    ideas: {
      titulo: "Lo que conviene revisar",
      grupos: [
        { nombre: "Celular", icono: "web", items: ["Textos legibles sin hacer zoom", "Botones fáciles de tocar", "Nada que tape el contenido"] },
        { nombre: "Claridad", icono: "check", items: ["Qué haces y para quién, en la primera pantalla", "Un botón principal por página", "Formas de contacto a la vista"] },
        { nombre: "SEO técnico básico", icono: "globo", items: ["Un título y una descripción únicos por página", "Encabezados ordenados", "Mapa del sitio y buena velocidad"] },
        { nombre: "Accesibilidad", icono: "persona", items: ["Buen contraste entre texto y fondo", "Textos alternativos en las imágenes", "Que se pueda navegar con el teclado"] },
      ],
    },
    plan: {
      titulo: "Cinco pasos para mejorarla",
      pasos: [
        "Revisa cada página en la hoja, desde el celular.",
        "Arregla primero la página por la que más gente entra.",
        "Deja un objetivo y un botón claro en cada página.",
        "Pon la medición: contactos y citas que llegan desde la web.",
        "Mide unas semanas y sigue con la siguiente página.",
      ],
    },
    alto: {
      titulo: "Antes de rehacer la web entera, revisa si…",
      items: [
        "El problema es de una o dos páginas y no de toda la web.",
        "Todavía no tienes claro qué ofreces y a quién.",
        "Nadie da seguimiento a los contactos que ya llegan.",
      ],
    },
    articulo: { texto: "Qué revisar en tu web", href: "/blog/que-revisar-en-tu-web" },
  },

  {
    slug: "antes-de-invertir-en-anuncios",
    servicio: "trafico-de-pago",
    titulo: "Antes de invertir",
    destacado: "en anuncios",
    resumen: "Qué dejar listo antes de pagar anuncios en Meta Ads o Google Ads, para que cada campaña se pueda medir.",
    entrada:
      "Pagar anuncios sin medir es apostar a ciegas. Esta guía te ayuda a revisar lo que tiene que estar listo antes de invertir: la página, la medición y el seguimiento.",
    incluye: [
      "Las tres cosas que revisar antes de invertir",
      "Una hoja para planear tu primera campaña",
      "Meta Ads o Google Ads: cuándo conviene cada uno",
      "Un plan de cinco pasos para probar con poco",
    ],
    criterio: {
      titulo: "Antes de invertir, revisa tres cosas",
      puntos: [
        {
          titulo: "La página de destino vende",
          texto: "Mandar visitas a una página que no vende, o sin seguimiento, suele ser dinero perdido.",
          pregunta: "¿Qué hace hoy quien llega a la página del anuncio?",
        },
        {
          titulo: "La medición está bien puesta",
          texto: "El píxel y las conversiones tienen que registrar los contactos y las citas. Si no, las plataformas no aprenden y tú no sabes qué funciona.",
          pregunta: "Cuando alguien agenda, ¿la plataforma de anuncios se entera?",
        },
        {
          titulo: "Alguien atiende los contactos",
          texto: "Si llegan mensajes por los anuncios y nadie contesta a tiempo, se pierden.",
          pregunta: "¿Quién responde a los contactos nuevos y en cuánto tiempo?",
        },
      ],
    },
    hoja: {
      titulo: "Planea tu primera campaña",
      texto: "Una fila por campaña de prueba. Mejor pocas y bien medidas que muchas a la vez.",
      columnas: ["Qué ofreces", "A quién", "Plataforma", "Página de destino", "Qué cuenta como resultado"],
      filas: 4,
    },
    ideas: {
      titulo: "Meta Ads, Google Ads y lo que va detrás",
      grupos: [
        { nombre: "Google Ads", icono: "globo", items: ["Llega a quien ya está buscando lo que vendes", "Conviene cuando hay búsquedas de tu servicio", "La página tiene que responder justo a esa búsqueda"] },
        { nombre: "Meta Ads", icono: "instagram", items: ["Despierta el interés de personas parecidas a tu cliente", "Funciona bien con algo útil a cambio, como una guía", "Necesita seguimiento para quien no se decide"] },
        { nombre: "La medición", icono: "grafica", items: ["Píxel de Meta y conversiones de Google", "Un evento por resultado: cita, contacto o registro", "Parámetros en los enlaces para saber de qué anuncio llega"] },
        { nombre: "El seguimiento", icono: "chat", items: ["Respuesta rápida a cada contacto", "Correos o mensajes para quien no agenda", "Recordatorios para que la cita no se olvide"] },
      ],
    },
    plan: {
      titulo: "Cinco pasos para probar con poco",
      pasos: [
        "Revisa la página, la medición y el seguimiento con las tres condiciones.",
        "Planea una campaña de prueba en la hoja.",
        "Define una inversión de prueba que puedas asumir sin arriesgar de más.",
        "Lánzala y mide con la misma cifra durante unas semanas.",
        "Invierte más solo en lo que demuestra ser rentable.",
      ],
    },
    alto: {
      titulo: "Todavía no conviene invertir si…",
      items: [
        "La página no tiene un objetivo claro.",
        "No puedes medir los contactos ni las citas que llegan.",
        "No tienes tiempo de atender a quien escribe.",
      ],
    },
    articulo: { texto: "Antes de pagar anuncios en Meta o Google", href: "/blog/antes-de-pagar-anuncios" },
  },

  {
    slug: "por-donde-empezar-con-ia",
    servicio: "consultoria-ia",
    titulo: "Por dónde empezar",
    destacado: "con la IA en tu negocio",
    resumen: "Cómo elegir dónde usar la IA primero, con qué herramienta y qué esperar, sin probar a ciegas.",
    entrada:
      "Hay cientos de herramientas de IA y es fácil perder tiempo probando sin rumbo. Esta guía te ayuda a ordenar las oportunidades de tu negocio y a elegir por dónde empezar.",
    incluye: [
      "Las tres condiciones de una buena primera idea",
      "Una hoja para ordenar oportunidades",
      "Dónde suele ayudar la IA en un negocio",
      "Un plan de cinco pasos para empezar",
    ],
    criterio: {
      titulo: "Una buena primera idea con IA…",
      puntos: [
        {
          titulo: "Resuelve un problema real",
          texto: "Empieza por algo que hoy te quita tiempo o clientes, no por la herramienta de moda.",
          pregunta: "¿Qué problema concreto resolvería?",
        },
        {
          titulo: "Aporta mucho y cuesta poco",
          texto: "Ordena las ideas por lo que aportan y lo fácil que es ponerlas en marcha. Arriba quedan las que aportan mucho y cuestan poco.",
          pregunta: "¿Qué cambiaría en tu semana y cuánto trabajo lleva ponerla en marcha?",
        },
        {
          titulo: "Se puede medir",
          texto: "Antes de empezar, decide qué vas a medir para saber si funcionó.",
          pregunta: "¿Cómo sabrías dentro de un mes si valió la pena?",
        },
      ],
    },
    hoja: {
      titulo: "Ordena tus oportunidades",
      texto: "Anota cada idea y puntúa de 1 a 3 lo que aporta y lo fácil que es. Empieza por la que sume más.",
      columnas: ["Idea", "Problema que resuelve", "Lo que aporta (1 a 3)", "Lo fácil que es (1 a 3)", "Cómo lo medirías"],
      filas: 6,
    },
    ideas: {
      titulo: "Dónde suele ayudar la IA",
      grupos: [
        { nombre: "Atención", icono: "chat", items: ["Responder preguntas frecuentes con tu información", "Agendar citas", "Resumir conversaciones para tu equipo"] },
        { nombre: "Contenido", icono: "megafono", items: ["Primeros borradores de textos y correos", "Ideas para publicaciones", "Adaptar un texto a cada canal"] },
        { nombre: "Operación", icono: "flujo", items: ["Ordenar y clasificar la información que llega", "Pasar datos entre herramientas", "Preparar resúmenes e informes"] },
        { nombre: "Decisiones", icono: "grafica", items: ["Juntar cifras de varias fuentes", "Detectar contactos que necesitan seguimiento", "Preparar la información antes de una reunión"] },
      ],
    },
    plan: {
      titulo: "Cinco pasos para empezar",
      pasos: [
        "Anota en la hoja las ideas donde la IA podría ayudarte.",
        "Puntúa lo que aportan y lo fáciles que son, y elige la que más sume.",
        "Elige la herramienta según lo que ya usas.",
        "Pruébala en pequeño y mide lo que decidiste medir.",
        "Si funciona, súmala al día a día y pasa a la siguiente.",
      ],
    },
    alto: {
      titulo: "Todavía no conviene si…",
      items: [
        "La idea es usar IA porque está de moda, sin un problema claro.",
        "El proceso todavía no está ordenado a mano.",
        "No hay forma de saber si funcionó.",
      ],
    },
    articulo: { texto: "Empezar con IA sin perder tiempo", href: "/blog/empezar-con-ia-sin-perder-tiempo" },
  },
];

export const GUIAS: Record<string, Guia> = Object.fromEntries(lista.map((g) => [g.slug, g]));

/** La general, para el blog y /guia. */
export const GUIA_GENERAL = "que-automatizar-primero";

/** La guía de cada servicio. */
export function guiaDeServicio(servicio: string | undefined): Guia {
  return lista.find((g) => g.servicio === servicio) ?? GUIAS[GUIA_GENERAL];
}

/** Título completo, para correos y formularios. */
export function tituloGuia(g: Guia): string {
  return `${g.titulo} ${g.destacado}`;
}
