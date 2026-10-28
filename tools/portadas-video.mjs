// Portadas del video de «Por dentro» en WebP, al tamaño al que se ven
// (28/10/2026). Remotion las saca en JPEG a tamaño completo; PageSpeed
// marcaba que pesaban el triple de lo necesario.
//
// Uso (después de `npm run piloto-web` en video/):
//   node tools/portadas-video.mjs
//
// - Horizontal: se ve como mucho a 1120 px de ancho en escritorio.
// - Vertical: en celular ocupa el ancho de la pantalla menos los márgenes,
//   unos 340 px; a 540 px sigue nítida en pantallas de densidad 1,5.
import sharp from "sharp";
import fs from "node:fs";

const PORTADAS = [
  { de: "public/video/piloto-portada.jpg", a: "public/video/piloto-portada.webp", ancho: 1120 },
  { de: "public/video/piloto-vertical-portada.jpg", a: "public/video/piloto-vertical-portada.webp", ancho: 540 },
];

for (const { de, a, ancho } of PORTADAS) {
  await sharp(de).resize({ width: ancho }).webp({ quality: 72 }).toFile(a);
  console.log(`${a}: ${(fs.statSync(de).size / 1024).toFixed(0)} KB → ${(fs.statSync(a).size / 1024).toFixed(0)} KB`);
}
