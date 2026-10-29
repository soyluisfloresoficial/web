/**
 * Qué recordatorio le toca a una cita (29/10/2026). Sin dependencias, para
 * probarlo en el ordenador (tools/probar-agenda.mjs).
 *
 * El Worker revisa las citas cada 10 minutos (cron de wrangler.jsonc):
 * - «24h»: un día antes, solo si se agendó con más de 26 horas de margen.
 *   Si se agendó para el día siguiente, la confirmación acaba de llegar y un
 *   «mañana hablamos» sobra.
 * - «1h»: una hora antes (como mucho 70 minutos), si se agendó con más de
 *   2 horas de margen.
 * Cada uno se envía una sola vez: la cita guarda que ya salió.
 */

const MINUTO = 60_000;
const HORA = 60 * MINUTO;

export interface EstadoCita {
  inicio: number;
  creado: number;
  enviado24: boolean;
  enviado1: boolean;
}

export function recordatorioPendiente(c: EstadoCita, ahora: number): "24h" | "1h" | null {
  const falta = c.inicio - ahora;
  const margen = c.inicio - c.creado;
  if (falta <= 0) return null;
  if (falta <= 70 * MINUTO) return !c.enviado1 && margen > 2 * HORA ? "1h" : null;
  if (falta <= 24 * HORA) return !c.enviado24 && margen > 26 * HORA ? "24h" : null;
  return null;
}
