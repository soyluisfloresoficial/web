/**
 * Gancho como escena (skill reel-efectos-motion): set de marca, palabra clave
 * en 3D tipo cristal detrás de la cabeza y el presentador recortado delante,
 * algo más pequeño y anclado abajo con brillo cian en el borde.
 * Opcional: un tachado rojo que se dibuja sobre la palabra en un momento dado.
 * El video del presentador original sigue sonando (está oculto, no desmontado).
 */
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import { prog } from "../util";
import { SetMarca } from "./EfectosMotion";

export function GanchoGlass({
  palabra,
  recorte,
  tachar,
  nota,
  escala = 0.8,
  arriba = 200,
}: {
  palabra: string;
  /** WebM con alfa del presentador (herramientas/recorte.py), desde el segundo 0. */
  recorte: string;
  /** Fotograma (relativo a la escena) en que se tacha la palabra. */
  tachar?: number;
  /** Etiqueta que aparece con el tachado. */
  nota?: string;
  escala?: number;
  arriba?: number;
}) {
  const f = useCurrentFrame();
  const letras = palabra.split("");
  const brillo = interpolate(f % 75, [0, 75], [-40, 140]);
  const t = tachar === undefined ? 0 : prog(f, tachar, 10, CURVA.impacto);
  const n = tachar === undefined ? 0 : prog(f, tachar + 8, 10, CURVA.impacto);
  const capas = 11;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SetMarca />
      {/* Palabra en 3D (detrás del presentador) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: arriba, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", display: "flex" }}>
          {letras.map((l, i) => {
            const e = prog(f, 2 + i * 3, 12, CURVA.impacto);
            return (
              <div key={i} style={{ position: "relative", opacity: e, transform: `translateY(${(1 - e) * 80}px) scale(${0.7 + 0.3 * e})` }}>
                {Array.from({ length: capas }, (_, k) => (
                  <span
                    key={k}
                    style={{
                      position: k === capas - 1 ? "relative" : "absolute",
                      left: 0,
                      top: 0,
                      transform: `translate(${(capas - 1 - k) * 1.6}px, ${(capas - 1 - k) * 2.2}px)`,
                      fontFamily: FUENTE.display,
                      fontWeight: 800,
                      fontSize: 280,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: k === capas - 1 ? "transparent" : `rgb(${10 + k * 4} ${40 + k * 8} ${80 + k * 10})`,
                      backgroundImage: k === capas - 1 ? `linear-gradient(170deg, #FFFFFF 0%, #BFF0FF 35%, ${COLOR.cian} 62%, ${COLOR.violeta} 100%)` : undefined,
                      WebkitBackgroundClip: k === capas - 1 ? "text" : undefined,
                      backgroundClip: k === capas - 1 ? "text" : undefined,
                      filter: k === capas - 1 ? "drop-shadow(0 0 30px rgb(0 194 255 / 0.45))" : undefined,
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            );
          })}
          {/* Barrido de brillo */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${brillo - 12}%, rgb(255 255 255 / 0.35) ${brillo}%, transparent ${brillo + 12}%)`, mixBlendMode: "overlay", pointerEvents: "none" }} />
          {/* Tachado */}
          {tachar !== undefined && (
            <div style={{ position: "absolute", left: -20, top: "48%", height: 26, width: `${t * 110}%`, background: COLOR.peligro, borderRadius: 13, transform: "rotate(-8deg)", transformOrigin: "left center", boxShadow: "0 0 30px rgb(255 92 122 / 0.6)" }} />
          )}
        </div>
      </div>

      {/* Presentador recortado delante */}
      <AbsoluteFill style={{ transform: `scale(${escala})`, transformOrigin: "50% 100%", filter: "drop-shadow(0 0 2px rgb(0 194 255 / 0.9)) drop-shadow(0 0 18px rgb(0 194 255 / 0.35))" }}>
        <OffthreadVideo src={staticFile(recorte)} transparent muted style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      {/* Viñetas laterales para tapar los cortes del recorte reducido */}
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${COLOR.base} 0%, transparent 9%, transparent 91%, ${COLOR.base} 100%)`, pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 72%, rgb(7 9 13 / 0.85) 88%, ${COLOR.base} 100%)`, pointerEvents: "none" }} />

      {nota && tachar !== undefined && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: n, transform: `translateY(${(1 - n) * 20}px) rotate(-3deg)` }}>
          <span style={{ padding: "10px 26px", borderRadius: 14, background: COLOR.peligro, color: "#fff", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 40, letterSpacing: "0.02em", boxShadow: "0 12px 30px rgb(0 0 0 / 0.45)" }}>{nota}</span>
        </div>
      )}
    </AbsoluteFill>
  );
}
