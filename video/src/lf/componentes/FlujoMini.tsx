/**
 * Vista previa del flujo para el gancho: formulario → cinco nodos en fila,
 * que se encienden uno tras otro con un punto de datos que los recorre.
 */
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import type { Icono as NombreIcono } from "../tipos";
import { prog } from "../util";
import { Icono } from "./Icono";

export function FlujoMini({ nodos, ancho }: { nodos: { icono: NombreIcono; titulo: string }[]; ancho: number }) {
  const f = useCurrentFrame();
  const total = nodos.length + 1;
  const paso = 9;
  const inicio = 4;
  const tam = 92;
  const sep = (ancho - tam) / (total - 1);
  const todos: { icono: NombreIcono; titulo: string }[] = [{ icono: "formulario", titulo: "Formulario" }, ...nodos];
  const avance = interpolate(f, [inicio, inicio + paso * (total - 1)], [0, total - 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "relative", width: ancho, height: tam + 46 }}>
      <div style={{ position: "absolute", left: tam / 2, right: tam / 2, top: tam / 2 - 2, height: 4, background: "rgb(255 255 255 / 0.1)", borderRadius: 2 }} />
      <div style={{ position: "absolute", left: tam / 2, top: tam / 2 - 2, width: avance * sep, height: 4, background: `linear-gradient(90deg, ${COLOR.cian}, ${COLOR.violeta})`, borderRadius: 2, boxShadow: "0 0 12px rgb(0 194 255 / 0.6)" }} />
      <div style={{ position: "absolute", left: tam / 2 + avance * sep - 9, top: tam / 2 - 9, width: 18, height: 18, borderRadius: 99, background: COLOR.cian, boxShadow: "0 0 18px rgb(0 194 255 / 0.9)", opacity: avance < total - 1 ? 1 : 0 }} />
      {todos.map((n, i) => {
        const t = prog(f, inicio + i * paso - 2, 8, CURVA.impacto);
        const on = avance >= i - 0.05;
        return (
          <div key={i} style={{ position: "absolute", left: i * sep, top: 0, width: tam, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: tam,
                height: tam,
                borderRadius: 24,
                display: "grid",
                placeItems: "center",
                background: i === 0 ? "rgb(139 92 246 / 0.2)" : "rgb(17 23 36 / 0.95)",
                border: `2px solid ${on ? COLOR.cian : "rgb(255 255 255 / 0.12)"}`,
                boxShadow: on ? "0 0 22px rgb(0 194 255 / 0.35)" : undefined,
                color: on ? COLOR.cian : COLOR.apagado,
                transform: `scale(${0.85 + 0.15 * t})`,
                position: "relative",
              }}
            >
              <Icono nombre={n.icono} tam={44} />
              {i > 0 && <span style={{ position: "absolute", top: -9, right: -9, width: 28, height: 28, borderRadius: 99, display: "grid", placeItems: "center", background: on ? COLOR.cian : COLOR.superficie2, color: COLOR.base, fontFamily: FUENTE.display, fontWeight: 800, fontSize: 16 }}>{i}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
