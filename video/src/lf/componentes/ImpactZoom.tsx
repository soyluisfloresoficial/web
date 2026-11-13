import type { ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CURVA } from "../marca";

export type GolpeZoom = { frame: number; escala: number; duracion: number };

/**
 * Factor de zoom en un fotograma: entra rápido (6 fotogramas, curva de
 * impacto), se mantiene y vuelve suave. Varios golpes no se suman: gana el mayor.
 */
export function factorZoom(frame: number, golpes: GolpeZoom[]): number {
  let z = 1;
  for (const g of golpes) {
    const entra = 6;
    const sale = Math.min(14, Math.max(6, Math.round(g.duracion * 0.4)));
    const fin = g.frame + g.duracion;
    if (frame < g.frame || frame > fin) continue;
    const subida = interpolate(frame, [g.frame, g.frame + entra], [0, 1], { extrapolateRight: "clamp", easing: CURVA.impacto });
    const bajada = interpolate(frame, [fin - sale, fin], [1, 0], { extrapolateLeft: "clamp", easing: CURVA.suave });
    z = Math.max(z, 1 + (g.escala - 1) * Math.min(subida, bajada));
  }
  return z;
}

/** Envoltorio genérico: aplica los golpes de zoom a lo que contenga. */
export function ImpactZoom({ golpes, origen = "50% 40%", children }: { golpes: GolpeZoom[]; origen?: string; children: ReactNode }) {
  const f = useCurrentFrame();
  const z = factorZoom(f, golpes);
  return <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: origen }}>{children}</div>;
}
