/**
 * Efectos de estudio del skill reel-efectos-motion sobre LF Motion (20/11/2026).
 * Todos usan al presentador recortado (herramientas/recorte.py) para colocar
 * cosas detrás o delante de él. La cara es zona prohibida: nada pasa por delante
 * de ella. Paleta ilustrativa (acentos cálidos y fríos) sobre la base de marca.
 */
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE } from "../marca";
import { prog } from "../util";

export const PALETA = {
  ambar: "#FFC15E",
  coral: "#FF7A90",
  cielo: "#5AD8FF",
  lila: "#B89CFF",
  menta: "#7CF5C9",
};
const COLORES = [PALETA.cielo, PALETA.ambar, PALETA.lila, PALETA.coral, PALETA.menta];

/** Set de marca vivo: degradado profundo, aurora, haces de luz, partículas desenfocadas y suelo. */
export function SetMarca({ suelo = true, tono = 0 }: { suelo?: boolean; tono?: number }) {
  const f = useCurrentFrame();
  const auroras = [
    { c: "rgb(0 194 255 / 0.55)", x: 20, y: 18, r: 620 },
    { c: "rgb(139 92 246 / 0.6)", x: 80, y: 30, r: 680 },
    { c: "rgb(255 122 144 / 0.32)", x: 70, y: 78, r: 560 },
    { c: "rgb(255 193 94 / 0.22)", x: 15, y: 70, r: 520 },
  ];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `linear-gradient(170deg, #071B33 0%, #0A2540 35%, #17104A 75%, #0B0820 100%)`, filter: tono ? `hue-rotate(${tono}deg)` : undefined }}>
      {auroras.map((a, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${a.x + Math.sin(f / (70 + i * 13) + i) * 6}%`,
            top: `${a.y + Math.cos(f / (80 + i * 11) + i) * 5}%`,
            width: a.r * 2,
            height: a.r * 2,
            marginLeft: -a.r,
            marginTop: -a.r,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${a.c} 0%, transparent 65%)`,
            filter: "blur(40px)",
          }}
        />
      ))}
      {/* Haces de luz */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: -400,
            left: 200 + i * 300 + Math.sin(f / 50 + i) * 40,
            width: 120,
            height: 2600,
            background: "linear-gradient(180deg, rgb(255 255 255 / 0.10), transparent 70%)",
            transform: `rotate(${18 - i * 6}deg)`,
            filter: "blur(18px)",
          }}
        />
      ))}
      {/* Partículas (bokeh) */}
      {Array.from({ length: 26 }, (_, i) => {
        const x = random(`x${i}`) * 1080;
        const y0 = random(`y${i}`) * 1920;
        const r = 6 + random(`r${i}`) * 26;
        const y = (y0 - f * (0.4 + random(`v${i}`) * 1.2) + 1920 * 4) % 1920;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r,
              height: r,
              borderRadius: "50%",
              background: COLORES[i % COLORES.length],
              opacity: 0.18 + random(`o${i}`) * 0.3,
              filter: `blur(${r > 20 ? 6 : 2}px)`,
            }}
          />
        );
      })}
      {suelo && (
        <div
          style={{
            position: "absolute",
            left: -300,
            right: -300,
            bottom: 0,
            height: 700,
            backgroundImage: "linear-gradient(rgb(90 216 255 / 0.18) 2px, transparent 2px), linear-gradient(90deg, rgb(184 156 255 / 0.18) 2px, transparent 2px)",
            backgroundSize: "120px 120px",
            backgroundPosition: `0 ${f * 1.5}px`,
            transform: "perspective(700px) rotateX(62deg)",
            transformOrigin: "bottom center",
            maskImage: "linear-gradient(to top, #000 10%, transparent 90%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
}

/** Presentador recortado: misma imagen que el video oculto, con brillo de borde y sombra. */
export function Presentador({ recorte, desde, escala = 0.92, x = 0, brillo = PALETA.cielo }: { recorte: string; desde: number; escala?: number; x?: number; brillo?: string }) {
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px) scale(${escala})`, transformOrigin: "50% 100%", filter: `drop-shadow(0 0 2px ${brillo}) drop-shadow(0 0 22px ${brillo}66)` }}>
      <OffthreadVideo src={staticFile(recorte)} startFrom={desde} transparent muted style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
}

/** Tapa los bordes del recorte reducido (abajo y laterales). */
export function Vineta() {
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, #0A0D24 0%, transparent 8%, transparent 92%, #0A0D24 100%)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 74%, rgb(8 10 30 / 0.85) 90%, #080A1E 100%)` }} />
    </>
  );
}

/* ---------- Órbita ---------- */
export function Orbita({ recorte, desde, tarjetas, credito }: { recorte: string; desde: number; tarjetas: { texto: string; imagen?: string }[]; credito?: string }) {
  const f = useCurrentFrame();
  const n = tarjetas.length;
  const cx = 540;
  const cy = 1060;
  const rx = 300;
  const ry = 110;
  const items = tarjetas.map((t, i) => {
    const ang = (i / n) * Math.PI * 2 + f * 0.018;
    const z = Math.sin(ang);
    const entra = prog(f, i * 3, 14, CURVA.impacto);
    return { t, i, x: cx + Math.cos(ang) * rx, y: cy + z * ry - 120 * (1 - entra), z, entra };
  });
  const tarjeta = (it: (typeof items)[number]) => {
    const s = 0.72 + 0.28 * ((it.z + 1) / 2);
    const color = COLORES[it.i % COLORES.length];
    return (
      <div
        key={it.i}
        style={{
          position: "absolute",
          left: it.x,
          top: it.y,
          transform: `translate(-50%, -50%) scale(${s * it.entra}) rotate(${Math.cos(it.i) * 6}deg)`,
          opacity: (0.55 + 0.45 * ((it.z + 1) / 2)) * it.entra,
          filter: it.z < 0 ? "blur(1.5px)" : undefined,
        }}
      >
        {it.t.imagen ? (
          <div style={{ width: 200, height: 260, borderRadius: 26, overflow: "hidden", border: `4px solid ${color}`, boxShadow: `0 20px 50px rgb(0 0 0 / 0.5), 0 0 30px ${color}55` }}>
            <Img src={staticFile(it.t.imagen)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ) : (
          <div style={{ width: 280, boxSizing: "border-box", padding: "16px 22px", borderRadius: "26px 26px 26px 6px", background: "rgb(255 255 255 / 0.92)", color: "#0A1630", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 30, lineHeight: 1.15, boxShadow: `0 20px 50px rgb(0 0 0 / 0.45), inset 6px 0 0 ${color}` }}>
            {it.t.texto}
          </div>
        )}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <SetMarca />
      {items.filter((it) => it.z < 0).map(tarjeta)}
      <Presentador recorte={recorte} desde={desde} escala={0.94} />
      <Vineta />
      {items.filter((it) => it.z >= 0).map(tarjeta)}
      {credito && <div style={{ position: "absolute", right: 160, top: 238, fontFamily: FUENTE.texto, fontSize: 16, color: "rgb(255 255 255 / 0.6)" }}>{credito}</div>}
    </AbsoluteFill>
  );
}

/* ---------- Muro de publicaciones (headline wall) ---------- */
export function MuroPosts({ recorte, desde, titulos, etiqueta, tachar }: { recorte: string; desde: number; titulos: string[]; etiqueta: string; tachar: number }) {
  const f = useCurrentFrame();
  const sitios = [
    { x: 70, y: 260, r: -9, detras: true },
    { x: 720, y: 290, r: 8, detras: true },
    { x: 40, y: 690, r: 6, detras: false },
    { x: 770, y: 700, r: -7, detras: false },
    { x: 380, y: 230, r: 3, detras: true },
  ];
  const fondos = [
    `linear-gradient(150deg, ${PALETA.ambar}, ${PALETA.coral})`,
    `linear-gradient(150deg, ${PALETA.cielo}, ${COLOR.violeta})`,
    `linear-gradient(150deg, ${PALETA.lila}, ${PALETA.coral})`,
    `linear-gradient(150deg, ${PALETA.menta}, ${PALETA.cielo})`,
    `linear-gradient(150deg, ${COLOR.violeta}, ${PALETA.ambar})`,
  ];
  const x = prog(f, tachar, 10, CURVA.impacto);
  const tile = (i: number) => {
    const s = sitios[i];
    const cae = prog(f, 2 + i * 4, 14, CURVA.impacto);
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: s.x,
          top: s.y - (1 - cae) * 500,
          width: 270,
          height: 330,
          borderRadius: 26,
          background: fondos[i % fondos.length],
          boxShadow: "0 30px 60px rgb(0 0 0 / 0.5)",
          transform: `rotate(${s.r}deg)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 22,
          boxSizing: "border-box",
          filter: x > 0 ? `grayscale(${x * 0.9}) brightness(${1 - 0.35 * x})` : undefined,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((k) => (
            <span key={k} style={{ width: 12, height: 12, borderRadius: 99, background: "rgb(255 255 255 / 0.7)" }} />
          ))}
        </div>
        <span style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 34, lineHeight: 1.08, color: "#fff", textShadow: "0 2px 12px rgb(0 0 0 / 0.3)" }}>{titulos[i % titulos.length]}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <SetMarca tono={-15} />
      {sitios.map((s, i) => (s.detras ? tile(i) : null))}
      <Presentador recorte={recorte} desde={desde} escala={0.9} />
      <Vineta />
      {sitios.map((s, i) => (!s.detras ? tile(i) : null))}
      {/* Sello rojo a la altura del pecho */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1140, display: "flex", justifyContent: "center", opacity: x, transform: `scale(${1.6 - 0.6 * x}) rotate(-6deg)` }}>
        <span style={{ padding: "14px 34px", borderRadius: 18, border: `6px solid ${COLOR.peligro}`, color: COLOR.peligro, background: "rgb(255 255 255 / 0.92)", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 64, letterSpacing: "0.04em", boxShadow: "0 20px 50px rgb(0 0 0 / 0.5)" }}>
          ✕ {etiqueta}
        </span>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- Notas adhesivas en los hombros (sobre el video original) ---------- */
export function Notas({ notas }: { notas: { texto: string; frame: number }[] }) {
  const f = useCurrentFrame();
  const sitios = [
    { x: 60, y: 980, r: -8, c: PALETA.ambar },
    { x: 700, y: 930, r: 7, c: PALETA.coral },
    { x: 330, y: 1150, r: -3, c: PALETA.lila },
  ];
  return (
    <AbsoluteFill>
      {notas.map((n, i) => {
        const s = sitios[i % sitios.length];
        const t = prog(f, n.frame, 10, CURVA.impacto);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: 330,
              padding: "26px 24px 30px",
              background: s.c,
              color: "#1A1230",
              fontFamily: FUENTE.display,
              fontWeight: 800,
              fontSize: 44,
              lineHeight: 1.05,
              boxShadow: "0 24px 40px rgb(0 0 0 / 0.45)",
              transform: `rotate(${s.r}deg) scale(${interpolate(t, [0, 0.6, 1], [0.2, 1.12, 1])})`,
              opacity: t,
              borderRadius: 6,
            }}
          >
            <div style={{ position: "absolute", top: -14, left: "38%", width: 90, height: 28, background: "rgb(255 255 255 / 0.55)", transform: "rotate(-4deg)" }} />
            {n.texto}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

/* ---------- Visor de cámara (digital zoom) ---------- */
export function Visor({ etiqueta = "1.30x" }: { etiqueta?: string }) {
  const f = useCurrentFrame();
  const t = prog(f, 0, 6, CURVA.impacto);
  const esquina = (pos: CSSProperties, rot: number) => (
    <div style={{ position: "absolute", width: 110, height: 110, borderTop: "6px solid #fff", borderLeft: "6px solid #fff", transform: `rotate(${rot}deg)`, opacity: 0.9, ...pos }} />
  );
  return (
    <AbsoluteFill style={{ opacity: t }}>
      {esquina({ left: 90, top: 260 }, 0)}
      {esquina({ right: 170, top: 260 }, 90)}
      {esquina({ right: 170, bottom: 470 }, 180)}
      {esquina({ left: 90, bottom: 470 }, 270)}
      <div style={{ position: "absolute", left: 110, top: 400, display: "flex", alignItems: "center", gap: 12, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 30, color: "#fff" }}>
        <span style={{ width: 22, height: 22, borderRadius: 99, background: "#FF3B4E", opacity: Math.floor(f / 8) % 2 ? 1 : 0.25 }} /> REC
      </div>
      <div style={{ position: "absolute", right: 190, top: 400, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 30, color: "#fff" }}>{etiqueta}</div>
    </AbsoluteFill>
  );
}

/* ---------- Tarjetas de cristal al lado del presentador ---------- */
export function TarjetasCristal({ recorte, desde, tarjetas }: { recorte: string; desde: number; tarjetas: { titulo: string; detalle: string; frame: number; tipo: "web" | "chat" | "flujo" }[] }) {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SetMarca tono={10} />
      <Presentador recorte={recorte} desde={desde} escala={0.9} x={-200} />
      <Vineta />
      {tarjetas.map((c, i) => {
        const t = prog(f, c.frame, 12, CURVA.impacto);
        const color = [PALETA.cielo, PALETA.ambar, PALETA.lila][i % 3];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              right: 150,
              top: 300 + i * 290,
              width: 430,
              height: 250,
              borderRadius: 28,
              padding: 22,
              boxSizing: "border-box",
              background: "linear-gradient(160deg, rgb(255 255 255 / 0.20), rgb(255 255 255 / 0.06))",
              border: `2px solid ${color}`,
              boxShadow: `0 30px 60px rgb(0 0 0 / 0.45), 0 0 40px ${color}44`,
              backdropFilter: "blur(14px)",
              opacity: t,
              transform: `translateX(${(1 - t) * 160}px) rotate(${(1 - t) * 8}deg)`,
            }}
          >
            {c.tipo === "web" && (
              <div style={{ height: 110, borderRadius: 14, background: "rgb(10 22 48 / 0.7)", padding: 12, boxSizing: "border-box" }}>
                <div style={{ height: 12, width: "60%", borderRadius: 6, background: color }} />
                <div style={{ height: 10, width: "85%", borderRadius: 5, background: "rgb(255 255 255 / 0.35)", marginTop: 12 }} />
                <div style={{ height: 10, width: "70%", borderRadius: 5, background: "rgb(255 255 255 / 0.25)", marginTop: 8 }} />
                <div style={{ height: 22, width: 120, borderRadius: 11, background: DEGRADADO, marginTop: 12 }} />
              </div>
            )}
            {c.tipo === "chat" && (
              <div style={{ height: 110, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                <div style={{ alignSelf: "flex-start", padding: "8px 14px", borderRadius: "14px 14px 14px 4px", background: "rgb(255 255 255 / 0.85)", color: "#0A1630", fontFamily: FUENTE.texto, fontSize: 18 }}>¿Cuánto tardan?</div>
                <div style={{ alignSelf: "flex-end", padding: "8px 14px", borderRadius: "14px 14px 4px 14px", background: color, color: "#1A1230", fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 18 }}>Aquí tienes los plazos ✓</div>
              </div>
            )}
            {c.tipo === "flujo" && (
              <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {[0, 1, 2].map((k) => (
                  <div key={k} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 62, height: 62, borderRadius: 18, background: k === 1 ? DEGRADADO : "rgb(255 255 255 / 0.2)", border: `2px solid ${color}` }} />
                    {k < 2 && <div style={{ width: 40, height: 4, background: color, opacity: prog(f, c.frame + 8 + k * 6, 6) }} />}
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 14, fontFamily: FUENTE.display, fontWeight: 800, fontSize: 32, color: "#fff" }}>{c.titulo}</div>
            <div style={{ fontFamily: FUENTE.texto, fontSize: 20, color: "rgb(255 255 255 / 0.75)", marginTop: 2 }}>{c.detalle}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

/* ---------- Cierre: frame break con el perfil ---------- */
export function CierrePerfil({ recorte, desde, usuario, enlace, etiqueta, accion, recurso }: { recorte: string; desde: number; usuario: string; enlace: string; etiqueta: string; accion: string; recurso: string }) {
  const f = useCurrentFrame();
  const a = prog(f, 0, 12, CURVA.impacto);
  const b = prog(f, 10, 12, CURVA.impacto);
  const toque = prog(f, 40, 8, CURVA.impacto);
  return (
    <AbsoluteFill>
      <SetMarca />
      {/* Marco del post: el presentador se sale por arriba */}
      <div style={{ position: "absolute", left: 90, right: 170, top: 760, bottom: 300, borderRadius: 48, background: "linear-gradient(170deg, rgb(255 255 255 / 0.16), rgb(255 255 255 / 0.04))", border: "2px solid rgb(255 255 255 / 0.35)", boxShadow: "0 40px 80px rgb(0 0 0 / 0.5)", opacity: a }} />
      <Presentador recorte={recorte} desde={desde} escala={0.82} x={-40} brillo={PALETA.lila} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 80%, #080A1E 100%)" }} />
      {/* Cabecera del perfil */}
      <div style={{ position: "absolute", left: 90, right: 170, top: 250, display: "flex", alignItems: "center", gap: 20, opacity: a, transform: `translateY(${(1 - a) * -30}px)` }}>
        <Img src={staticFile("logo/monograma-80.webp")} style={{ width: 110, height: 110, borderRadius: 99, boxShadow: `0 0 0 5px ${PALETA.cielo}, 0 0 40px ${PALETA.cielo}88` }} />
        <div>
          <div style={{ fontFamily: FUENTE.display, fontWeight: 800, fontSize: 38, color: "#fff" }}>{usuario}</div>
          <div style={{ fontFamily: FUENTE.texto, fontSize: 24, color: "rgb(255 255 255 / 0.75)" }}>IA y automatización para negocios</div>
          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 14, background: toque > 0 ? COLOR.cta : "rgb(255 255 255 / 0.14)", color: toque > 0 ? COLOR.base : "#fff", border: `2px solid ${COLOR.cta}`, fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 26, transform: `scale(${interpolate(toque, [0, 0.5, 1], [1, 0.92, 1.04])})`, boxShadow: toque > 0 ? "0 0 40px rgb(0 255 179 / 0.6)" : undefined }}>
            🔗 {enlace}
          </div>
        </div>
      </div>
      {/* Pegatina del recurso y la acción, a la altura del pecho */}
      <div style={{ position: "absolute", left: 0, right: 80, top: 1240, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: b, transform: `scale(${0.85 + 0.15 * b})` }}>
        <span style={{ padding: "10px 26px", borderRadius: 999, background: COLOR.cta, color: COLOR.base, fontFamily: FUENTE.display, fontWeight: 800, fontSize: 34, letterSpacing: "0.1em", transform: "rotate(-3deg)", boxShadow: "0 0 40px rgb(0 255 179 / 0.45)" }}>{etiqueta}</span>
        <span style={{ padding: "12px 26px", borderRadius: 18, background: "rgb(8 10 30 / 0.85)", color: "#fff", fontFamily: FUENTE.display, fontWeight: 800, fontSize: 46 }}>{accion}</span>
        <span style={{ padding: "8px 20px", borderRadius: 14, background: "rgb(7 9 13 / 0.82)", border: "1px solid rgb(255 255 255 / 0.12)", fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 28, color: "#fff" }}>{recurso}</span>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- Demo con el presentador delante (UI world) ---------- */
export function DemoConPresentador({ recorte, desde, children }: { recorte: string; desde: number; children: ReactNode }) {
  return (
    <AbsoluteFill>
      <SetMarca suelo={false} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 240, display: "flex", justifyContent: "center" }}>{children}</div>
      <Presentador recorte={recorte} desde={desde} escala={0.58} x={0} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 86%, #080A1E 100%)" }} />
    </AbsoluteFill>
  );
}
