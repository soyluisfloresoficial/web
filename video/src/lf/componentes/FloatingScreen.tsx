/**
 * Pantalla flotante con perspectiva 3D, sombra profunda, reflejo y parallax.
 * Muestra una maqueta, una imagen o una grabación de pantalla. Si hay varias
 * en la misma escena se escalonan en profundidad (la de atrás se mueve menos).
 */
import { Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE, SOMBRA_FLOTANTE } from "../marca";
import { Maqueta } from "../pantallas/Maquetas";
import type { Cursor, FuentePantalla } from "../tipos";
import { prog } from "../util";
import { GuidedCursor } from "./GuidedCursor";

const esVideo = (a: string) => /\.(mp4|webm|mov|m4v)$/i.test(a);

export function FloatingScreen({
  fuente,
  titulo,
  cursor,
  indice = 0,
  total = 1,
  inclinacion = 10,
  ancho = 880,
  alto = 560,
  retraso = 0,
  entrada = "deslizar",
}: {
  fuente: FuentePantalla;
  titulo?: string;
  cursor?: Cursor;
  indice?: number;
  total?: number;
  inclinacion?: number;
  ancho?: number;
  alto?: number;
  /** Fotogramas de espera antes de entrar. */
  retraso?: number;
  entrada?: "deslizar" | "mascara" | "zoom";
}) {
  const f = useCurrentFrame();
  const t = prog(f, retraso, 20, CURVA.impacto);

  // Profundidad: con dos pantallas, la primera queda atrás a la izquierda.
  const profundidad = total > 1 ? (indice === 0 ? -1 : 1) : 0;
  // En vertical se apilan: la de atrás arriba, la de delante abajo.
  const escalaCapa = total > 1 ? (indice === 0 ? 0.93 : 1) : 1;
  const desplX = total > 1 ? (indice === 0 ? -40 : 40) : 0;
  const desplY = total > 1 ? (indice === 0 ? -165 : 165) : 0;

  // Parallax: flotación lenta; la capa de atrás se mueve la mitad.
  const amp = profundidad < 0 ? 6 : 12;
  const flotY = Math.sin((f + indice * 23) / 28) * amp;
  const giroY = -inclinacion * (total > 1 ? (indice === 0 ? 1 : -0.6) : 0.6) + Math.sin(f / 45) * 1.5;
  const giroX = inclinacion * 0.55 + Math.cos(f / 50) * 1;

  const entradaTransform =
    entrada === "zoom"
      ? `translateZ(${(1 - t) * -500}px)`
      : entrada === "deslizar"
        ? `translateY(${(1 - t) * 260}px) translateZ(${(1 - t) * -200}px)`
        : "";
  const recorte = entrada === "mascara" ? `inset(${(1 - t) * 50}% 0% ${(1 - t) * 50}% 0% round 28px)` : undefined;
  const reflejo = ((f * 1.2) % 400) - 100;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: ancho,
        height: alto,
        marginLeft: -ancho / 2,
        marginTop: -alto / 2,
        perspective: 1800,
        zIndex: 5 + indice,
        opacity: entrada === "mascara" ? 1 : t,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `translate(${desplX}px, ${desplY + flotY}px) scale(${escalaCapa}) rotateX(${giroX}deg) rotateY(${giroY}deg) ${entradaTransform}`,
          clipPath: recorte,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 28,
            overflow: "hidden",
            background: COLOR.superficie,
            boxShadow: SOMBRA_FLOTANTE,
            border: "1px solid rgb(255 255 255 / 0.08)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Barra de ventana */}
          <div style={{ height: alto < 440 ? 42 : 52, flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: COLOR.base2, borderBottom: `1px solid ${COLOR.linea}` }}>
            {[COLOR.peligro, "#FFC857", COLOR.cta].map((c) => (
              <span key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.8 }} />
            ))}
            {titulo && (
              <span style={{ marginLeft: 12, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 20, color: COLOR.apagado, letterSpacing: "0.03em" }}>{titulo}</span>
            )}
          </div>
          <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
            {fuente.tipo === "archivo" ? (
              esVideo(fuente.archivo) ? (
                <OffthreadVideo src={staticFile(fuente.archivo)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Img src={staticFile(fuente.archivo)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )
            ) : (
              <Maqueta pantalla={fuente} compacto={alto < 440} />
            )}
            {cursor && <GuidedCursor cursor={cursor} />}
          </div>
          {/* Reflejo que cruza el cristal */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(115deg, transparent ${reflejo}%, rgb(255 255 255 / 0.06) ${reflejo + 8}%, transparent ${reflejo + 16}%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
