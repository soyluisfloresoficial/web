/**
 * Revelación: empieza con restos desordenados (avisos borrosos, girados) y
 * una línea de luz cian barre la pantalla de arriba abajo; detrás queda una
 * composición limpia con rejilla y el titular. La cámara se acerca despacio.
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, ZONA_SEGURA } from "../marca";
import { prog } from "../util";
import { KineticText } from "./KineticText";

const RESTOS = [
  { x: 90, y: 330, r: -12 },
  { x: 560, y: 420, r: 9 },
  { x: 170, y: 760, r: 6 },
  { x: 600, y: 900, r: -8 },
  { x: 120, y: 1120, r: 11 },
  { x: 540, y: 1250, r: -5 },
];

export function Revelacion({ titular, destacar, inicioEscenaFrame }: { titular: string; destacar?: string[]; inicioEscenaFrame: number }) {
  const f = useCurrentFrame();
  const barrido = interpolate(f, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CURVA.suave });
  const yLinea = barrido * 1920;
  const camara = 1 + 0.05 * prog(f, 0, 90, CURVA.suave);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Antes: desorden */}
      <AbsoluteFill style={{ background: "#0b0d12", clipPath: `inset(${yLinea}px 0 0 0)` }}>
        {RESTOS.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: 380,
              height: 84,
              borderRadius: 22,
              background: "rgb(40 46 62 / 0.9)",
              border: "1px solid rgb(255 92 122 / 0.4)",
              transform: `rotate(${r.r + Math.sin((f + i * 7) / 6) * 2}deg)`,
              filter: "blur(1.5px)",
            }}
          />
        ))}
      </AbsoluteFill>
      {/* Después: limpio */}
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${1920 - yLinea}px 0)`, transform: `scale(${camara})` }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 45%, rgb(0 194 255 / 0.16), transparent 70%), ${COLOR.base}` }} />
        <AbsoluteFill
          style={{
            backgroundImage: "linear-gradient(rgb(0 194 255 / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(0 194 255 / 0.08) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
            maskImage: "radial-gradient(ellipse 70% 50% at 50% 45%, #000 20%, transparent 100%)",
          }}
        />
        <div style={{ position: "absolute", left: ZONA_SEGURA.izquierda, right: ZONA_SEGURA.derecha, top: 700, display: "flex", justifyContent: "center" }}>
          <KineticText texto={titular} destacar={destacar} colorDestacado="cian" inicioEscenaFrame={inicioEscenaFrame} retraso={14} tamano={96} ancho={858} />
        </div>
      </AbsoluteFill>
      {/* Línea de luz */}
      {barrido > 0 && barrido < 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: yLinea - 3, height: 6, background: COLOR.cian, boxShadow: "0 0 50px 14px rgb(0 194 255 / 0.6)" }} />
      )}
    </AbsoluteFill>
  );
}
