// Versión en Markdown de cada página indexable (09/11/2026). Ver AGENTE.md.
//
// Se ejecuta solo al final de «npm run build». Lee las páginas del sitemap en
// dist/, toma el contenido principal (<main>) y escribe al lado un index.md
// con el título, la descripción, la dirección y el texto limpio: sin diseño,
// menús, formularios ni scripts.
//
// El Worker (src/worker/index.ts) lo entrega cuando un agente de IA pide la
// página con «Accept: text/markdown». Las personas siguen viendo el HTML.
// Las páginas con noindex (landings de campaña, agenda, correo) no llevan
// Markdown: si alguien lo pide, recibe el HTML.
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const RAIZ = "dist";
const SITIO = "https://soyluisflores.es";

const ENTIDADES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };
const decodificar = (t) =>
  t
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z0-9#]+);/gi, (m, n) => ENTIDADES[n] ?? m);

const absoluta = (href) => (href.startsWith("/") ? SITIO + href : href);

/**
 * Quita los elementos ocultos o solo decorativos (hidden, aria-hidden="true"),
 * contando las etiquetas anidadas del mismo tipo para cerrar en la buena.
 * Así se van enteras las maquetas animadas (EscenaFunnel) y los adornos.
 */
function quitarOcultos(html) {
  // Solo el atributo hidden suelto o aria-hidden="true", no clases como «overflow-hidden».
  const apertura = /<([a-z0-9]+)\b[^>]*?(?:\shidden(?=[\s>/=])|\saria-hidden="true")[^>]*>/gi;
  let salida = "";
  let desde = 0;
  let m;
  while ((m = apertura.exec(html))) {
    const etiqueta = m[1].toLowerCase();
    salida += html.slice(desde, m.index);
    if (m[0].endsWith("/>") || ["img", "input", "br", "hr", "source", "track"].includes(etiqueta)) {
      desde = apertura.lastIndex;
      continue;
    }
    const marca = new RegExp(`<(/?)${etiqueta}\\b[^>]*>`, "gi");
    marca.lastIndex = apertura.lastIndex;
    let nivel = 1;
    let t;
    while (nivel > 0 && (t = marca.exec(html))) nivel += t[1] ? -1 : 1;
    desde = t ? marca.lastIndex : html.length;
    apertura.lastIndex = desde;
  }
  return salida + html.slice(desde);
}

/** HTML del contenido principal → Markdown sencillo. */
export function aMarkdown(html) {
  let h = quitarOcultos(html)
    // Fuera lo que no es texto para leer.
    .replace(/<(script|style|svg|noscript|template|form|button|select|textarea|video|iframe)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, "")
    // Los laterales fuera, salvo el resumen «En 30 segundos» de los artículos.
    .replace(/<aside\b(?![^>]*resumen-rapido)[\s\S]*?<\/aside>/gi, "")
    .replace(/<(img|input|source|track|br|hr)\b[^>]*>/gi, (m, t) => (t.toLowerCase() === "br" ? " " : t.toLowerCase() === "hr" ? "\n\n---\n\n" : ""))
    .replace(/<!--[\s\S]*?-->/g, "");
  // Enlaces: [texto](url)
  h = h.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, txt) => {
    const t = txt.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!t) return "";
    if (href.startsWith("#")) return t;
    return `[${t}](${absoluta(href)})`;
  });
  h = h
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n\n${"#".repeat(Number(n))} ${t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}\n\n`)
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => (t.trim() ? `**${t.trim()}**` : ""))
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|section|article|header|footer|ul|ol|li|figure|figcaption|blockquote|details|summary|table|tr|dl|dd|dt)>/gi, "\n")
    .replace(/<(p|div|section|article|ul|ol|figure|blockquote|details|summary|table|tr|dl|dd|dt)\b[^>]*>/gi, "\n")
    .replace(/<\/?(td|th)\b[^>]*>/gi, " | ")
    // Piezas en línea (etiquetas, cifras, botones): con un espacio entre ellas.
    .replace(/<\/?(span|small|em|i|time|code|mark|abbr)\b[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "");
  return decodificar(h)
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter((l, i, a) => !(l === "- " || l === "-"))
    .join("\n")
    .replace(/\*\*\s*\*\*/g, "")
    .replace(/\)(?=[A-Za-zÁÉÍÓÚÑáéíóúñ¿])/g, ") ")
    // Listas sin líneas en blanco entre sus puntos.
    .replace(/^(- .*)\n\n(?=- )/gm, "$1\n")
    .replace(/^(- .*)\n\n(?=- )/gm, "$1\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function paginasDelSitemap() {
  const rutas = [];
  for (const f of await readdir(RAIZ)) {
    if (!/^sitemap-\d+\.xml$/.test(f)) continue;
    const xml = await readFile(join(RAIZ, f), "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) rutas.push(new URL(m[1]).pathname);
  }
  return rutas;
}

const rutas = await paginasDelSitemap();
let hechas = 0;
for (const ruta of rutas) {
  const carpeta = join(RAIZ, ruta);
  let html;
  try {
    html = await readFile(join(carpeta, "index.html"), "utf8");
  } catch {
    continue;
  }
  if (/name="robots" content="[^"]*noindex/.test(html)) continue;
  const titulo = decodificar(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const descripcion = decodificar(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const canonica = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? SITIO + ruta;
  const principal = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!principal) continue;
  const cuerpo = aMarkdown(principal);
  const md = `---\ntitle: ${JSON.stringify(titulo)}\ndescription: ${JSON.stringify(descripcion)}\nurl: ${canonica}\n---\n\n${cuerpo}\n\n---\n\nLuis Carlos Flores · IA, automatización y negocios · Manresa, Barcelona, España\nAgenda una llamada: ${SITIO}/contacto\n`;
  await writeFile(join(carpeta, "index.md"), md);
  hechas++;
}
console.log(`Markdown para agentes de IA: ${hechas} páginas.`);

// Cabeceras de seguridad para el Worker. Desde que el Worker atiende las
// páginas (para ofrecer el Markdown), Cloudflare no aplica _headers a sus
// respuestas. El Worker lee este archivo y pone las mismas cabeceras de la
// regla «/*» de public/_headers, que sigue siendo el único sitio donde se
// editan.
const reglas = await readFile("public/_headers", "utf8");
const cabeceras = {};
let enGlobal = false;
for (const linea of reglas.split(/\r?\n/)) {
  if (/^\S/.test(linea) && !linea.startsWith("#")) enGlobal = linea.trim() === "/*";
  else if (enGlobal && /^\s+[A-Za-z-]+:/.test(linea)) {
    const i = linea.indexOf(":");
    cabeceras[linea.slice(0, i).trim()] = linea.slice(i + 1).trim();
  }
}
if (!cabeceras["Content-Security-Policy"]) throw new Error("No encuentro la CSP en la regla /* de public/_headers");
await writeFile(join(RAIZ, "agente", "cabeceras.json"), JSON.stringify(cabeceras, null, 2));
console.log(`Cabeceras para el Worker: ${Object.keys(cabeceras).length}.`);
