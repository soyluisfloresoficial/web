/**
 * Revisión rápida: empaqueta una sola vez y saca fotogramas sueltos de una
 * composición en out/revision/, para comprobar encuadres y zona segura sin
 * renderizar el video entero.
 *
 * Uso: node herramientas/revisar.mjs LF-Piloto-DobleClientes 1 4 9 15.5
 *      (los números son segundos)
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const [id = "LF-Piloto-DobleClientes", ...segundos] = process.argv.slice(2);
const salida = join(raiz, "out", "revision");
mkdirSync(salida, { recursive: true });

const serveUrl = await bundle({ entryPoint: join(raiz, "src/index.ts"), publicDir: join(raiz, "publico") });
const opciones = { serveUrl, browserExecutable: process.env.NAVEGADOR ?? null };
const comp = await selectComposition({ ...opciones, id });
console.log(`${id}: ${(comp.durationInFrames / comp.fps).toFixed(2)} s`);
for (const s of segundos.length ? segundos : ["1"]) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(Number(s) * comp.fps));
  const archivo = join(salida, `${id}-${String(s).replace(".", "_")}s.png`);
  await renderStill({ ...opciones, composition: comp, frame, output: archivo, scale: 0.5 });
  console.log(archivo);
}
