import { interpolate } from "remotion";
import { CURVA } from "./marca";

/** Progreso 0 → 1 entre dos fotogramas con la curva de marca. */
export function prog(frame: number, desde: number, dur = 18, curva = CURVA.marca): number {
  return interpolate(frame, [desde, desde + Math.max(1, dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: curva,
  });
}

/** Mezcla lineal. */
export const mezclar = (a: number, b: number, t: number) => a + (b - a) * t;

/** Separa un texto en palabras conservando la puntuación pegada. */
export const palabras = (t: string) => t.split(/\s+/).filter(Boolean);
