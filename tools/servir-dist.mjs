// Servidor estatico minimo para revisar dist/ en el navegador.
// `astro preview` no arranca en este equipo, asi que esto hace el trabajo.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, resolve } from "node:path";

const raiz = resolve(process.argv[2] ?? "dist");
const puerto = Number(process.argv[3] ?? 4325);

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  try {
    const limpia = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let ruta = join(raiz, limpia);

    try {
      if ((await stat(ruta)).isDirectory()) ruta = join(ruta, "index.html");
    } catch {
      // Sin extension: Astro genera carpeta/index.html
      if (!extname(ruta)) ruta = join(ruta, "index.html");
    }

    const cuerpo = await readFile(ruta);
    res.writeHead(200, { "Content-Type": TIPOS[extname(ruta)] ?? "application/octet-stream" });
    res.end(cuerpo);
  } catch {
    try {
      const err = await readFile(join(raiz, "404.html"));
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(err);
    } catch {
      res.writeHead(404).end("404");
    }
  }
}).listen(puerto, () => console.log("sirviendo " + raiz + " en http://localhost:" + puerto));
