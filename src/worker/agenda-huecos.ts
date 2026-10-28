/**
 * Cálculo de las horas libres de la agenda (28/10/2026).
 *
 * Sin dependencias ni llamadas a Google: recibe el horario, la hora actual y
 * los tramos ocupados del calendario, y devuelve los huecos. Así se puede
 * probar en el ordenador (tools/probar-agenda.mjs) y usar también en la
 * vista previa de la web.
 *
 * Todas las horas viajan en UTC (ISO 8601). Solo el horario se escribe en la
 * zona de la agenda, y aquí se convierte respetando los cambios de hora.
 */

export interface Horario {
  zona: string;
  duracion: number;
  paso: number;
  margen: number;
  antelacion: number;
  dias: number;
  horario: Record<number, string[]>;
}

export interface Tramo {
  inicio: number;
  fin: number;
}

const MINUTO = 60_000;
const formatos = new Map<string, Intl.DateTimeFormat>();

function formato(zona: string): Intl.DateTimeFormat {
  let f = formatos.get(zona);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: zona,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      weekday: "short",
    });
    formatos.set(zona, f);
  }
  return f;
}

const DIAS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Fecha y hora de pared de un instante en una zona. */
export function enZona(ms: number, zona: string) {
  const p: Record<string, string> = {};
  for (const { type, value } of formato(zona).formatToParts(new Date(ms))) p[type] = value;
  return {
    anio: Number(p.year),
    mes: Number(p.month),
    dia: Number(p.day),
    hora: Number(p.hour),
    minuto: Number(p.minute),
    segundo: Number(p.second),
    semana: DIAS[p.weekday] ?? 0,
  };
}

/** Diferencia de la zona con UTC en ese instante, en minutos. */
function desfase(ms: number, zona: string): number {
  const z = enZona(ms, zona);
  const comoUtc = Date.UTC(z.anio, z.mes - 1, z.dia, z.hora, z.minuto, z.segundo);
  return Math.round((comoUtc - Math.floor(ms / 1000) * 1000) / MINUTO);
}

/** Instante UTC de una hora de pared en una zona. */
export function deZona(anio: number, mes: number, dia: number, minutos: number, zona: string): number {
  const ingenuo = Date.UTC(anio, mes - 1, dia, 0, minutos);
  let t = ingenuo - desfase(ingenuo, zona) * MINUTO;
  // Segunda pasada por si el primer cálculo cayó al otro lado de un cambio de hora.
  const d2 = desfase(t, zona);
  t = ingenuo - d2 * MINUTO;
  return t;
}

function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** Huecos libres, en ms UTC, ordenados. */
export function calcularHuecos(cfg: Horario, ahora: number, ocupados: Tramo[]): number[] {
  const minimo = ahora + cfg.antelacion * 60 * MINUTO;
  const hoy = enZona(ahora, cfg.zona);
  const huecos: number[] = [];

  for (let i = 0; i < cfg.dias; i++) {
    // Fecha de calendario i días después de hoy en la zona de la agenda.
    const base = new Date(Date.UTC(hoy.anio, hoy.mes - 1, hoy.dia + i));
    const anio = base.getUTCFullYear();
    const mes = base.getUTCMonth() + 1;
    const dia = base.getUTCDate();
    const tramos = cfg.horario[base.getUTCDay()];
    if (!tramos) continue;

    for (const tramo of tramos) {
      const [desde, hasta] = tramo.split("-").map(aMinutos);
      for (let m = desde; m + cfg.duracion <= hasta; m += cfg.paso) {
        const inicio = deZona(anio, mes, dia, m, cfg.zona);
        if (inicio < minimo) continue;
        if (!estaLibre(inicio, cfg, ocupados)) continue;
        huecos.push(inicio);
      }
    }
  }
  return [...new Set(huecos)].sort((a, b) => a - b);
}

/** True si la llamada que empieza en «inicio» no choca con nada (con margen). */
export function estaLibre(inicio: number, cfg: Horario, ocupados: Tramo[]): boolean {
  const fin = inicio + cfg.duracion * MINUTO;
  const margen = cfg.margen * MINUTO;
  return !ocupados.some((o) => inicio < o.fin + margen && fin > o.inicio - margen);
}
