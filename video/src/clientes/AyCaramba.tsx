/**
 * Anuncio vertical para el restaurante Ay Caramba lounge (21/11/2026).
 * Material: video del cliente (publico/medios/aycaramba.mp4) y sus logos extraídos del mismo video.
 * Montaje al ritmo de una música latina propia a 104 BPM (herramientas/generar-musica-latina.mjs):
 * cada toma dura un número exacto de tiempos, corte seco en el tiempo y nombre del plato al entrar.
 * Se quitan los destellos blancos y fundidos en gris del original, y las tomas con franjas negras
 * se amplían hasta llenar el cuadro.
 */
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

for (const [familia, archivo] of [
  ["Lobster", "lobster-latin-400-normal.woff2"],
  ["Bebas Neue", "bebas-neue-latin-400-normal.woff2"],
] as const) {
  loadFont({ family: familia, url: staticFile(`fonts/${archivo}`) });
}

export const FPS = 30;
const BPM = 104;
const TIEMPO = (60 / BPM) * FPS; // 17,31 fotogramas
const VIDEO = "medios/aycaramba.mp4";
const ORO = "linear-gradient(180deg, #FFF1C2 0%, #FFD36B 45%, #F2A93B 75%, #C9761E 100%)";
const CREMA = "#FFF3D6";
const CAFE = "#3A1D0A";

type Relleno = "completo" | "franjas" | "franjaAbajo";
type Toma = { desde: number; tiempos: number; velocidad: number; relleno?: Relleno; plato?: string; zoom?: [number, number]; destello?: boolean; /** Tiempos de espera antes del nombre (cuando el plato entra más tarde en la toma). */ retrasoPlato?: number };

/** Guion de tomas: segundo de inicio en el original, duración en tiempos de la música y velocidad. */
export const TOMAS: Toma[] = [
  { desde: 13.7, tiempos: 3, velocidad: 1, zoom: [1.12, 1.0] }, // gancho: arepa
  { desde: 2.3, tiempos: 3, velocidad: 0.87, plato: "Café recién hecho", zoom: [1.0, 1.08], destello: true },
  { desde: 5.0, tiempos: 5, velocidad: 1.6, zoom: [1.05, 1.12] },
  { desde: 11.2, tiempos: 2, velocidad: 1.15, relleno: "franjas", plato: "Arepas", zoom: [1.0, 1.06], destello: true },
  { desde: 15.5, tiempos: 3, velocidad: 1, zoom: [1.08, 1.0] },
  { desde: 18.35, tiempos: 2, velocidad: 0.5, relleno: "franjas", plato: "Tequeños", zoom: [1.0, 1.08], destello: true },
  { desde: 19.7, tiempos: 4, velocidad: 1.3, plato: "Empanadas", zoom: [1.0, 1.06] },
  { desde: 23.3, tiempos: 3, velocidad: 1.15, relleno: "franjas", zoom: [1.04, 1.0] },
  { desde: 26.0, tiempos: 6, velocidad: 1.4, plato: "Desayuno criollo", retrasoPlato: 2, zoom: [1.0, 1.08], destello: true },
  { desde: 31.5, tiempos: 3, velocidad: 0.92, relleno: "franjas", plato: "Café + empanada", zoom: [1.06, 1.0] },
];
const TIEMPOS_CIERRE = 6;
const inicioTiempo = (n: number) => Math.round(n * TIEMPO);
const TIEMPOS_TOTALES = TOMAS.reduce((s, t) => s + t.tiempos, 0) + TIEMPOS_CIERRE;
export const DURACION = inicioTiempo(TIEMPOS_TOTALES) + 6;

const escalaRelleno = (r: Relleno = "completo") => (r === "franjas" ? { s: 1280 / 960, origen: "50% 50%" } : r === "franjaAbajo" ? { s: 1280 / 1120, origen: "50% 0%" } : { s: 1, origen: "50% 50%" });

function Plano({ toma, duracion }: { toma: Toma; duracion: number }) {
  const f = useCurrentFrame();
  const [z0, z1] = toma.zoom ?? [1, 1];
  const z = interpolate(f, [0, duracion], [z0, z1]);
  const r = escalaRelleno(toma.relleno);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <AbsoluteFill style={{ transform: `scale(${r.s})`, transformOrigin: r.origen }}>
          <OffthreadVideo
            src={staticFile(VIDEO)}
            muted
            startFrom={Math.round(toma.desde * FPS)}
            playbackRate={toma.velocidad}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.1) saturate(1.22) brightness(1.04)" }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* Etalonaje cálido y viñeta */}
      <AbsoluteFill style={{ background: "rgb(255 140 50 / 0.10)", mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgb(20 8 0 / 0.55) 100%)" }} />
      {/* Degradado bajo para que se lean los textos */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 55%, rgb(25 10 0 / 0.55) 82%, rgb(25 10 0 / 0.7) 100%)" }} />
    </AbsoluteFill>
  );
}

function Destello() {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 3, 10], [0, 0.55, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "radial-gradient(circle at 85% 20%, #FFB347 0%, rgb(255 120 40 / 0.6) 30%, transparent 65%)", mixBlendMode: "screen", opacity: o }} />;
}

function NombrePlato({ texto }: { texto: string }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f, fps, config: { damping: 14, stiffness: 180 } });
  const linea = interpolate(f, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 80, right: 160, top: 1250, transform: `translateY(${(1 - e) * 40}px)`, opacity: e }}>
      <div style={{ fontFamily: "Lobster", fontSize: 118, lineHeight: 1.05, color: CREMA, textShadow: `0 4px 0 ${CAFE}, 0 10px 30px rgb(0 0 0 / 0.6)` }}>{texto}</div>
      <div style={{ marginTop: 14, height: 8, width: `${linea * 62}%`, borderRadius: 8, background: ORO, boxShadow: "0 0 18px rgb(255 190 80 / 0.6)" }} />
    </div>
  );
}

function Gancho() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f - 2, fps, config: { damping: 9, stiffness: 160 } });
  const b = spring({ frame: f - Math.round(TIEMPO * 1.5), fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1120, textAlign: "center", transform: `scale(${0.6 + 0.4 * a}) rotate(${(1 - a) * -6}deg)`, opacity: Math.min(1, a * 1.4) }}>
        <div
          style={{
            fontFamily: "Lobster",
            fontSize: 172,
            lineHeight: 1,
            backgroundImage: ORO,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: `drop-shadow(0 5px 0 ${CAFE}) drop-shadow(0 14px 30px rgb(0 0 0 / 0.6))`,
          }}
        >
          ¡Ay, caramba!
        </div>
      </div>
      <div style={{ position: "absolute", top: 1330, fontFamily: "Bebas Neue", fontSize: 96, letterSpacing: "0.12em", color: CREMA, textShadow: "0 6px 24px rgb(0 0 0 / 0.7)", opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>
        ¡QUÉ SABOR!
      </div>
    </AbsoluteFill>
  );
}

function SelloLogo() {
  return (
    <div style={{ position: "absolute", left: 60, top: 270, width: 132, height: 132, borderRadius: 999, overflow: "hidden", boxShadow: "0 0 0 4px rgb(255 211 107 / 0.9), 0 12px 30px rgb(0 0 0 / 0.5)" }}>
      <Img src={staticFile("medios/aycaramba-logo-redondo.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

function Cierre() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: f, fps, config: { damping: 12, stiffness: 120 } });
  const t1 = spring({ frame: f - 12, fps, config: { damping: 14 } });
  const t2 = spring({ frame: f - 22, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120700" }}>
      {/* Fondo: la mesa completa desenfocada */}
      <AbsoluteFill style={{ transform: "scale(1.15)", filter: "blur(26px) brightness(0.45) saturate(1.3)" }}>
        <OffthreadVideo src={staticFile(VIDEO)} muted startFrom={Math.round(28 * FPS)} playbackRate={0.6} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* Rayos de luz detrás del logo */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 260,
            width: 1100,
            height: 1100,
            borderRadius: 999,
            background: "repeating-conic-gradient(from 0deg, rgb(255 200 90 / 0.16) 0deg 8deg, transparent 8deg 22deg)",
            transform: `rotate(${f * 0.4}deg) scale(${logo})`,
            maskImage: "radial-gradient(circle, #000 25%, transparent 68%)",
            WebkitMaskImage: "radial-gradient(circle, #000 25%, transparent 68%)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 340, width: 620, height: 620, borderRadius: 999, overflow: "hidden", transform: `scale(${0.5 + 0.5 * logo})`, opacity: logo, boxShadow: "0 0 0 8px rgb(255 211 107 / 0.95), 0 0 80px rgb(255 170 60 / 0.55), 0 30px 60px rgb(0 0 0 / 0.6)" }}>
          <Img src={staticFile("medios/aycaramba-logo-redondo.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", top: 1060, fontFamily: "Lobster", fontSize: 140, color: CREMA, textShadow: `0 5px 0 ${CAFE}, 0 14px 30px rgb(0 0 0 / 0.6)`, opacity: t1, transform: `translateY(${(1 - t1) * 40}px)` }}>Te esperamos</div>
        <div style={{ position: "absolute", top: 1240, padding: "14px 40px", borderRadius: 999, background: ORO, color: CAFE, fontFamily: "Bebas Neue", fontSize: 76, letterSpacing: "0.1em", boxShadow: "0 0 40px rgb(255 190 80 / 0.5)", opacity: t2, transform: `scale(${0.8 + 0.2 * t2})` }}>VEN A PROBARLO</div>
        <div style={{ position: "absolute", top: 1420, fontFamily: "Bebas Neue", fontSize: 54, letterSpacing: "0.16em", color: CREMA, opacity: spring({ frame: f - 32, fps, config: { damping: 16 } }) * 0.9 }}>AREPAS · TEQUEÑOS · EMPANADAS · CAFÉ</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function AyCaramba() {
  let t = 0;
  const bloques = TOMAS.map((toma, i) => {
    const desde = inicioTiempo(t);
    t += toma.tiempos;
    const hasta = inicioTiempo(t);
    return { toma, i, desde, dur: hasta - desde };
  });
  const inicioCierre = inicioTiempo(t);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {bloques.map(({ toma, i, desde, dur }) => (
        <Sequence key={i} from={desde} durationInFrames={dur}>
          <Plano toma={toma} duracion={dur} />
          {toma.destello && <Destello />}
          {toma.plato && (
            <Sequence from={Math.round((toma.retrasoPlato ?? 0) * TIEMPO)}>
              <NombrePlato texto={toma.plato} />
              <Audio src={staticFile("sfx/pop.wav")} volume={0.18} />
            </Sequence>
          )}
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={bloques[0].dur}>
        <Gancho />
      </Sequence>
      <Sequence from={bloques[1].desde} durationInFrames={inicioCierre - bloques[1].desde}>
        <SelloLogo />
      </Sequence>
      <Sequence from={inicioCierre}>
        <Cierre />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.25} />
      </Sequence>
      <Audio src={staticFile("medios/musica-aycaramba.wav")} volume={(f) => interpolate(f, [0, 6], [0, 0.9], { extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
}
