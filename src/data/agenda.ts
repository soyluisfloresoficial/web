/**
 * Agenda propia de la llamada de diagnóstico (28/10/2026). Ver AGENDA.md.
 *
 * Valores por defecto de la agenda. Las horas libres salen de cruzar este
 * horario con tu Google Calendar: si tienes algo en el calendario, esa hora
 * no aparece en la web.
 *
 * Desde el 28/10/2026 el horario se edita en el panel (lo pidió el titular):
 * lo que guarde el panel en Cloudflare manda sobre lo de aquí. Esto solo se
 * usa mientras el panel no haya guardado nada, o si se borra lo guardado.
 */
export const AGENDA = {
  /** Zona horaria en la que está escrito el horario de abajo. */
  zona: "Europe/Madrid",
  /** Duración de la llamada, en minutos. */
  duracion: 30,
  /** Cada cuánto empieza un hueco (10:00, 10:30, 11:00…). */
  paso: 30,
  /** Minutos libres que se dejan antes y después de cada cita del calendario. */
  margen: 15,
  /** Horas mínimas entre la reserva y la llamada. */
  antelacion: 12,
  /** Cuántos días hacia adelante se pueden ver. */
  dias: 21,
  /**
   * Horario por día de la semana, en la zona de arriba.
   * 1 = lunes … 5 = viernes, 6 = sábado, 0 = domingo. Sin la clave, ese día
   * no se atiende.
   * Abierto todos los días a todas horas, a pedido del titular (28/10/2026):
   * el horario real lo pone él desde el panel.
   */
  horario: {
    0: ["00:00-24:00"],
    1: ["00:00-24:00"],
    2: ["00:00-24:00"],
    3: ["00:00-24:00"],
    4: ["00:00-24:00"],
    5: ["00:00-24:00"],
    6: ["00:00-24:00"],
  } as Record<number, string[]>,
  /** Título del evento en tu calendario. Se le añade el nombre del cliente. */
  titulo: "Llamada de diagnóstico",
};

export type ConfigAgenda = typeof AGENDA;
