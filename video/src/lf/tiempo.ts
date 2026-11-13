/**
 * Motor de tiempos. Convierte la configuración (segundos, secciones y anclas
 * de palabra) en fotogramas concretos para la duración real de la voz.
 *
 * Reglas:
 * 1. Una escena con `inicio` numérico empieza en ese segundo.
 * 2. Con `inicio: { ancla: "imagina esto" }` empieza cuando la voz dice esa
 *    frase (la primera vez después del inicio de la escena anterior).
 * 3. Sin `inicio`, toma el inicio de su sección en el timeline base de 60 s,
 *    escalado a la duración real (un video de 45 s comprime todo igual).
 * Cada escena termina donde empieza la siguiente; la última, al final.
 */
import type { Caption } from "@remotion/captions";
import { TIMELINE_BASE, type ConfigVideo, type Escena, type Momento } from "./tipos";

export type EscenaResuelta = Escena & { desde: number; hasta: number; indice: number };

/** Minúsculas, sin tildes ni signos: «¿Guía?» → «guia». */
export function normalizar(t: string): string {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ ]/g, "")
    .trim();
}

/** Segundo en que empieza una frase dentro de los subtítulos, o null. */
export function buscarAncla(subtitulos: Caption[] | null, frase: string, desdeMs = 0): number | null {
  if (!subtitulos?.length) return null;
  const objetivo = normalizar(frase).split(/\s+/).filter(Boolean);
  if (!objetivo.length) return null;
  const palabras = subtitulos.map((c) => normalizar(c.text));
  for (let i = 0; i < palabras.length; i++) {
    if (subtitulos[i].startMs < desdeMs) continue;
    let ok = true;
    for (let j = 0; j < objetivo.length; j++) {
      if (palabras[i + j] !== objetivo[j]) {
        ok = false;
        break;
      }
    }
    if (ok) return subtitulos[i].startMs / 1000;
  }
  return null;
}

/** Resuelve un Momento a segundos absolutos. */
export function resolverMomento(
  m: Momento,
  subtitulos: Caption[] | null,
  base: number,
  desdeSeg = 0,
): number {
  if (typeof m === "number") return base + m;
  const t = buscarAncla(subtitulos, m.ancla, desdeSeg * 1000);
  if (t === null) {
    // Ancla no encontrada: se queda en el inicio de la escena y se avisa.
    console.warn(`[LF] Ancla no encontrada en los subtítulos: «${m.ancla}»`);
    return base + (m.ajuste ?? 0);
  }
  return t + (m.ajuste ?? 0);
}

export function resolverEscenas(config: ConfigVideo, duracionSeg: number, fps: number): EscenaResuelta[] {
  const escala = duracionSeg / 60;
  const inicios: number[] = [];
  let anterior = 0;
  config.escenas.forEach((e, i) => {
    let t: number;
    if (e.inicio === undefined) {
      t = i === 0 ? 0 : TIMELINE_BASE[e.seccion][0] * escala;
    } else {
      t = resolverMomento(e.inicio, config.subtitulos, 0, anterior);
    }
    // Nunca antes que la escena anterior ni más allá del final.
    t = Math.min(Math.max(t, i === 0 ? 0 : anterior + 0.3), duracionSeg - 0.5);
    inicios.push(i === 0 ? 0 : t);
    anterior = inicios[i];
  });
  const total = Math.round(duracionSeg * fps);
  return config.escenas.map((e, i) => ({
    ...e,
    indice: i,
    desde: Math.round(inicios[i] * fps),
    hasta: i + 1 < inicios.length ? Math.round(inicios[i + 1] * fps) : total,
  }));
}

/** Duración por defecto si no se puede leer el video: fin de la voz + 1,5 s. */
export function duracionDesdeSubtitulos(config: ConfigVideo): number | null {
  const ult = config.subtitulos?.at(-1);
  return ult ? ult.endMs / 1000 + 1.5 : null;
}
