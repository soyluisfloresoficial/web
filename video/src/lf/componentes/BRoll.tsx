/**
 * Plano de recurso (B-roll) a pantalla completa: foto o video real que cubre
 * todo el lienzo, con movimiento lento de cámara, velo de marca arriba y
 * abajo para leer titulares y subtítulos, y el crédito en pequeño.
 * Se usa cuando la explicación es la protagonista y el avatar no está en pantalla.
 */
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE, ZONA_SEGURA } from "../marca";
import { prog } from "../util";

const esVideo = (a: string) => /\.(mp4|webm|mov|m4v)$/i.test(a);

export function BRoll({
  archivo,
  credito,
  movimiento = "acercar",
  duracion,
  oscurecer = 0.35,
  sinFundido = false,
}: {
  /** Corte seco: entra ya visible. */
  sinFundido?: boolean;
  archivo: string;
  credito?: string;
  movimiento?: "acercar" | "alejar" | "izquierda" | "derecha";
  duracion: number;
  /** Velo general sobre la imagen (0–1). */
  oscurecer?: number;
}) {
  const f = useCurrentFrame();
  const entra = sinFundido ? 1 : prog(f, 0, 10, CURVA.marca);
  const t = interpolate(f, [0, Math.max(1, duracion)], [0, 1], { extrapolateRight: "clamp" });
  const escala = movimiento === "alejar" ? 1.18 - 0.12 * t : movimiento === "acercar" ? 1.06 + 0.12 * t : 1.14;
  const x = movimiento === "izquierda" ? 3 - 6 * t : movimiento === "derecha" ? -3 + 6 * t : 0;
  const estilo = { position: "absolute" as const, inset: 0, width: "100%", height: "100%", objectFit: "cover" as const, transform: `scale(${escala}) translateX(${x}%)` };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: entra, background: COLOR.base }}>
      {esVideo(archivo) ? <OffthreadVideo src={staticFile(archivo)} muted style={estilo} /> : <Img src={staticFile(archivo)} style={{ ...estilo, filter: "contrast(1.05) saturate(0.95)" }} />}
      <div style={{ position: "absolute", inset: 0, background: `rgb(7 9 13 / ${oscurecer})` }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgb(7 9 13 / 0.88) 0%, rgb(7 9 13 / 0.35) 30%, rgb(7 9 13 / 0.1) 50%, rgb(7 9 13 / 0.45) 68%, rgb(7 9 13 / 0.92) 100%)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgb(0 194 255 / 0.12), transparent 40%, transparent 60%, rgb(139 92 246 / 0.16))", mixBlendMode: "screen" }} />
      {credito && (
        <div style={{ position: "absolute", right: ZONA_SEGURA.derecha, top: ZONA_SEGURA.arriba - 30, fontFamily: FUENTE.texto, fontWeight: 500, fontSize: 17, color: "rgb(255 255 255 / 0.6)", textShadow: "0 1px 4px rgb(0 0 0 / 0.8)" }}>
          {credito}
        </div>
      )}
    </div>
  );
}
