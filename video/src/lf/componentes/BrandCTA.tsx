/**
 * Cierre de marca en tres pasos, sincronizados con la voz:
 *  1. Seguir: el botón «Seguir» junto al avatar pasa a «Siguiendo ✓».
 *  2. Comentar: «Comenta PALABRA» y la caja de comentario se escribe sola.
 *  3. Recurso: entra la portada de lo que recibe, en 3D, con el logo.
 * El avatar queda en la burbuja de arriba a la izquierda.
 */
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE, ZONA_SEGURA } from "../marca";
import type { ConfigCTA } from "../tipos";
import { prog } from "../util";
import { Icono } from "./Icono";

export type MomentosCTA = { seguir: number; comentar: number; recurso: number };

export function BrandCTA({ cta, momentos }: { cta: ConfigCTA; momentos: MomentosCTA }) {
  const f = useCurrentFrame();
  const izq = ZONA_SEGURA.izquierda;
  const ancho = 1080 - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha;

  // 1. Seguir
  const perfil = prog(f, 2, 12, CURVA.impacto);
  const pulsado = prog(f, momentos.seguir + 10, 8, CURVA.impacto);
  const siguiendo = f >= momentos.seguir + 12;

  // 2. Comentar
  const titulo = prog(f, momentos.comentar - 4, 12, CURVA.impacto);
  const caja = prog(f, momentos.comentar + 4, 12, CURVA.impacto);
  const inicioTecleo = momentos.comentar + 10;
  const letras = Math.max(0, Math.min(cta.palabra.length, Math.floor((f - inicioTecleo) / 3)));
  const finTecleo = inicioTecleo + cta.palabra.length * 3;
  const enviado = f >= finTecleo + 6;
  const latido = 1 + 0.035 * Math.sin(f / 5);

  // 3. Recurso
  const portada = prog(f, momentos.recurso, 18, CURVA.impacto);
  const flota = Math.sin(f / 22) * 8;
  const brillo = ((f - momentos.recurso) * 2.2) % 260;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* 1 · Perfil y botón de seguir, junto a la burbuja */}
      <div style={{ position: "absolute", left: 352, top: 282, opacity: perfil, transform: `translateX(${(1 - perfil) * 40}px)` }}>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 36, color: COLOR.tinta, letterSpacing: "-0.01em" }}>{cta.usuario}</div>
        <div
          style={{
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 30px",
            borderRadius: 14,
            fontFamily: FUENTE.display,
            fontWeight: 800,
            fontSize: 28,
            background: siguiendo ? COLOR.superficie2 : DEGRADADO,
            color: siguiendo ? COLOR.tinta : COLOR.base,
            border: siguiendo ? `1.5px solid ${COLOR.linea}` : "1.5px solid transparent",
            transform: `scale(${interpolate(pulsado, [0, 0.5, 1], [1, 0.9, 1])})`,
          }}
        >
          {siguiendo ? (
            <>
              Siguiendo <Icono nombre="check" tam={26} grosor={2.6} color={COLOR.cta} />
            </>
          ) : (
            "Seguir"
          )}
        </div>
      </div>

      {/* 2 · Comenta PALABRA */}
      <div style={{ position: "absolute", left: izq, width: ancho, top: 560, textAlign: "center", opacity: titulo, transform: `translateY(${(1 - titulo) * 30}px)` }}>
        <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 84, color: COLOR.tinta, letterSpacing: "-0.03em", verticalAlign: "middle" }}>{cta.accion} </span>
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginLeft: 8,
            padding: "4px 28px",
            borderRadius: 20,
            background: COLOR.cta,
            color: COLOR.base,
            fontFamily: FUENTE.display,
            fontWeight: 800,
            fontSize: 92,
            transform: `scale(${latido}) rotate(-2deg)`,
            boxShadow: "0 0 50px rgb(0 255 179 / 0.5)",
          }}
        >
          {cta.palabra}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: izq + 30,
          width: ancho - 60,
          top: 720,
          height: 86,
          borderRadius: 43,
          display: "flex",
          alignItems: "center",
          padding: "0 12px 0 30px",
          boxSizing: "border-box",
          background: COLOR.superficie,
          border: `2px solid ${enviado ? COLOR.cta : COLOR.linea}`,
          opacity: caja,
          transform: `translateY(${(1 - caja) * 30}px)`,
          boxShadow: enviado ? "0 0 30px rgb(0 255 179 / 0.25)" : undefined,
        }}
      >
        <span style={{ flex: 1, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 30, color: letras ? COLOR.tinta : COLOR.apagado }}>
          {letras ? cta.palabra.slice(0, letras) : "Añade un comentario…"}
          {!enviado && f % 20 < 10 && <span style={{ color: COLOR.cta }}>|</span>}
        </span>
        <span style={{ padding: "12px 24px", borderRadius: 32, background: enviado ? COLOR.cta : COLOR.superficie2, color: enviado ? COLOR.base : COLOR.suave, fontFamily: FUENTE.display, fontWeight: 800, fontSize: 24 }}>
          {enviado ? "Enviado ✓" : "Publicar"}
        </span>
      </div>

      {/* 3 · Portada del recurso en 3D */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", perspective: 1600, opacity: portada }}>
        <div
          style={{
            width: 560,
            height: 470,
            borderRadius: 32,
            position: "relative",
            overflow: "hidden",
            padding: "34px 40px",
            boxSizing: "border-box",
            background: "linear-gradient(155deg, #0f1b2e 0%, #17123a 100%)",
            border: "1.5px solid rgb(0 194 255 / 0.45)",
            boxShadow: "0 50px 90px rgb(0 0 0 / 0.6), 0 0 60px rgb(139 92 246 / 0.25)",
            transform: `translateY(${(1 - portada) * 220 + flota}px) rotateX(${8 - 8 * portada + 6}deg) rotateY(${-14 + Math.sin(f / 40) * 3}deg) scale(${0.8 + 0.2 * portada})`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ padding: "6px 14px", borderRadius: 999, background: "rgb(0 255 179 / 0.14)", color: COLOR.cta, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 20, letterSpacing: "0.14em" }}>
              {cta.etiquetaRecurso ?? "GRATIS"}
            </span>
            <Img src={staticFile("logo/monograma-80.webp")} style={{ height: 40, width: "auto" }} />
          </div>
          {cta.numeroRecurso && (
            <div
              style={{
                fontFamily: FUENTE.display,
                fontWeight: 800,
                fontSize: 170,
                lineHeight: 0.95,
                marginTop: 18,
                backgroundImage: DEGRADADO,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                letterSpacing: "-0.05em",
              }}
            >
              {cta.numeroRecurso}
            </div>
          )}
          <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 40, lineHeight: 1.12, color: COLOR.tinta, marginTop: 10 }}>{cta.recurso}</div>
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <Img src={staticFile("logo/nombre-180.webp")} style={{ height: 22, width: "auto", opacity: 0.85 }} />
          </div>
          {/* Brillo que cruza la portada */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${brillo - 60}%, rgb(255 255 255 / 0.10) ${brillo - 45}%, transparent ${brillo - 30}%)` }} />
        </div>
      </div>
      {cta.entrega && (
        <div style={{ position: "absolute", left: izq, width: ancho, top: 1370, textAlign: "center", fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 26, color: COLOR.suave, opacity: prog(f, momentos.recurso + 14, 12) }}>
          {cta.entrega}
        </div>
      )}
    </div>
  );
}

/**
 * Cierre «escríbeme por privado»: texto grande con la palabra en verde, una
 * burbuja de mensaje que se escribe y se envía (✓✓), la nota y la marca.
 * Pensado con el avatar en la mitad superior (disposición «superior»).
 */
export function CTAMensaje({ cta, momentos, zona }: { cta: ConfigCTA; momentos: MomentosCTA; zona?: { y: number; h: number } }) {
  const f = useCurrentFrame();
  if (zona) return <CTAMensajeFranja cta={cta} momentos={momentos} zona={zona} />;
  const izq = ZONA_SEGURA.izquierda;
  const ancho = 1080 - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha;
  const t1 = prog(f, 4, 14, CURVA.impacto);
  const t2 = prog(f, 10, 14, CURVA.impacto);
  const burbuja = prog(f, momentos.comentar, 12, CURVA.impacto);
  const inicioTecleo = momentos.comentar + 8;
  const letras = Math.max(0, Math.min(cta.palabra.length, Math.floor((f - inicioTecleo) / 3)));
  const enviado = f >= inicioTecleo + cta.palabra.length * 3 + 6;
  const marca = prog(f, momentos.comentar + 24, 14, CURVA.impacto);
  const latido = 1 + 0.035 * Math.sin(f / 5);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: izq, width: ancho, top: 912, textAlign: "center" }}>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 88, lineHeight: 1, color: COLOR.tinta, letterSpacing: "-0.02em", opacity: t1, transform: `translateY(${(1 - t1) * 30}px)` }}>
          {cta.accion}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 14,
            padding: "6px 34px",
            borderRadius: 22,
            background: COLOR.cta,
            color: COLOR.base,
            fontFamily: FUENTE.display,
            fontWeight: 800,
            fontSize: 112,
            lineHeight: 1.05,
            opacity: t2,
            transform: `scale(${(0.7 + 0.3 * t2) * latido}) rotate(-2deg)`,
            boxShadow: "0 0 60px rgb(0 255 179 / 0.5)",
          }}
        >
          {cta.palabra}
        </div>
      </div>

      {/* Burbuja de mensaje saliente */}
      <div style={{ position: "absolute", right: ZONA_SEGURA.derecha + 10, top: 1186, opacity: burbuja, transform: `translateY(${(1 - burbuja) * 30}px) scale(${0.9 + 0.1 * burbuja})`, transformOrigin: "right bottom" }}>
        <div
          style={{
            minWidth: 260,
            padding: "16px 22px",
            borderRadius: "24px 24px 6px 24px",
            background: "linear-gradient(135deg, rgb(0 194 255 / 0.3), rgb(139 92 246 / 0.3))",
            border: "1.5px solid rgb(0 194 255 / 0.55)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 40, color: COLOR.tinta }}>
            {cta.palabra.slice(0, letras)}
            {!enviado && f % 20 < 10 && <span style={{ color: COLOR.cta }}>|</span>}
          </span>
          <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 22, color: enviado ? COLOR.cian : COLOR.apagado }}>{enviado ? "✓✓" : "✓"}</span>
        </div>
      </div>
      {cta.nota && (
        <div style={{ position: "absolute", left: izq, top: 1206, width: 420, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 26, lineHeight: 1.3, color: COLOR.suave, opacity: burbuja }}>{cta.nota}</div>
      )}

      {/* Marca */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1340, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: marca }}>
        <Img src={staticFile("logo/monograma-80.webp")} style={{ height: 50, width: "auto" }} />
        <span style={{ fontFamily: FUENTE.display, fontWeight: 700, fontSize: 32, color: COLOR.tinta, letterSpacing: "0.02em" }}>{cta.web ?? ""}</span>
      </div>
    </div>
  );
}

/**
 * Variante compacta del cierre para la franja superior de la pantalla
 * dividida (avatar abajo al 65 %): tres filas dentro de la zona segura.
 */
function CTAMensajeFranja({ cta, momentos, zona }: { cta: ConfigCTA; momentos: MomentosCTA; zona: { y: number; h: number } }) {
  const f = useCurrentFrame();
  const izq = ZONA_SEGURA.izquierda;
  const ancho = 1080 - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha;
  const t1 = prog(f, 3, 12, CURVA.impacto);
  const t2 = prog(f, 9, 12, CURVA.impacto);
  const burbuja = prog(f, momentos.comentar, 12, CURVA.impacto);
  const inicioTecleo = momentos.comentar + 8;
  const letras = Math.max(0, Math.min(cta.palabra.length, Math.floor((f - inicioTecleo) / 3)));
  const enviado = f >= inicioTecleo + cta.palabra.length * 3 + 6;
  const marca = prog(f, momentos.comentar + 24, 14, CURVA.impacto);
  const latido = 1 + 0.035 * Math.sin(f / 5);
  return (
    <div style={{ position: "absolute", left: izq, width: ancho, top: zona.y, height: zona.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 74, color: COLOR.tinta, letterSpacing: "-0.02em", opacity: t1, transform: `translateY(${(1 - t1) * 24}px)` }}>{cta.accion}</span>
        <span
          style={{
            padding: "2px 26px",
            borderRadius: 18,
            background: COLOR.cta,
            color: COLOR.base,
            fontFamily: FUENTE.display,
            fontWeight: 800,
            fontSize: 80,
            lineHeight: 1.1,
            opacity: t2,
            transform: `scale(${(0.7 + 0.3 * t2) * latido}) rotate(-2deg)`,
            boxShadow: "0 0 50px rgb(0 255 179 / 0.5)",
          }}
        >
          {cta.palabra}
        </span>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: burbuja }}>
        <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 26, lineHeight: 1.3, color: COLOR.suave, maxWidth: 440 }}>{cta.nota}</span>
        <div
          style={{
            minWidth: 250,
            padding: "14px 22px",
            borderRadius: "24px 24px 6px 24px",
            background: "linear-gradient(135deg, rgb(0 194 255 / 0.3), rgb(139 92 246 / 0.3))",
            border: "1.5px solid rgb(0 194 255 / 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            transform: `translateY(${(1 - burbuja) * 24}px) scale(${0.9 + 0.1 * burbuja})`,
            transformOrigin: "right bottom",
          }}
        >
          <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 36, color: COLOR.tinta }}>
            {cta.palabra.slice(0, letras)}
            {!enviado && f % 20 < 10 && <span style={{ color: COLOR.cta }}>|</span>}
          </span>
          <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 22, color: enviado ? COLOR.cian : COLOR.apagado }}>{enviado ? "✓✓" : "✓"}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: marca }}>
        <Img src={staticFile("logo/monograma-80.webp")} style={{ height: 44, width: "auto" }} />
        <span style={{ fontFamily: FUENTE.display, fontWeight: 700, fontSize: 30, color: COLOR.tinta }}>{cta.web ?? ""}</span>
      </div>
    </div>
  );
}

/**
 * Cierre «Sígueme» para la franja superior: palabra grande, perfil con el
 * botón Seguir → Siguiendo ✓ (cuando la voz dice «sígueme») y la marca.
 */
export function CTASeguir({ cta, momentos, zona }: { cta: ConfigCTA; momentos: MomentosCTA; zona: { y: number; h: number } }) {
  const f = useCurrentFrame();
  const izq = ZONA_SEGURA.izquierda;
  const ancho = 1080 - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha;
  const t1 = prog(f, momentos.seguir, 12, CURVA.impacto);
  const t2 = prog(f, momentos.seguir + 8, 12, CURVA.impacto);
  const pulsado = prog(f, momentos.seguir + 22, 8, CURVA.impacto);
  const siguiendo = f >= momentos.seguir + 24;
  const marca = prog(f, momentos.seguir + 30, 14, CURVA.impacto);
  return (
    <div style={{ position: "absolute", left: izq, width: ancho, top: zona.y, height: zona.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 104, lineHeight: 1, color: COLOR.tinta, letterSpacing: "-0.03em", opacity: t1, transform: `scale(${0.8 + 0.2 * t1})` }}>
        {cta.accion}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 14px 12px 24px", borderRadius: 999, background: COLOR.superficie, border: `1.5px solid ${COLOR.linea}`, opacity: t2, transform: `translateY(${(1 - t2) * 24}px)` }}>
        <Img src={staticFile("logo/monograma-80.webp")} style={{ height: 40, width: "auto" }} />
        <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 34, color: COLOR.tinta }}>{cta.usuario}</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            borderRadius: 999,
            fontFamily: FUENTE.display,
            fontWeight: 800,
            fontSize: 26,
            background: siguiendo ? COLOR.superficie2 : COLOR.cta,
            color: siguiendo ? COLOR.tinta : COLOR.base,
            border: siguiendo ? `1.5px solid ${COLOR.cta}` : "1.5px solid transparent",
            transform: `scale(${interpolate(pulsado, [0, 0.5, 1], [1, 0.88, 1])})`,
            boxShadow: siguiendo ? undefined : "0 0 30px rgb(0 255 179 / 0.45)",
          }}
        >
          {siguiendo ? (
            <>
              Siguiendo <Icono nombre="check" tam={24} grosor={2.6} color={COLOR.cta} />
            </>
          ) : (
            "Seguir"
          )}
        </span>
      </div>
      <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 26, color: COLOR.suave, opacity: marca }}>
        {cta.nota ? `${cta.nota} · ` : ""}
        {cta.web ?? ""}
      </span>
    </div>
  );
}
