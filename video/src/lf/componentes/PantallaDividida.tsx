/**
 * Pantalla dividida: a la izquierda lo presencial (el dueño atendiendo en el
 * local), a la derecha lo digital (mensajes que siguen llegando y un
 * contador ilustrativo de consultas pendientes). Con `zoomFrame`, la columna
 * de mensajes se acerca para leerlos.
 *
 * Si no hay foto del local, se dibuja una escena con código: mostrador,
 * clientes esperando y el aviso «Atendiendo…».
 */
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import { prog } from "../util";
import { Icono } from "./Icono";

export const PASO_MENSAJE = 16;

function Local({ f }: { f: number }) {
  const cola = [0, 1, 2, 3];
  const pulso = 0.6 + 0.4 * Math.abs(Math.sin(f / 10));
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #1b1420 0%, #120e18 100%)" }}>
      {/* Luz cálida del local */}
      <div style={{ position: "absolute", left: -60, top: -80, width: 520, height: 420, background: "radial-gradient(circle, rgb(255 180 90 / 0.28), transparent 65%)" }} />
      {/* Dueño detrás del mostrador */}
      <div style={{ position: "absolute", left: 40, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: "rgb(255 190 120 / 0.2)", display: "grid", placeItems: "center", color: "#FFC98A", transform: `translateY(${Math.sin(f / 7) * 3}px)` }}>
          <Icono nombre="usuario" tam={70} grosor={1.6} />
        </div>
        <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 20, color: "#FFC98A" }}>Tú</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, height: 26, background: "linear-gradient(90deg, #5a3b2a, #7a5238)", boxShadow: "0 8px 20px rgb(0 0 0 / 0.5)" }} />
      {/* Clientes en el local */}
      <div style={{ position: "absolute", left: 20, right: 20, top: 360, display: "flex", justifyContent: "space-around" }}>
        {cola.map((i) => {
          const t = prog(f, 4 + i * 6, 10, CURVA.impacto);
          return (
            <div key={i} style={{ color: COLOR.suave, opacity: t, transform: `translateY(${(1 - t) * 30 + Math.sin((f + i * 9) / 9) * 2}px)` }}>
              <Icono nombre="usuario" tam={62} grosor={1.6} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center" }}>
        <span style={{ padding: "8px 18px", borderRadius: 999, background: "rgb(255 190 120 / 0.16)", border: "1px solid rgb(255 190 120 / 0.5)", color: "#FFC98A", fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 22, opacity: pulso }}>
          Atendiendo…
        </span>
      </div>
    </div>
  );
}

export function PantallaDividida({
  izquierda,
  derecha,
  zoomFrame,
  ancho = 936,
  alto = 720,
}: {
  izquierda: { etiqueta: string; imagen?: string };
  derecha: { etiqueta: string; mensajes: string[]; contador?: { etiqueta: string; hasta: number } };
  zoomFrame?: number;
  ancho?: number;
  alto?: number;
}) {
  const f = useCurrentFrame();
  const entra = prog(f, 0, 14, CURVA.impacto);
  const mitad = (ancho - 16) / 2;
  const llegados = derecha.mensajes.filter((_, i) => f >= 10 + i * PASO_MENSAJE).length;
  const cuenta = derecha.contador
    ? Math.round(interpolate(f, [10, 10 + Math.max(1, derecha.mensajes.length) * PASO_MENSAJE + 30], [0, derecha.contador.hasta], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
    : 0;
  const zoom = zoomFrame !== undefined ? 1 + 0.08 * prog(f, zoomFrame, 10, CURVA.impacto) : 1;

  const panel = {
    position: "absolute" as const,
    top: 0,
    width: mitad,
    height: alto,
    borderRadius: 30,
    overflow: "hidden" as const,
    boxShadow: "0 30px 60px rgb(0 0 0 / 0.5)",
  };
  const etiqueta = (texto: string, color: string) => (
    <div style={{ position: "absolute", left: 18, top: 16, zIndex: 3, padding: "6px 14px", borderRadius: 999, background: "rgb(7 9 13 / 0.7)", border: `1px solid ${color}`, color, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 19, letterSpacing: "0.12em" }}>
      {texto}
    </div>
  );

  return (
    <div style={{ position: "relative", width: ancho, height: alto, opacity: entra, transform: `translateY(${(1 - entra) * 50}px)` }}>
      {/* Presencial */}
      <div style={{ ...panel, left: 0, transform: `translateX(${(1 - entra) * -60}px)` }}>
        {izquierda.imagen ? (
          <Img src={staticFile(izquierda.imagen)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", left: 0, top: 0, width: mitad / (alto / 720), height: 720, transform: `scale(${alto / 720})`, transformOrigin: "top left" }}>
            <Local f={f} />
          </div>
        )}
        {etiqueta(izquierda.etiqueta, "#FFC98A")}
      </div>
      {/* Línea divisoria */}
      <div style={{ position: "absolute", left: mitad + 6, top: 30, bottom: 30, width: 4, borderRadius: 2, background: "linear-gradient(180deg, transparent, #00C2FF, transparent)", opacity: 0.8 }} />
      {/* Digital */}
      <div style={{ ...panel, left: mitad + 16, background: COLOR.superficie, border: "1px solid rgb(0 194 255 / 0.3)", transform: `translateX(${(1 - entra) * 60}px)` }}>
        {etiqueta(derecha.etiqueta, COLOR.cian)}
        {derecha.contador && (
          <div style={{ position: "absolute", right: 14, top: 12, zIndex: 3, display: "flex", alignItems: "center", gap: 10, padding: "4px 6px 4px 14px", borderRadius: 999, background: "rgb(255 92 122 / 0.14)", border: "1px solid rgb(255 92 122 / 0.6)" }}>
            <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 18, color: COLOR.suave }}>{derecha.contador.etiqueta}</span>
            <span
              style={{
                minWidth: 40,
                height: 40,
                borderRadius: 20,
                display: "grid",
                placeItems: "center",
                background: COLOR.peligro,
                color: "#fff",
                fontFamily: FUENTE.display,
                fontWeight: 800,
                fontSize: 26,
                transform: `scale(${1 + (llegados > 0 ? 0.18 * Math.max(0, 1 - ((f - 10) % PASO_MENSAJE) / 6) : 0)})`,
              }}
            >
              {cuenta}
            </span>
          </div>
        )}
        <div style={{ position: "absolute", left: 16, right: 16, top: 64, bottom: 14, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12, transform: `scale(${zoom})`, transformOrigin: "50% 80%" }}>
          {derecha.mensajes.map((m, i) => {
            if (f < 10 + i * PASO_MENSAJE) return null;
            const t = prog(f, 10 + i * PASO_MENSAJE, 10, CURVA.impacto);
            return (
              <div
                key={i}
                style={{
                  alignSelf: "flex-start",
                  flexShrink: 0,
                  maxWidth: "94%",
                  padding: "12px 16px",
                  borderRadius: "20px 20px 20px 6px",
                  background: COLOR.superficie2,
                  border: `1px solid ${COLOR.linea}`,
                  fontFamily: FUENTE.texto,
                  fontWeight: 500,
                  fontSize: 27,
                  lineHeight: 1.2,
                  color: COLOR.tinta,
                  opacity: t,
                  transform: `translateY(${(1 - t) * 26}px) scale(${0.94 + 0.06 * t})`,
                  transformOrigin: "left bottom",
                  position: "relative",
                }}
              >
                {m}
                <span style={{ position: "absolute", right: -6, top: -6, width: 14, height: 14, borderRadius: 7, background: COLOR.peligro, boxShadow: "0 0 10px rgb(255 92 122 / 0.8)" }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
