/**
 * Música de fondo propia (síntesis con código, sin licencias de terceros).
 * Base tecnológica a 100 BPM en La menor (Am–F–C–G):
 *  - antes de --cambio: pad suave, arpegio y pulso tenue;
 *  - un compás antes: subida de ruido (riser);
 *  - desde --cambio: bombo, palmas, charles y bajo («cambio de ritmo»).
 * Sale normalizada a -1 dBFS; el volumen final se ajusta en la configuración
 * del video (musica.volumen) para que nunca tape la voz.
 *
 * Uso: node herramientas/generar-musica.mjs publico/medios/musica.wav --duracion 45.1 --cambio 13.4 [--bpm 100]
 */
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const salida = args[0] ?? "publico/medios/musica.wav";
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? Number(args[i + 1]) : d;
};
const DUR = opt("duracion", 45);
const CAMBIO = opt("cambio", 13);
const BPM = opt("bpm", 100);
const SR = 48000;
const N = Math.ceil(DUR * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);
const beat = 60 / BPM;
const compas = beat * 4;
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
let semilla = 11;
const ruido = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647) * 2 - 1;

function nota(t0, dur, fn, pan = 0, gan = 1) {
  const i0 = Math.max(0, Math.floor(t0 * SR));
  const i1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gan * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gan * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = i0; i < i1; i++) {
    const v = fn((i - i0) / SR);
    L[i] += v * gl;
    R[i] += v * gr;
  }
}

// Acordes (MIDI): Am, F, C, G
const ACORDES = [
  [57, 60, 64],
  [53, 57, 60],
  [48, 52, 55],
  [55, 59, 62],
];

for (let c = 0; c * compas < DUR; c++) {
  const t = c * compas;
  const acorde = ACORDES[c % 4];
  const lleno = t >= CAMBIO - 0.01;
  // Pad: dos voces desafinadas por nota, ataque y cola suaves.
  for (const m of acorde) {
    for (const det of [-0.12, 0.12]) {
      const f = hz(m) * Math.pow(2, det / 12);
      nota(t, compas + 0.4, (x) => {
        const env = Math.min(1, x / 0.5) * Math.min(1, (compas + 0.4 - x) / 0.6);
        return (Math.sin(2 * Math.PI * f * x) + 0.3 * Math.sin(4 * Math.PI * f * x)) * env * 0.05;
      }, det > 0 ? 0.4 : -0.4, lleno ? 1.1 : 0.9);
    }
  }
  // Arpegio en semicorcheas, una octava arriba.
  for (let s = 0; s < 16; s++) {
    const m = acorde[s % 3] + 12 + (s % 6 === 5 ? 12 : 0);
    const f = hz(m);
    nota(t + (s * beat) / 4, 0.3, (x) => Math.sin(2 * Math.PI * f * x) * Math.exp(-x * 14) * 0.06, s % 2 ? 0.5 : -0.5, lleno ? 1 : 0.7);
  }
  for (let b = 0; b < 4; b++) {
    const tb = t + b * beat;
    if (lleno || b % 2 === 0) {
      // Bombo: senoidal que cae de tono.
      nota(tb, 0.35, (x) => Math.sin(2 * Math.PI * (45 + 90 * Math.exp(-x * 30)) * x) * Math.exp(-x * 9) * (lleno ? 0.55 : 0.22));
    }
    if (lleno) {
      // Charles a contratiempo.
      let prev = 0;
      nota(tb + beat / 2, 0.06, () => {
        const n = ruido();
        const v = n - prev;
        prev = n;
        return v;
      }, 0.2, 0.09);
      // Palmas en 2 y 4.
      if (b % 2 === 1) nota(tb, 0.18, (x) => ruido() * Math.exp(-x * 22) * 0.16, -0.1);
      // Bajo en corcheas sobre la fundamental.
      const fb = hz(acorde[0] - 24);
      for (const off of [0, beat / 2]) {
        nota(tb + off, beat / 2, (x) => (Math.sin(2 * Math.PI * fb * x) + 0.25 * Math.sin(4 * Math.PI * fb * x)) * Math.exp(-x * 4) * 0.22);
      }
    }
  }
}

// Subida (riser) en el compás antes del cambio.
let lp = 0;
nota(Math.max(0, CAMBIO - compas), compas, (x) => {
  const p = x / compas;
  lp += (0.02 + 0.5 * p * p) * (ruido() - lp);
  return lp * p * p * 0.35;
});

// Fundidos y normalización a -1 dBFS.
const fin = 1.5 * SR;
let pico = 0;
for (let i = 0; i < N; i++) {
  const g = Math.min(1, i / (0.3 * SR)) * Math.min(1, (N - i) / fin);
  L[i] *= g;
  R[i] *= g;
  pico = Math.max(pico, Math.abs(L[i]), Math.abs(R[i]));
}
const k = 0.89 / (pico || 1);
const datos = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  datos.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * k)) * 32767), i * 4);
  datos.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * k)) * 32767), i * 4 + 2);
}
const cab = Buffer.alloc(44);
cab.write("RIFF", 0);
cab.writeUInt32LE(36 + datos.length, 4);
cab.write("WAVEfmt ", 8);
cab.writeUInt32LE(16, 16);
cab.writeUInt16LE(1, 20);
cab.writeUInt16LE(2, 22);
cab.writeUInt32LE(SR, 24);
cab.writeUInt32LE(SR * 4, 28);
cab.writeUInt16LE(4, 32);
cab.writeUInt16LE(16, 34);
cab.write("data", 36);
cab.writeUInt32LE(datos.length, 40);
writeFileSync(salida, Buffer.concat([cab, datos]));
console.log(`Música: ${salida} · ${DUR} s · ${BPM} BPM · cambio en ${CAMBIO} s`);
