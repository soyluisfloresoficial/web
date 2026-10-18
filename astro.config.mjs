import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import fs from "node:fs";
import path from "node:path";

/**
 * Fechas de modificación reales de los posts, leídas del frontmatter.
 *
 * Decisión deliberada: solo se emite <lastmod> donde hay una fecha real. Las
 * páginas estáticas no llevan lastmod en vez de inventarles uno, porque un
 * lastmod que no corresponde a un cambio de contenido es ruido que los
 * buscadores acaban ignorando.
 */
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

const lastmod = lastmodPorRuta();

export default defineConfig({
  site: "https://soyluisflores.es",

  // El sitio en producción redirige /servicios/ a /servicios con un 308,
  // así que la regla es "sin barra final" y se aplica a canonical, og:url,
  // sitemap y enlaces internos.
  trailingSlash: "never",

  integrations: [
    sitemap({
      serialize(item) {
        const fecha = lastmod.get(item.url.replace(/\/$/, ""));
        if (fecha) item.lastmod = fecha;
        return item;
      },
    }),
  ],
});
