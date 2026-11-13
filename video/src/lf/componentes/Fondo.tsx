import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR } from "../marca";

/** Fondo de marca: base oscura, dos brillos (cian y violeta) y rejilla fina. */
export function Fondo() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: COLOR.base, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          left: -620 + Math.sin(f / 80) * 70,
          top: -520 + Math.cos(f / 95) * 50,
          background: "radial-gradient(circle, rgb(0 194 255 / 0.20), transparent 62%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          right: -650 + Math.cos(f / 85) * 70,
          bottom: -420 + Math.sin(f / 70) * 50,
          background: "radial-gradient(circle, rgb(139 92 246 / 0.22), transparent 62%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          backgroundPosition: `0px ${f * 0.4}px`,
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
}
