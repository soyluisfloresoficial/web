/**
 * Interfaces de ejemplo dibujadas con código. Son genéricas (sin logos ni
 * marcas de terceros) y su contenido sale de la configuración del video.
 * Todo aparece por pasos según el fotograma de la escena.
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Icono } from "../componentes/Icono";
import { Placeholder } from "../componentes/Placeholder";
import { COLOR, CURVA, FUENTE } from "../marca";
import type { PantallaMaqueta } from "../tipos";
import { prog } from "../util";

const etiqueta = { fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 22, color: COLOR.apagado, letterSpacing: "0.04em" } as const;

function Chat({ p, f, fps, compacto }: { p: Extract<PantallaMaqueta, { tipo: "chat" }>; f: number; fps: number; compacto?: boolean }) {
  const paso = Math.round(fps * 1.1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compacto ? 12 : 16, padding: compacto ? 20 : 28, height: "100%", boxSizing: "border-box" }}>
      <div style={{ display: compacto ? "none" : "flex", alignItems: "center", gap: 14, paddingBottom: 16, borderBottom: `1px solid ${COLOR.linea}` }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: COLOR.superficie2, display: "grid", placeItems: "center", color: COLOR.cian }}>
          <Icono nombre="whatsapp" tam={28} />
        </div>
        <div>
          <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 28, color: COLOR.tinta }}>{p.canal}</div>
          <div style={etiqueta}>Conversación de ejemplo</div>
        </div>
      </div>
      {p.mensajes.map((m, i) => {
        const aparece = 8 + i * paso;
        // Antes de cada respuesta del agente, «escribiendo…».
        const escribiendo = m.de === "agente" && f >= aparece - 18 && f < aparece;
        const t = prog(f, aparece, 10, CURVA.impacto);
        if (m.de === "estado") {
          const pulso = 0.55 + 0.45 * Math.abs(Math.sin((f - aparece) / 9));
          return (
            <div key={i} style={{ alignSelf: "center", opacity: t * (f >= aparece ? pulso : 0), fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 24, color: COLOR.peligro, padding: "8px 18px", borderRadius: 999, border: `1.5px solid ${COLOR.peligro}`, background: "rgb(255 92 122 / 0.08)" }}>
              {m.texto}
            </div>
          );
        }
        const delCliente = m.de === "cliente";
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: delCliente ? "flex-start" : "flex-end" }}>
            {escribiendo ? (
              <div style={{ padding: "16px 22px", borderRadius: 22, background: "rgb(0 194 255 / 0.14)", display: "flex", gap: 8 }}>
                {[0, 1, 2].map((d) => (
                  <span key={d} style={{ width: 11, height: 11, borderRadius: 6, background: COLOR.cian, opacity: 0.35 + 0.65 * Math.abs(Math.sin((f + d * 5) / 5)) }} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  maxWidth: "82%",
                  opacity: t,
                  transform: `translateY(${(1 - t) * 24}px) scale(${0.96 + 0.04 * t})`,
                  transformOrigin: delCliente ? "left bottom" : "right bottom",
                  padding: "16px 22px",
                  borderRadius: delCliente ? "22px 22px 22px 6px" : "22px 22px 6px 22px",
                  background: delCliente ? COLOR.superficie2 : "linear-gradient(135deg, rgb(0 194 255 / 0.28), rgb(139 92 246 / 0.28))",
                  border: delCliente ? `1px solid ${COLOR.linea}` : "1px solid rgb(0 194 255 / 0.45)",
                  fontFamily: FUENTE.texto,
                  fontWeight: 500,
                  fontSize: 27,
                  lineHeight: 1.35,
                  color: COLOR.tinta,
                }}
              >
                {!delCliente && <div style={{ ...etiqueta, fontSize: 18, color: COLOR.cian, marginBottom: 4 }}>ASISTENTE IA</div>}
                {m.texto}
                {m.hora && <div style={{ ...etiqueta, fontSize: 18, textAlign: "right", marginTop: 6 }}>{m.hora}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Formulario({ p, f }: { p: Extract<PantallaMaqueta, { tipo: "formulario" }>; f: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24, height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 32, lineHeight: "40px", color: COLOR.tinta }}>{p.titulo}</div>
      {p.campos.map((c, i) => {
        const aparece = 6 + i * 10;
        const letras = Math.max(0, Math.floor((f - aparece) / 1.2));
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ ...etiqueta, fontSize: 20, lineHeight: "24px" }}>{c.etiqueta}</span>
            <div style={{ padding: "12px 18px", borderRadius: 14, background: COLOR.base2, border: `1.5px solid ${letras > 0 && letras < c.valor.length ? COLOR.cian : COLOR.linea}`, fontFamily: FUENTE.texto, fontSize: 25, lineHeight: "32px", color: COLOR.tinta, minHeight: 32 }}>
              {c.valor.slice(0, letras)}
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, padding: "16px 0", lineHeight: "32px", borderRadius: 16, textAlign: "center", background: `linear-gradient(105deg, ${COLOR.cian}, ${COLOR.violeta})`, fontFamily: FUENTE.display, fontWeight: 800, fontSize: 28, color: COLOR.base }}>
        {p.boton}
      </div>
    </div>
  );
}

function Crm({ p, f, fps }: { p: Extract<PantallaMaqueta, { tipo: "crm" }>; f: number; fps: number }) {
  const mueve = prog(f, Math.round(fps * 1.2), 22, CURVA.marca);
  return (
    <div style={{ display: "flex", gap: 14, padding: 24, height: "100%", boxSizing: "border-box" }}>
      {p.columnas.map((col, ci) => (
        <div key={ci} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, background: COLOR.base2, borderRadius: 16, padding: 14 }}>
          <div style={{ ...etiqueta, fontSize: 20 }}>{col.titulo}</div>
          {col.tarjetas.map((t, ti) => {
            const esMovida = p.mover?.tarjeta === t;
            const salto = esMovida && p.mover ? (p.mover.a - ci) * mueve : 0;
            return (
              <div
                key={ti}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: esMovida ? "rgb(0 194 255 / 0.16)" : COLOR.superficie2,
                  border: `1px solid ${esMovida ? COLOR.cian : COLOR.linea}`,
                  fontFamily: FUENTE.texto,
                  fontWeight: 500,
                  fontSize: 21,
                  color: COLOR.tinta,
                  transform: `translateX(${salto * 100}%) translateX(${salto * 14}px)`,
                  zIndex: esMovida ? 2 : 1,
                  boxShadow: esMovida ? "0 10px 30px rgb(0 194 255 / 0.25)" : undefined,
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Calendario({ p, f }: { p: Extract<PantallaMaqueta, { tipo: "calendario" }>; f: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 28, height: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: COLOR.cian }}>
        <Icono nombre="calendario" tam={32} />
        <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 30, color: COLOR.tinta }}>{p.dia}</span>
      </div>
      {p.huecos.map((h, i) => {
        const t = h.nuevo ? prog(f, 26, 14, CURVA.impacto) : 1;
        return (
          <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ ...etiqueta, width: 90 }}>{h.hora}</span>
            <div
              style={{
                flex: 1,
                minHeight: 52,
                borderRadius: 12,
                padding: "10px 16px",
                boxSizing: "border-box",
                background: h.nuevo ? `rgb(0 255 179 / ${0.16 * t})` : h.texto ? COLOR.superficie2 : "transparent",
                border: h.nuevo ? `1.5px solid rgb(0 255 179 / ${t})` : `1px dashed ${COLOR.linea}`,
                fontFamily: FUENTE.texto,
                fontWeight: 600,
                fontSize: 22,
                color: h.nuevo ? COLOR.cta : COLOR.suave,
                transform: h.nuevo ? `scale(${0.9 + 0.1 * t})` : undefined,
                opacity: h.nuevo ? t : 1,
              }}
            >
              {h.texto}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Notificacion({ p, f }: { p: Extract<PantallaMaqueta, { tipo: "notificacion" }>; f: number }) {
  const t = prog(f, 6, 12, CURVA.impacto);
  return (
    <div style={{ padding: 28, display: "flex", gap: 18, alignItems: "flex-start", opacity: t, transform: `translateY(${(1 - t) * -30}px)` }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, display: "grid", placeItems: "center", background: "rgb(0 255 179 / 0.14)", color: COLOR.cta }}>
        <Icono nombre="usuario" tam={30} />
      </div>
      <div>
        <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 28, color: COLOR.tinta }}>{p.titulo}</div>
        <div style={{ fontFamily: FUENTE.texto, fontSize: 24, color: COLOR.suave, marginTop: 6, lineHeight: 1.35 }}>{p.texto}</div>
      </div>
    </div>
  );
}

function Web({ p, f, compacto }: { p: Extract<PantallaMaqueta, { tipo: "web" }>; f: number; compacto?: boolean }) {
  const hero = prog(f, 4, 14, CURVA.impacto);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 26px", borderBottom: `1px solid ${COLOR.linea}` }}>
        <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 26, color: COLOR.tinta }}>{p.negocio}</span>
        <span style={{ display: "flex", gap: 18, fontFamily: FUENTE.texto, fontSize: 18, color: COLOR.apagado }}>
          {p.secciones.slice(0, 3).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </span>
      </div>
      <div
        style={{
          margin: compacto ? 12 : 18,
          borderRadius: 18,
          padding: compacto ? "16px 22px" : "26px 28px",
          background: "linear-gradient(135deg, rgb(0 194 255 / 0.18), rgb(139 92 246 / 0.22))",
          opacity: hero,
          transform: `translateY(${(1 - hero) * 20}px)`,
        }}
      >
        <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: compacto ? 32 : 36, lineHeight: 1.1, color: COLOR.tinta }}>{p.lema}</div>
        <div style={{ marginTop: compacto ? 10 : 16, display: "inline-block", padding: "12px 26px", borderRadius: 12, background: COLOR.cta, color: COLOR.base, fontFamily: FUENTE.display, fontWeight: 800, fontSize: 24 }}>{p.boton}</div>
      </div>
      <div style={{ display: "flex", gap: 14, padding: compacto ? "0 12px" : "0 18px" }}>
        {p.secciones.map((s, i) => {
          const t = prog(f, 12 + i * 5, 12, CURVA.impacto);
          return (
            <div key={s} style={{ flex: 1, borderRadius: 14, background: COLOR.superficie2, border: `1px solid ${COLOR.linea}`, padding: 14, opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>
              <div style={{ height: compacto ? 34 : 70, borderRadius: 10, background: `linear-gradient(135deg, ${COLOR.superficie}, ${COLOR.linea})`, marginBottom: 10 }} />
              <div style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 19, color: COLOR.tinta }}>{s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Maqueta({ pantalla, compacto }: { pantalla: PantallaMaqueta; compacto?: boolean }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  switch (pantalla.tipo) {
    case "chat":
      return <Chat p={pantalla} f={f} fps={fps} compacto={compacto} />;
    case "formulario":
      return <Formulario p={pantalla} f={f} />;
    case "crm":
      return <Crm p={pantalla} f={f} fps={fps} />;
    case "calendario":
      return <Calendario p={pantalla} f={f} />;
    case "notificacion":
      return <Notificacion p={pantalla} f={f} />;
    case "web":
      return <Web p={pantalla} f={f} compacto={compacto} />;
    case "pendiente":
      return <Placeholder texto={pantalla.descripcion} />;
  }
}
