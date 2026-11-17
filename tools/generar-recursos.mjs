// Genera los PDF de los recursos gratuitos (CTA de videos y carruseles).
//
// Fuente: video/recursos/<slug>.md (formato: «# Título», una línea de
// subtítulo, «## Sección», «- [ ] punto» y párrafos sueltos).
// Salida: public/recursos/<slug>.pdf → https://soyluisflores.es/recursos/<slug>.pdf
//
// Uso: node tools/generar-recursos.mjs            (todos)
//      node tools/generar-recursos.mjs <slug>     (uno)
// Necesita Edge o Chrome (o la variable NAVEGADOR con la ruta del ejecutable).
// Después: añade el recurso en src/data/recursos.ts, compila y publica (RECURSOS.md).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fuente = path.join(raiz, "video", "recursos");
const salida = path.join(raiz, "public", "recursos");

const navegadores = [
  process.env.NAVEGADOR,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/opt/pw-browsers/chromium/chrome-linux/chrome",
].filter(Boolean);
const ejecutable = navegadores.find((n) => fs.existsSync(n));
if (!ejecutable) throw new Error("No encuentro Edge ni Chrome. Indica la ruta con la variable NAVEGADOR.");

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const b64 = (f) => fs.readFileSync(f).toString("base64");
const fuenteManrope = b64(path.join(raiz, "video", "publico", "fonts", "manrope-latin-800-normal.woff2"));
const fuenteInter4 = b64(path.join(raiz, "video", "publico", "fonts", "inter-latin-400-normal.woff2"));
const fuenteInter6 = b64(path.join(raiz, "video", "publico", "fonts", "inter-latin-600-normal.woff2"));
const logo = b64(path.join(raiz, "video", "publico", "logo", "monograma-80.webp"));

function html(md) {
  const cuerpo = md
    .split(/\r?\n/)
    .map((l) => {
      if (l.startsWith("# ")) return `<h1>${esc(l.slice(2))}</h1>`;
      if (l.startsWith("## ")) return `<h2>${esc(l.slice(3))}</h2>`;
      if (l.startsWith("- [ ] ")) return `<div class="item"><span class="box"></span>${esc(l.slice(6))}</div>`;
      if (l.trim()) return `<p>${esc(l)}</p>`;
      return "";
    })
    .join("\n");
  return `<!doctype html><html lang="es"><meta charset="utf-8"><style>
@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${fuenteManrope});font-weight:800}
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${fuenteInter4});font-weight:400}
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${fuenteInter6});font-weight:600}
@page{size:A4;margin:0}
html,body{margin:0;background:#07090D}
body{color:#F5F8FC;font-family:Inter,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hoja{padding:32px 46px;min-height:1122px;box-sizing:border-box;background:radial-gradient(circle at 0 0,rgba(0,194,255,.18),transparent 45%),radial-gradient(circle at 100% 100%,rgba(139,92,246,.2),transparent 45%)}
.marca{display:flex;align-items:center;gap:10px;font:600 12px Inter;color:#A9B4C6;letter-spacing:.12em}
.marca img{width:30px;height:30px;border-radius:50%}
h1{font:800 26px/1.12 Manrope;margin:12px 0 4px}
h2{font:800 15px Manrope;color:#00C2FF;margin:11px 0 5px;break-after:avoid}
p{font:400 11.5px/1.4 Inter;color:#A9B4C6;margin:3px 0}
.item{display:flex;gap:10px;align-items:flex-start;font:400 12.5px/1.35 Inter;padding:5px 10px;margin:3px 0;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);break-inside:avoid}
.box{flex:0 0 13px;height:13px;border-radius:3px;border:2px solid #00C2FF;margin-top:1px}
.pie{margin-top:10px;font:600 11px Inter;color:#6E7A90}
</style><div class="hoja"><div class="marca"><img src="data:image/webp;base64,${logo}">SOYLUISFLORES.ES · RECURSO GRATUITO</div>${cuerpo}<div class="pie">soyluisflores.es</div></div></html>`;
}

const pedido = process.argv[2];
const archivos = fs
  .readdirSync(fuente)
  .filter((f) => f.endsWith(".md"))
  .filter((f) => !pedido || f === `${pedido}.md`);
if (!archivos.length) throw new Error(pedido ? `No existe video/recursos/${pedido}.md` : "No hay recursos en video/recursos/");

fs.mkdirSync(salida, { recursive: true });
const navegador = await puppeteer.launch({ executablePath: ejecutable, headless: true, args: ["--no-sandbox"] });
try {
  for (const f of archivos) {
    const slug = f.replace(/\.md$/, "");
    const pagina = await navegador.newPage();
    await pagina.setContent(html(fs.readFileSync(path.join(fuente, f), "utf8")), { waitUntil: "load" });
    await pagina.evaluate(() => document.fonts.ready);
    const destino = path.join(salida, `${slug}.pdf`);
    await pagina.pdf({ path: destino, format: "A4", printBackground: true });
    await pagina.close();
    console.log(`✓ public/recursos/${slug}.pdf (${Math.round(fs.statSync(destino).size / 1024)} KB)`);
  }
} finally {
  await navegador.close();
}
