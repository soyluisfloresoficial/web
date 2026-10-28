/**
 * Agenda propia de la llamada de diagnóstico (28/10/2026). Ver AGENDA.md.
 *
 * Aquí se decide cuándo se puede reservar. Las horas libres salen de cruzar
 * este horario con tu Google Calendar: si tienes algo en el calendario, esa
 * hora no aparece en la web.
 *
 * Al cambiar algo aquí, compila y sube como cualquier otro cambio.
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
   * [VERIFICAR con el titular: es un horario de partida. La tarde de Madrid
   * es la mañana en Latinoamérica.]
   */
  horario: {
    1: ["10:00-14:00", "16:00-20:00"],
    2: ["10:00-14:00", "16:00-20:00"],
    3: ["10:00-14:00", "16:00-20:00"],
    4: ["10:00-14:00", "16:00-20:00"],
    5: ["10:00-14:00"],
  } as Record<number, string[]>,
  /** Título del evento en tu calendario. Se le añade el nombre del cliente. */
  titulo: "Llamada de diagnóstico",
};

export type ConfigAgenda = typeof AGENDA;
