/**
 * Antes / después con revelado por máscara: una línea de luz barre la
 * tarjeta «antes» y deja ver «después» debajo.
 */
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE } from "../marca";
import { prog } from "../util";
import { Icono } from "./Icono";

type Lado = { titulo: string; puntos: string[] };

function Tarjeta({ lado, tipo }: { lado: Lado; tipo: "antes" | "despues" }) {
  const despues = tipo === "despues";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 30,
        padding: "36px 40px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        background: despues ? "linear-gradient(160deg, #0f1d2e, #1a1438)" : COLOR.superficie,
        border: despues ? "2px solid rgb(0 194 255 / 0.55)" : `2px solid ${COLOR.linea}`,
        boxShadow: "0 40px 80px rgb(0 0 0 / 0.5)",
      }}
    >
      <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 24, letterSpacing: "0.18em", color: despues ? COLOR.cta : COLOR.peligro }}>
        {despues ? "DESPUÉS" : "ANTES"}
      </span>
      <span
        style={{
          fontFamily: FUENTE.display,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.08,
          color: despues ? "transparent" : COLOR.suave,
          ...(despues ? { backgroundImage: DEGRADADO, WebkitBackgroundClip: "text", backgroundClip: "text" } : {}),
        }}
      >
        {lado.titulo}
      </span>
      {lado.puntos.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: despues ? "rgb(0 255 179 / 0.14)" : "rgb(255 92 122 / 0.12)", color: despues ? COLOR.cta : COLOR.peligro }}>
            {despues ? <Icono nombre="check" tam={26} grosor={2.4} /> : <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 26 }}>✕</span>}
          </div>
          <span style={{ fontFamily: FUENTE.texto, fontWeight: 500, fontSize: 30, color: despues ? COLOR.tinta : COLOR.suave, lineHeight: 1.3 }}>{p}</span>
        </div>
      ))}
    </div>
  );
}

export function BeforeAfterReveal({
  antes,
  despues,
  ancho = 900,
  alto = 520,
  inicioBarrido = 22,
  duracionBarrido = 26,
}: {
  antes: Lado;
  despues: Lado;
  ancho?: number;
  alto?: number;
  inicioBarrido?: number;
  duracionBarrido?: number;
}) {
  const f = useCurrentFrame();
  const entra = prog(f, 0, 14, CURVA.impacto);
  const barrido = interpolate(f, [inicioBarrido, inicioBarrido + duracionBarrido], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CURVA.suave,
  });
  return (
    <div style={{ position: "relative", width: ancho, height: alto, opacity: entra, transform: `translateY(${(1 - entra) * 60}px)` }}>
      <Tarjeta lado={antes} tipo="antes" />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - barrido}% 0 0 round 30px)` }}>
        <Tarjeta lado={despues} tipo="despues" />
      </div>
      {barrido > 0 && barrido < 100 && (
        <div
          style={{
            position: "absolute",
            top: -20,
            bottom: -20,
            left: `${barrido}%`,
            width: 6,
            marginLeft: -3,
            borderRadius: 3,
            background: COLOR.cian,
            boxShadow: "0 0 30px 6px rgb(0 194 255 / 0.65)",
          }}
        />
      )}
    </div>
  );
}
