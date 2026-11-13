/**
 * Gancho visual: avisos de mensajes que llegan uno tras otro alrededor del
 * avatar (como en la pantalla bloqueada de un celular), con un pequeño
 * rebote, y después se marcan todos con un sello rojo «Sin responder».
 * Ilustrativo: remitentes y textos genéricos.
 */
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import { prog } from "../util";
import { Icono } from "./Icono";

/** Posiciones a los lados de la cara para no taparla del todo. */
const POSICIONES = [
  // La mirada (hacia y = 360) queda libre: arriba en la frente y abajo,
  // a la altura de la boca, el mentón y el cuello.
  { x: 64, y: 236, giro: -3 },
  { x: 576, y: 520, giro: 2.5 },
  { x: 64, y: 690, giro: -1.5 },
  { x: 576, y: 845, giro: 3 },
];

export const PASO_AVISO = 7;

export function NotificacionesFlotantes({
  avisos,
  sello,
  selloFrame,
  duracion,
}: {
  avisos: { remitente: string; texto: string; hora: string }[];
  sello?: string;
  /** Fotograma (relativo a la escena) del sello. */
  selloFrame: number;
  duracion: number;
}) {
  const f = useCurrentFrame();
  const salida = prog(f, duracion - 10, 10, CURVA.marca);
  const s = sello ? prog(f, selloFrame, 8, CURVA.impacto) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 12, pointerEvents: "none" }}>
      {avisos.slice(0, POSICIONES.length).map((a, i) => {
        const p = POSICIONES[i];
        const entra = prog(f, 2 + i * PASO_AVISO, 10, CURVA.impacto);
        const temblor = s > 0 && s < 1 ? Math.sin(f * 2.4 + i) * 6 * (1 - s) : 0;
        const vuela = salida * (i % 2 === 0 ? -1 : 1) * 700;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: 440,
              padding: "20px 24px",
              boxSizing: "border-box",
              borderRadius: 30,
              background: "rgb(20 26 40 / 0.78)",
              backdropFilter: "blur(18px)",
              border: `1px solid ${s > 0.5 ? "rgb(255 92 122 / 0.6)" : "rgb(255 255 255 / 0.14)"}`,
              boxShadow: "0 24px 50px rgb(0 0 0 / 0.45)",
              display: "flex",
              gap: 18,
              alignItems: "center",
              opacity: entra * (1 - salida),
              transform: `translate(${vuela + temblor}px, ${(1 - entra) * -70}px) rotate(${p.giro}deg) scale(${0.85 + 0.15 * entra})`,
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 18, flexShrink: 0, display: "grid", placeItems: "center", background: "linear-gradient(135deg, #00C2FF, #8B5CF6)", color: COLOR.base }}>
              <Icono nombre="whatsapp" tam={34} grosor={2.2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 21, color: COLOR.suave }}>
                <span>{a.remitente}</span>
                <span>{a.hora}</span>
              </div>
              <div style={{ fontFamily: FUENTE.texto, fontWeight: 500, fontSize: 24, color: COLOR.tinta, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.texto}</div>
            </div>
            {sello && s > 0 && (
              <div
                style={{
                  position: "absolute",
                  right: -14,
                  top: -16,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: COLOR.peligro,
                  color: "#fff",
                  fontFamily: FUENTE.display,
                  fontWeight: 800,
                  fontSize: 20,
                  letterSpacing: "0.04em",
                  transform: `scale(${interpolate(s, [0, 0.6, 1], [0.4, 1.15, 1])})`,
                  boxShadow: "0 6px 20px rgb(255 92 122 / 0.5)",
                }}
              >
                {sello}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
