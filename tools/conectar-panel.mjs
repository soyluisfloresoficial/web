// Conecta la web con el panel (panel.soyluisflores.es) de una sola vez.
// Ver «Conectar con el panel» en AGENDA.md.
//
// Uso, en la terminal, dentro de la carpeta de la web:
//   node tools/conectar-panel.mjs
//
// Antes tienes que haber iniciado sesión, tú, en las dos cuentas:
//   npx firebase login      (en la carpeta del panel)
//   npx wrangler login      (en la carpeta de la web)
//
// Qué hace:
//   1. Comprueba las dos sesiones y el proyecto de Firebase del panel.
//   2. Inventa una clave al azar y la guarda en Firebase (SECRETO_FORMULARIO)
//      y en Cloudflare (PANEL_SECRETO). La clave no se muestra ni se guarda en
//      ningún archivo: pasa directa de este programa a las dos cuentas.
//   3. Publica la función webhookFormulario del panel.
//   4. Guarda en Cloudflare la dirección del panel (PANEL_WEBHOOK_URL).
//   5. Manda un lead de prueba y te dice si llegó.
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const panel = path.resolve(process.argv[2] ?? path.join(web, "..", "panel"));
const REGION = "europe-west1";

function ejecutar(orden, carpeta, entrada) {
  const r = spawnSync(orden, { cwd: carpeta, shell: true, encoding: "utf8", input: entrada, maxBuffer: 20 * 1024 * 1024 });
  return { ok: r.status === 0, salida: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

function paso(n, texto) {
  console.log(`\n${n}. ${texto}`);
}

function parar(texto) {
  console.error(`\nNo se pudo terminar: ${texto}\n`);
  process.exit(1);
}

console.log("\nConectar la web soyluisflores.es con el panel\n");
if (!fs.existsSync(path.join(panel, "firebase.json"))) {
  parar(`no encuentro el panel en ${panel}. Pasa su carpeta así: node tools/conectar-panel.mjs "C:\\ruta\\al\\panel"`);
}

paso(1, "Compruebo las sesiones…");
const fb = ejecutar("npx firebase login:list", panel);
if (!fb.ok || /No authorized accounts/i.test(fb.salida)) {
  parar('no hay sesión en Firebase. En la carpeta del panel ejecuta "npx firebase login", entra con tu cuenta y vuelve a ejecutar esto.');
}
const cf = ejecutar("npx wrangler whoami", web);
if (!cf.ok || /not authenticated/i.test(cf.salida)) {
  parar('no hay sesión en Cloudflare. En la carpeta de la web ejecuta "npx wrangler login", entra con tu cuenta y vuelve a ejecutar esto.');
}
console.log("   Firebase y Cloudflare: sesión iniciada.");

// Proyecto de producción del panel: el de .firebaserc, o el que escribas.
let proyecto = "";
try {
  proyecto = JSON.parse(fs.readFileSync(path.join(panel, ".firebaserc"), "utf8")).projects?.prod ?? "";
} catch {
  /* sin .firebaserc: se pregunta */
}
if (!proyecto || proyecto.includes("COMPLETAR")) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  proyecto = (await rl.question("   ¿Cuál es el id del proyecto de Firebase del panel? (lo ves en console.firebase.google.com): ")).trim();
  rl.close();
}
if (!/^[a-z0-9-]{4,40}$/.test(proyecto)) parar(`«${proyecto}» no parece un id de proyecto de Firebase.`);
const url = `https://${REGION}-${proyecto}.cloudfunctions.net/webhookFormulario`;

paso(2, "Creo la clave compartida y la guardo en Firebase…");
const clave = crypto.randomBytes(32).toString("base64url");
// Firebase la lee de un archivo: se crea en la carpeta temporal y se borra al momento.
const temporal = path.join(os.tmpdir(), `lf-${crypto.randomBytes(6).toString("hex")}`);
fs.writeFileSync(temporal, clave, { mode: 0o600 });
const secreto = ejecutar(`npx firebase functions:secrets:set SECRETO_FORMULARIO --project ${proyecto} --data-file "${temporal}" --force`, panel);
fs.rmSync(temporal, { force: true });
if (!secreto.ok) parar(`Firebase no guardó la clave.\n${secreto.salida.slice(-800)}`);
console.log("   Guardada en Firebase como SECRETO_FORMULARIO.");

paso(3, "Publico la función webhookFormulario del panel (tarda unos minutos)…");
const despliegue = ejecutar(`npx firebase deploy --only functions:webhookFormulario --project ${proyecto} --force`, panel);
if (!despliegue.ok) {
  parar(
    `Firebase no publicó la función. Lo más común: el proyecto no está en el plan Blaze o el panel aún no está montado (DESPLIEGUE.md del panel, apartados 1 a 6).\n${despliegue.salida.slice(-1200)}`,
  );
}
console.log("   Publicada.");

paso(4, "Guardo la dirección y la clave en Cloudflare…");
for (const [nombre, valor] of [
  ["PANEL_SECRETO", clave],
  ["PANEL_WEBHOOK_URL", url],
]) {
  const r = ejecutar(`npx wrangler secret put ${nombre} --name web`, web, valor);
  if (!r.ok) parar(`Cloudflare no guardó ${nombre}.\n${r.salida.slice(-800)}`);
  console.log(`   ${nombre}: guardado como secreto del Worker web.`);
}

paso(5, "Mando un lead de prueba al panel…");
const prueba = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-panel-secreto": clave },
  body: JSON.stringify({
    marca: "soyluisflores",
    nombre: "Prueba de conexión",
    email: "prueba-conexion@soyluisflores.es",
    mensaje: "Lead de prueba de tools/conectar-panel.mjs. Puedes borrarlo.",
  }),
}).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
if (!prueba.ok) parar(`el panel respondió ${prueba.status}: ${(await prueba.text()).slice(0, 300)}`);

console.log(`
Listo. La web y el panel están conectados.

- En el panel, en Leads, verás «Prueba de conexión»: puedes borrarlo.
- Desde ahora cada reserva de la web entra en el panel como lead, y también
  quien se suscriba a la guía gratis.
- Cloudflare tarda uno o dos minutos en aplicar los secretos.
`);
