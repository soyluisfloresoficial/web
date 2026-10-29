import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

/**
 * Fechas de modificación reales. Nunca se inventa una: un lastmod que no
 * corresponde a un cambio de contenido es ruido que los buscadores acaban
 * ignorando.
 *
 * - Posts del blog: la fecha del frontmatter.
 * - Resto de páginas: la fecha del último commit que tocó los archivos de los
 *   que sale cada página (26/10/2026).
 *
 * Si el repositorio se clona sin historial (clon superficial), git daría la
 * misma fecha a todo, así que en ese caso las páginas estáticas se quedan sin
 * lastmod, como antes.
 */
function hayHistorial() {
  try {
    return execFileSync("git", ["rev-parse", "--is-shallow-repository"], { encoding: "utf8" }).trim() === "false";
  } catch {
    return false;
  }
}

/** Fecha del último commit (AAAA-MM-DD) que tocó alguno de estos archivos. */
function fechaDeCommit(archivos) {
  const fechas = archivos
    .filter((a) => fs.existsSync(a))
    .map((a) => {
      try {
        return execFileSync("git", ["log", "-1", "--format=%cs", "--", a], { encoding: "utf8" }).trim();
      } catch {
        return "";
      }
    })
    .filter(Boolean);
  return fechas.sort().pop();
}

/**
 * Archivos de los que sale cada página estática. El layout y los estilos
 * quedan fuera a propósito: tocarlos cambia la forma, no el contenido.
 */
function lastmodEstaticas() {
  const mapa = new Map();
  if (!hayHistorial()) return mapa;

  const servicios = ["src/pages/servicios/[slug].astro", "src/data/servicios-detalle.ts", "src/data/servicios.ts"];
  const paginas = {
    "/": ["src/pages/index.astro", "src/data/home.ts", "src/data/servicios.ts"],
    "/servicios": ["src/pages/servicios/index.astro", "src/data/servicios.ts"],
    "/sobre-mi": ["src/pages/sobre-mi.astro"],
    "/contacto": ["src/pages/contacto.astro"],
    "/roi": ["src/pages/roi.astro"],
    "/blog": ["src/pages/blog/index.astro"],
  };
  for (const archivo of fs.readdirSync("src/content/legal")) {
    if (archivo.endsWith(".md")) paginas["/" + archivo.replace(/\.md$/, "")] = ["src/content/legal/" + archivo];
  }
  for (const [ruta, archivos] of Object.entries(paginas)) {
    const fecha = fechaDeCommit(archivos);
    // Sin barra final: es como busca serialize() más abajo.
    if (fecha) mapa.set(`https://soyluisflores.es${ruta === "/" ? "" : ruta}`, fecha);
  }
  // Una página por servicio, todas con los mismos archivos de origen.
  const fechaServicios = fechaDeCommit(servicios);
  if (fechaServicios) {
    const datos = fs.readFileSync("src/data/servicios.ts", "utf8");
    for (const m of datos.matchAll(/^\s*slug:\s*"([a-z-]+)",/gm)) {
      mapa.set(`https://soyluisflores.es/servicios/${m[1]}`, fechaServicios);
    }
  }
  return mapa;
}
function lastmodPorRuta() {
  const dir = path.resolve("./src/content/blog");
  const mapa = new Map();
  if (!fs.existsSync(dir)) return mapa;

  for (const archivo of fs.readdirSync(dir)) {
    if (!archivo.endsWith(".md")) continue;
    const texto = fs.readFileSync(path.join(dir, archivo), "utf8");
    const fm = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;

    const modificado = fm[1].match(/^dateModified:\s*["']?([0-9-]+)/m);
    const publicado = fm[1].match(/^datePublished:\s*["']?([0-9-]+)/m);
    const fecha = (modificado ?? publicado)?.[1];
    if (!fecha) continue;

    const slug = archivo.replace(/\.md$/, "");
    mapa.set(`https://soyluisflores.es/blog/${slug}`, fecha);
  }
  return mapa;
}

const lastmod = new Map([...lastmodEstaticas(), ...lastmodPorRuta()]);

export default defineConfig({
  site: "https://soyluisflores.es",
  // El CSS va dentro de cada página (28/10/2026). Eran dos hojas, unos 17 KB
  // comprimidos, que el navegador tenía que descargar antes de pintar nada:
  // PageSpeed las marcaba como bloqueo de renderización (530 ms en celular).
  // La web es pequeña, así que repetirlas en cada HTML cuesta menos que
  // esperar esa petición en la primera visita.
  build: { inlineStylesheets: "always" },

  // El sitio en producción redirige /servicios/ a /servicios con un 308,
  // así que la regla es "sin barra final" y se aplica a canonical, og:url,
  // sitemap y enlaces internos.
  trailingSlash: "never",

  integrations: [
    sitemap({
      // /diagnostico es la landing de campañas: repite el contenido de
      // /contacto, va con «noindex, follow» y canónica hacia /contacto, así
      // que fuera del sitemap (26/10/2026). Igual los funnels de campaña por
      // servicio, /diagnostico/[servicio] (28/10/2026, FUNNELS.md).
      // /agenda/cambiar y /correo/* solo sirven con el enlace personal de un
      // correo, y la guía en sí (/guia/...) es para quien la pidió. /guia sí
      // va: es la página para pedirla (EMAIL-MARKETING.md).
      filter: (pagina) => !/^https:\/\/soyluisflores\.es\/(diagnostico(\/|$)|agenda\/|correo\/|guia\/)/.test(pagina),
      serialize(item) {
        const fecha = lastmod.get(item.url.replace(/\/$/, ""));
        if (fecha) item.lastmod = fecha;
        return item;
      },
    }),
  ],
});
