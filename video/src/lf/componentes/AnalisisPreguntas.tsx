/**
 * DEMO «20 preguntas de clientes → la IA las agrupa» (datos de ejemplo).
 * Fases (fotogramas relativos a la escena), cada una cuando la voz la nombra:
 * llegan las preguntas · se escribe la petición · se agrupan por temas ·
 * se marcan las repetidas · aparece qué información falta.
 * Interfaz genérica de chat (no imita ninguna app concreta).
 */
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE } from "../marca";
import { prog } from "../util";

export type FasesAnalisis = { preguntas: number; peticion: number; agrupar: number; repetidas: number; falta: number };

export function AnalisisPreguntas({
  preguntas,
  peticion,
  grupos,
  falta,
  fases,
  ancho,
  alto,
  colores,
}: {
  /** Un color por grupo (temas y notas agrupadas). Si falta, cian. */
  colores?: string[];
  preguntas: string[];
  peticion: string;
  grupos: { tema: string; indices: number[]; repetida?: number; total: number }[];
  falta: string;
  fases: FasesAnalisis;
  ancho: number;
  alto: number;
}) {
  const f = useCurrentFrame();
  const entrada = prog(f, 0, 12, CURVA.impacto);
  const agrupado = prog(f, fases.agrupar, 18, CURVA.marca);
  const letras = Math.floor(interpolate(f, [fases.peticion, fases.peticion + 28], [0, peticion.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const visibles = preguntas.slice(0, 9);
  const altoPeticion = 108;
  const top = 70 + altoPeticion + 22;
  const colW = (ancho - 48 - 2 * 16) / 3;
  const zona = alto - top - 150;

  // Posición de cada chip: suelto (lista en dos columnas) → dentro de su grupo.
  const posicion = (i: number) => {
    const suelta = { x: 24 + (i % 2) * ((ancho - 48) / 2 + 8), y: top + Math.floor(i / 2) * 64 };
    const g = grupos.findIndex((gr) => gr.indices.includes(i));
    if (g < 0) return { ...suelta, w: (ancho - 64) / 2, dentro: false };
    const k = grupos[g].indices.indexOf(i);
    const agrup = { x: 24 + g * (colW + 16) + 10, y: top + 64 + k * 60 };
    return {
      x: suelta.x + (agrup.x - suelta.x) * agrupado,
      y: suelta.y + (agrup.y - suelta.y) * agrupado,
      w: (ancho - 64) / 2 + (colW - 20 - (ancho - 64) / 2) * agrupado,
      dentro: true,
    };
  };

  return (
    <div
      style={{
        position: "relative",
        width: ancho,
        height: alto,
        borderRadius: 30,
        overflow: "hidden",
        background: `linear-gradient(165deg, #0A2540 0%, ${COLOR.base2} 70%)`,
        border: "1.5px solid rgb(0 194 255 / 0.3)",
        boxShadow: "0 40px 80px rgb(0 0 0 / 0.55)",
        opacity: entrada,
        transform: `translateY(${(1 - entrada) * 30}px)`,
        fontFamily: FUENTE.texto,
      }}
    >
      {/* Cabecera */}
      <div style={{ height: 58, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", borderBottom: "1px solid rgb(255 255 255 / 0.08)" }}>
        <span style={{ width: 30, height: 30, borderRadius: 99, background: DEGRADADO }} />
        <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 26, color: COLOR.tinta }}>Chat de IA</span>
        <span style={{ fontSize: 20, color: COLOR.suave }}>· 20 preguntas de ejemplo</span>
        <span style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 8, background: DEGRADADO, color: "#fff", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em" }}>DEMO</span>
      </div>

      {/* Petición */}
      <div style={{ position: "absolute", left: 22, right: 22, top: 74, minHeight: altoPeticion - 12, borderRadius: 18, padding: "14px 18px", background: "rgb(0 194 255 / 0.10)", border: `1.5px solid ${f >= fases.peticion ? COLOR.cian : "rgb(255 255 255 / 0.1)"}`, boxSizing: "border-box" }}>
        <div style={{ fontSize: 17, color: COLOR.cian, fontWeight: 600, marginBottom: 4 }}>Tu petición</div>
        <div style={{ fontSize: 23, lineHeight: 1.3, color: letras ? COLOR.tinta : COLOR.apagado, fontWeight: 600 }}>
          {letras ? peticion.slice(0, letras) : "Escribe tu petición…"}
          {f >= fases.peticion && letras < peticion.length && <span style={{ color: COLOR.cian }}>|</span>}
        </div>
      </div>

      {/* Cabeceras de grupo */}
      {grupos.map((g, k) => {
        const t = prog(f, fases.agrupar + 4 + k * 4, 12, CURVA.impacto);
        return (
          <div key={k} style={{ position: "absolute", left: 24 + k * (colW + 16), top, width: colW, height: zona, borderRadius: 18, border: `2px solid ${colores?.[k] ?? COLOR.cian}`, background: `${colores?.[k] ?? COLOR.cian}1A`, opacity: t, boxShadow: colores ? `0 0 30px ${colores[k]}33` : undefined }}>
            <div style={{ padding: "12px 14px", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 25, color: colores?.[k] ?? COLOR.cian, display: "flex", justifyContent: "space-between" }}>
              {g.tema}
              <span style={{ color: COLOR.suave, fontSize: 21 }}>{g.total}</span>
            </div>
          </div>
        );
      })}

      {/* Preguntas */}
      {visibles.map((p, i) => {
        const llega = prog(f, fases.preguntas + i * 3, 10, CURVA.impacto);
        const pos = posicion(i);
        const esRepetida = grupos.some((g) => g.repetida === i);
        const gi = grupos.findIndex((g) => g.indices.includes(i));
        const tinte = colores && gi >= 0 ? colores[gi] : null;
        const rep = prog(f, fases.repetidas, 10, CURVA.impacto);
        const apaga = !pos.dentro ? 1 - agrupado * 0.85 : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: pos.w,
              height: 52,
              borderRadius: 12,
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              boxSizing: "border-box",
              background: esRepetida && rep > 0 ? "rgb(255 92 122 / 0.22)" : tinte && agrupado > 0.5 ? `${tinte}2E` : "rgb(255 255 255 / 0.08)",
              border: `1px solid ${esRepetida && rep > 0 ? COLOR.peligro : "rgb(255 255 255 / 0.08)"}`,
              fontSize: 19,
              color: COLOR.tinta,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              opacity: llega * apaga,
              transform: `translateY(${(1 - llega) * 20}px)`,
            }}
          >
            {p}
            {esRepetida && rep > 0 && (
              <span style={{ position: "absolute", right: 6, top: 6, padding: "2px 8px", borderRadius: 8, background: COLOR.peligro, color: "#fff", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 15, transform: `scale(${rep})` }}>×5</span>
            )}
          </div>
        );
      })}
      {/* «+11 más» */}
      <div style={{ position: "absolute", left: 24, top: top + 5 * 64, fontSize: 20, color: COLOR.suave, opacity: prog(f, fases.preguntas + 30, 10) * (1 - agrupado) }}>+ 11 preguntas más</div>

      {/* Lo que falta */}
      {(() => {
        const t = prog(f, fases.falta, 12, CURVA.impacto);
        return (
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, padding: "16px 20px", borderRadius: 18, background: "rgb(0 255 179 / 0.08)", border: `1.5px solid ${COLOR.cian}`, opacity: t, transform: `translateY(${(1 - t) * 20}px)` }}>
            <div style={{ fontSize: 17, color: COLOR.cian, fontWeight: 600, letterSpacing: "0.12em" }}>INFORMACIÓN QUE FALTA</div>
            <div style={{ fontSize: 24, color: COLOR.tinta, fontWeight: 600, marginTop: 4 }}>{falta}</div>
          </div>
        );
      })()}
    </div>
  );
}
