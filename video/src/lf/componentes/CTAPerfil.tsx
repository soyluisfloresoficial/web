/**
 * Cierre «enlace en mi perfil»: etiqueta del recurso + tarjeta de perfil
 * genérica (monograma, @usuario, bio) con el botón del enlace, que se pulsa.
 * No imita la interfaz de ninguna red concreta.
 */
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE, ZONA_SEGURA } from "../marca";
import type { ConfigCTA } from "../tipos";
import { prog } from "../util";

export function CTAPerfil({ cta, inicio, zona }: { cta: ConfigCTA; inicio: number; zona: { y: number; h: number } }) {
  const f = useCurrentFrame();
  const izq = ZONA_SEGURA.izquierda;
  const ancho = 1080 - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha;
  const t1 = prog(f, inicio, 10, CURVA.impacto);
  const t2 = prog(f, inicio + 8, 12, CURVA.impacto);
  const toque = prog(f, inicio + 34, 8, CURVA.impacto);
  const cursor = prog(f, inicio + 20, 14, CURVA.marca);
  return (
    <div style={{ position: "absolute", left: izq, width: ancho, top: zona.y, height: zona.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: t1, transform: `scale(${0.88 + 0.12 * t1})` }}>
        <span style={{ padding: "6px 18px", borderRadius: 999, border: `1.5px solid ${COLOR.cta}`, color: COLOR.cta, fontFamily: FUENTE.display, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em" }}>{cta.etiquetaRecurso ?? "PLANTILLA GRATIS"}</span>
        <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 46, color: COLOR.tinta }}>{cta.accion}</span>
      </div>
      <div style={{ position: "relative", width: ancho - 80, borderRadius: 24, background: COLOR.superficie, border: "1.5px solid rgb(255 255 255 / 0.1)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, opacity: t2, transform: `translateY(${(1 - t2) * 20}px)`, boxSizing: "border-box" }}>
        <Img src={staticFile("logo/monograma-80.webp")} style={{ width: 70, height: 70, borderRadius: 99, boxShadow: `0 0 0 3px ${COLOR.cian}` }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 26, color: COLOR.tinta }}>{cta.usuario}</div>
          <div style={{ fontFamily: FUENTE.texto, fontSize: 19, color: COLOR.suave, marginTop: 2 }}>IA y automatización para negocios</div>
          <div
            style={{
              marginTop: 8,
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 10,
              background: toque > 0 ? COLOR.cta : "rgb(0 194 255 / 0.14)",
              color: toque > 0 ? COLOR.base : COLOR.cian,
              fontFamily: FUENTE.texto,
              fontWeight: 600,
              fontSize: 20,
              transform: `scale(${interpolate(toque, [0, 0.5, 1], [1, 0.92, 1])})`,
            }}
          >
            🔗 {cta.web}
          </div>
        </div>
        {/* Cursor que pulsa el enlace */}
        <div style={{ position: "absolute", left: 120 + (1 - cursor) * 360, top: 96 + (1 - cursor) * 80, width: 30, height: 30, borderRadius: 99, background: "rgb(255 255 255 / 0.85)", boxShadow: "0 4px 12px rgb(0 0 0 / 0.5)", opacity: cursor * (1 - prog(f, inicio + 50, 10)), transform: `scale(${1 - 0.25 * toque})` }} />
      </div>
      <div style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 24, color: COLOR.tinta, textAlign: "center", opacity: t2 }}>{cta.recurso}</div>
    </div>
  );
}
