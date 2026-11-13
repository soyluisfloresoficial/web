/**
 * Subtítulos palabra por palabra (estilo TikTok) a partir de los tiempos de
 * la transcripción. La palabra que suena va en cian; el bloque entra con un
 * pequeño rebote. Se colocan según la disposición del avatar y se ocultan en
 * las escenas con `subtitulos: false`.
 */
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";
import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Y_SUBTITULOS } from "../disposicion";
import { COLOR, CURVA, FUENTE } from "../marca";
import { normalizar, type EscenaResuelta } from "../tiempo";
import { mezclar, prog } from "../util";

/** Quita el punto y la coma finales: en pantalla sobran. */
const limpiar = (t: string) => t.replace(/[.,;:]+$/u, "");

export function Subtitles({
  subtitulos,
  escenas,
  agrupar = 1100,
  tamano = 62,
  claves = [],
  maxCaracteres = 0,
}: {
  /** Palabras que van siempre en cian. Si hay claves, la palabra activa solo se ilumina. */
  claves?: string[];
  /** Máximo de caracteres por bloque (0 = sin límite). 36 ≈ dos líneas. */
  maxCaracteres?: number;
  subtitulos: Caption[] | null;
  escenas: EscenaResuelta[];
  /** Milisegundos que caben en un bloque. Menos = bloques más cortos. */
  agrupar?: number;
  tamano?: number;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const paginas = useMemo(() => {
    if (!subtitulos?.length) return [];
    const base = createTikTokStyleCaptions({ captions: subtitulos, combineTokensWithinMilliseconds: agrupar }).pages;
    return maxCaracteres > 0 ? partirPaginas(base, maxCaracteres) : base;
  }, [subtitulos, agrupar, maxCaracteres]);
  const setClaves = useMemo(() => new Set(claves.map(normalizar)), [claves]);
  if (!paginas.length) return null;

  const ms = (f / fps) * 1000;
  const pagina = paginas.find((p, i) => ms >= p.startMs && ms < (paginas[i + 1]?.startMs ?? p.startMs + p.durationMs + 400));
  if (!pagina) return null;

  const i = Math.max(0, escenas.findIndex((e) => f >= e.desde && f < e.hasta));
  const escena = escenas[i];
  if (escena?.subtitulos === false) return null;
  // Si el titular ya dice lo mismo sincronizado con la voz, no se duplica.
  if (escena?.titular?.sincronizar && escena.subtitulos !== true) return null;

  // Posición: sigue a la disposición del avatar, con transición suave.
  const yActual = Y_SUBTITULOS[escena?.presentador ?? "completo"];
  const yPrevia = i > 0 ? Y_SUBTITULOS[escenas[i - 1].presentador ?? "completo"] : yActual;
  const y = mezclar(yPrevia, yActual, prog(f, escena?.desde ?? 0, 14));

  const entrada = prog(f, Math.round((pagina.startMs / 1000) * fps), 5, CURVA.impacto);

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 150,
        top: y,
        transform: `translateY(-50%) scale(${0.92 + 0.08 * entrada})`,
        display: "flex",
        justifyContent: "center",
        zIndex: 20,
        opacity: entrada,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 18,
          padding: "14px 26px",
          borderRadius: 22,
          background: "rgb(7 9 13 / 0.62)",
          boxShadow: "0 10px 40px rgb(0 0 0 / 0.35)",
          fontFamily: FUENTE.display,
          fontWeight: 800,
          fontSize: tamano,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          maxWidth: 858,
          textAlign: "center",
        }}
      >
        {pagina.tokens.map((t, k) => {
          const siguiente = pagina.tokens[k + 1]?.fromMs ?? t.toMs + 200;
          const activa = ms >= t.fromMs && ms < Math.min(siguiente, t.toMs + 200);
          const clave = setClaves.has(normalizar(t.text));
          const color = setClaves.size ? (clave ? COLOR.cian : activa ? "#FFFFFF" : "rgb(245 248 252 / 0.86)") : activa ? COLOR.cian : COLOR.tinta;
          return (
            <span
              key={k}
              style={{
                color,
                display: "inline-block",
                textShadow: activa ? (setClaves.size && !clave ? "0 0 18px rgb(255 255 255 / 0.45)" : "0 0 22px rgb(0 194 255 / 0.55)") : undefined,
              }}
            >
              {limpiar(t.text.trim())}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Parte los bloques largos para que no pasen de N caracteres (≈ dos líneas). */
function partirPaginas(paginas: TikTokPage[], max: number): TikTokPage[] {
  const out: TikTokPage[] = [];
  for (const p of paginas) {
    let actual: TikTokPage["tokens"] = [];
    let largo = 0;
    const cerrar = () => {
      if (!actual.length) return;
      const ini = actual[0].fromMs;
      const fin = actual[actual.length - 1].toMs;
      out.push({ text: actual.map((t) => t.text).join(""), startMs: ini, durationMs: fin - ini, tokens: actual });
      actual = [];
      largo = 0;
    };
    for (const t of p.tokens) {
      const l = t.text.trim().length + 1;
      if (largo + l > max && actual.length) cerrar();
      actual.push(t);
      largo += l;
    }
    cerrar();
  }
  return out;
}
