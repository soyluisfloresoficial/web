/** Rótulo discreto de presentación bajo el avatar: nombre, especialidad y web. */
import { useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import { prog } from "../util";

export function Presentacion({ nombre, linea, web, escala = 1 }: { nombre: string; linea: string; web: string; escala?: number }) {
  const f = useCurrentFrame();
  const a = prog(f, 10, 16, CURVA.impacto);
  const b = prog(f, 18, 16, CURVA.impacto);
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 20 * escala, padding: `${16 * escala}px ${28 * escala}px ${16 * escala}px ${18 * escala}px`, borderRadius: 22 * escala, background: "rgb(7 9 13 / 0.68)", backdropFilter: "blur(10px)", border: "1px solid rgb(255 255 255 / 0.08)", opacity: a }}>
      <div style={{ width: 6 * escala, borderRadius: 3, background: "linear-gradient(180deg, #00C2FF, #8B5CF6)", transform: `scaleY(${a})`, transformOrigin: "top" }} />
      <div>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 50 * escala, letterSpacing: "0.04em", color: COLOR.tinta, opacity: a, transform: `translateX(${(1 - a) * -30}px)` }}>{nombre}</div>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 700, fontSize: 25 * escala, letterSpacing: "0.14em", color: COLOR.cian, marginTop: 4, opacity: b }}>{linea}</div>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 500, fontSize: 23 * escala, color: COLOR.suave, marginTop: 4, opacity: b }}>{web}</div>
      </div>
    </div>
  );
}
