/**
 * Autodiagnóstico «¿Por dónde empiezo?» (09/11/2026). Lo usa
 * src/components/Autodiagnostico.astro en /servicios.
 *
 * Cinco preguntas; cada respuesta suma puntos a uno o varios servicios y el
 * que más suma es la recomendación (y el segundo, «también te puede servir»).
 * Es una orientación, no un presupuesto: el resultado siempre invita a la
 * llamada, donde se ve el caso de verdad.
 *
 * Los slugs tienen que existir en src/data/servicios.ts (lo comprueba la
 * prueba de tools/probar-agenda.mjs).
 */
export type Puntos = Partial<Record<string, number>>;

export interface Pregunta {
  id: string;
  texto: string;
  opciones: { texto: string; puntos: Puntos }[];
}

export const PREGUNTAS: Pregunta[] = [
  {
    id: "tiempo",
    texto: "¿Qué te quita más tiempo hoy?",
    opciones: [
      { texto: "Contestar mensajes y agendar citas", puntos: { "agentes-ia": 3 } },
      { texto: "Pasar datos de una herramienta a otra y tareas repetidas", puntos: { automatizacion: 3 } },
      { texto: "Hacer seguimiento a quien preguntó y no compró", puntos: { "crm-seguimiento-leads": 3, "email-marketing": 1 } },
      { texto: "Averiguar qué funciona y qué no en mi negocio", puntos: { "paneles-de-metricas": 3 } },
    ],
  },
  {
    id: "clientes",
    texto: "¿Cómo te llegan los clientes ahora?",
    opciones: [
      { texto: "Por WhatsApp y redes sociales", puntos: { "agentes-ia": 1, "funnels-conversion": 1 } },
      { texto: "Por recomendación; no tengo un flujo constante", puntos: { "funnels-conversion": 2, "trafico-de-pago": 1, "webs-ia": 1 } },
      { texto: "Con anuncios pagados", puntos: { "trafico-de-pago": 2, "paneles-de-metricas": 1, "funnels-conversion": 1 } },
      { texto: "Por mi web o por Google", puntos: { "webs-ia": 2, "funnels-conversion": 1 } },
    ],
  },
  {
    id: "seguimiento",
    texto: "¿Qué pasa con quien te pregunta y no compra?",
    opciones: [
      { texto: "Se pierde: nadie le vuelve a escribir", puntos: { "crm-seguimiento-leads": 2, "email-marketing": 2 } },
      { texto: "Le escribo a mano cuando me acuerdo", puntos: { "crm-seguimiento-leads": 2, automatizacion: 1 } },
      { texto: "Tengo seguimiento, pero casi nadie termina comprando", puntos: { "funnels-conversion": 2, "email-marketing": 1 } },
    ],
  },
  {
    id: "web",
    texto: "¿Tu web te trae contactos?",
    opciones: [
      { texto: "No tengo web o está desactualizada", puntos: { "webs-ia": 3 } },
      { texto: "Tengo web, pero casi no me escriben desde ahí", puntos: { "funnels-conversion": 2, "webs-ia": 1 } },
      { texto: "Sí, funciona bien", puntos: { "trafico-de-pago": 1 } },
    ],
  },
  {
    id: "ia",
    texto: "¿Qué tan claro tienes cómo usar la IA en tu negocio?",
    opciones: [
      { texto: "Nada claro: quiero que alguien me oriente", puntos: { "consultoria-ia": 3 } },
      { texto: "Tengo ideas, pero no sé si valen la pena", puntos: { "consultoria-ia": 2 } },
      { texto: "Lo tengo claro: quiero implementarlo ya", puntos: {} },
    ],
  },
];

/** Por qué se recomienda cada servicio, en una frase. */
export const MOTIVOS: Record<string, string> = {
  "agentes-ia": "Lo que más te frena es atender y agendar. Un agente de IA contesta al momento, también fuera de horario, y deja la cita en tu calendario.",
  automatizacion: "Se te va el día en tareas repetidas. Conectar tus herramientas para que los datos pasen solos te devuelve esas horas.",
  "crm-seguimiento-leads": "Se te escapan interesados por falta de seguimiento. Un CRM bien montado te dice a quién escribir y cuándo.",
  "email-marketing": "Hay gente que te conoce y no compra todavía. Una secuencia de correos la acompaña hasta que esté lista.",
  "paneles-de-metricas": "Te falta ver qué funciona. Un panel con tus números de cada semana te dice dónde poner el tiempo y el dinero.",
  "funnels-conversion": "Te llegan visitas o contactos, pero pocos terminan en cliente. Un funnel ordena el camino y mide cada paso.",
  "webs-ia": "Tu web no está trabajando para ti. Una web pensada para pedir la cita convierte visitas en conversaciones.",
  "trafico-de-pago": "Ya tienes algo que funciona. Con anuncios bien medidos puedes llevarle más gente.",
  "consultoria-ia": "Antes de implementar conviene tener un plan. En una consultoría vemos qué automatizar primero y qué no vale la pena.",
};

/** Suma los puntos de las respuestas (índice de opción por pregunta) y devuelve los servicios ordenados. */
export function recomendar(respuestas: number[]): string[] {
  const total: Record<string, number> = {};
  respuestas.forEach((r, i) => {
    const puntos = PREGUNTAS[i]?.opciones[r]?.puntos ?? {};
    for (const [slug, p] of Object.entries(puntos)) total[slug] = (total[slug] ?? 0) + (p ?? 0);
  });
  const orden = Object.keys(MOTIVOS);
  return Object.entries(total)
    .filter(([, p]) => p > 0)
    // Empate: el orden de MOTIVOS decide, así el resultado es siempre el mismo.
    .sort((a, b) => b[1] - a[1] || orden.indexOf(a[0]) - orden.indexOf(b[0]))
    .map(([slug]) => slug);
}
