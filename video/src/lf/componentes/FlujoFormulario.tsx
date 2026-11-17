/**
 * DEMO «Un formulario, cinco tareas» (datos ficticios).
 * 1. El formulario se rellena y se envía.
 * 2. Un paquete de datos baja por la línea y activa cada nodo cuando la voz lo nombra.
 * 3. Cada nodo muestra su detalle; los anteriores quedan marcados como hechos.
 * Todos los tiempos son fotogramas relativos a la escena.
 */
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE } from "../marca";
import type { Icono as NombreIcono } from "../tipos";
import { prog } from "../util";
import { Icono } from "./Icono";

export type NodoFlujoForm = { icono: NombreIcono; titulo: string; detalle: string; frame: number };

export function FlujoFormulario({
  titulo,
  campos,
  boton,
  enviar,
  nodos,
  ancho,
  alto,
}: {
  titulo: string;
  campos: { etiqueta: string; valor: string }[];
  boton: string;
  /** Fotograma en que se pulsa «Enviar». */
  enviar: number;
  nodos: NodoFlujoForm[];
  ancho: number;
  alto: number;
}) {
  const f = useCurrentFrame();
  const entrada = prog(f, 0, 12, CURVA.impacto);
  const altoForm = 300;
  const gap = 14;
  const huecoForm = 34;
  const altoNodo = Math.floor((alto - altoForm - huecoForm - gap * (nodos.length - 1)) / nodos.length);
  const xLinea = 46;

  // Relleno de campos: cada campo se escribe en orden antes de «enviar».
  const inicioRelleno = 8;
  const durCampo = Math.max(8, Math.floor((enviar - inicioRelleno - 6) / Math.max(1, campos.length)));
  const pulsado = prog(f, enviar, 8, CURVA.impacto);
  const enviado = f >= enviar + 6;

  // Posición vertical del paquete de datos (centro del nodo activo).
  const yNodo = (i: number) => altoForm + huecoForm + i * (altoNodo + gap) + altoNodo / 2;
  const activo = nodos.reduce((acc, n, i) => (f >= n.frame ? i : acc), -1);
  const yPaquete = (() => {
    if (f < enviar + 6) return null;
    const objetivo = activo < 0 ? 0 : activo;
    const desdeY = objetivo === 0 ? altoForm : yNodo(objetivo - 1);
    const t0 = objetivo === 0 ? enviar + 6 : nodos[objetivo].frame - 10;
    const t = interpolate(f, [t0, t0 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CURVA.marca });
    return desdeY + (yNodo(objetivo) - desdeY) * t;
  })();
  const finLinea = activo < 0 ? altoForm : yNodo(activo);

  return (
    <div style={{ position: "relative", width: ancho, height: alto, opacity: entrada, transform: `translateY(${(1 - entrada) * 24}px)`, fontFamily: FUENTE.texto }}>
      {/* Formulario */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: ancho,
          height: altoForm,
          borderRadius: 26,
          background: `linear-gradient(160deg, #0A2540 0%, ${COLOR.base2} 75%)`,
          border: `1.5px solid ${enviado ? COLOR.cian : "rgb(0 194 255 / 0.3)"}`,
          boxShadow: "0 30px 60px rgb(0 0 0 / 0.5)",
          padding: "18px 24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <Icono nombre="formulario" tam={28} color={COLOR.cian} />
          <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 28, color: COLOR.tinta }}>{titulo}</span>
          <span style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 8, background: DEGRADADO, color: "#fff", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em" }}>DEMO</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
          {campos.map((c, i) => {
            const ini = inicioRelleno + i * durCampo;
            const letras = Math.floor(interpolate(f, [ini, ini + durCampo - 2], [0, c.valor.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
            const foco = f >= ini && f < ini + durCampo;
            return (
              <div key={i} style={{ gridColumn: i === campos.length - 1 && campos.length % 2 === 1 ? "1 / span 2" : undefined }}>
                <div style={{ fontSize: 17, color: COLOR.suave, marginBottom: 4 }}>{c.etiqueta}</div>
                <div style={{ height: 44, borderRadius: 10, display: "flex", alignItems: "center", padding: "0 14px", background: "rgb(7 9 13 / 0.6)", border: `1.5px solid ${foco ? COLOR.cian : "rgb(255 255 255 / 0.1)"}`, fontSize: 21, fontWeight: 600, color: COLOR.tinta, whiteSpace: "nowrap", overflow: "hidden" }}>
                  {c.valor.slice(0, letras)}
                  {foco && f % 16 < 8 && <span style={{ color: COLOR.cian }}>|</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            right: 24,
            bottom: 16,
            padding: "8px 26px",
            borderRadius: 12,
            background: enviado ? COLOR.superficie2 : DEGRADADO,
            border: enviado ? `1.5px solid ${COLOR.cian}` : "1.5px solid transparent",
            color: "#fff",
            fontFamily: FUENTE.display,
            fontWeight: 800,
            fontSize: 21,
            transform: `scale(${interpolate(pulsado, [0, 0.5, 1], [1, 0.9, 1])})`,
          }}
        >
          {enviado ? "Enviado ✓" : boton}
        </div>
      </div>

      {/* Línea de datos */}
      <div style={{ position: "absolute", left: xLinea - 2, top: altoForm, width: 4, height: alto - altoForm - altoNodo / 2, background: "rgb(255 255 255 / 0.08)", borderRadius: 2 }} />
      {enviado && <div style={{ position: "absolute", left: xLinea - 2, top: altoForm, width: 4, height: Math.max(0, (yPaquete ?? finLinea) - altoForm), background: DEGRADADO, borderRadius: 2, boxShadow: "0 0 14px rgb(0 194 255 / 0.6)" }} />}
      {yPaquete !== null && (
        <div style={{ position: "absolute", left: xLinea - 13, top: yPaquete - 13, width: 26, height: 26, borderRadius: 99, background: COLOR.cian, boxShadow: "0 0 24px rgb(0 194 255 / 0.9)" }} />
      )}

      {/* Nodos */}
      {nodos.map((n, i) => {
        const on = f >= n.frame;
        const hecho = i < activo;
        const esActivo = i === activo;
        const t = prog(f, n.frame, 12, CURVA.impacto);
        const top = altoForm + huecoForm + i * (altoNodo + gap);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: xLinea + 34,
              top,
              width: ancho - xLinea - 34,
              height: altoNodo,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "0 20px",
              boxSizing: "border-box",
              background: esActivo ? "linear-gradient(90deg, rgb(0 194 255 / 0.16), rgb(139 92 246 / 0.12))" : "rgb(17 23 36 / 0.9)",
              border: `1.5px solid ${esActivo ? COLOR.cian : hecho ? "rgb(0 194 255 / 0.35)" : "rgb(255 255 255 / 0.08)"}`,
              boxShadow: esActivo ? "0 0 34px rgb(0 194 255 / 0.3)" : undefined,
              opacity: on ? 1 : 0.38,
              transform: esActivo ? `scale(${1 + 0.03 * t})` : undefined,
              transformOrigin: "left center",
            }}
          >
            <div style={{ width: 54, height: 54, borderRadius: 16, flexShrink: 0, display: "grid", placeItems: "center", background: on ? "rgb(0 194 255 / 0.16)" : "rgb(255 255 255 / 0.05)", color: on ? COLOR.cian : COLOR.apagado, position: "relative" }}>
              <Icono nombre={hecho ? "check" : n.icono} tam={30} />
              <span style={{ position: "absolute", top: -8, left: -8, width: 26, height: 26, borderRadius: 99, display: "grid", placeItems: "center", background: on ? COLOR.cian : COLOR.superficie2, color: COLOR.base, fontFamily: FUENTE.display, fontWeight: 800, fontSize: 15 }}>{i + 1}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 30, color: on ? COLOR.tinta : COLOR.suave, letterSpacing: "-0.01em" }}>{n.titulo}</div>
              <div style={{ fontSize: 20, color: COLOR.suave, marginTop: 2, opacity: on ? t : 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.detalle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
