// Auditoría estática de dist/: enlaces internos, imágenes, encabezados,
// identificadores, metadatos y datos legales. Uso: node tools/auditar-dist.mjs
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const raiz = "dist";
const paginas = [];
async function recorrer(dir) {
  for (const n of await readdir(dir)) {
    const p = join(dir, n);
    if ((await stat(p)).isDirectory()) await recorrer(p);
    else if (n.endsWith(".html")) paginas.push(p);
  }
}
await recorrer(raiz);

const existe = async (ruta) => {
  const limpia = decodeURIComponent(ruta.split("#")[0].split("?")[0]);
  for (const c of [limpia, `${limpia}.html`, join(limpia, "index.html")]) {
    try {
      if ((await stat(join(raiz, c))).isFile()) return true;
    } catch {}
  }
  return limpia === "" || limpia === "/";
};

const problemas = [];
const anota = (pag, tipo, detalle) => problemas.push({ pag, tipo, detalle });

for (const archivo of paginas) {
  const pag = "/" + relative(raiz, archivo).replace(/\\/g, "/").replace(/index\.html$/, "").replace(/\.html$/, "");
  const html = await readFile(archivo, "utf8");
  const sinScripts = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");

  // Metadatos
  if (!/<title>[^<]{10,}<\/title>/.test(html)) anota(pag, "meta", "sin <title>");
  const desc = html.match(/<meta name="description" content="([^"]*)"/);
  if (!desc) anota(pag, "meta", "sin meta description");
  else if (desc[1].length > 160 || desc[1].length < 70) anota(pag, "meta", `description de ${desc[1].length} caracteres`);
  if (!/<link rel="canonical"/.test(html) && !pag.includes("404")) anota(pag, "meta", "sin canonical");

  // H1 y orden de encabezados
  const hs = [...sinScripts.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  const h1 = hs.filter((n) => n === 1).length;
  if (h1 !== 1) anota(pag, "encabezados", `${h1} H1`);
  for (let i = 1; i < hs.length; i++)
    if (hs[i] > hs[i - 1] + 1) anota(pag, "encabezados", `salto de H${hs[i - 1]} a H${hs[i]}`);

  // Imágenes sin alt
  for (const img of sinScripts.matchAll(/<img\b[^>]*>/g))
    // Astro minifica alt="" como `alt` a secas: también vale (imagen decorativa).
    if (!/\balt(=|\s|>|\/)/.test(img[0])) anota(pag, "imagen", `sin alt: ${img[0].slice(0, 80)}`);

  // IDs duplicados
  const ids = [...sinScripts.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
  if (dup.length) anota(pag, "id", `duplicados: ${[...new Set(dup)].join(", ")}`);

  // Enlaces internos rotos
  for (const m of sinScripts.matchAll(/href="(\/[^"]*)"/g)) {
    const h = m[1];
    if (h.startsWith("//") || h.startsWith("/_astro/")) continue;
    if (!(await existe(h))) anota(pag, "enlace", `roto: ${h}`);
  }
  // Anclas a ids que no existen en la propia página
  for (const m of sinScripts.matchAll(/href="#([^"]+)"/g))
    if (m[1] !== "top" && !ids.includes(m[1])) anota(pag, "ancla", `#${m[1]} no existe`);

  // Datos legales fuera de /aviso-legal
  if (!pag.startsWith("/aviso-legal") && /Z2428176W|Pujada Roja/.test(html)) anota(pag, "legal", "NIF o calle fuera de /aviso-legal");

  // Marcadores pendientes visibles
  for (const m of sinScripts.matchAll(/\[(COMPLETAR|VERIFICAR)[^\]]*\]/g)) anota(pag, "marcador", m[0].slice(0, 80));
}

const porTipo = {};
for (const p of problemas) (porTipo[p.tipo] ??= []).push(p);
console.log(`Páginas auditadas: ${paginas.length}`);
console.log(`Problemas: ${problemas.length}`);
for (const [tipo, lista] of Object.entries(porTipo)) {
  console.log(`\n## ${tipo} (${lista.length})`);
  for (const p of lista.slice(0, 25)) console.log(`  ${p.pag.padEnd(36)} ${p.detalle}`);
}
