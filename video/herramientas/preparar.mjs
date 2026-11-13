/**
 * Prepara la carpeta publico/ del LF Motion System:
 *  1. Copia las fuentes y el logo de la web (../public) → publico/fonts y publico/logo.
 *  2. Sintetiza los efectos de sonido → publico/sfx (whoosh, clic, impacto, pop).
 *  3. Crea publico/medios/ para el avatar, la música y las grabaciones.
 *
 * Los sonidos se generan con código (ruido y senoidales con envolvente): son
 * propios y no dependen de licencias de terceros. Se puede ejecutar siempre
 * que haga falta; sobrescribe lo generado y nunca toca publico/medios/.
 *
 * Uso: npm run lf:preparar
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const publico = join(raiz, "publico");
const web = join(raiz, "..", "public");

for (const d of ["fonts", "logo", "sfx", "medios"]) mkdirSync(join(publico, d), { recursive: true });

let copiados = 0;
for (const sub of ["fonts", "logo"]) {
  const origen = join(web, sub);
  if (!existsSync(origen)) {
    console.warn(`Aviso: no existe ${origen}; copia a mano las fuentes y el logo.`);
    continue;
  }
  for (const f of readdirSync(origen)) {
    copyFileSync(join(origen, f), join(publico, sub, f));
    copiados++;
  }
}

// ------------------------------------------------------------ Síntesis
const SR = 48000;
let semilla = 7;
const ruido = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647) * 2 - 1;

function wav(muestras) {
  const datos = Buffer.alloc(muestras.length * 2);
  muestras.forEach((v, i) => datos.writeInt16LE(Math.max(-1, Math.min(1, v)) * 32767, i * 2));
  const cab = Buffer.alloc(44);
  cab.write("RIFF", 0);
  cab.writeUInt32LE(36 + datos.length, 4);
  cab.write("WAVEfmt ", 8);
  cab.writeUInt32LE(16, 16);
  cab.writeUInt16LE(1, 20);
  cab.writeUInt16LE(1, 22);
  cab.writeUInt32LE(SR, 24);
  cab.writeUInt32LE(SR * 2, 28);
  cab.writeUInt16LE(2, 32);
  cab.writeUInt16LE(16, 34);
  cab.write("data", 36);
  cab.writeUInt32LE(datos.length, 40);
  return Buffer.concat([cab, datos]);
}

function generar(seg, fn) {
  const n = Math.round(SR * seg);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = fn(i / SR, i / n);
  // Normaliza a -3 dBFS.
  const pico = out.reduce((m, v) => Math.max(m, Math.abs(v)), 0) || 1;
  return Array.from(out, (v) => (v / pico) * 0.7);
}

// Whoosh: ruido filtrado (paso bajo variable) con envolvente de campana.
let lp = 0;
const whoosh = generar(0.55, (t, p) => {
  const corte = 0.02 + 0.25 * Math.sin(Math.PI * p);
  lp += corte * (ruido() - lp);
  return lp * Math.pow(Math.sin(Math.PI * p), 2);
});

// Clic: transitorio corto con un tono alto que cae rápido.
const clic = generar(0.06, (t) => (Math.sin(2 * Math.PI * 2400 * t) * 0.6 + ruido() * 0.4) * Math.exp(-t * 90));

// Impacto: golpe grave que baja de tono + ruido inicial.
const impacto = generar(0.7, (t) => {
  const f = 110 * Math.exp(-t * 3) + 38;
  return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 5) + ruido() * 0.35 * Math.exp(-t * 40);
});

// Pop: burbuja que sube de tono.
const pop = generar(0.18, (t) => Math.sin(2 * Math.PI * (380 + 900 * t) * t) * Math.exp(-t * 22));

for (const [nombre, m] of Object.entries({ whoosh, clic, impacto, pop })) {
  writeFileSync(join(publico, "sfx", `${nombre}.wav`), wav(m));
}

console.log(`Listo: ${copiados} archivos de marca copiados y 4 efectos en publico/sfx.`);
console.log("Coloca el avatar, la música y las grabaciones en publico/medios/.");
