// Conecta el panel con el horario de la agenda de la web, de una sola vez.
// Ver «Editar el horario desde el panel» en AGENDA.md.
//
// Uso, en la terminal, dentro de la carpeta de la web:
//   node tools/conectar-agenda.mjs
//
// Antes tienes que haber iniciado sesión, tú, en las dos cuentas:
//   npx firebase login      (en la carpeta del panel)
//   npx wrangler login      (en la carpeta de la web)
//
// Qué hace:
//   1. Comprueba las dos sesiones y el proyecto de Firebase del panel.
//   2. Inventa una clave al azar y la guarda en Firebase (AGENDA_ADMIN_TOKEN) y
//      en Cloudflare (AGENDA_ADMIN_TOKEN). La clave no se muestra ni se guarda
//      en ningún archivo: pasa directa de este programa a las dos cuentas.
//   3. Compila el panel y publica la función agendaHorario y la pantalla nueva.
//   4. Comprueba, con la clave, que la web responde.
//
// Si lo vuelves a ejecutar, crea una clave nueva y la cambia en los dos sitios.
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const panel = path.resolve(process.argv[2] ?? path.join(web, "..", "panel"));
const DIRECCION = "https://soyluisflores.es/api/agenda/config";

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

console.log("\nConectar el panel con el horario de la agenda\n");
if (!fs.existsSync(path.join(panel, "firebase.json"))) {
  parar(`no encuentro el panel en ${panel}. Pasa su carpeta así: node tools/conectar-agenda.mjs "C:\\ruta\\al\\panel"`);
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

paso(2, "Creo la clave y la guardo en Firebase y en Cloudflare…");
const clave = crypto.randomBytes(32).toString("base64url");
// Firebase la lee de un archivo: se crea en la carpeta temporal y se borra al momento.
const temporal = path.join(os.tmpdir(), `lf-${crypto.randomBytes(6).toString("hex")}`);
fs.writeFileSync(temporal, clave, { mode: 0o600 });
const secreto = ejecutar(`npx firebase functions:secrets:set AGENDA_ADMIN_TOKEN --project ${proyecto} --data-file "${temporal}" --force`, panel);
fs.rmSync(temporal, { force: true });
if (!secreto.ok) parar(`Firebase no guardó la clave.\n${secreto.salida.slice(-800)}`);
console.log("   Guardada en Firebase como AGENDA_ADMIN_TOKEN.");
const enCloudflare = ejecutar("npx wrangler secret put AGENDA_ADMIN_TOKEN --name web", web, clave);
if (!enCloudflare.ok) parar(`Cloudflare no guardó la clave.\n${enCloudflare.salida.slice(-800)}`);
console.log("   Guardada en Cloudflare como secreto del Worker web.");

paso(3, "Compilo el panel y publico la función y la pantalla (tarda unos minutos)…");
const compilacion = ejecutar("npm run build", panel);
if (!compilacion.ok) parar(`el panel no compiló.\n${compilacion.salida.slice(-1200)}`);
const despliegue = ejecutar(`npx firebase deploy --only functions:agendaHorario,hosting --project ${proyecto} --force`, panel);
if (!despliegue.ok) {
  parar(`Firebase no publicó. Lo más común: el proyecto no está en el plan Blaze (DESPLIEGUE.md del panel).\n${despliegue.salida.slice(-1200)}`);
}
console.log("   Publicado.");

paso(4, "Compruebo que la web responde con la clave (Cloudflare tarda uno o dos minutos)…");
let estado = 0;
for (let intento = 0; intento < 12; intento++) {
  const r = await fetch(DIRECCION, { headers: { Authorization: `Bearer ${clave}` } }).catch(() => null);
  estado = r?.status ?? 0;
  if (estado === 200) break;
  await new Promise((ok) => setTimeout(ok, 10_000));
}
if (estado !== 200) {
  parar(
    `la web respondió ${estado || "nada"} en lugar de 200. 401 = la clave aún no se aplicó (espera un minuto y repite); 503 = falta el KV AGENDA_CONFIG en wrangler.jsonc.`,
  );
}

console.log(`
Listo. El panel ya puede cambiar el horario de la agenda.

- Abre el panel → Ajustes → «Horario de la agenda».
- Cada cambio tarda como máximo un minuto en verse en la web.
`);
