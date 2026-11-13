/**
 * LF Motion System · tokens de marca de SOYLUISFLORES.
 *
 * Todo color, fuente, curva y zona segura sale de aquí. Si cambia la marca,
 * se cambia en este archivo y los componentes lo heredan.
 */
import { Easing } from "remotion";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const COLOR = {
  base: "#07090D",
  base2: "#0C1018",
  superficie: "#111724",
  superficie2: "#182032",
  linea: "#243049",
  cian: "#00C2FF",
  violeta: "#8B5CF6",
  cta: "#00FFB3",
  tinta: "#F5F8FC",
  suave: "#A9B4C6",
  apagado: "#6E7A90",
  peligro: "#FF5C7A",
} as const;

export const DEGRADADO = `linear-gradient(105deg, ${COLOR.cian} 0%, ${COLOR.violeta} 100%)`;
export const BRILLO_CIAN = "0 0 40px rgb(0 194 255 / 0.35)";
export const SOMBRA_FLOTANTE =
  "0 40px 80px rgb(0 0 0 / 0.55), 0 12px 24px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(255 255 255 / 0.06)";

export const FUENTE = {
  /** Titulares, tipografía cinética y subtítulos. */
  display: "Manrope, Inter, sans-serif",
  /** Etiquetas pequeñas de interfaz. */
  texto: "Inter, Manrope, sans-serif",
} as const;

/** Lienzo vertical común a Reels, TikTok, Shorts y LinkedIn. */
export const LIENZO = { ancho: 1080, alto: 1920, fps: 30 } as const;

/**
 * Zona segura (px sobre 1080 × 1920). Es una estimación conservadora que deja
 * libres la cabecera, los botones de la derecha y el pie con el texto y la
 * música de cada app. Revísala si una red cambia su interfaz.
 */
export const ZONA_SEGURA = { arriba: 230, abajo: 440, izquierda: 72, derecha: 150 } as const;

/** Curvas de animación. La principal es la misma que usa la web. */
export const CURVA = {
  marca: Easing.bezier(0.22, 0.61, 0.36, 1),
  impacto: Easing.bezier(0.16, 1, 0.3, 1),
  suave: Easing.bezier(0.45, 0, 0.55, 1),
} as const;

let fuentesCargadas = false;
/** Carga Manrope e Inter desde publico/fonts (las mismas de la web). */
export function cargarFuentes() {
  if (fuentesCargadas) return;
  fuentesCargadas = true;
  for (const [familia, archivo, peso] of [
    ["Manrope", "manrope-latin-700-normal.woff2", "700"],
    ["Manrope", "manrope-latin-800-normal.woff2", "800"],
    ["Inter", "inter-latin-400-normal.woff2", "400"],
    ["Inter", "inter-latin-500-normal.woff2", "500"],
    ["Inter", "inter-latin-600-normal.woff2", "600"],
  ] as const) {
    loadFont({ family: familia, url: staticFile(`fonts/${archivo}`), weight: peso });
  }
}
