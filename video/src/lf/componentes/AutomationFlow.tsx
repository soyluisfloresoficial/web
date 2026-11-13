/**
 * Flujo animado de automatización (formulario → agente IA → CRM → agenda…).
 * Cada nodo entra, la conexión se dibuja y un pulso de luz viaja hasta el
 * siguiente, que se enciende al recibirlo. Vertical, pensado para 9:16.
 */
import { evolvePath } from "@remotion/paths";
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, CURVA, FUENTE } from "../marca";
import type { NodoFlujo } from "../tipos";
import { prog } from "../util";
import { Icono } from "./Icono";

export function AutomationFlow({
  nodos,
  titulo,
  ancho = 860,
  alto = 760,
  duracion,
}: {
  nodos: NodoFlujo[];
  titulo?: string;
  ancho?: number;
  alto?: number;
  /** Fotogramas disponibles: el flujo se reparte en el 70 % de la escena. */
  duracion: number;
}) {
  const f = useCurrentFrame();
  const n = nodos.length;
  const cabecera = titulo ? 70 : 0;
  const altoNodo = 116;
  const hueco = n > 1 ? (alto - cabecera - n * altoNodo) / (n - 1) : 0;
  const paso = Math.max(10, Math.min(36, Math.floor((duracion * 0.7) / Math.max(1, n))));
  const yNodo = (i: number) => cabecera + i * (altoNodo + hueco);

  return (
    <div style={{ position: "relative", width: ancho, height: alto }}>
      {titulo && (
        <div style={{ height: cabecera, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 24, letterSpacing: "0.16em", textTransform: "uppercase", color: COLOR.cian, opacity: prog(f, 0, 12) }}>
          {titulo}
        </div>
      )}
      <svg width={ancho} height={alto} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="lf-flujo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLOR.cian} />
            <stop offset="100%" stopColor={COLOR.violeta} />
          </linearGradient>
        </defs>
        {nodos.slice(0, -1).map((_, i) => {
          const x = 70;
          const y1 = yNodo(i) + altoNodo;
          const y2 = yNodo(i + 1);
          const d = `M ${x} ${y1} L ${x} ${y2}`;
          const inicio = i * paso + 12;
          const t = prog(f, inicio, paso - 4, CURVA.suave);
          const trazo = evolvePath(t, d);
          const pulsoY = interpolate(t, [0, 1], [y1, y2]);
          return (
            <g key={i}>
              <path d={d} stroke={COLOR.linea} strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" />
              <path d={d} stroke="url(#lf-flujo)" strokeWidth={5} strokeLinecap="round" strokeDasharray={trazo.strokeDasharray} strokeDashoffset={trazo.strokeDashoffset} />
              {t > 0 && t < 1 && <circle cx={x} cy={pulsoY} r={10} fill={COLOR.cta} style={{ filter: "drop-shadow(0 0 12px #00FFB3)" }} />}
            </g>
          );
        })}
      </svg>
      {nodos.map((nodo, i) => {
        const entra = prog(f, i * paso, 12, CURVA.impacto);
        const activo = prog(f, i * paso + (i === 0 ? 4 : 0), 8);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: yNodo(i),
              width: ancho,
              height: altoNodo,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 28px 0 12px",
              boxSizing: "border-box",
              borderRadius: 26,
              background: `linear-gradient(90deg, rgb(17 23 36 / 0.96), rgb(24 32 50 / 0.9))`,
              border: `1.5px solid rgb(0 194 255 / ${0.15 + 0.6 * activo})`,
              boxShadow: `0 20px 50px rgb(0 0 0 / 0.45), 0 0 ${40 * activo}px rgb(0 194 255 / ${0.22 * activo})`,
              opacity: entra,
              transform: `translateX(${(1 - entra) * -80}px) scale(${0.94 + 0.06 * entra})`,
            }}
          >
            <div style={{ width: 92, height: 92, borderRadius: 22, flexShrink: 0, display: "grid", placeItems: "center", background: `rgb(0 194 255 / ${0.1 + 0.12 * activo})`, color: activo > 0.5 ? COLOR.cian : COLOR.suave }}>
              <Icono nombre={nodo.icono} tam={46} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 36, color: COLOR.tinta, letterSpacing: "-0.01em" }}>{nodo.titulo}</span>
              {nodo.detalle && <span style={{ fontFamily: FUENTE.texto, fontWeight: 500, fontSize: 24, color: COLOR.suave }}>{nodo.detalle}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
