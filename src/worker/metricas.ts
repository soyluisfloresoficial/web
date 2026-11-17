/**
 * Métricas propias de la web (17/11/2026), para la sección «Métricas web»
 * del panel. Sin cookies y SIN guardar la IP (decisión del titular).
 *
 * Qué se apunta, en Workers Analytics Engine (dataset «web_visitas»):
 *  - vista: cada página HTML servida a una persona (ruta, fuente, campaña,
 *    país, región, ciudad, dispositivo, navegador, sistema, idioma).
 *  - tiempo: segundos en la página, que manda la propia web al salir
 *    (POST /api/m, sin cookies).
 *  - conversion: guía confirmada, cita (formulario o chat) y conversación
 *    con Flora.
 *  - bot: visitas de buscadores y agentes de IA (Googlebot, GPTBot...), por
 *    separado, para no inflar las de personas.
 *
 * Visitantes únicos: una huella anónima que cambia cada día
 * (SHA-256 de día + secreto + IP + navegador, recortada). La IP solo se usa
 * en memoria para calcularla y no se guarda en ningún sitio; al día
 * siguiente la misma persona da otra huella, así que no se puede seguir a
 * nadie. Es la técnica de herramientas de privacidad como Plausible.
 *
 * El panel lo lee con GET /api/metricas, con el mismo secreto que ya
 * comparten web y panel (PANEL_SECRETO). Para consultar, la web necesita
 * CLOUDFLARE_ACCOUNT_ID y METRICAS_TOKEN (clave de solo lectura de
 * «Account Analytics»), los dos en el panel de Cloudflare.
 *
 * Retención: tres meses (límite de Analytics Engine).
 */

export interface PuntoMetrica {
  blobs?: string[];
  doubles?: number[];
  indexes?: string[];
}

export interface EnvMetricas {
  METRICAS?: { writeDataPoint(punto: PuntoMetrica): void };
  CLOUDFLARE_ACCOUNT_ID?: string;
  METRICAS_TOKEN?: string;
  PANEL_SECRETO?: string;
}

const DATASET = "web_visitas";
const corto = (t: string | null | undefined, n = 120) => (t ?? "").slice(0, n);

// ---------------------------------------------------------------------------
// Quién visita: dispositivo, navegador, sistema, fuente y bots
// ---------------------------------------------------------------------------

const BOTS: Array<[RegExp, string]> = [
  [/GPTBot|OAI-SearchBot|ChatGPT-User/i, "ChatGPT (OpenAI)"],
  [/ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai/i, "Claude (Anthropic)"],
  [/PerplexityBot|Perplexity-User/i, "Perplexity"],
  [/Google-Extended|GoogleOther/i, "Google IA"],
  [/Googlebot|Google-InspectionTool|AdsBot-Google|Mediapartners-Google/i, "Google"],
  [/bingbot|BingPreview|msnbot/i, "Bing"],
  [/Applebot/i, "Apple"],
  [/DuckDuckBot/i, "DuckDuckGo"],
  [/YandexBot/i, "Yandex"],
  [/facebookexternalhit|meta-externalagent|Facebot/i, "Meta"],
  [/LinkedInBot/i, "LinkedIn"],
  [/WhatsApp/i, "WhatsApp (vista previa)"],
  [/Twitterbot/i, "X (vista previa)"],
  [/Bytespider/i, "TikTok"],
  [/AhrefsBot|SemrushBot|MJ12bot|DotBot|PetalBot|SeznamBot/i, "Herramientas SEO"],
  [/bot|crawler|spider|crawl|slurp|headless|lighthouse|pagespeed|curl|wget|python-requests|node-fetch|axios/i, "Otros robots"],
];

export function nombreBot(ua: string): string | null {
  for (const [patron, nombre] of BOTS) if (patron.test(ua)) return nombre;
  return null;
}

function dispositivo(ua: string): string {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "Tableta";
  if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) return "Celular";
  return "Computadora";
}

function navegador(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/Instagram/.test(ua)) return "Instagram (navegador interno)";
  if (/FBAN|FBAV/.test(ua)) return "Facebook (navegador interno)";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua) || /CriOS/.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "Otro";
}

function sistema(ua: string): string {
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X|Macintosh/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Otro";
}

/** De dónde viene: campaña (utm_source) si la hay; si no, por la página de origen. */
function fuente(referencia: string, utmSource: string, propio: string): { fuente: string; host: string } {
  let host = "";
  try {
    host = referencia ? new URL(referencia).hostname.replace(/^www\./, "") : "";
  } catch {
    host = "";
  }
  if (host === propio || host.endsWith("." + propio)) host = "";
  const u = utmSource.toLowerCase();
  const de = (t: string) => u.includes(t) || host.includes(t);
  let f = "Directo";
  if (de("chatgpt") || de("openai")) f = "ChatGPT";
  else if (de("perplexity")) f = "Perplexity";
  else if (de("claude")) f = "Claude";
  else if (de("gemini")) f = "Gemini";
  else if (u === "ig" || de("instagram")) f = "Instagram";
  else if (u === "fb" || de("facebook") || host === "l.facebook.com" || host === "m.facebook.com") f = "Facebook";
  else if (de("google")) f = u && u !== "google" ? "Google Ads" : "Google";
  else if (de("bing")) f = "Bing";
  else if (de("linkedin") || host === "lnkd.in") f = "LinkedIn";
  else if (de("tiktok")) f = "TikTok";
  else if (de("youtube")) f = "YouTube";
  else if (de("whatsapp") || host === "wa.me") f = "WhatsApp";
  else if (u === "correo" || u === "email" || de("mail")) f = "Correo";
  else if (u) f = "Campaña: " + corto(utmSource, 40);
  else if (host) f = "Otra web";
  return { fuente: f, host };
}

/** Huella anónima del día: no se puede revertir ni seguir de un día a otro. */
async function huellaDelDia(ip: string, ua: string, secreto: string): Promise<string> {
  const dia = new Date().toISOString().slice(0, 10);
  const datos = new TextEncoder().encode(`${dia}|${secreto}|${ip}|${ua}`);
  const resumen = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(resumen)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface DatosCf {
  country?: string;
  region?: string;
  city?: string;
}

/**
 * Apunta una página vista (o la visita de un robot). Se llama después de
 * servir la página, sin hacer esperar a nadie. Solo HTML con respuesta 200.
 */
export async function apuntarVista(env: EnvMetricas, request: Request, respuesta: Response): Promise<void> {
  if (!env.METRICAS || request.method !== "GET" || respuesta.status !== 200) return;
  if (!(respuesta.headers.get("Content-Type") ?? "").includes("text/html")) return;
  const url = new URL(request.url);
  const ua = request.headers.get("User-Agent") ?? "";
  const ruta = corto(url.pathname, 200) || "/";

  const bot = nombreBot(ua);
  if (bot) {
    env.METRICAS.writeDataPoint({ blobs: ["bot", ruta, bot], doubles: [1], indexes: ["bot"] });
    return;
  }
  // Las precargas del navegador no son visitas.
  if ((request.headers.get("Sec-Purpose") ?? request.headers.get("Purpose") ?? "").includes("prefetch")) return;

  const cf = ((request as unknown as { cf?: DatosCf }).cf ?? {}) as DatosCf;
  const p = url.searchParams;
  const { fuente: f, host } = fuente(request.headers.get("Referer") ?? "", p.get("utm_source") ?? "", url.hostname.replace(/^www\./, ""));
  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  const visitante = await huellaDelDia(ip, ua, env.PANEL_SECRETO ?? "web");
  const idioma = (request.headers.get("Accept-Language") ?? "").split(",")[0]?.trim().slice(0, 10) ?? "";

  env.METRICAS.writeDataPoint({
    blobs: [
      "vista",
      ruta,
      f,
      corto(host, 80),
      corto(p.get("utm_source"), 60),
      corto(p.get("utm_medium"), 60),
      corto(p.get("utm_campaign"), 80),
      corto(cf.country, 4),
      corto(cf.region, 60),
      corto(cf.city, 60),
      dispositivo(ua),
      navegador(ua),
      sistema(ua),
      visitante,
      idioma,
    ],
    doubles: [1],
    indexes: [visitante],
  });
}

/** POST /api/m: segundos en una página, enviados por la web al salir. */
export async function apuntarTiempo(request: Request, env: EnvMetricas): Promise<Response> {
  const vacio = new Response(null, { status: 204 });
  if (request.method !== "POST" || !env.METRICAS) return vacio;
  const ua = request.headers.get("User-Agent") ?? "";
  if (nombreBot(ua)) return vacio;
  try {
    const cuerpo = (await request.json()) as { r?: unknown; s?: unknown };
    const ruta = corto(String(cuerpo.r ?? ""), 200);
    const segundos = Math.round(Number(cuerpo.s));
    if (!ruta.startsWith("/") || !Number.isFinite(segundos) || segundos < 1) return vacio;
    const visitante = await huellaDelDia(request.headers.get("CF-Connecting-IP") ?? "", ua, env.PANEL_SECRETO ?? "web");
    // Más de 30 minutos en una pestaña olvidada no es lectura: se topa.
    env.METRICAS.writeDataPoint({ blobs: ["tiempo", ruta, visitante], doubles: [Math.min(segundos, 1800)], indexes: [visitante] });
  } catch {
    /* cuerpo raro: se ignora */
  }
  return vacio;
}

/** Una conversión: «guia», «cita-web», «cita-chat», «chat». */
export function apuntarConversion(env: EnvMetricas, tipo: string, detalle = ""): void {
  env.METRICAS?.writeDataPoint({ blobs: ["conversion", tipo, corto(detalle, 80)], doubles: [1], indexes: ["conversion"] });
}

// ---------------------------------------------------------------------------
// Lectura para el panel: GET /api/metricas?rango=hoy|7d|30d|90d
// ---------------------------------------------------------------------------

const RANGOS: Record<string, { dias: number; tramo: string }> = {
  hoy: { dias: 1, tramo: "INTERVAL '1' HOUR" },
  "7d": { dias: 7, tramo: "INTERVAL '1' DAY" },
  "30d": { dias: 30, tramo: "INTERVAL '1' DAY" },
  "90d": { dias: 90, tramo: "INTERVAL '1' DAY" },
};

type Fila = Record<string, string | number>;

async function sql(env: EnvMetricas, consulta: string): Promise<Fila[]> {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/analytics_engine/sql`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.METRICAS_TOKEN}` },
    body: consulta + " FORMAT JSON",
  });
  if (!r.ok) {
    console.error(JSON.stringify({ metricas: "sql", estado: r.status }));
    throw new Error("sql-" + r.status);
  }
  const j = (await r.json()) as { data?: Fila[]; result?: { data?: Fila[] } };
  return j.data ?? j.result?.data ?? [];
}

const num = (v: unknown) => Math.round(Number(v ?? 0) * 100) / 100;

/** Iguala secretos sin dar pistas por el tiempo de respuesta. */
function iguales(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function leerMetricas(request: Request, env: EnvMetricas): Promise<Response> {
  const json = (cuerpo: unknown, estado = 200) =>
    new Response(JSON.stringify(cuerpo), { status: estado, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
  if (!iguales(request.headers.get("x-panel-secreto") ?? "", env.PANEL_SECRETO ?? "")) return json({ error: "no-autorizado" }, 401);
  if (!env.CLOUDFLARE_ACCOUNT_ID || !env.METRICAS_TOKEN) return json({ error: "sin-clave" }, 503);

  const rango = new URL(request.url).searchParams.get("rango") ?? "7d";
  const r = RANGOS[rango] ?? RANGOS["7d"]!;
  const desde = `timestamp > NOW() - INTERVAL '${r.dias}' DAY`;
  const vistas = `FROM ${DATASET} WHERE blob1 = 'vista' AND ${desde}`;
  const agrupar = (col: string, limite = 12, extra = "") =>
    sql(env, `SELECT ${col} AS nombre, SUM(_sample_interval) AS vistas, count(DISTINCT blob14) AS visitantes ${vistas} ${extra} GROUP BY nombre ORDER BY vistas DESC LIMIT ${limite}`);

  try {
    const [resumen, serie, paginas, tiempos, tiempoTotal, fuentes, campanas, paises, ciudades, dispositivos, navegadores, sistemas, ahora, ahoraPaginas, conversiones, bots] =
      await Promise.all([
        sql(env, `SELECT SUM(_sample_interval) AS vistas, count(DISTINCT blob14) AS visitantes ${vistas}`),
        sql(env, `SELECT toStartOfInterval(timestamp, ${r.tramo}, 'Europe/Madrid') AS t, SUM(_sample_interval) AS vistas, count(DISTINCT blob14) AS visitantes ${vistas} GROUP BY t ORDER BY t ASC`),
        agrupar("blob2", 20),
        sql(env, `SELECT blob2 AS nombre, SUM(_sample_interval * double1) / SUM(_sample_interval) AS segundos FROM ${DATASET} WHERE blob1 = 'tiempo' AND ${desde} GROUP BY nombre`),
        sql(env, `SELECT SUM(_sample_interval * double1) / SUM(_sample_interval) AS segundos FROM ${DATASET} WHERE blob1 = 'tiempo' AND ${desde}`),
        agrupar("blob3"),
        agrupar("blob7", 12, "AND blob7 != ''"),
        agrupar("blob8", 15),
        sql(env, `SELECT blob10 AS nombre, blob8 AS pais, SUM(_sample_interval) AS vistas, count(DISTINCT blob14) AS visitantes ${vistas} AND blob10 != '' GROUP BY nombre, pais ORDER BY vistas DESC LIMIT 15`),
        agrupar("blob11", 5),
        agrupar("blob12", 8),
        agrupar("blob13", 8),
        sql(env, `SELECT count(DISTINCT blob14) AS visitantes, SUM(_sample_interval) AS vistas FROM ${DATASET} WHERE blob1 = 'vista' AND timestamp > NOW() - INTERVAL '5' MINUTE`),
        sql(env, `SELECT blob2 AS nombre, count(DISTINCT blob14) AS visitantes FROM ${DATASET} WHERE blob1 = 'vista' AND timestamp > NOW() - INTERVAL '5' MINUTE GROUP BY nombre ORDER BY visitantes DESC LIMIT 10`),
        sql(env, `SELECT blob2 AS nombre, SUM(_sample_interval) AS total FROM ${DATASET} WHERE blob1 = 'conversion' AND ${desde} GROUP BY nombre`),
        sql(env, `SELECT blob3 AS nombre, SUM(_sample_interval) AS vistas FROM ${DATASET} WHERE blob1 = 'bot' AND ${desde} GROUP BY nombre ORDER BY vistas DESC LIMIT 12`),
      ]);

    const tiempoPorRuta = new Map(tiempos.map((t) => [String(t["nombre"]), num(t["segundos"])]));
    const lista = (filas: Fila[]) => filas.map((f) => ({ nombre: String(f["nombre"] ?? ""), vistas: num(f["vistas"]), visitantes: num(f["visitantes"]) }));
    const totalVistas = num(resumen[0]?.["vistas"]);
    const totalVisitantes = num(resumen[0]?.["visitantes"]);

    return json({
      rango,
      generado: new Date().toISOString(),
      ahora: {
        visitantes: num(ahora[0]?.["visitantes"]),
        vistas: num(ahora[0]?.["vistas"]),
        paginas: ahoraPaginas.map((f) => ({ nombre: String(f["nombre"]), visitantes: num(f["visitantes"]) })),
      },
      resumen: {
        vistas: totalVistas,
        visitantes: totalVisitantes,
        paginasPorVisitante: totalVisitantes ? num(totalVistas / totalVisitantes) : 0,
        tiempoMedio: num(tiempoTotal[0]?.["segundos"]),
      },
      serie: serie.map((f) => ({ t: String(f["t"]), vistas: num(f["vistas"]), visitantes: num(f["visitantes"]) })),
      paginas: lista(paginas).map((p) => ({ ...p, segundos: tiempoPorRuta.get(p.nombre) ?? 0 })),
      fuentes: lista(fuentes),
      campanas: lista(campanas),
      paises: lista(paises),
      ciudades: ciudades.map((f) => ({ nombre: String(f["nombre"]), pais: String(f["pais"] ?? ""), vistas: num(f["vistas"]), visitantes: num(f["visitantes"]) })),
      dispositivos: lista(dispositivos),
      navegadores: lista(navegadores),
      sistemas: lista(sistemas),
      conversiones: Object.fromEntries(conversiones.map((f) => [String(f["nombre"]), num(f["total"])])),
      bots: bots.map((f) => ({ nombre: String(f["nombre"]), vistas: num(f["vistas"]) })),
    });
  } catch (error) {
    console.error(JSON.stringify({ metricas: "fallo", tipo: error instanceof Error ? error.message : "desconocido" }));
    return json({ error: "fallo" }, 502);
  }
}
