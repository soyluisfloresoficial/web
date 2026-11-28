// Mete los archivos de public/ dentro del Worker (src/static.ts) para desplegar sin subida de assets.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
const types = { html: "text/html; charset=utf-8", js: "text/javascript; charset=utf-8", css: "text/css; charset=utf-8", json: "application/manifest+json", svg: "image/svg+xml" };
const files = {};
for (const f of readdirSync("public")) {
  const ext = f.split(".").pop();
  if (!types[ext]) continue;
  files["/" + f] = { type: types[ext], body: readFileSync("public/" + f, "utf8") };
}
for (const [pub, src, type] of [["/vendor/leaflet.js", "node_modules/leaflet/dist/leaflet.js", types.js], ["/vendor/leaflet.css", "node_modules/leaflet/dist/leaflet.css", types.css]])
  files[pub] = { type, body: readFileSync(src, "utf8") };
writeFileSync("src/static.ts", "// Generado por scripts/embed.mjs. No editar a mano.\nexport const FILES: Record<string, { type: string; body: string }> = " + JSON.stringify(files) + ";\n");
console.log("Archivos embebidos:", Object.keys(files).join(", "));
