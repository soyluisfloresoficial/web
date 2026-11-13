/**
 * Contador y comparativa con valores configurables. Los números salen de la
 * configuración del video: nunca se inventan aquí. Si el dato es un ejemplo,
 * hay que decirlo en `nota`.
 */
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE } from "../marca";
import { prog } from "../util";

const formato = (n: number) => Math.round(n).toLocaleString("es-ES");

export function AnimatedCounter({
  etiqueta,
  desde,
  hasta,
  prefijo = "",
  sufijo = "",
  nota,
  retraso = 6,
  duracion = 40,
}: {
  etiqueta: string;
  desde: number;
  hasta: number;
  prefijo?: string;
  sufijo?: string;
  nota?: string;
  retraso?: number;
  duracion?: number;
}) {
  const f = useCurrentFrame();
  const entra = prog(f, 0, 12, CURVA.impacto);
  const valor = interpolate(f, [retraso, retraso + duracion], [desde, hasta], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CURVA.marca });
  const fin = prog(f, retraso + duracion, 10, CURVA.impacto);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: entra, transform: `scale(${0.9 + 0.1 * entra})` }}>
      <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 28, letterSpacing: "0.14em", textTransform: "uppercase", color: COLOR.suave, textAlign: "center" }}>{etiqueta}</span>
      <span
        style={{
          fontFamily: FUENTE.display,
          fontWeight: 800,
          fontSize: 230,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          backgroundImage: DEGRADADO,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          transform: `scale(${1 + 0.06 * fin * (1 - fin) * 4})`,
          filter: `drop-shadow(0 0 ${30 * fin}px rgb(0 194 255 / 0.45))`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {prefijo}
        {formato(valor)}
        {sufijo}
      </span>
      {nota && <span style={{ fontFamily: FUENTE.texto, fontWeight: 500, fontSize: 22, color: COLOR.apagado, opacity: fin }}>{nota}</span>}
    </div>
  );
}

export function Comparativa({
  titulo,
  filas,
  etiquetas = ["Antes", "Después"],
  nota,
  ancho = 880,
}: {
  titulo?: string;
  filas: { etiqueta: string; antes: number; despues: number; sufijo?: string }[];
  etiquetas?: [string, string];
  nota?: string;
  ancho?: number;
}) {
  const f = useCurrentFrame();
  const max = Math.max(1, ...filas.flatMap((r) => [r.antes, r.despues]));
  return (
    <div style={{ width: ancho, display: "flex", flexDirection: "column", gap: 26 }}>
      {titulo && <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 44, color: COLOR.tinta }}>{titulo}</span>}
      {filas.map((r, i) => {
        const t = prog(f, 8 + i * 10, 30, CURVA.marca);
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 26, color: COLOR.suave }}>{r.etiqueta}</span>
            {([
              [etiquetas[0], r.antes, COLOR.apagado],
              [etiquetas[1], r.despues, COLOR.cian],
            ] as const).map(([nombre, v, color], k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ width: 150, fontFamily: FUENTE.texto, fontSize: 22, color: COLOR.apagado }}>{nombre}</span>
                <div style={{ flex: 1, height: 34, borderRadius: 17, background: COLOR.superficie2, overflow: "hidden" }}>
                  <div style={{ width: `${(v / max) * 100 * t}%`, height: "100%", borderRadius: 17, background: k === 1 ? DEGRADADO : color }} />
                </div>
                <span style={{ width: 120, textAlign: "right", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 32, color: k === 1 ? COLOR.tinta : COLOR.suave }}>
                  {formato(v * t)}
                  {r.sufijo ?? ""}
                </span>
              </div>
            ))}
          </div>
        );
      })}
      {nota && <span style={{ fontFamily: FUENTE.texto, fontSize: 22, color: COLOR.apagado }}>{nota}</span>}
    </div>
  );
}
