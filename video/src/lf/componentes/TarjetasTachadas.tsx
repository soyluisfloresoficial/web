/**
 * «No es esto»: publicaciones genéricas (sin marcas ni apps reales) que entran
 * inclinadas y se tachan con una línea roja y una etiqueta.
 */
import { useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE } from "../marca";
import { prog } from "../util";

export function TarjetasTachadas({ titulos, etiqueta, tachar, ancho }: { titulos: string[]; etiqueta: string; tachar: number; ancho: number }) {
  const f = useCurrentFrame();
  const t = prog(f, tachar, 12, CURVA.impacto);
  const e = prog(f, tachar + 8, 10, CURVA.impacto);
  const w = 290;
  return (
    <div style={{ position: "relative", width: ancho, height: 560 }}>
      {titulos.map((tt, i) => {
        const llega = prog(f, 2 + i * 5, 12, CURVA.impacto);
        const rot = [-8, 2, 9][i % 3];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ancho / 2 - w / 2 + (i - 1) * 250,
              top: 60 + (i % 2) * 40,
              width: w,
              height: w * 1.25,
              borderRadius: 24,
              background: [DEGRADADO, `linear-gradient(160deg, #FFB86B, #FF5C7A)`, `linear-gradient(160deg, #6EE7B7, #3B82F6)`][i % 3],
              boxShadow: "0 30px 60px rgb(0 0 0 / 0.5)",
              display: "flex",
              alignItems: "flex-end",
              padding: 24,
              boxSizing: "border-box",
              opacity: llega * (1 - 0.45 * t),
              transform: `translateY(${(1 - llega) * 60}px) rotate(${rot}deg)`,
              filter: t > 0 ? `grayscale(${t})` : undefined,
            }}
          >
            <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 34, lineHeight: 1.1, color: "#fff", textShadow: "0 2px 12px rgb(0 0 0 / 0.35)" }}>{tt}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 40, top: 270, height: 24, width: `${t * (ancho - 80)}px`, background: COLOR.peligro, borderRadius: 12, transform: "rotate(-6deg)", transformOrigin: "left center", boxShadow: "0 0 30px rgb(255 92 122 / 0.6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", opacity: e, transform: `scale(${0.85 + 0.15 * e})` }}>
        <span style={{ padding: "10px 28px", borderRadius: 14, background: COLOR.peligro, color: "#fff", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 40 }}>{etiqueta}</span>
      </div>
    </div>
  );
}
