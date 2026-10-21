/**
 * Genera la imagen para compartir (Open Graph, 1200 × 630) de cada página.
 *
 * Uso, después de `npm run build`:
 *   node tools/generar-og.mjs
 *
 * Lee las páginas ya compiladas en dist/, toma de cada una el antetítulo y el
 * H1, y dibuja una tarjeta con la tipografía, los colores y el retrato de la
 * web. Las guarda en public/og/<ruta>.jpg, que se suben al repositorio.
 * Base.astro usa esa imagen si existe y, si no, og-default.png. Así una página
 * nueva nunca se queda sin imagen, aunque no se haya ejecutado esto.
 *
 * Necesita Microsoft Edge (o Chrome) instalado en el ordenador: por eso se
 * ejecuta en local y no en la compilación de Cloudflare.
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(raiz, "dist");
const salida = path.join(raiz, "public", "og");

const navegadores = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
];
const ejecutable = navegadores.find((n) => fs.existsSync(n));
if (!ejecutable) throw new Error("No encuentro Edge ni Chrome instalados.");
if (!fs.existsSync(dist)) throw new Error("Primero ejecuta npm run build.");

// Páginas que no necesitan imagen propia: usan la general.
const excluidas = ["404.html", "aviso-legal", "politica-de-cookies", "politica-de-privacidad", "aviso-de-privacidad-latinoamerica"];

// Colores de cada servicio, leídos de global.css para no duplicarlos.
const css = fs.readFileSync(path.join(raiz, "src", "styles", "global.css"), "utf8");
const colores = Object.fromEntries(
  [...css.matchAll(/--svc-([a-z-]+):\s*(#[0-9a-f]{3,8})/gi)].map((m) => [m[1], m[2]]),
);

function paginas(dir, base = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "_astro" ? [] : paginas(ruta, `${base}/${e.name}`);
    return e.name === "index.html" ? [{ ruta: base || "/", fichero: ruta }] : [];
  });
}

const limpiar = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

// Servidor mínimo sobre dist/ para que la plantilla cargue fuentes y fotos.
const tipos = { ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const servidor = http.createServer((req, res) => {
  const f = path.join(dist, decodeURIComponent(req.url.split("?")[0]));
  if (!f.startsWith(dist) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  // La plantilla se carga con setContent (origen about:blank): las fuentes
  // necesitan cabecera CORS o el navegador las descarta en silencio.
  res.writeHead(200, {
    "Content-Type": tipos[path.extname(f)] ?? "application/octet-stream",
    "Access-Control-Allow-Origin": "*",
  });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, r));
const origen = `http://localhost:${servidor.address().port}`;

// Retrato: la versión más grande que haya generado Astro del original
// luis-flores-sobre-mi.png (lo usan el schema y el autor del blog).
const retratos = fs
  .readdirSync(path.join(dist, "_astro"))
  .filter((n) => /^luis-flores-sobre-mi\.[^.]+\.(webp|jpg)$/.test(n))
  .map((n) => `/_astro/${n}`);
const retrato = retratos.sort((a, b) => fs.statSync(path.join(dist, b)).size - fs.statSync(path.join(dist, a)).size)[0];

function plantilla({ antetitulo, titulo, color, lima = false }) {
  const tamano = titulo.length > 70 ? 54 : titulo.length > 48 ? 62 : 72;
  // Identidad propia de /diagnostico: lima sobre negro y Space Grotesk.
  const ext = lima
    ? `@font-face{font-family:"Space Grotesk";font-weight:600;src:url(/fonts/space-grotesk-latin-600-normal.woff2)}
body,.lienzo{background:#050505!important}
.lienzo{background:radial-gradient(560px 420px at 70% 60%,rgb(198 255 61/.12),transparent 70%),#050505!important}
h1{font:600 ${tamano}px/1.05 "Space Grotesk"!important;letter-spacing:-.02em!important}
.ante{font-family:ui-monospace,monospace!important;letter-spacing:.08em!important}
.barra{background:#c6ff3d!important}`
    : "";
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><base href="${origen}/">
<style>
@font-face{font-family:Manrope;font-weight:800;src:url(/fonts/manrope-latin-800-normal.woff2)}
@font-face{font-family:Inter;font-weight:500;src:url(/fonts/inter-latin-500-normal.woff2)}
@font-face{font-family:Inter;font-weight:600;src:url(/fonts/inter-latin-600-normal.woff2)}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#07090d;font-family:Inter,sans-serif;color:#fff}
.lienzo{position:relative;width:100%;height:100%;padding:64px 72px;display:flex;flex-direction:column;
 background:radial-gradient(700px 420px at 8% -10%,rgb(0 123 255/.28),transparent 70%),
 radial-gradient(620px 420px at 100% 100%,${color}33,transparent 70%),#07090d}
.reticula{position:absolute;inset:0;background-image:linear-gradient(rgb(255 255 255/.045) 1px,transparent 1px),linear-gradient(90deg,rgb(255 255 255/.045) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(80% 90% at 30% 30%,#000,transparent 80%)}
.marca{position:relative;display:flex;align-items:center;gap:14px}
.marca img{height:30px}
.texto{position:relative;width:680px;margin-top:auto;margin-bottom:auto}
.ante{display:inline-flex;align-items:center;gap:12px;color:${color};font:600 20px Inter;letter-spacing:.14em;text-transform:uppercase}
.ante:before{content:"";width:36px;height:2px;background:${color}}
h1{margin-top:22px;font:800 ${tamano}px/1.06 Manrope;letter-spacing:-.025em}
.pie{position:relative;display:flex;align-items:center;gap:14px;color:#aab4c8;font:500 22px Inter}
.pie b{color:#fff;font-weight:600}
.punto{width:6px;height:6px;border-radius:9px;background:${color}}
.foto{position:absolute;right:56px;top:56px;bottom:56px;width:380px;border-radius:28px;overflow:hidden;border:1px solid rgb(255 255 255/.1);box-shadow:0 30px 80px -20px #000}
.foto img{width:100%;height:100%;object-fit:cover;object-position:50% 12%}
.foto:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgb(7 9 13/.55),transparent 35%)}
.barra{position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg,#007bff,${color},#8b5cf6)}
${ext}
</style></head><body><div class="lienzo"><div class="reticula"></div>
<div class="marca"><img src="/logo/nombre-360.webp" alt=""></div>
<div class="texto"><p class="ante">${antetitulo}</p><h1>${titulo}</h1></div>
<div class="pie"><b>soyluisflores.es</b><span class="punto"></span><span>IA y automatización para negocios</span></div>
<div class="foto"><img src="${retrato}" alt=""></div><div class="barra"></div></div></body></html>`;
}

fs.mkdirSync(salida, { recursive: true });
const navegador = await puppeteer.launch({ executablePath: ejecutable, headless: true, args: ["--no-first-run"] });
const pag = await navegador.newPage();
await pag.setViewport({ width: 1200, height: 630 });

let n = 0;
for (const { ruta, fichero } of paginas(dist)) {
  if (excluidas.some((e) => ruta.includes(e))) continue;
  const html = fs.readFileSync(fichero, "utf8");
  const h1 = limpiar(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
  if (!h1) continue;
  const ante = limpiar(html.match(/<p class="eyebrow[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "") || "Luis Flores";
  // Color: el del servicio de la página, o el del servicio del artículo.
  const slug =
    ruta.match(/^\/servicios\/([a-z-]+)/)?.[1] ??
    html.match(/class="etiqueta-servicio[^"]*"[^>]*href="\/servicios\/([a-z-]+)"|href="\/servicios\/([a-z-]+)"[^>]*class="etiqueta-servicio/)?.slice(1).find(Boolean);
  const lima = ruta === "/diagnostico";
  const color = lima ? "#c6ff3d" : colores[slug] ?? "#3d9bff";
  await pag.setContent(plantilla({ antetitulo: lima ? "Llamada de diagnóstico · Gratis" : ruta === "/" ? "IA aplicada a negocios" : ruta.startsWith("/blog/") ? "Blog" : ante, titulo: h1, color, lima }), { waitUntil: "load" });
  // Espera a las fuentes y a que la foto esté decodificada antes de capturar.
  await pag.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
  const nombre = ruta === "/" ? "inicio" : ruta.slice(1).replaceAll("/", "-");
  await pag.screenshot({ path: path.join(salida, `${nombre}.jpg`), type: "jpeg", quality: 86 });
  // La de la home también es la imagen general (og-default.png), la que usan
  // las páginas sin imagen propia.
  if (ruta === "/") await pag.screenshot({ path: path.join(raiz, "public", "og-default.png"), type: "png" });
  n++;
}

await navegador.close();
servidor.close();
console.log(`${n} imágenes en public/og/`);
