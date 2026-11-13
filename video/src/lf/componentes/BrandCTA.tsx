/**
 * Cierre de marca: logo, «Comenta PALABRA», una caja de comentario que se
 * escribe sola, el recurso que se recibe y el usuario para seguir.
 * El avatar queda en la burbuja de arriba a la izquierda.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE, ZONA_SEGURA } from "../marca";
import type { ConfigCTA } from "../tipos";
import { prog } from "../util";

export function BrandCTA({ cta }: { cta: ConfigCTA }) {
  const f = useCurrentFrame();
  const a = prog(f, 4, 14, CURVA.impacto);
  const b = prog(f, 12, 14, CURVA.impacto);
  const c = prog(f, 30, 14, CURVA.impacto);
  const d = prog(f, 44, 14, CURVA.impacto);
  const letras = Math.max(0, Math.min(cta.palabra.length, Math.floor((f - 22) / 3)));
  const enviado = f >= 22 + cta.palabra.length * 3 + 8;
  const latido = 1 + 0.04 * Math.sin(f / 5);
  const izq = ZONA_SEGURA.izquierda;
  const ancho = 1080 - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Seguir: junto a la burbuja del avatar */}
      <div style={{ position: "absolute", left: 360, top: 300, opacity: a, transform: `translateX(${(1 - a) * 40}px)` }}>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 24, letterSpacing: "0.16em", color: COLOR.suave }}>SÍGUEME</div>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 44, color: COLOR.tinta, marginTop: 4 }}>{cta.usuario}</div>
      </div>

      {/* Acción principal */}
      <div style={{ position: "absolute", left: izq, width: ancho, top: 600, textAlign: "center", opacity: b, transform: `scale(${0.85 + 0.15 * b})` }}>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 92, lineHeight: 1, color: COLOR.tinta, letterSpacing: "-0.03em" }}>{cta.accion}</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 18,
            padding: "10px 40px",
            borderRadius: 24,
            background: COLOR.cta,
            color: COLOR.base,
            fontFamily: FUENTE.display,
            fontWeight: 800,
            fontSize: 120,
            letterSpacing: "0.02em",
            transform: `scale(${latido})`,
            boxShadow: "0 0 60px rgb(0 255 179 / 0.45)",
          }}
        >
          {cta.palabra}
        </div>
      </div>

      {/* Caja de comentario que se escribe sola */}
      <div
        style={{
          position: "absolute",
          left: izq + 20,
          width: ancho - 40,
          top: 960,
          height: 92,
          borderRadius: 46,
          display: "flex",
          alignItems: "center",
          padding: "0 14px 0 34px",
          boxSizing: "border-box",
          background: COLOR.superficie,
          border: `2px solid ${enviado ? COLOR.cta : COLOR.linea}`,
          opacity: c,
          transform: `translateY(${(1 - c) * 40}px)`,
        }}
      >
        <span style={{ flex: 1, fontFamily: FUENTE.texto, fontWeight: 500, fontSize: 32, color: letras ? COLOR.tinta : COLOR.apagado }}>
          {letras ? cta.palabra.slice(0, letras) : "Añade un comentario…"}
          {!enviado && f % 20 < 10 && <span style={{ color: COLOR.cta }}>|</span>}
        </span>
        <span
          style={{
            padding: "14px 26px",
            borderRadius: 34,
            background: enviado ? COLOR.cta : COLOR.superficie2,
            color: enviado ? COLOR.base : COLOR.suave,
            fontFamily: FUENTE.display,
            fontWeight: 800,
            fontSize: 26,
          }}
        >
          {enviado ? "Enviado ✓" : "Publicar"}
        </span>
      </div>

      {/* Recurso */}
      <div style={{ position: "absolute", left: izq, width: ancho, top: 1100, textAlign: "center", opacity: d }}>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 24, letterSpacing: "0.14em", color: COLOR.cian }}>Y TE ENVÍO</div>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: COLOR.tinta, marginTop: 8 }}>{cta.recurso}</div>
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1350, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: d }}>
        <Img src={staticFile("logo/monograma-80.webp")} style={{ height: 56, width: "auto" }} />
        <Img src={staticFile("logo/nombre-360.webp")} style={{ height: 44, width: "auto" }} />
      </div>
    </div>
  );
}
