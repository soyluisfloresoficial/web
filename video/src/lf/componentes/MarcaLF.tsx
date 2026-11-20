/**
 * Capa de marca persistente de SOYLUISFLORES:
 * - Firma: monograma LF y @usuario, discreta, siempre en el mismo sitio.
 * - Marcador de capítulos 01 · 02 · 03 mientras dura cada error.
 * - Línea de luz con el degradado de marca entre el gráfico y el avatar en pantalla dividida.
 * Todo dentro de la zona segura y lejos de la cara.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { COLOR, CURVA, DEGRADADO, FUENTE, ZONA_SEGURA } from "../marca";
import type { EscenaResuelta } from "../tiempo";
import { prog } from "../util";

export function MarcaLF({ escenas, usuario, firma = true, capitulos = 0 }: { escenas: EscenaResuelta[]; usuario: string; firma?: boolean; capitulos?: number }) {
  const f = useCurrentFrame();
  const i = Math.max(0, escenas.findIndex((e) => f >= e.desde && f < e.hasta));
  const e = escenas[i];
  if (!e) return null;
  const disp = e.presentador ?? "completo";
  const dividida = disp === "dividida";
  const enCta = e.contenido?.tipo === "cta" || e.contenido?.tipo === "presentacion";
  // Altura de la franja superior del avatar (lejos de la cara y de los subtítulos).
  const yFranja = dividida ? 770 : ZONA_SEGURA.arriba + 18;
  const entradaEscena = prog(f, e.desde, 12);
  const visibleFirma = firma && !enCta && e.capa?.tipo !== "notificaciones" && e.contenido?.tipo !== "ganchoGlass" && !(e.contenido?.tipo === "motion" && (e.contenido.efecto === "cierre" || e.contenido.efecto === "demo")) ? 1 : 0;

  const cap = e.capitulo ?? 0;
  const capPrevio = escenas[i - 1]?.capitulo ?? 0;
  const tCap = cap && capPrevio !== cap ? prog(f, e.desde, 14, CURVA.impacto) : 1;

  // Pulso de luz que recorre la línea divisoria.
  const pulso = ((f % 90) / 90) * 1400 - 200;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 22, pointerEvents: "none" }}>
      {dividida && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 668, height: 4, background: DEGRADADO, opacity: 0.9 * prog(f, e.desde, 14), overflow: "hidden", boxShadow: "0 0 24px rgb(0 194 255 / 0.55)" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 200, left: pulso, background: "linear-gradient(90deg, transparent, #fff, transparent)", opacity: 0.8 }} />
        </div>
      )}

      {visibleFirma > 0 && (
        <div
          style={{
            position: "absolute",
            left: ZONA_SEGURA.izquierda,
            top: yFranja,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 16px 8px 8px",
            borderRadius: 999,
            background: "rgb(7 9 13 / 0.55)",
            border: "1px solid rgb(255 255 255 / 0.10)",
            backdropFilter: "blur(8px)",
            opacity: 0.92 * entradaEscena,
          }}
        >
          <Img src={staticFile("logo/monograma-80.webp")} style={{ width: 40, height: 40, borderRadius: 999 }} />
          <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 22, color: COLOR.tinta, letterSpacing: "0.01em" }}>{usuario}</span>
        </div>
      )}

      {capitulos > 0 && cap > 0 && (
        <div
          style={{
            position: "absolute",
            right: ZONA_SEGURA.derecha,
            top: yFranja,
            display: "flex",
            gap: 8,
            padding: 8,
            borderRadius: 999,
            background: "rgb(7 9 13 / 0.55)",
            border: "1px solid rgb(255 255 255 / 0.10)",
            backdropFilter: "blur(8px)",
            opacity: entradaEscena,
          }}
        >
          {Array.from({ length: capitulos }, (_, k) => {
            const n = k + 1;
            const activo = n === cap;
            const hecho = n < cap;
            const t = activo ? tCap : 1;
            return (
              <div
                key={n}
                style={{
                  minWidth: 46,
                  height: 40,
                  padding: "0 10px",
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FUENTE.display,
                  fontWeight: 800,
                  fontSize: 20,
                  color: activo ? "#fff" : hecho ? COLOR.cian : COLOR.apagado,
                  background: activo ? DEGRADADO : "transparent",
                  boxShadow: activo ? `0 0 ${20 * t}px rgb(0 194 255 / 0.6)` : undefined,
                  transform: activo ? `scale(${0.8 + 0.2 * t})` : undefined,
                }}
              >
                {hecho ? "✓" : String(n).padStart(2, "0")}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
