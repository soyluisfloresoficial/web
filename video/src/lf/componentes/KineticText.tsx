/**
 * Tipografía cinética. Cada palabra entra con desenfoque → nitidez, sube y
 * escala. Con `sincronizar`, cada palabra aparece justo cuando la voz la dice
 * (la busca en los subtítulos); si no, entran escalonadas.
 * Las palabras de `destacar` llevan el degradado cian → violeta.
 */
import type { Caption } from "@remotion/captions";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE } from "../marca";
import { normalizar } from "../tiempo";
import { palabras, prog } from "../util";

export function KineticText({
  texto,
  destacar = [],
  sincronizar = false,
  subtitulos,
  inicioEscenaFrame,
  tamano = 92,
  ancho = 900,
  alineacion = "center",
  retraso = 4,
  colorDestacado = "degradado",
}: {
  colorDestacado?: "degradado" | "cian";
  texto: string;
  destacar?: string[];
  sincronizar?: boolean;
  subtitulos?: Caption[] | null;
  /** Fotograma absoluto donde empieza la escena (para sincronizar con la voz). */
  inicioEscenaFrame: number;
  tamano?: number;
  ancho?: number;
  alineacion?: "center" | "left";
  /** Fotogramas antes de la primera palabra cuando no se sincroniza. */
  retraso?: number;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lista = palabras(texto);
  const marcadas = new Set(destacar.map(normalizar));

  // Fotograma (relativo a la escena) en que aparece cada palabra.
  const tiempos: number[] = [];
  let cursorMs = (inicioEscenaFrame / fps) * 1000 - 400;
  lista.forEach((p, i) => {
    let t = retraso + i * 3;
    if (sincronizar && subtitulos?.length) {
      const objetivo = normalizar(p);
      const hit = subtitulos.find((c) => c.startMs >= cursorMs && normalizar(c.text) === objetivo);
      if (hit) {
        cursorMs = hit.startMs;
        t = Math.round((hit.startMs / 1000) * fps) - inicioEscenaFrame;
      } else if (i > 0) {
        t = tiempos[i - 1] + 3;
      }
    }
    tiempos.push(Math.max(0, t));
  });

  return (
    <div
      style={{
        width: ancho,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: alineacion === "center" ? "center" : "flex-start",
        columnGap: tamano * 0.26,
        rowGap: tamano * 0.04,
        fontFamily: FUENTE.display,
        fontWeight: 800,
        fontSize: tamano,
        lineHeight: 1.08,
        letterSpacing: "-0.025em",
        color: COLOR.tinta,
        textAlign: alineacion,
      }}
    >
      {lista.map((p, i) => {
        const t = prog(f, tiempos[i], 9, CURVA.impacto);
        const resaltada = marcadas.has(normalizar(p));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: t,
              transform: `translateY(${(1 - t) * 38}px) scale(${0.9 + 0.1 * t})`,
              filter: t < 1 ? `blur(${(1 - t) * 14}px)` : undefined,
              ...(resaltada && colorDestacado === "cian"
                ? { color: COLOR.cian, textShadow: "0 0 30px rgb(0 194 255 / 0.55), 0 6px 30px rgb(0 0 0 / 0.55)" }
                : resaltada
                ? {
                    backgroundImage: DEGRADADO,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    filter: `drop-shadow(0 0 24px rgb(0 194 255 / 0.35))${t < 1 ? ` blur(${(1 - t) * 14}px)` : ""}`,
                  }
                : { textShadow: "0 6px 30px rgb(0 0 0 / 0.55)" }),
            }}
          >
            {p}
          </span>
        );
      })}
    </div>
  );
}
