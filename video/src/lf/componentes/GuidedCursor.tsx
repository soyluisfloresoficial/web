/**
 * Cursor guiado para demostraciones. Recorre los puntos (en % de la pantalla
 * que lo contiene) con movimiento suave, hace clic en el último y deja un
 * anillo de resaltado sobre el botón.
 */
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, CURVA } from "../marca";
import type { Cursor } from "../tipos";

/** Fotograma (relativo a la escena) en que el cursor hace clic. */
export function frameClic(c: Cursor, fps: number): number {
  return Math.round(((c.desde ?? 1) + (c.duracion ?? 1.6)) * fps);
}

export function GuidedCursor({ cursor }: { cursor: Cursor }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ini = Math.round((cursor.desde ?? 1) * fps);
  const clic = frameClic(cursor, fps);
  const pts = cursor.puntos;
  if (pts.length === 0 || f < ini - 6) return null;

  // Posición por tramos, cada uno con su propia curva.
  const tramos = Math.max(1, pts.length - 1);
  const t = interpolate(f, [ini, clic], [0, tramos], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = Math.min(tramos - 1, Math.floor(t));
  const local = CURVA.suave(Math.min(1, t - k));
  const a = pts[k];
  const b = pts[Math.min(pts.length - 1, k + 1)];
  const x = a.x + (b.x - a.x) * local;
  const y = a.y + (b.y - a.y) * local;

  const aparece = interpolate(f, [ini - 6, ini], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hizoClic = cursor.clic !== false;
  const presion = hizoClic ? interpolate(f, [clic - 2, clic, clic + 5], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const onda = hizoClic ? interpolate(f, [clic, clic + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CURVA.marca }) : 0;
  const resalte = hizoClic ? interpolate(f, [clic, clic + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
      {resalte > 0 && (
        <div
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: cursor.resalte?.ancho ?? 360,
            height: cursor.resalte?.alto ?? 84,
            transform: "translate(-50%, -50%)",
            borderRadius: 18,
            boxShadow: `0 0 0 ${4 * resalte}px ${COLOR.cta}, 0 0 50px rgb(0 255 179 / ${0.45 * resalte})`,
          }}
        />
      )}
      {onda > 0 && onda < 1 && (
        <div
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: 140 * onda,
            height: 140 * onda,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: `3px solid rgb(0 255 179 / ${1 - onda})`,
          }}
        />
      )}
      <svg
        width={54}
        height={54}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          opacity: aparece,
          transform: `translate(-6px, -4px) scale(${presion})`,
          transformOrigin: "6px 4px",
          filter: "drop-shadow(0 6px 10px rgb(0 0 0 / 0.5))",
        }}
      >
        <path d="M4 2.5v16.2l4.4-4.1 2.8 6.3 2.6-1.1-2.7-6.2h6.1L4 2.5Z" fill={COLOR.tinta} stroke={COLOR.base} strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
    </div>
  );
}
