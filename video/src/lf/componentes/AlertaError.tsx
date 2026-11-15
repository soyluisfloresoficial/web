/**
 * Alerta de error sincronizada con la voz: destello rojo sobre la franja de
 * gráficos, sacudida breve y un sello grande con el texto. Ilustrativa.
 */
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import { prog } from "../util";

export function AlertaError({ texto, frame, zona }: { texto: string; frame: number; zona: { y: number; h: number } }) {
  const f = useCurrentFrame();
  if (f < frame) return null;
  const t = f - frame;
  const destello = interpolate(t, [0, 3, 14], [0, 0.55, 0.18], { extrapolateRight: "clamp" });
  const sacudida = t < 10 ? Math.sin(t * 2.6) * (10 - t) * 1.6 : 0;
  const sello = prog(f, frame + 2, 8, CURVA.impacto);
  const pulso = 0.85 + 0.15 * Math.abs(Math.sin(t / 6));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: zona.y + zona.h + 40, zIndex: 30, pointerEvents: "none", transform: `translateX(${sacudida}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 60%, rgb(255 60 90 / ${destello}), transparent 75%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: zona.y + zona.h / 2 - 50, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 30px",
            borderRadius: 18,
            background: COLOR.peligro,
            color: "#fff",
            fontFamily: FUENTE.display,
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: "0.02em",
            boxShadow: `0 0 ${50 * pulso}px rgb(255 92 122 / 0.7), 0 20px 40px rgb(0 0 0 / 0.5)`,
            transform: `scale(${interpolate(sello, [0, 0.6, 1], [1.8, 0.92, 1])}) rotate(-3deg)`,
            opacity: sello,
          }}
        >
          <span style={{ fontSize: 48 }}>⚠</span>
          {texto}
        </div>
      </div>
    </div>
  );
}
