/**
 * Geometría de cada disposición del avatar y zonas que quedan libres para el
 * contenido y los subtítulos. Todo dentro de la zona segura (marca.ts).
 *
 * Coordenadas sobre 1080 × 1920. `fx`/`fy` es el punto del video del avatar
 * que queda centrado (la cara está hacia el 27 % de la altura en HeyGen).
 */
import type { Disposicion } from "./tipos";

export type Caja = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Radio de las esquinas de arriba y de abajo. */
  rArriba: number;
  rAbajo: number;
  /** Zoom sobre el video y punto de foco. */
  z: number;
  fx: number;
  fy: number;
  opacidad: number;
  /** Anillo de luz alrededor (0–1). */
  anillo: number;
};

export const CAJAS: Record<Disposicion, Caja> = {
  completo: { x: 0, y: 0, w: 1080, h: 1920, rArriba: 0, rAbajo: 0, z: 1, fx: 0.5, fy: 0.5, opacidad: 1, anillo: 0 },
  superior: { x: 0, y: 0, w: 1080, h: 880, rArriba: 0, rAbajo: 56, z: 1, fx: 0.5, fy: 0.28, opacidad: 1, anillo: 0.6 },
  burbuja: { x: 72, y: 250, w: 250, h: 250, rArriba: 125, rAbajo: 125, z: 2.3, fx: 0.5, fy: 0.27, opacidad: 1, anillo: 1 },
  oculto: { x: 135, y: 313, w: 124, h: 124, rArriba: 62, rAbajo: 62, z: 2.3, fx: 0.5, fy: 0.27, opacidad: 0, anillo: 0 },
};

/** Zona libre para el contenido en cada disposición: [y inicial, alto]. */
export const ESCENARIO: Record<Disposicion, { y: number; h: number }> = {
  completo: { y: 960, h: 340 },
  superior: { y: 920, h: 560 },
  burbuja: { y: 540, h: 760 },
  oculto: { y: 300, h: 1000 },
};

/** Centro vertical de los subtítulos en cada disposición. */
export const Y_SUBTITULOS: Record<Disposicion, number> = {
  completo: 1390,
  superior: 826,
  burbuja: 1395,
  oculto: 1395,
};

export function mezclarCaja(a: Caja, b: Caja, t: number): Caja {
  const m = (x: number, y: number) => x + (y - x) * t;
  return {
    x: m(a.x, b.x),
    y: m(a.y, b.y),
    w: m(a.w, b.w),
    h: m(a.h, b.h),
    rArriba: m(a.rArriba, b.rArriba),
    rAbajo: m(a.rAbajo, b.rAbajo),
    z: m(a.z, b.z),
    fx: m(a.fx, b.fx),
    fy: m(a.fy, b.fy),
    opacidad: m(a.opacidad, b.opacidad),
    anillo: m(a.anillo, b.anillo),
  };
}
