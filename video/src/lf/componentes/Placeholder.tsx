import type { CSSProperties } from "react";
import { COLOR, FUENTE } from "../marca";

/**
 * Hueco visible para un recurso que falta. Rayado y con la palabra
 * PENDIENTE para que nunca se publique por error.
 */
export function Placeholder({ texto, estilo }: { texto: string; estilo?: CSSProperties }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        textAlign: "center",
        padding: 32,
        background: `repeating-linear-gradient(-45deg, ${COLOR.superficie} 0 22px, ${COLOR.superficie2} 22px 44px)`,
        border: `3px dashed ${COLOR.cta}`,
        color: COLOR.tinta,
        fontFamily: FUENTE.display,
        boxSizing: "border-box",
        ...estilo,
      }}
    >
      <span style={{ fontWeight: 800, fontSize: 30, letterSpacing: "0.18em", color: COLOR.cta }}>PENDIENTE</span>
      <span style={{ fontWeight: 700, fontSize: 30, lineHeight: 1.25, maxWidth: 700 }}>{texto}</span>
    </div>
  );
}
