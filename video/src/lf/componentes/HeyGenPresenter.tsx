/**
 * Avatar de HeyGen. Es un único video continuo durante todo el reel (la voz
 * nunca se corta); lo que cambia es la caja donde se ve: completo, mitad
 * superior, burbuja u oculto. El paso de una a otra se anima en 14 fotogramas.
 */
import { OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CAJAS, mezclarCaja, type Caja } from "../disposicion";
import { COLOR, CURVA } from "../marca";
import type { EscenaResuelta } from "../tiempo";
import { factorZoom, type GolpeZoom } from "./ImpactZoom";
import { Placeholder } from "./Placeholder";
import { prog } from "../util";

const TRANSICION = 12;

/** Caja de una escena: en pantalla completa alterna plano abierto y cerrado y se acerca despacio. */
function cajaEscena(escenas: EscenaResuelta[], i: number, frame: number): Caja {
  const e = escenas[i];
  const disp = e?.presentador ?? "completo";
  const base = CAJAS[disp];
  if (!e) return base;
  const avanceEsc = Math.min(1, Math.max(0, (frame - e.desde) / Math.max(1, e.hasta - e.desde)));
  if (disp !== "completo") return e.acercamiento ? { ...base, z: base.z * (1 + (e.acercamiento - 1) * avanceEsc) } : base;
  const nCompletas = escenas.slice(0, i).filter((x) => (x.presentador ?? "completo") === "completo").length;
  const cerrado = nCompletas % 2 === 1;
  const avance = Math.min(1, Math.max(0, (frame - e.desde) / Math.max(1, e.hasta - e.desde)));
  return { ...base, z: (cerrado ? 1.17 : 1.0) * (1 + 0.04 * avance), fy: 0.33 };
}

export function cajaEnFrame(frame: number, escenas: EscenaResuelta[], cortesSecos = false): Caja {
  const i = Math.max(0, escenas.findIndex((e) => frame >= e.desde && frame < e.hasta));
  if ((escenas[i]?.presentador ?? "completo") === "oculto" && i > 0 && (escenas[i - 1].presentador ?? "completo") === "oculto") {
    return { ...CAJAS.completo, opacidad: 0 };
  }
  const actual = cajaEscena(escenas, i, frame);
  if (i === 0) return actual;
  const dispPrevia = escenas[i - 1].presentador ?? "completo";
  const dispActual = escenas[i].presentador ?? "completo";
  // Entre dos planos a pantalla completa, corte seco (salto de plano), como en los reels.
  if (dispPrevia === "completo" && dispActual === "completo") return actual;
  const previa = cajaEscena(escenas, i - 1, escenas[i].desde - 1);
  const t = prog(frame, escenas[i].desde, TRANSICION, CURVA.marca);
  // Hacia o desde «oculto» (explicación a pantalla completa): fundido, sin encoger el avatar.
  if (dispActual === "oculto") return { ...previa, opacidad: cortesSecos ? 0 : 1 - prog(frame, escenas[i].desde, 8, CURVA.marca) };
  if (dispPrevia === "oculto") return { ...actual, opacidad: cortesSecos ? 1 : prog(frame, escenas[i].desde, 8, CURVA.marca) };
  return mezclarCaja(previa, actual, t);
}

export function HeyGenPresenter({
  avatar,
  escenas,
  golpes,
  anchoFuente = 1080,
  altoFuente = 1920,
  etalonaje = false,
  cortesSecos = false,
}: {
  cortesSecos?: boolean;
  /** Etalonaje de marca: algo más de contraste y viñeta con tinte cian/violeta en los bordes. */
  etalonaje?: boolean;
  avatar: string | null;
  escenas: EscenaResuelta[];
  golpes: GolpeZoom[];
  anchoFuente?: number;
  altoFuente?: number;
}) {
  const f = useCurrentFrame();
  const c = cajaEnFrame(f, escenas, cortesSecos);
  // Aunque no se vea (opacidad 0), el video sigue montado: su audio es la voz.

  // Tamaño del video para cubrir la caja con el zoom pedido y el golpe de impacto.
  const zoom = c.z * factorZoom(f, golpes);
  const s = Math.max(c.w / anchoFuente, c.h / altoFuente) * zoom;
  const W = anchoFuente * s;
  const H = altoFuente * s;
  let left = c.w / 2 - c.fx * W;
  let top = c.h / 2 - c.fy * H;
  // Sin bordes vacíos: el video siempre cubre la caja.
  left = Math.min(0, Math.max(c.w - W, left));
  top = Math.min(0, Math.max(c.h - H, top));

  const radio = `${c.rArriba}px ${c.rArriba}px ${c.rAbajo}px ${c.rAbajo}px`;

  return (
    <div
      style={{
        position: "absolute",
        left: c.x,
        top: c.y,
        width: c.w,
        height: c.h,
        borderRadius: radio,
        overflow: "hidden",
        opacity: c.opacidad,
        boxShadow:
          c.anillo > 0
            ? `0 0 0 ${3 * c.anillo}px rgb(0 194 255 / ${0.9 * c.anillo}), 0 0 ${60 * c.anillo}px rgb(0 194 255 / ${0.35 * c.anillo}), 0 30px 60px rgb(0 0 0 / ${0.5 * c.anillo})`
            : undefined,
        background: COLOR.base2,
        zIndex: 2,
      }}
    >
      {avatar ? (
        <OffthreadVideo
          src={staticFile(avatar)}
          style={{ position: "absolute", left, top, width: W, height: H, maxWidth: "none", filter: etalonaje ? "contrast(1.07) saturate(1.06) brightness(0.98)" : undefined }}
        />
      ) : (
        <Placeholder texto="Video del avatar de HeyGen" />
      )}
      {etalonaje && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 85% 75% at 50% 42%, transparent 55%, rgb(7 9 13 / 0.55) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgb(0 194 255 / 0.10) 0%, transparent 35%, transparent 65%, rgb(139 92 246 / 0.12) 100%)", mixBlendMode: "screen" }} />
        </>
      )}
      {/* Viñeta inferior en modo completo para que los textos se lean sobre la ropa. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgb(7 9 13 / 0) 45%, rgb(7 9 13 / 0.55) 100%)",
          opacity: c.w > 1000 && c.h > 1800 ? 1 : 0.4,
        }}
      />
    </div>
  );
}
