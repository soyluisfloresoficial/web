import fs from "node:fs";
import path from "node:path";

/**
 * Imagen para compartir de una ruta («/servicios/agentes-ia»).
 *
 * Las genera `node tools/generar-og.mjs` en public/og/. Si una página aún no
 * tiene la suya (por ejemplo, un artículo nuevo), se usa la general.
 */
export function imagenOg(ruta: string): string {
  const limpia = ruta.replace(/\/+$/, "");
  const nombre = limpia === "" ? "inicio" : limpia.slice(1).replaceAll("/", "-");
  const propia = path.join(process.cwd(), "public", "og", `${nombre}.jpg`);
  return fs.existsSync(propia) ? `/og/${nombre}.jpg` : "/og-default.png";
}
