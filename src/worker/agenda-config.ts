/**
 * Validación del horario de la agenda que se edita desde el panel
 * (28/10/2026). Ver AGENDA.md, «Editar el horario desde el panel».
 *
 * Sin dependencias, para probarlo en el ordenador
 * (tools/probar-agenda.mjs). Acepta cambios parciales: lo que no venga se
 * queda como estaba.
 */
import type { Horario } from "./agenda-huecos";

export interface ConfigAgenda extends Horario {
  titulo: string;
}

const TRAMO = /^([01]\d|2[0-3]):([0-5]\d)-(([01]\d|2[0-3]):([0-5]\d)|24:00)$/;
const LIMITES: Record<string, [number, number]> = {
  duracion: [15, 180],
  paso: [5, 120],
  margen: [0, 120],
  antelacion: [0, 336],
  dias: [1, 90],
};

function minutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Junta los cambios con la configuración actual. Devuelve un error legible si algo no vale. */
export function aplicarCambios(
  actual: ConfigAgenda,
  cambios: unknown,
): { ok: true; config: ConfigAgenda } | { ok: false; error: string } {
  if (!cambios || typeof cambios !== "object" || Array.isArray(cambios)) {
    return { ok: false, error: "Hace falta un objeto con los cambios." };
  }
  const c = cambios as Record<string, unknown>;
  const nueva: ConfigAgenda = { ...actual, horario: { ...actual.horario } };

  for (const [clave, [min, max]] of Object.entries(LIMITES)) {
    if (c[clave] === undefined) continue;
    const v = c[clave];
    if (typeof v !== "number" || !Number.isInteger(v) || v < min || v > max) {
      return { ok: false, error: `«${clave}» tiene que ser un número entero entre ${min} y ${max}.` };
    }
    (nueva as unknown as Record<string, number>)[clave] = v;
  }

  if (c.zona !== undefined) {
    if (typeof c.zona !== "string") return { ok: false, error: "«zona» tiene que ser una zona horaria, por ejemplo Europe/Madrid." };
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: c.zona });
    } catch {
      return { ok: false, error: `«${c.zona}» no es una zona horaria válida.` };
    }
    nueva.zona = c.zona;
  }

  if (c.titulo !== undefined) {
    if (typeof c.titulo !== "string" || !c.titulo.trim() || c.titulo.length > 80) {
      return { ok: false, error: "«titulo» tiene que ser un texto de 1 a 80 caracteres." };
    }
    nueva.titulo = c.titulo.trim();
  }

  if (c.horario !== undefined) {
    if (!c.horario || typeof c.horario !== "object" || Array.isArray(c.horario)) {
      return { ok: false, error: "«horario» tiene que ser un objeto con los días 0 a 6." };
    }
    const horario: Record<number, string[]> = {};
    for (const [dia, tramos] of Object.entries(c.horario as Record<string, unknown>)) {
      if (!/^[0-6]$/.test(dia)) return { ok: false, error: `El día «${dia}» no existe: usa 0 (domingo) a 6 (sábado).` };
      if (!Array.isArray(tramos) || tramos.length > 6) {
        return { ok: false, error: `El día ${dia} tiene que ser una lista de hasta 6 tramos.` };
      }
      const ordenados: [number, number][] = [];
      for (const t of tramos) {
        if (typeof t !== "string" || !TRAMO.test(t)) {
          return { ok: false, error: `El tramo «${String(t)}» del día ${dia} tiene que ser como 09:00-14:00.` };
        }
        const [a, b] = t.split("-").map(minutos);
        if (a >= b) return { ok: false, error: `En el tramo «${t}» la hora de inicio tiene que ser anterior a la de fin.` };
        ordenados.push([a, b]);
      }
      ordenados.sort((x, y) => x[0] - y[0]);
      for (let i = 1; i < ordenados.length; i++) {
        if (ordenados[i][0] < ordenados[i - 1][1]) return { ok: false, error: `Los tramos del día ${dia} se pisan.` };
      }
      // Un día sin tramos se guarda como cerrado.
      if (tramos.length) horario[Number(dia)] = tramos as string[];
    }
    nueva.horario = horario;
  }

  return { ok: true, config: nueva };
}
