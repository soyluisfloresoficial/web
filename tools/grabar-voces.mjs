// Graba las voces de las respuestas fijas del chat de Flora (08/11/2026).
//
// Pide cada respuesta a /api/voz de la web publicada (con la voz configurada
// en VOZ_FLORA, o la que se indique con --voz) y guarda el audio en
// public/voz/<huella>.mp3. El chat usa esos archivos cuando el texto coincide.
//
//   node tools/grabar-voces.mjs            graba solo lo que falta
//   node tools/grabar-voces.mjs --forzar   vuelve a grabarlo todo (por ejemplo, al cambiar de voz)
//   node tools/grabar-voces.mjs --voz celeste
//
// Cada grabación gasta unas letras del cupo diario de voz de Cloudflare
// (el plan gratuito da unas 3.600 al día). Si el cupo está agotado, avisa y
// se para: se reintenta después de la 01:00 de Madrid.
import fs from "node:fs";
import path from "node:path";
import { FIJAS, huella, textoDeVoz } from "../src/data/chat-fijas.ts";

const SITIO = "https://soyluisflores.es";
const carpeta = path.resolve("public/voz");
const forzar = process.argv.includes("--forzar");
const i = process.argv.indexOf("--voz");
const voz = i > -1 ? process.argv[i + 1] : undefined;

fs.mkdirSync(carpeta, { recursive: true });
const textos = [...new Set(Object.values(FIJAS).map(textoDeVoz))];
const nombres = new Set(textos.map(huella));

// Archivos que ya no corresponden a ningún texto: se borran.
for (const f of fs.readdirSync(carpeta)) {
  if (f.endsWith(".mp3") && !nombres.has(f.replace(/\.mp3$/, ""))) {
    fs.unlinkSync(path.join(carpeta, f));
    console.log("borrado (texto que ya no existe):", f);
  }
}

let hechos = 0;
for (const texto of textos) {
  const destino = path.join(carpeta, `${huella(texto)}.mp3`);
  if (fs.existsSync(destino) && !forzar) {
    console.log("ya está:", path.basename(destino));
    continue;
  }
  const r = await fetch(`${SITIO}/api/voz`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: SITIO },
    body: JSON.stringify(voz ? { texto, voz } : { texto }),
  });
  if (!r.ok) {
    const motivo = r.status === 502 ? "el cupo diario de voz de Cloudflare está agotado (se reinicia a la 01:00 de Madrid)" : `la web respondió ${r.status}`;
    console.error(`No se pudo grabar «${texto.slice(0, 40)}…»: ${motivo}.`);
    process.exit(1);
  }
  const audio = Buffer.from(await r.arrayBuffer());
  if (audio.length < 2000) {
    console.error("El audio salió demasiado corto: no se guarda.");
    process.exit(1);
  }
  fs.writeFileSync(destino, audio);
  hechos++;
  console.log(`grabado: ${path.basename(destino)} (${Math.round(audio.length / 1024)} KB, ${texto.length} letras)`);
  await new Promise((x) => setTimeout(x, 5000));
}
console.log(`Listo: ${hechos} grabadas, ${textos.length} en total.`);
