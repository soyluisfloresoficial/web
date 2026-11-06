// Trae el catálogo de servicios del panel (función catalogoPublico) y lo guarda
// en src/data/catalogo.json, que es lo que pinta la web y lo que sabe Flora. No
// trae precios: la web no los muestra. Ejecútalo y publica cuando cambien los
// textos del catálogo en el panel:
//
//   node tools/sincronizar-catalogo.mjs
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const URL_CATALOGO = "https://europe-west1-panel-soyluisflores.cloudfunctions.net/catalogoPublico";
const destino = fileURLToPath(new URL("../src/data/catalogo.json", import.meta.url));

const respuesta = await fetch(URL_CATALOGO);
if (!respuesta.ok) throw new Error(`El panel respondió ${respuesta.status}`);
const catalogo = await respuesta.json();
if (!Array.isArray(catalogo.servicios) || catalogo.servicios.length === 0) throw new Error("El catálogo llegó vacío");
// El repositorio de la web es público: si algún día llegara un importe, aquí se para.
if (/"(precio|cuota|tasas|mercado|stripe\w*)"\s*:/i.test(JSON.stringify(catalogo))) {
  throw new Error("El catálogo trae datos que no pueden ser públicos");
}

await writeFile(destino, JSON.stringify(catalogo, null, 2) + "\n");
console.log(`Catálogo guardado: ${catalogo.servicios.length} servicios.`);
