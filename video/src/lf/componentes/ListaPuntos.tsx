/**
 * Lista de puntos que entran uno a uno, cada uno cuando la voz lo nombra
 * (fotograma relativo a la escena), con icono y línea de luz a la izquierda.
 */
import { useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import type { Icono as NombreIcono } from "../tipos";
import { prog } from "../util";
import { Icono } from "./Icono";

export function ListaPuntos({ items, ancho, alto }: { items: { texto: string; icono: NombreIcono; frame: number }[]; ancho: number; alto: number }) {
  const f = useCurrentFrame();
  const n = Math.max(1, items.length);
  const altoItem = Math.min(104, Math.floor((alto - (n - 1) * 14) / n));
  return (
    <div style={{ width: ancho, height: alto, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
      {items.map((it, i) => {
        const t = prog(f, it.frame, 12, CURVA.impacto);
        const activo = i === items.filter((x) => f >= x.frame).length - 1;
        return (
          <div
            key={i}
            style={{
              height: altoItem,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "0 26px 0 14px",
              borderRadius: 24,
              background: "linear-gradient(90deg, rgb(17 23 36 / 0.95), rgb(24 32 50 / 0.85))",
              border: `1.5px solid rgb(0 194 255 / ${activo ? 0.8 : 0.25})`,
              boxShadow: activo ? "0 0 36px rgb(0 194 255 / 0.25)" : "0 16px 40px rgb(0 0 0 / 0.4)",
              opacity: t,
              transform: `translateX(${(1 - t) * -90}px)`,
            }}
          >
            <div style={{ width: altoItem - 26, height: altoItem - 26, borderRadius: 18, display: "grid", placeItems: "center", background: "rgb(0 194 255 / 0.14)", color: COLOR.cian }}>
              <Icono nombre={it.icono} tam={Math.round((altoItem - 26) * 0.55)} />
            </div>
            <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: Math.min(40, altoItem * 0.42), color: COLOR.tinta, letterSpacing: "-0.01em" }}>{it.texto}</span>
          </div>
        );
      })}
    </div>
  );
}
