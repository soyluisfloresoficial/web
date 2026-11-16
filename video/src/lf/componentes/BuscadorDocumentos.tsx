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

export type FasesBuscador = { pregunta: number; busca: number; respuesta: number; citas: number };

export function BuscadorDocumentos({
  documentos,
  pregunta,
  resaltar,
  respuesta,
  citas,
  fases,
  ancho,
  alto,
}: {
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
  const filaAlto = Math.min(44, Math.floor((cuerpo - (documentos.length - 1) * 6) / documentos.length));

  // Pregunta escrita letra a letra.
  const letras = Math.floor(interpolate(f, [fases.pregunta, fases.pregunta + 34], [0, pregunta.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const escribiendo = f >= fases.pregunta && letras < pregunta.length;
  // Barrido de búsqueda.
  const barrido = interpolate(f, [fases.busca, fases.busca + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const buscando = f >= fases.busca && f < fases.respuesta;
  const resp = prog(f, fases.respuesta, 12, CURVA.impacto);
  const palabrasResp = respuesta.split(" ");
  const nPalabras = Math.floor(interpolate(f, [fases.respuesta + 4, fases.respuesta + 40], [0, palabrasResp.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <div
      style={{
        width: ancho,
        height: alto,
        borderRadius: 26,
        background: `linear-gradient(160deg, #0A2540 0%, ${COLOR.base2} 70%)`,
        border: "1px solid rgb(0 194 255 / 0.25)",
        boxShadow: "0 30px 60px rgb(0 0 0 / 0.5), 0 0 40px rgb(0 194 255 / 0.12)",
        overflow: "hidden",
        position: "relative",
        opacity: entrada,
        transform: `translateY(${(1 - entrada) * 30}px) scale(${0.96 + 0.04 * entrada})`,
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
            const t = prog(f, 2 + i * 3, 18, CURVA.impacto);
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
