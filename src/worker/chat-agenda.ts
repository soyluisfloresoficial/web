/**
 * Herramientas del asistente del chat para agendar la llamada (2/11/2026).
 *
 * - ver_horarios: le da a Claude los huecos libres de la agenda propia, con la
 *   hora del visitante y la de Madrid.
 * - preparar_cita: comprueba los datos que el visitante dio en la conversación
 *   y, si están bien, el chat muestra una tarjeta para confirmar.
 *
 * El asistente nunca reserva solo: la cita se crea cuando la persona revisa
 * la tarjeta, marca la casilla de privacidad y pulsa «Confirmar», que llama a
 * POST /api/agenda igual que el formulario de /contacto (agenda.ts). Así la
 * validación, el permiso y los correos son los mismos.
 */
import type Anthropic from "@anthropic-ai/sdk";
import { CORREO, EQUIPOS, SERVICIOS, huecosParaChat, type EnvAgenda } from "./agenda";

/** Lo que el chat necesita para pintar la tarjeta de confirmación. */
export interface CitaPropuesta {
  inicio: string;
  nombre: string;
  correo: string;
  telefono: string;
  empresa: string;
  sitioWeb: string;
  sector: string;
  equipo: string;
  servicio: string;
  mensaje: string;
}

export const HERRAMIENTAS: Anthropic.Beta.BetaToolUnion[] = [
  {
    name: "ver_horarios",
    description:
      "Devuelve las horas libres para la llamada de diagnóstico, en la hora del visitante y en la de Madrid. Úsala antes de proponer horarios: nunca inventes horas. Sin «dia» devuelve los próximos días con horas libres; con «dia» (AAAA-MM-DD, en la fecha del visitante), solo ese día.",
    input_schema: {
      type: "object",
      properties: {
        dia: { type: "string", description: "Día concreto en formato AAAA-MM-DD. Opcional." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "preparar_cita",
    description:
      "Prepara la cita con los datos que el visitante dio en la conversación. No la reserva: el chat le muestra una tarjeta con los datos para que los revise, acepte la política de privacidad y confirme. Úsala solo cuando tengas la hora elegida (el «inicio» exacto que dio ver_horarios), el nombre y el correo.",
    input_schema: {
      type: "object",
      properties: {
        inicio: { type: "string", description: "El valor «inicio» exacto de la hora elegida, tal cual lo dio ver_horarios." },
        nombre: { type: "string", description: "Nombre de la persona." },
        correo: { type: "string", description: "Correo de la persona; ahí le llega la invitación." },
        telefono: { type: "string", description: "WhatsApp o teléfono, con prefijo del país. Vacío si no lo dio." },
        empresa: { type: "string", description: "Nombre del negocio. Vacío si no lo dio." },
        sitio_web: { type: "string", description: "Página web o Instagram del negocio. Vacío si no lo dio." },
        sector: { type: "string", description: "A qué se dedica el negocio, en pocas palabras." },
        equipo: { type: "string", enum: [...EQUIPOS, ""], description: "Tamaño del equipo, si lo sabes." },
        servicio: { type: "string", enum: [...SERVICIOS, ""], description: "El servicio que más le encaja según la conversación." },
        mensaje: {
          type: "string",
          description: "Resumen en una o dos frases de lo que quiere resolver, con sus palabras, para que Luis llegue preparado.",
        },
      },
      required: ["inicio", "nombre", "correo"],
      additionalProperties: false,
    },
  },
];

const DIA = 24 * 60 * 60_000;

function etiqueta(ms: number, zona: string, conDia = true): string {
  return new Intl.DateTimeFormat("es", {
    timeZone: zona,
    ...(conDia ? { weekday: "long", day: "numeric", month: "long" } : {}),
    hour: "2-digit",
    minute: "2-digit",
  }).format(ms);
}

function fechaLocal(ms: number, zona: string): string {
  // en-CA da AAAA-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: zona, year: "numeric", month: "2-digit", day: "2-digit" }).format(ms);
}

function limpio(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

/**
 * Ejecuta una herramienta y devuelve el texto para Claude. Si preparar_cita
 * sale bien, también devuelve la cita para la tarjeta del chat.
 */
export async function usarHerramienta(
  env: EnvAgenda,
  nombre: string,
  entrada: unknown,
  zonaVisitante: string,
): Promise<{ texto: string; error?: boolean; cita?: CitaPropuesta }> {
  const datos = (entrada && typeof entrada === "object" ? entrada : {}) as Record<string, unknown>;
  const agenda = await huecosParaChat(env);
  if (!agenda) {
    return {
      texto:
        "La agenda no está disponible ahora. Ofrece agendar en https://soyluisflores.es/contacto o escribir por WhatsApp al +34 631 65 49 19.",
      error: true,
    };
  }

  if (nombre === "ver_horarios") {
    const dia = typeof datos.dia === "string" && /^\d{4}-\d{2}-\d{2}$/.test(datos.dia) ? datos.dia : "";
    const porDia = new Map<string, number[]>();
    for (const t of agenda.huecos) {
      const f = fechaLocal(t, zonaVisitante);
      if (dia && f !== dia) continue;
      porDia.set(f, [...(porDia.get(f) ?? []), t]);
    }
    if (!porDia.size) {
      return { texto: dia ? `No hay horas libres el ${dia}. Llama a ver_horarios sin día para ver los próximos.` : "No hay horas libres en los próximos días." };
    }
    // Sin día: los tres primeros días con hueco. Con día: todo ese día.
    const dias = [...porDia.entries()].slice(0, dia ? 1 : 3);
    const lineas = dias.map(([f, horas]) => {
      const lista = horas
        .map((t) => {
          const madrid = zonaVisitante === agenda.zona ? "" : ` (${etiqueta(t, agenda.zona, false)} en Madrid)`;
          return `  - ${etiqueta(t, zonaVisitante, false)}${madrid} · inicio=${new Date(t).toISOString()}`;
        })
        .join("\n");
      const nombreDia = new Intl.DateTimeFormat("es", { timeZone: zonaVisitante, weekday: "long", day: "numeric", month: "long" }).format(horas[0]);
      return `${nombreDia} (${f}):\n${lista}`;
    });
    return {
      texto: `Zona del visitante: ${zonaVisitante}. Llamada de ${agenda.duracion} minutos por Google Meet.\n${lineas.join("\n")}\nOfrécele dos o tres de estas horas, no todas.`,
    };
  }

  if (nombre === "preparar_cita") {
    const inicio = typeof datos.inicio === "string" ? Date.parse(datos.inicio) : NaN;
    const faltan: string[] = [];
    if (!Number.isFinite(inicio) || !agenda.huecos.includes(inicio)) {
      return { texto: "Esa hora no está libre o no es un «inicio» de ver_horarios. Vuelve a llamar a ver_horarios y ofrece otra.", error: true };
    }
    const cita: CitaPropuesta = {
      inicio: new Date(inicio).toISOString(),
      nombre: limpio(datos.nombre, 80),
      correo: limpio(datos.correo, 120).toLowerCase(),
      telefono: limpio(datos.telefono, 30),
      empresa: limpio(datos.empresa, 120),
      sitioWeb: limpio(datos.sitio_web, 200),
      sector: limpio(datos.sector, 80),
      equipo: EQUIPOS.includes(limpio(datos.equipo, 40)) ? limpio(datos.equipo, 40) : "",
      servicio: SERVICIOS.includes(limpio(datos.servicio, 60)) ? limpio(datos.servicio, 60) : "",
      mensaje: limpio(datos.mensaje, 1000),
    };
    if (cita.nombre.length < 2) faltan.push("el nombre");
    if (!CORREO.test(cita.correo)) faltan.push("un correo válido");
    if (faltan.length) return { texto: `Falta ${faltan.join(" y ")}. Pídeselo antes de volver a llamar a preparar_cita.`, error: true };
    if (inicio - Date.now() > 60 * DIA) return { texto: "Esa fecha está demasiado lejos.", error: true };
    return {
      texto: `Tarjeta mostrada: ${etiqueta(inicio, zonaVisitante)} (${zonaVisitante}). Dile en una frase que revise sus datos abajo, marque la casilla de privacidad y pulse «Confirmar llamada». Todavía no está agendada.`,
      cita,
    };
  }

  return { texto: `No existe la herramienta ${nombre}.`, error: true };
}
