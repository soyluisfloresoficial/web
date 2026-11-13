/** Rótulo discreto de presentación bajo el avatar: nombre, especialidad y web. */
import { useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import { prog } from "../util";

export function Presentacion({ nombre, linea, web }: { nombre: string; linea: string; web: string }) {
  const f = useCurrentFrame();
  const a = prog(f, 10, 16, CURVA.impacto);
  const b = prog(f, 18, 16, CURVA.impacto);
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 20 }}>
      <div style={{ width: 6, borderRadius: 3, background: "linear-gradient(180deg, #00C2FF, #8B5CF6)", transform: `scaleY(${a})`, transformOrigin: "top" }} />
      <div>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 50, letterSpacing: "0.04em", color: COLOR.tinta, opacity: a, transform: `translateX(${(1 - a) * -30}px)` }}>{nombre}</div>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 700, fontSize: 25, letterSpacing: "0.14em", color: COLOR.cian, marginTop: 4, opacity: b }}>{linea}</div>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 500, fontSize: 23, color: COLOR.suave, marginTop: 4, opacity: b }}>{web}</div>
      </div>
    </div>
  );
}
