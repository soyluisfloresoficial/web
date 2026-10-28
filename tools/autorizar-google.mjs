// Conecta tu Google Calendar con la agenda de la web (ver AGENDA.md).
//
// Uso, en la terminal, dentro de la carpeta del proyecto:
//   node tools/autorizar-google.mjs
//
// Te pide el ID de cliente y el secreto de cliente de Google Cloud, abre el
// navegador para que entres con TU cuenta de Google y des permiso, y al final
// te muestra el «refresh token» que se pega en Cloudflare como secreto.
//
// Nada se guarda en el ordenador ni en el repositorio: todo se queda en esta
// ventana de la terminal. Cierra la terminal cuando termines.
import http from "node:http";
import crypto from "node:crypto";
import { exec } from "node:child_process";
import readline from "node:readline/promises";

const PUERTO = 53682;
const REDIRECCION = `http://127.0.0.1:${PUERTO}`;
// Ver y crear eventos, y consultar las horas ocupadas. Nada más.
const PERMISOS = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
].join(" ");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("\nConectar Google Calendar con la agenda de soyluisflores.es\n");
const clientId = (await rl.question("1. Pega el ID de cliente y pulsa Enter: ")).trim();
const clientSecret = (await rl.question("2. Pega el secreto de cliente y pulsa Enter: ")).trim();
rl.close();
if (!clientId.endsWith(".apps.googleusercontent.com") || !clientSecret) {
  console.error("\nEl ID de cliente debe terminar en .apps.googleusercontent.com. Revisa AGENDA.md, paso 1.");
  process.exit(1);
}

const verificador = crypto.randomBytes(48).toString("base64url");
const reto = crypto.createHash("sha256").update(verificador).digest("base64url");
const estado = crypto.randomBytes(16).toString("hex");

const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
url.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: REDIRECCION,
  response_type: "code",
  scope: PERMISOS,
  access_type: "offline",
  prompt: "consent",
  code_challenge: reto,
  code_challenge_method: "S256",
  state: estado,
}).toString();

const servidor = http.createServer(async (req, res) => {
  const recibido = new URL(req.url ?? "/", REDIRECCION);
  if (recibido.pathname !== "/") return res.writeHead(404).end();
  const codigo = recibido.searchParams.get("code");
  const fallo = recibido.searchParams.get("error");
  const pagina = (texto) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<meta charset="utf-8"><body style="font:18px system-ui;padding:3rem;background:#07090d;color:#f8fafc"><p>${texto}</p></body>`);
  };

  if (fallo || !codigo || recibido.searchParams.get("state") !== estado) {
    pagina("No se pudo conectar. Vuelve a la terminal para ver qué pasó.");
    console.error(`\nGoogle no dio el permiso (${fallo ?? "respuesta incompleta"}). Vuelve a ejecutar el comando.`);
    servidor.close();
    return;
  }

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: codigo,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECCION,
      code_verifier: verificador,
    }),
  });
  const datos = await r.json();
  servidor.close();

  if (!r.ok || !datos.refresh_token) {
    pagina("No se pudo conectar. Vuelve a la terminal para ver qué pasó.");
    console.error(`\nGoogle respondió con un error: ${datos.error ?? r.status}. ${datos.error_description ?? ""}`);
    console.error("Revisa que copiaste bien el ID y el secreto, y vuelve a ejecutar el comando.");
    return;
  }
  const permisos = String(datos.scope ?? "");
  pagina("Listo. Ya puedes cerrar esta pestaña y volver a la terminal.");
  console.log("\nListo. Google dio permiso para la agenda.\n");
  if (!permisos.includes("calendar.events") || !permisos.includes("calendar.freebusy")) {
    console.log("Atención: no marcaste todas las casillas de permisos. Vuelve a ejecutar el comando y márcalas todas.\n");
  }
  console.log("3. Copia este valor y pégalo en Cloudflare como secreto GOOGLE_REFRESH_TOKEN:\n");
  console.log(datos.refresh_token);
  console.log("\nNo lo compartas con nadie ni lo pegues en ningún otro sitio. Después cierra esta terminal.\n");
});

servidor.listen(PUERTO, "127.0.0.1", () => {
  console.log("\nSe va a abrir el navegador. Entra con tu cuenta de Google y acepta los permisos.");
  console.log("Si no se abre solo, copia esta dirección en el navegador:\n");
  console.log(url.toString(), "\n");
  const abrir = process.platform === "win32" ? `start "" "${url}"` : process.platform === "darwin" ? `open "${url}"` : `xdg-open "${url}"`;
  exec(abrir);
});
