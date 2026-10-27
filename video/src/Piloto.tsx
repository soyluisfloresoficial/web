/**
 * Piloto de motion graphics (27/10/2026): la historia de la sección
 * «Por dentro» de la portada, en 15 segundos.
 *
 * Son las 22:14 y entra un mensaje → el agente contesta → la cita entra en
 * la agenda → el papeleo se hace solo → todo queda medido → cierre.
 *
 * Los textos salen de src/components/Showcase.astro: no hay cifras, clientes
 * ni promesas nuevas. Las proporciones del embudo son de ejemplo, igual que
 * en la web, y el video lo dice en pantalla («Ejemplo ilustrativo»).
 *
 * Colores y fuentes de la marca (src/styles/global.css): navy, azul
 * eléctrico y violeta; Manrope en títulos e Inter en texto. Las fuentes se
 * leen de la carpeta public/ de la web (--public-dir=../public).
 */
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";

// ------------------------------------------------------------------ Marca
const C = {
  navy: "#07090d",
  navy2: "#0a0e1a",
  superficie: "#101522",
  electrico: "#007bff",
  electricoSuave: "#66b2ff",
  violeta: "#8b5cf6",
  turquesa: "#2dd4bf",
  whatsapp: "#25d366",
  tinta: "#f8fafc",
  suave: "#a7b0c0",
  apagado: "#778398",
  linea: "#263248",
  divisor: "#ffffff14",
};
const DEGRADADO = "linear-gradient(110deg, #007bff 0%, #6366f1 55%, #8b5cf6 100%)";
const DISPLAY = "Manrope, sans-serif";
const TEXTO = "Inter, sans-serif";

for (const [familia, archivo, peso] of [
  ["Manrope", "manrope-latin-700-normal.woff2", "700"],
  ["Manrope", "manrope-latin-800-normal.woff2", "800"],
  ["Inter", "inter-latin-400-normal.woff2", "400"],
  ["Inter", "inter-latin-500-normal.woff2", "500"],
  ["Inter", "inter-latin-600-normal.woff2", "600"],
] as const) {
  loadFont({ family: familia, url: staticFile(`fonts/${archivo}`), weight: peso });
}

// La misma curva que --ease en la web.
const EASE = Easing.bezier(0.22, 0.61, 0.36, 1);

/** Progreso 0 → 1 con la curva de la marca. */
function prog(frame: number, desde: number, dur = 18) {
  return interpolate(frame, [desde, desde + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
}

// ------------------------------------------------------------------ Escenas
// Cada escena se solapa 5 fotogramas con la siguiente para el fundido.
const ESCENAS = {
  hora: { desde: 0, dur: 80 },
  chat: { desde: 75, dur: 95 },
  agenda: { desde: 165, dur: 95 },
  registro: { desde: 255, dur: 95 },
  embudo: { desde: 345, dur: 65 },
  cierre: { desde: 405, dur: 45 },
};
export const DURACION = 450;

const iconos = {
  agente: "M4 8h16v11H4zM12 4v4M9 13h.01M15 13h.01M9.5 16h5",
  whatsapp:
    "M3.5 20.5 4.8 16.4A8.5 8.5 0 1 1 8 19.3l-4.5 1.2ZM9 8.6c.2 3.4 3 6.2 6.4 6.4l1.1-1.5-2-1.1-1 .9a4.3 4.3 0 0 1-2.3-2.3l.9-1-1.1-2L9 8.6Z",
  calendario: "M3.5 5h17v15h-17zM3.5 10h17M8 3v4M16 3v4",
  calendarioOk: "M3.5 5h17v15h-17zM3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4",
  persona: "M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM4.5 20.5a7.5 7.5 0 0 1 15 0",
  check: "m5 12.5 4.5 4.5L19 7.5",
  email: "M3 5h18v14H3zM4 7l8 6 8-6",
  chat: "M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z",
  embudo: "M4 5h16l-6 7.5V19l-4-2v-4.5L4 5Z",
};

function Icono({ d, tam = 28, color = "currentColor" }: { d: string; tam?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tam}
      height={tam}
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  );
}

// ------------------------------------------------------------------ Fondo
function Fondo() {
  const f = useCurrentFrame();
  const deriva = f * 0.35;
  return (
    <AbsoluteFill style={{ background: C.navy, overflow: "hidden" }}>
      {/* Brillos de la marca, que se desplazan despacio. */}
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          left: -500 + Math.sin(f / 70) * 60,
          top: -700 + Math.cos(f / 90) * 40,
          background: "radial-gradient(circle, rgb(0 123 255 / 0.22), transparent 62%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          right: -500 + Math.cos(f / 80) * 60,
          bottom: -700 + Math.sin(f / 60) * 40,
          background: "radial-gradient(circle, rgb(139 92 246 / 0.2), transparent 62%)",
        }}
      />
      {/* Cuadrícula fina que avanza en diagonal. */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: `${deriva}px ${deriva}px`,
          maskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, #000 40%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
}

function Marco({ vertical }: { vertical: boolean }) {
  const f = useCurrentFrame();
  const p = prog(f, 4, 20);
  return (
    <AbsoluteFill style={{ padding: vertical ? "90px 70px" : "56px 72px", opacity: p, pointerEvents: "none" }}>
      {/* En vertical el aviso va debajo del logo: al lado no cabe. */}
      <div
        style={{
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          justifyContent: "space-between",
          alignItems: vertical ? "flex-start" : "center",
          gap: 16,
        }}
      >
        <Img src={staticFile("logo/nombre-360.webp")} style={{ height: 52, width: "auto" }} />
        <span
          style={{
            fontFamily: TEXTO,
            fontWeight: 500,
            fontSize: vertical ? 22 : 18,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.apagado,
          }}
        >
          Ejemplo ilustrativo
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ Piezas
/** Escena con fundido de entrada y de salida. */
function Escena({ dur, children }: { dur: number; children: ReactNode }) {
  const f = useCurrentFrame();
  const entra = prog(f, 0, 10);
  const sale = interpolate(f, [dur - 8, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        opacity: entra * (1 - sale),
        transform: `translateY(${-sale * 30}px) scale(${1 - sale * 0.02})`,
        filter: sale > 0 ? `blur(${sale * 6}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

const textoDegradado: CSSProperties = {
  backgroundImage: DEGRADADO,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/** Titular cinético: entra palabra por palabra, desde abajo y desenfocado. */
function Titular({
  texto,
  desde = 0,
  tam,
  resaltar = [],
  centro = false,
}: {
  texto: string;
  desde?: number;
  tam: number;
  resaltar?: string[];
  centro?: boolean;
}) {
  const f = useCurrentFrame();
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: tam,
        lineHeight: 1.04,
        letterSpacing: "-0.03em",
        color: C.tinta,
        textAlign: centro ? "center" : "left",
        textWrap: "balance",
      }}
    >
      {texto.split(" ").map((palabra, i) => {
        const p = prog(f, desde + i * 3, 16);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.24em",
              opacity: p,
              transform: `translateY(${(1 - p) * 0.55}em)`,
              filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
              ...(resaltar.includes(palabra) ? textoDegradado : null),
            }}
          >
            {palabra}
          </span>
        );
      })}
    </h1>
  );
}

/** Antetítulo con número y un filete que se dibuja. */
function Etiqueta({ num, texto, tam }: { num: string; texto: string; tam: number }) {
  const f = useCurrentFrame();
  const p = prog(f, 2, 16);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, marginBottom: tam * 1.2 }}>
      <span
        style={{
          width: 64,
          height: 2,
          background: DEGRADADO,
          transform: `scaleX(${p})`,
          transformOrigin: "left",
        }}
      />
      <span
        style={{
          fontFamily: TEXTO,
          fontWeight: 600,
          fontSize: tam,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: C.electricoSuave,
        }}
      >
        {num} · {texto}
      </span>
    </div>
  );
}

/**
 * Ventana de aplicación, la misma idea que las maquetas de la web: entra
 * inclinada en perspectiva y se endereza.
 */
function Ventana({ titulo, ancho, extra, children }: { titulo: string; ancho: number; extra?: ReactNode; children: ReactNode }) {
  const f = useCurrentFrame();
  const p = prog(f, 4, 26);
  return (
    <div style={{ perspective: 2000 }}>
      <div
        style={{
          width: ancho,
          borderRadius: 24,
          border: `1px solid ${C.linea}`,
          background: C.navy2,
          overflow: "hidden",
          opacity: p,
          transform: `translateY(${(1 - p) * 60}px) rotateX(${(1 - p) * 14}deg) rotateY(${(1 - p) * -18}deg)`,
          boxShadow: "0 40px 120px -40px rgb(91 63 196 / 0.55), 0 30px 80px -40px #000, inset 0 1px 0 rgb(255 255 255 / 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: "16px 22px",
            borderBottom: `1px solid ${C.divisor}`,
            background: "rgb(255 255 255 / 0.04)",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c, opacity: 0.85 }} />
          ))}
        </div>
        <div style={{ padding: 30 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: TEXTO,
              fontWeight: 600,
              fontSize: 24,
              color: C.tinta,
              marginBottom: 24,
            }}
          >
            <span>{titulo}</span>
            {extra}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Disposición de las escenas 2 a 5: texto y ventana, en fila o en columna. */
function Dos({ vertical, texto, ventana }: { vertical: boolean; texto: ReactNode; ventana: ReactNode }) {
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        alignItems: vertical ? "flex-start" : "center",
        justifyContent: "center",
        gap: vertical ? 90 : 110,
        padding: vertical ? "0 80px" : "0 130px",
      }}
    >
      <div style={{ width: vertical ? "100%" : 720, flexShrink: 0 }}>{texto}</div>
      <div style={{ alignSelf: "center" }}>{ventana}</div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ 1. 22:14
function EscenaHora({ vertical }: { vertical: boolean }) {
  const f = useCurrentFrame();
  const reloj = prog(f, 4, 22);
  const aviso = prog(f, 34, 18);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34 }}>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: vertical ? 300 : 280,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          opacity: reloj,
          transform: `scale(${0.82 + reloj * 0.18})`,
          filter: `blur(${(1 - reloj) * 16}px)`,
          ...textoDegradado,
        }}
      >
        22:14
      </div>
      <Titular texto="Entra un mensaje." desde={16} tam={vertical ? 96 : 92} centro />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginTop: 16,
          padding: "20px 28px",
          maxWidth: vertical ? 900 : 980,
          borderRadius: 22,
          border: `1px solid ${C.linea}`,
          background: "rgb(16 21 34 / 0.85)",
          boxShadow: "0 30px 80px -30px #000",
          opacity: aviso,
          transform: `translateY(${(1 - aviso) * 40}px)`,
        }}
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "rgb(37 211 102 / 0.14)",
          }}
        >
          <Icono d={iconos.whatsapp} tam={30} color={C.whatsapp} />
        </span>
        <span style={{ fontFamily: TEXTO, fontSize: vertical ? 30 : 28, color: C.suave, lineHeight: 1.35 }}>
          <b style={{ color: C.tinta, fontWeight: 600 }}>WhatsApp · ahora</b>
          <br />
          ¿Tienen disponibilidad esta semana para una primera consulta?
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ 2. Chat
const conversacion = [
  { de: "cliente", texto: "Hola, ¿tienen disponibilidad esta semana para una primera consulta?", hora: "22:14", en: 12 },
  { de: "agente", texto: "¡Hola! Sí, tengo el jueves a las 10:00 o el viernes a las 17:30. ¿Cuál te queda mejor?", hora: "22:14", en: 38 },
  { de: "cliente", texto: "El jueves a las 10, perfecto.", hora: "22:15", en: 56 },
  { de: "agente", texto: "Listo, te agendé el jueves a las 10:00.", hora: "22:15", en: 70 },
];

function Escribiendo({ desde, hasta }: { desde: number; hasta: number }) {
  const f = useCurrentFrame();
  if (f < desde || f >= hasta) return null;
  return (
    <div
      style={{
        alignSelf: "flex-end",
        display: "flex",
        gap: 8,
        padding: "16px 20px",
        borderRadius: 20,
        background: "rgb(255 255 255 / 0.08)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 99,
            background: C.suave,
            opacity: 0.35 + 0.65 * Math.abs(Math.sin((f - desde) / 4 - i * 0.8)),
          }}
        />
      ))}
    </div>
  );
}

function EscenaChat({ vertical }: { vertical: boolean }) {
  const f = useCurrentFrame();
  const tam = vertical ? 30 : 26;
  return (
    <Dos
      vertical={vertical}
      texto={
        <>
          <Etiqueta num="01" texto="WhatsApp" tam={vertical ? 28 : 22} />
          <Titular texto="El agente contesta al instante." desde={4} tam={vertical ? 110 : 96} resaltar={["instante."]} />
        </>
      }
      ventana={
        <Ventana
          titulo="Asistente de tu negocio"
          ancho={vertical ? 920 : 820}
          extra={<span style={{ fontSize: 20, color: C.whatsapp, fontWeight: 500 }}>en línea</span>}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: vertical ? 560 : 500 }}>
            {conversacion.map((m) => {
              const p = prog(f, m.en, 12);
              if (f < m.en) return null;
              const agente = m.de === "agente";
              return (
                <div
                  key={m.texto}
                  style={{
                    alignSelf: agente ? "flex-end" : "flex-start",
                    maxWidth: "82%",
                    padding: "16px 22px 30px",
                    borderRadius: 22,
                    borderTopLeftRadius: agente ? 22 : 6,
                    borderTopRightRadius: agente ? 6 : 22,
                    position: "relative",
                    fontFamily: TEXTO,
                    fontSize: tam,
                    lineHeight: 1.38,
                    color: agente ? "#fff" : C.tinta,
                    background: agente ? "linear-gradient(135deg, #1f5fd6, #5b3fc4)" : "rgb(255 255 255 / 0.08)",
                    opacity: p,
                    transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + p * 0.04})`,
                    transformOrigin: agente ? "right bottom" : "left bottom",
                  }}
                >
                  {m.texto}
                  <span style={{ position: "absolute", right: 16, bottom: 8, fontSize: 16, opacity: 0.7 }}>{m.hora}</span>
                </div>
              );
            })}
            <Escribiendo desde={22} hasta={38} />
          </div>
        </Ventana>
      }
    />
  );
}

// ------------------------------------------------------------------ 3. Agenda
// "o" ocupado, "n" la cita nueva, "" libre. La misma agenda que la web.
const agenda = [
  { dia: "L", huecos: ["", "o", "", ""] },
  { dia: "M", huecos: ["o", "", "", ""] },
  { dia: "Mi", huecos: ["", "", "o", ""] },
  { dia: "J", huecos: ["", "", "n", ""] },
  { dia: "V", huecos: ["", "o", "", ""] },
];

function EscenaAgenda({ vertical }: { vertical: boolean }) {
  const f = useCurrentFrame();
  const nueva = prog(f, 30, 16);
  const aviso = prog(f, 46, 16);
  return (
    <Dos
      vertical={vertical}
      texto={
        <>
          <Etiqueta num="02" texto="Agenda" tam={vertical ? 28 : 22} />
          <Titular texto="La cita entra sola en tu agenda." desde={4} tam={vertical ? 110 : 96} resaltar={["sola"]} />
        </>
      }
      ventana={
        <Ventana
          titulo="Agenda · esta semana"
          ancho={vertical ? 920 : 820}
          extra={<Icono d={iconos.calendario} tam={28} color={C.electricoSuave} />}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {agenda.map((d) => (
              <div key={d.dia} style={{ display: "grid", gap: 10 }}>
                <span style={{ textAlign: "center", fontFamily: TEXTO, fontSize: 20, color: C.apagado }}>{d.dia}</span>
                {d.huecos.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      height: 52,
                      borderRadius: 10,
                      background:
                        h === "o" ? "rgb(0 123 255 / 0.35)" : h === "n" ? "rgb(255 255 255 / 0.05)" : "rgb(255 255 255 / 0.05)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {h === "n" && (
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: DEGRADADO,
                          transform: `scaleX(${nueva})`,
                          transformOrigin: "left",
                          boxShadow: `0 0 ${nueva * 40}px rgb(99 102 241 / 0.7)`,
                        }}
                      />
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 26,
              padding: "16px 20px",
              borderRadius: 14,
              border: "1px solid rgb(45 212 191 / 0.3)",
              background: "rgb(45 212 191 / 0.08)",
              fontFamily: TEXTO,
              fontSize: 23,
              color: C.suave,
              opacity: aviso,
              transform: `translateY(${(1 - aviso) * 20}px)`,
            }}
          >
            <Icono d={iconos.calendarioOk} tam={28} color={C.turquesa} />
            <span>
              <b style={{ color: C.tinta, fontWeight: 600 }}>Nueva cita</b> · jueves 10:00 · creada por el agente
            </span>
          </div>
        </Ventana>
      }
    />
  );
}

// ------------------------------------------------------------------ 4. Registro
const registro = [
  { icono: iconos.persona, texto: "Contacto creado en el CRM", etiqueta: "CRM" },
  { icono: iconos.check, texto: "Etiqueta «Interesado» añadida", etiqueta: "CRM" },
  { icono: iconos.email, texto: "Correo de bienvenida enviado", etiqueta: "Email" },
  { icono: iconos.calendario, texto: "Cita registrada en la agenda", etiqueta: "Agenda" },
  { icono: iconos.chat, texto: "Aviso al equipo por WhatsApp", etiqueta: "Equipo" },
];

function EscenaRegistro({ vertical }: { vertical: boolean }) {
  const f = useCurrentFrame();
  return (
    <Dos
      vertical={vertical}
      texto={
        <>
          <Etiqueta num="03" texto="Automático" tam={vertical ? 28 : 22} />
          <Titular texto="El papeleo se hace solo." desde={4} tam={vertical ? 110 : 96} resaltar={["solo."]} />
        </>
      }
      ventana={
        <Ventana
          titulo="Automatización · nuevo contacto"
          ancho={vertical ? 920 : 820}
          extra={<span style={{ fontSize: 20, color: C.turquesa, fontWeight: 500 }}>activa</span>}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {registro.map((r, i) => {
              const en = 14 + i * 10;
              const p = prog(f, en, 12);
              const ok = prog(f, en + 6, 8);
              return (
                <div
                  key={r.texto}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 18px",
                    borderRadius: 12,
                    background: `rgb(255 255 255 / ${0.035 + ok * 0.03})`,
                    fontFamily: TEXTO,
                    fontSize: 24,
                    color: C.suave,
                    opacity: p,
                    transform: `translateX(${(1 - p) * -30}px)`,
                  }}
                >
                  <span
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `rgb(0 123 255 / ${0.18 + ok * 0.2})`,
                      color: C.electricoSuave,
                    }}
                  >
                    <Icono d={ok > 0.5 ? iconos.check : r.icono} tam={24} />
                  </span>
                  <span style={{ flex: 1, color: ok > 0.5 ? C.tinta : C.suave }}>{r.texto}</span>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 99,
                      border: `1px solid ${C.linea}`,
                      fontSize: 17,
                      color: C.apagado,
                    }}
                  >
                    {r.etiqueta}
                  </span>
                </div>
              );
            })}
          </div>
        </Ventana>
      }
    />
  );
}

// ------------------------------------------------------------------ 5. Embudo
// Proporciones de ejemplo para dibujar el embudo. No son datos.
const etapas = [
  { nombre: "Visitas", ancho: 1 },
  { nombre: "Registros", ancho: 0.64 },
  { nombre: "Citas", ancho: 0.38 },
  { nombre: "Clientes", ancho: 0.22 },
];

function EscenaEmbudo({ vertical }: { vertical: boolean }) {
  const f = useCurrentFrame();
  return (
    <Dos
      vertical={vertical}
      texto={
        <>
          <Etiqueta num="04" texto="Medición" tam={vertical ? 28 : 22} />
          <Titular texto="Y queda todo medido." desde={4} tam={vertical ? 110 : 96} resaltar={["medido."]} />
        </>
      }
      ventana={
        <Ventana
          titulo="Embudo · cada etapa medida"
          ancho={vertical ? 920 : 820}
          extra={<Icono d={iconos.embudo} tam={28} color={C.electricoSuave} />}
        >
          <div style={{ display: "grid", gap: 22 }}>
            {etapas.map((e, i) => {
              const p = prog(f, 12 + i * 6, 22);
              return (
                <div
                  key={e.nombre}
                  style={{ display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center", gap: 20 }}
                >
                  <span style={{ fontFamily: TEXTO, fontSize: 23, color: C.suave }}>{e.nombre}</span>
                  <span style={{ height: 22, borderRadius: 99, background: "rgb(255 255 255 / 0.05)", overflow: "hidden" }}>
                    <span
                      style={{
                        display: "block",
                        height: "100%",
                        borderRadius: 99,
                        background: DEGRADADO,
                        transform: `scaleX(${e.ancho * p})`,
                        transformOrigin: "left",
                      }}
                    />
                  </span>
                </div>
              );
            })}
          </div>
        </Ventana>
      }
    />
  );
}

// ------------------------------------------------------------------ 6. Cierre
function EscenaCierre({ vertical }: { vertical: boolean }) {
  const f = useCurrentFrame();
  const web = prog(f, 16, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 48, padding: "0 100px" }}>
      <Titular
        texto="Automatizo lo que hoy haces a mano."
        tam={vertical ? 120 : 112}
        resaltar={["Automatizo"]}
        centro
      />
      <span
        style={{
          fontFamily: TEXTO,
          fontWeight: 600,
          fontSize: vertical ? 40 : 36,
          letterSpacing: "0.04em",
          color: C.tinta,
          padding: "16px 34px",
          borderRadius: 999,
          border: `1px solid ${C.linea}`,
          background: "rgb(16 21 34 / 0.8)",
          opacity: web,
          transform: `translateY(${(1 - web) * 24}px)`,
        }}
      >
        soyluisflores.es
      </span>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ Video
export function Piloto({ vertical }: { vertical: boolean }) {
  const escenas = [
    { ...ESCENAS.hora, C: EscenaHora },
    { ...ESCENAS.chat, C: EscenaChat },
    { ...ESCENAS.agenda, C: EscenaAgenda },
    { ...ESCENAS.registro, C: EscenaRegistro },
    { ...ESCENAS.embudo, C: EscenaEmbudo },
  ];
  return (
    <AbsoluteFill>
      <Fondo />
      {escenas.map(({ desde, dur, C: Componente }) => (
        <Sequence key={desde} from={desde} durationInFrames={dur}>
          <Escena dur={dur}>
            <Componente vertical={vertical} />
          </Escena>
        </Sequence>
      ))}
      {/* El cierre no se desvanece: es el último fotograma. */}
      <Sequence from={ESCENAS.cierre.desde} durationInFrames={ESCENAS.cierre.dur}>
        <Escena dur={ESCENAS.cierre.dur + 20}>
          <EscenaCierre vertical={vertical} />
        </Escena>
      </Sequence>
      <Marco vertical={vertical} />
    </AbsoluteFill>
  );
}
