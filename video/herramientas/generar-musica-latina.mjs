/**
 * Música latina propia para anuncios de restaurante (síntesis con código, sin licencias de terceros).
 * Sol mayor (G–C–D–G), por defecto 104 BPM: guitarra rasgueada (Karplus-Strong), bajo en tumbao,
 * maracas, clave 3-2, congas y bombo suave. Arranca con guitarra y maracas, entra completa en
 * --entrada y cierra con un acorde largo en los últimos --cierre segundos.
 *
 * Uso: node herramientas/generar-musica-latina.mjs publico/medios/musica-restaurante.wav --duracion 24 --entrada 1.73 --cierre 3.4 [--bpm 104]
 */
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const salida = args[0] ?? "publico/medios/musica-restaurante.wav";
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? Number(args[i + 1]) : d;
};
const DUR = opt("duracion", 24);
const ENTRADA = opt("entrada", 1.7);
const CIERRE = opt("cierre", 3.4);
const BPM = opt("bpm", 104);
const SR = 48000;
const N = Math.ceil(DUR * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);
const beat = 60 / BPM;
const compas = beat * 4;
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
let semilla = 7;
const ruido = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647) * 2 - 1;
const finMusica = DUR - CIERRE;

function sumar(i0, datos, pan = 0, gan = 1) {
  const gl = gan * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gan * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let k = 0; k < datos.length && i0 + k < N; k++) {
    if (i0 + k < 0) continue;
    L[i0 + k] += datos[k] * gl;
    R[i0 + k] += datos[k] * gr;
  }
}

/** Cuerda pulsada (Karplus-Strong). */
function cuerda(f, dur, brillo = 0.5) {
  const n = Math.floor(dur * SR);
  const p = Math.max(2, Math.round(SR / f));
  const buf = Float32Array.from({ length: p }, () => ruido() * 0.5);
  const out = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const j = i % p;
    const v = buf[j];
    const nuevo = 0.996 * (brillo * v + (1 - brillo) * prev);
    prev = v;
    buf[j] = (v + nuevo) / 2;
    out[i] = v;
  }
  return out;
}

const tono = (f, dur, caida, forma = (x) => Math.sin(x)) => {
  const n = Math.floor(dur * SR);
  return Float32Array.from({ length: n }, (_, i) => forma(2 * Math.PI * f * (i / SR)) * Math.exp(-(i / SR) / caida));
};

// Acordes (MIDI) por compás: G, C, D, G
const ACORDES = [
  [55, 59, 62, 67, 71],
  [55, 60, 64, 67, 72],
  [57, 62, 66, 69, 74],
  [55, 59, 62, 67, 71],
];
const BAJOS = [43, 48, 50, 43];

function rasgueo(t, acorde, fuerza, abajo = true) {
  const notas = abajo ? acorde : [...acorde].reverse();
  notas.forEach((m, k) => {
    sumar(Math.floor((t + k * 0.008) * SR), cuerda(hz(m), 0.5, 0.45), (k - 2) * 0.12, 0.13 * fuerza);
  });
}

const totalCompases = Math.ceil(DUR / compas) + 1;
for (let c = 0; c < totalCompases; c++) {
  const t0 = c * compas;
  if (t0 >= DUR) break;
  const acorde = ACORDES[c % 4];
  const bajo = BAJOS[c % 4];
  const completo = t0 + 0.001 >= ENTRADA - beat * 0.01;
  if (t0 >= finMusica) {
    // Acorde final largo
    rasgueo(t0, acorde.map((m) => m), 1.2);
    sumar(Math.floor(t0 * SR), tono(hz(bajo), 2.5, 0.9), 0, 0.35);
    break;
  }
  // Guitarra: x . x x . x x .  (corcheas)
  const patron = [1, 0, 0.7, 0.9, 0, 0.8, 0.9, 0];
  patron.forEach((f, k) => {
    if (f) rasgueo(t0 + k * (beat / 2), acorde, f, k % 2 === 0);
  });
  // Maracas: semicorcheas con acento en las corcheas
  for (let k = 0; k < 16; k++) {
    const t = t0 + k * (beat / 4);
    const n = Math.floor(0.05 * SR);
    const d = Float32Array.from({ length: n }, (_, i) => ruido() * Math.exp(-i / (0.012 * SR)));
    // pasa-altos simple
    for (let i = n - 1; i > 0; i--) d[i] = d[i] - 0.92 * d[i - 1];
    sumar(Math.floor(t * SR), d, 0.35, k % 2 ? 0.035 : 0.06);
  }
  if (!completo) continue;
  // Clave 3-2 (compás de 2 tiempos dobles): golpes en 1, 1&+, 2&, 3, 4 aprox.
  [0, 1.5, 3, 5, 6].forEach((b) => sumar(Math.floor((t0 + (b * beat) / 2) * SR), tono(2500, 0.08, 0.018), -0.3, 0.09));
  // Bajo en tumbao: 2& y 4
  sumar(Math.floor((t0 + 1.5 * beat) * SR), tono(hz(bajo), beat * 1.4, 0.35, (x) => Math.sin(x) + 0.3 * Math.sin(2 * x)), 0, 0.32);
  sumar(Math.floor((t0 + 3 * beat) * SR), tono(hz(bajo + 7), beat * 0.9, 0.3, (x) => Math.sin(x) + 0.3 * Math.sin(2 * x)), 0, 0.28);
  // Congas: abierto en 4 y 4&
  sumar(Math.floor((t0 + 3 * beat) * SR), tono(210, 0.25, 0.07), 0.25, 0.22);
  sumar(Math.floor((t0 + 3.5 * beat) * SR), tono(185, 0.25, 0.07), 0.25, 0.2);
  sumar(Math.floor((t0 + 1 * beat) * SR), tono(320, 0.12, 0.03), 0.25, 0.12);
  // Bombo suave en 1 y 3
  [0, 2].forEach((b) => {
    const n = Math.floor(0.3 * SR);
    const d = Float32Array.from({ length: n }, (_, i) => {
      const t = i / SR;
      return Math.sin(2 * Math.PI * (55 + 70 * Math.exp(-t * 30)) * t) * Math.exp(-t * 9);
    });
    sumar(Math.floor((t0 + b * beat) * SR), d, 0, 0.35);
  });
}

// Fundido de salida y normalización a -1 dBFS
let pico = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const f = t > DUR - 1.2 ? Math.max(0, (DUR - t) / 1.2) : 1;
  L[i] *= f;
  R[i] *= f;
  pico = Math.max(pico, Math.abs(L[i]), Math.abs(R[i]));
}
const g = (Math.pow(10, -1 / 20) / (pico || 1));
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
}
writeFileSync(salida, buf);
console.log(`✓ ${salida} (${DUR.toFixed(2)} s, ${BPM} BPM, entrada ${ENTRADA} s)`);
