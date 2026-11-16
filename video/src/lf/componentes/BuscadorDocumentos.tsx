/**
 * Demo «la IA consulta tus documentos» (ejemplo ilustrativo, sin datos reales):
 * 1. Los documentos llegan desordenados y se agrupan en el buscador.
 * 2. Se escribe la pregunta.
 * 3. Un barrido busca y resalta los documentos con fragmentos relacionados.
 * 4. Aparece la respuesta y, después, las citas con el documento de origen.
 * Cada fase entra cuando la voz la nombra (fotogramas relativos a la escena).
 */
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE } from "../marca";
import { prog } from "../util";
import { Icono } from "./Icono";

export type FasesBuscador = { pregunta: number; busca: number; respuesta: number; citas: number; agrupar?: number };

export function BuscadorDocumentos({
  documentos,
  pregunta,
  resaltar,
  respuesta,
  citas,
  fases,
  ancho,
  alto,
  escala = 1,
  zoomVisor = false,
}: {
  /** Visor con zoom suave sobre la pregunta, la búsqueda, la respuesta y las fuentes. */
  zoomVisor?: boolean;
  /** Escala final del panel (a pantalla completa se amplía y la cámara va a cada fase). */
  escala?: number;
  documentos: string[];
  pregunta: string;
  resaltar: number[];
  respuesta: string;
  citas: { doc: number; ref: string }[];
  fases: FasesBuscador;
  ancho: number;
  alto: number;
}) {
  const f = useCurrentFrame();
  const entrada = prog(f, 0, 12, CURVA.impacto);
  const cabecera = 50;
  const cuerpo = alto - cabecera - 20;
  const anchoLista = Math.round(ancho * 0.4);
  const anchoDerecha = ancho - anchoLista - 46;
  const filaAlto = Math.min(60, Math.floor((cuerpo - (documentos.length - 1) * 6) / documentos.length));

  // Pregunta escrita letra a letra.
  const letras = Math.floor(interpolate(f, [fases.pregunta, fases.pregunta + 34], [0, pregunta.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const escribiendo = f >= fases.pregunta && letras < pregunta.length;
  // Barrido de búsqueda.
  const barrido = interpolate(f, [fases.busca, fases.busca + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const buscando = f >= fases.busca && f < fases.respuesta;
  const resp = prog(f, fases.respuesta, 12, CURVA.impacto);
  const palabrasResp = respuesta.split(" ");
  const nPalabras = Math.floor(interpolate(f, [fases.respuesta + 4, fases.respuesta + 40], [0, palabrasResp.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Cámara: a pantalla completa se acerca a la parte que importa en cada fase.
  const fasesCam = [
    { t: 0, z: 1, ox: 50, oy: 50 },
    { t: fases.pregunta, z: 1.05, ox: 62, oy: 20 },
    { t: fases.busca, z: 1.05, ox: 38, oy: 50 },
    { t: fases.respuesta, z: 1.04, ox: 62, oy: 65 },
    { t: fases.citas + 30, z: 1, ox: 50, oy: 50 },
  ];
  const camara = (() => {
    if (escala === 1) return { z: 1, ox: 50, oy: 50 };
    let a = fasesCam[0];
    let b = fasesCam[0];
    for (const c of fasesCam) {
      if (f >= c.t) {
        a = b;
        b = c;
      }
    }
    const k = prog(f, b.t, 14, CURVA.marca);
    return { z: a.z + (b.z - a.z) * k, ox: a.ox + (b.ox - a.ox) * k, oy: a.oy + (b.oy - a.oy) * k };
  })();
  // Visor: la cámara se centra en cada parte y la amplía (sin bordes vacíos).
  const xDer = Math.round(ancho * 0.4) + 64 + (ancho - Math.round(ancho * 0.4) - 46) / 2;
  const focos = [
    { t: 0, z: 1, x: ancho / 2, y: alto / 2 },
    { t: fases.pregunta, z: 1.38, x: xDer, y: 100 },
    { t: fases.busca, z: 1.22, x: Math.round(ancho * 0.22), y: alto / 2 },
    { t: fases.respuesta, z: 1.32, x: xDer, y: 250 },
    { t: fases.citas, z: 1.38, x: xDer, y: alto - 120 },
    { t: fases.citas + 45, z: 1, x: ancho / 2, y: alto / 2 },
  ];
  const visor = (() => {
    let a = focos[0];
    let b = focos[0];
    for (const c of focos) {
      if (f >= c.t) {
        a = b;
        b = c;
      }
    }
    const k = prog(f, b.t, 18, CURVA.suave);
    const z = a.z + (b.z - a.z) * k;
    const S = escala * z;
    const Vw = ancho * escala;
    const Vh = alto * escala;
    const fx = a.x + (b.x - a.x) * k;
    const fy = a.y + (b.y - a.y) * k;
    const tx = Math.min(0, Math.max(Vw - ancho * S, Vw / 2 - fx * S));
    const ty = Math.min(0, Math.max(Vh - alto * S, Vh / 2 - fy * S));
    return { S, tx, ty };
  })();
  if (zoomVisor) {
    return (
      <div
        style={{
          width: ancho * escala,
          height: alto * escala,
          position: "relative",
          overflow: "hidden",
          borderRadius: 30,
          border: "1.5px solid rgb(0 194 255 / 0.35)",
          boxShadow: "0 40px 80px rgb(0 0 0 / 0.55), 0 0 50px rgb(0 194 255 / 0.15)",
          opacity: entrada,
          transform: `translateY(${(1 - entrada) * 30}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${visor.tx}px, ${visor.ty}px) scale(${visor.S})` }}>
          {panel(1, { z: 1, ox: 50, oy: 50 }, false)}
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: ancho * escala, height: alto * escala, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {panel(entrada, camara, true)}
    </div>
  );

  function panel(op: number, cam: { z: number; ox: number; oy: number }, conEscala: boolean) {
    return (
    <div
      style={{
        width: ancho,
        height: alto,
        flexShrink: 0,
        background: `linear-gradient(160deg, #0A2540 0%, ${COLOR.base2} 70%)`,
        border: "1px solid rgb(0 194 255 / 0.25)",
        boxShadow: "0 30px 60px rgb(0 0 0 / 0.5), 0 0 40px rgb(0 194 255 / 0.12)",
        overflow: "hidden",
        position: "relative",
        opacity: op,
        transform: conEscala ? `translateY(${(1 - op) * 30}px) scale(${(0.96 + 0.04 * op) * escala * cam.z})` : undefined,
        transformOrigin: `${cam.ox}% ${cam.oy}%`,
        borderRadius: conEscala ? 26 : 0,
        fontFamily: FUENTE.texto,
      }}
    >
      {/* Cabecera */}
      <div style={{ height: cabecera, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", borderBottom: "1px solid rgb(255 255 255 / 0.08)" }}>
        <div style={{ display: "flex", gap: 7 }}>
          {["#FF5C7A", "#FFC857", "#00FFB3"].map((c) => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: 99, background: c, opacity: 0.8 }} />
          ))}
        </div>
        <span style={{ fontFamily: FUENTE.display, fontWeight: 700, fontSize: 24, color: COLOR.tinta }}>Buscador de documentos · IA</span>
        <span style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 8, background: DEGRADADO, color: "#fff", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 19, letterSpacing: "0.16em" }}>DEMO</span>
      </div>

      <div style={{ display: "flex", gap: 20, padding: "12px 18px" }}>
        {/* Documentos: llegan dispersos y se ordenan */}
        <div style={{ width: anchoLista, position: "relative", height: cuerpo }}>
          {documentos.map((d, i) => {
            const t = prog(f, (fases.agrupar ?? 0) + 2 + i * 3, 18, CURVA.impacto);
            const dx = (i % 2 === 0 ? -1 : 1) * (60 + i * 12) * (1 - t);
            const dy = ((i * 37) % 90 - 45) * (1 - t);
            const rot = (i % 2 === 0 ? -14 : 12) * (1 - t);
            const resaltado = resaltar.includes(i) && f >= fases.busca + Math.round(barrido * 0 + 8 + resaltar.indexOf(i) * 5);
            const yFila = i * (filaAlto + 6);
            const escaneado = buscando && barrido * documentos.length > i && barrido * documentos.length < i + 1.4;
            const citado = citas.findIndex((c) => c.doc === i);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  top: yFila,
                  width: anchoLista,
                  height: filaAlto,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 12px",
                  borderRadius: 12,
                  background: resaltado ? "rgb(0 194 255 / 0.16)" : escaneado ? "rgb(139 92 246 / 0.18)" : "rgb(255 255 255 / 0.05)",
                  border: `1px solid ${resaltado ? COLOR.cian : "rgb(255 255 255 / 0.08)"}`,
                  boxShadow: resaltado ? "0 0 18px rgb(0 194 255 / 0.35)" : undefined,
                  opacity: t,
                  transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
                }}
              >
                <Icono nombre="formulario" tam={24} color={resaltado ? COLOR.cian : COLOR.suave} />
                <span style={{ fontSize: 22, fontWeight: 600, color: resaltado ? COLOR.tinta : COLOR.suave, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{d}</span>
                {citado >= 0 && f >= fases.citas + citado * 6 && (
                  <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 15, color: COLOR.base, background: COLOR.cian, borderRadius: 6, padding: "2px 7px" }}>[{citado + 1}]</span>
                )}
              </div>
            );
          })}
          {buscando && barrido < 1 && (
            <div style={{ position: "absolute", left: -6, right: -6, top: barrido * cuerpo - 3, height: 4, borderRadius: 2, background: DEGRADADO, boxShadow: "0 0 18px rgb(0 194 255 / 0.8)" }} />
          )}
        </div>

        {/* Pregunta y respuesta */}
        <div style={{ width: anchoDerecha, display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              minHeight: 64,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              borderRadius: 16,
              background: "rgb(7 9 13 / 0.6)",
              border: `1.5px solid ${f >= fases.pregunta ? COLOR.cian : "rgb(255 255 255 / 0.12)"}`,
            }}
          >
            <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={COLOR.cian} strokeWidth={2} strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <span style={{ fontSize: 24, fontWeight: 600, color: letras ? COLOR.tinta : COLOR.apagado, lineHeight: 1.3 }}>
              {letras ? pregunta.slice(0, letras) : "Pregunta a tus documentos…"}
              {escribiendo && <span style={{ color: COLOR.cian }}>|</span>}
            </span>
          </div>

          {buscando && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: COLOR.suave, fontSize: 22 }}>
              <span style={{ width: 16, height: 16, borderRadius: 99, border: `2.5px solid ${COLOR.cian}`, borderTopColor: "transparent", transform: `rotate(${f * 18}deg)` }} />
              Buscando fragmentos relacionados…
            </div>
          )}

          {f >= fases.respuesta && (
            <div
              style={{
                flex: 1,
                padding: "14px 18px",
                borderRadius: 16,
                background: "rgb(255 255 255 / 0.06)",
                border: "1px solid rgb(255 255 255 / 0.10)",
                opacity: resp,
                transform: `translateY(${(1 - resp) * 16}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FUENTE.display, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: COLOR.cian, marginBottom: 6 }}>
                <Icono nombre="agente" tam={20} color={COLOR.cian} /> RESPUESTA
              </div>
              <div style={{ fontSize: 24, lineHeight: 1.3, color: COLOR.tinta }}>
                {palabrasResp.slice(0, nPalabras).join(" ")}
                {citas.map((_c, k) =>
                  f >= fases.citas + k * 6 ? (
                    <span key={k} style={{ marginLeft: 6, fontFamily: FUENTE.display, fontWeight: 800, fontSize: 15, color: COLOR.base, background: COLOR.cian, borderRadius: 6, padding: "1px 6px" }}>[{k + 1}]</span>
                  ) : null,
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {citas.map((c, k) => {
                  const t = prog(f, fases.citas + k * 6, 10, CURVA.impacto);
                  return (
                    <span key={k} style={{ opacity: t, transform: `translateY(${(1 - t) * 10}px)`, fontSize: 19, fontWeight: 600, color: COLOR.tinta, padding: "4px 10px", borderRadius: 8, border: `1px solid ${COLOR.cian}`, background: "rgb(0 194 255 / 0.10)" }}>
                      [{k + 1}] {documentos[c.doc]} · {c.ref}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  }
}
