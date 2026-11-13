/**
 * Imagen real con movimiento lento de cámara (Ken Burns), esquinas
 * redondeadas, degradado inferior para que se lea lo que va encima y el
 * crédito del autor en pequeño. Sirve para fotos propias, de banco
 * (Pexels, Pixabay, Unsplash) o generadas con IA.
 */
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import { prog } from "../util";

const esVideo = (a: string) => /\.(mp4|webm|mov|m4v)$/i.test(a);

export function ImagenReal({
  archivo,
  credito,
  movimiento = "acercar",
  etiqueta,
  ancho,
  alto,
  duracion,
}: {
  archivo: string;
  credito?: string;
  movimiento?: "acercar" | "alejar" | "izquierda" | "derecha";
  etiqueta?: string;
  ancho: number;
  alto: number;
  /** Fotogramas de la escena: el movimiento dura toda la escena. */
  duracion: number;
}) {
  const f = useCurrentFrame();
  useVideoConfig();
  const entra = prog(f, 0, 14, CURVA.impacto);
  const t = interpolate(f, [0, Math.max(1, duracion)], [0, 1], { extrapolateRight: "clamp" });
  const escala = movimiento === "alejar" ? 1.14 - 0.1 * t : movimiento === "acercar" ? 1.04 + 0.1 * t : 1.1;
  const x = movimiento === "izquierda" ? 3 - 6 * t : movimiento === "derecha" ? -3 + 6 * t : 0;
  const estilo = { width: "100%", height: "100%", objectFit: "cover" as const, transform: `scale(${escala}) translateX(${x}%)` };
  return (
    <div
      style={{
        position: "relative",
        width: ancho,
        height: alto,
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 30px 60px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(255 255 255 / 0.08)",
        opacity: entra,
        transform: `scale(${0.94 + 0.06 * entra})`,
      }}
    >
      {esVideo(archivo) ? <OffthreadVideo src={staticFile(archivo)} muted style={estilo} /> : <Img src={staticFile(archivo)} style={estilo} />}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgb(7 9 13 / 0) 55%, rgb(7 9 13 / 0.55) 100%)" }} />
      {etiqueta && (
        <div style={{ position: "absolute", left: 18, top: 16, padding: "6px 14px", borderRadius: 999, background: "rgb(7 9 13 / 0.7)", border: `1px solid ${COLOR.cian}`, color: COLOR.cian, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 19, letterSpacing: "0.12em" }}>
          {etiqueta}
        </div>
      )}
      {credito && (
        <div style={{ position: "absolute", left: 16, bottom: 10, fontFamily: FUENTE.texto, fontWeight: 500, fontSize: 15, color: "rgb(255 255 255 / 0.7)", textShadow: "0 1px 4px rgb(0 0 0 / 0.8)" }}>{credito}</div>
      )}
    </div>
  );
}
