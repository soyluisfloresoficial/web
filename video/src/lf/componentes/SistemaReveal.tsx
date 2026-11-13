/**
 * Revelación del sistema completo: una máscara circular se abre desde el
 * centro y aparece el agente con sus conexiones; los pulsos recorren las
 * líneas para mostrar que todo funciona junto.
 */
import { useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE } from "../marca";
import type { NodoFlujo } from "../tipos";
import { prog } from "../util";
import { Icono } from "./Icono";

export function SistemaReveal({
  nodos,
  titulo,
  centro = { titulo: "Agente IA", icono: "agente" },
  ancho = 920,
  alto = 760,
}: {
  nodos: NodoFlujo[];
  titulo?: string;
  centro?: NodoFlujo;
  ancho?: number;
  alto?: number;
}) {
  const f = useCurrentFrame();
  const mascara = prog(f, 0, 26, CURVA.marca);
  const cx = ancho / 2;
  const cy = alto / 2 + (titulo ? 30 : 0);
  const rx = ancho / 2 - 120;
  const ry = alto / 2 - 110;
  const pos = nodos.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / nodos.length;
    return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
  });

  return (
    <div style={{ position: "relative", width: ancho, height: alto, clipPath: `circle(${mascara * 75}% at 50% 52%)` }}>
      {titulo && (
        <div style={{ position: "absolute", top: 0, width: "100%", textAlign: "center", fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 24, letterSpacing: "0.16em", textTransform: "uppercase", color: COLOR.cian }}>
          {titulo}
        </div>
      )}
      <svg width={ancho} height={alto} style={{ position: "absolute", inset: 0 }}>
        {pos.map((p, i) => {
          const t = prog(f, 14 + i * 5, 14);
          const viaje = ((f - 30 - i * 7) % 40) / 40;
          return (
            <g key={i} opacity={t}>
              <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgb(0 194 255 / 0.35)" strokeWidth={3} strokeDasharray="4 10" />
              {f > 30 && viaje >= 0 && (
                <circle cx={cx + (p.x - cx) * viaje} cy={cy + (p.y - cy) * viaje} r={7} fill={COLOR.cta} style={{ filter: "drop-shadow(0 0 10px #00FFB3)" }} />
              )}
            </g>
          );
        })}
      </svg>
      {/* Centro */}
      <div
        style={{
          position: "absolute",
          left: cx - 110,
          top: cy - 110,
          width: 220,
          height: 220,
          borderRadius: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: DEGRADADO,
          boxShadow: `0 0 ${60 + Math.sin(f / 8) * 20}px rgb(0 194 255 / 0.55)`,
          color: COLOR.base,
          transform: `scale(${0.6 + 0.4 * prog(f, 4, 16, CURVA.impacto)})`,
        }}
      >
        <Icono nombre={centro.icono} tam={70} grosor={2} />
        <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 30 }}>{centro.titulo}</span>
      </div>
      {nodos.map((n, i) => {
        const t = prog(f, 16 + i * 5, 12, CURVA.impacto);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos[i].x - 105,
              top: pos[i].y - 72,
              width: 210,
              height: 144,
              borderRadius: 28,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: COLOR.superficie,
              border: "1.5px solid rgb(0 194 255 / 0.4)",
              boxShadow: "0 20px 40px rgb(0 0 0 / 0.45)",
              opacity: t,
              transform: `scale(${0.7 + 0.3 * t})`,
              color: COLOR.cian,
            }}
          >
            <Icono nombre={n.icono} tam={44} />
            <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 26, color: COLOR.tinta, textAlign: "center", lineHeight: 1.1, padding: "0 10px" }}>{n.titulo}</span>
          </div>
        );
      })}
    </div>
  );
}
