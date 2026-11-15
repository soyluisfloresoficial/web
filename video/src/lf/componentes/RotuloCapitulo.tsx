/**
 * Rótulo de capítulo de marca (pantalla completa). Un barrido de luz cian →
 * violeta abre el capítulo; entra el número grande con el degradado de marca,
 * una línea vertical y el título, que se enciende palabra a palabra con la voz.
 * Va a la altura del pecho para no tapar la cara.
 */
import type { Caption } from "@remotion/captions";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE, ZONA_SEGURA } from "../marca";
import { prog } from "../util";
import { KineticText } from "./KineticText";

export function RotuloCapitulo({
  numero,
  total,
  texto,
  destacar,
  subtitulos,
  inicioEscenaFrame,
  y = 1150,
}: {
  numero: number;
  total: number;
  texto: string;
  destacar?: string[];
  subtitulos: Caption[] | null;
  inicioEscenaFrame: number;
  y?: number;
}) {
  const f = useCurrentFrame();
  const barrido = prog(f, 0, 12, CURVA.suave);
  const num = prog(f, 2, 14, CURVA.impacto);
  const linea = prog(f, 6, 12, CURVA.impacto);
  const ancho = 1080 - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha;
  const nn = String(numero).padStart(2, "0");
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Barrido de luz de apertura. */}
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          width: 520,
          left: -700 + barrido * 2400,
          transform: "skewX(-18deg)",
          background: "linear-gradient(90deg, transparent, rgb(0 194 255 / 0.32), rgb(139 92 246 / 0.32), transparent)",
          mixBlendMode: "screen",
          opacity: barrido < 1 ? 1 : 0,
        }}
      />
      {/* Halo oscuro para leer sobre la sudadera. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y - 90,
          height: 460,
          background: "radial-gradient(ellipse 70% 55% at 45% 50%, rgb(7 9 13 / 0.72) 0%, rgb(7 9 13 / 0.35) 60%, transparent 100%)",
          opacity: num,
        }}
      />
      <div style={{ position: "absolute", left: ZONA_SEGURA.izquierda, width: ancho, top: y, display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", flexShrink: 0, opacity: num, transform: `translateY(${(1 - num) * 50}px) scale(${1.25 - 0.25 * num})`, transformOrigin: "left center" }}>
          <div
            style={{
              fontFamily: FUENTE.display,
              fontWeight: 800,
              fontSize: 220,
              lineHeight: 0.9,
              letterSpacing: "-0.06em",
              backgroundImage: DEGRADADO,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 0 34px rgb(0 194 255 / 0.45))",
            }}
          >
            {nn}
          </div>
          <div style={{ fontFamily: FUENTE.display, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: COLOR.suave, marginTop: 6, textAlign: "center" }}>
            ERROR {nn}/{String(total).padStart(2, "0")}
          </div>
        </div>
        <div style={{ width: 6, alignSelf: "stretch", borderRadius: 3, background: "linear-gradient(180deg, #00C2FF, #8B5CF6)", transform: `scaleY(${linea})`, transformOrigin: "top", boxShadow: "0 0 18px rgb(0 194 255 / 0.5)" }} />
        <KineticText
          texto={texto}
          destacar={destacar}
          sincronizar
          subtitulos={subtitulos}
          inicioEscenaFrame={inicioEscenaFrame}
          tamano={68}
          ancho={ancho - 260}
          alineacion="left"
        />
      </div>
    </AbsoluteFill>
  );
}
