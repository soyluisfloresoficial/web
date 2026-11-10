/**
 * Páginas de la web y versión Markdown para agentes de IA (09/11/2026).
 * Ver AGENTE.md, «Markdown para agentes de IA».
 *
 * Desde hoy el Worker atiende también las páginas (run_worker_first en
 * wrangler.jsonc), salvo los archivos fijos (_astro, fuentes, logos, video,
 * voz, imágenes para redes), que Cloudflare sigue sirviendo directo.
 *
 * - Si quien pide la página prefiere Markdown («Accept: text/markdown», lo
 *   que hacen los agentes de IA), recibe dist/<ruta>/index.md, generado en el
 *   build por tools/generar-markdown.mjs: el texto de la página sin diseño.
 * - Las personas (navegadores, «Accept: text/html» o «*\/*») reciben el HTML
 *   de siempre, sin ningún cambio.
 * - Cloudflare no aplica public/_headers a las respuestas del Worker. Por
 *   eso aquí se ponen las mismas cabeceras de seguridad de la regla «/*»
 *   (CSP, Permissions-Policy, etc.), que el build copia en
 *   /agente/cabeceras.json. _headers sigue siendo el único sitio donde se
 *   editan.
 */
interface Activos {
  fetch(request: Request): Promise<Response>;
}

const SITIO = "https://soyluisflores.es";
const SENALES = "search=yes, ai-input=yes, ai-train=yes";

// Se leen una vez por instancia del Worker; cambian solo al publicar.
let cabeceras: Record<string, string> | null = null;
async function cabecerasGlobales(activos: Activos, base: string): Promise<Record<string, string>> {
  if (cabeceras) return cabeceras;
  try {
    const r = await activos.fetch(new Request(new URL("/agente/cabeceras.json", base)));
    if (!r.ok) throw new Error(String(r.status));
    cabeceras = (await r.json()) as Record<string, string>;
  } catch (e) {
    // Sin el archivo, al menos lo básico (y se reintenta en la próxima visita).
    console.error(JSON.stringify({ paginas: "sin-cabeceras", motivo: String(e).slice(0, 100) }));
    return { "X-Frame-Options": "SAMEORIGIN", "Referrer-Policy": "strict-origin-when-cross-origin" };
  }
  return cabeceras;
}

/** Peso (q) de un tipo en la cabecera Accept, o -1 si no aparece. Devuelve también su posición. */
function peso(accept: string, tipo: string): { q: number; pos: number } {
  const partes = accept.split(",");
  for (let i = 0; i < partes.length; i++) {
    const [nombre, ...params] = partes[i].trim().toLowerCase().split(";");
    if (nombre.trim() !== tipo) continue;
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const valor = q ? Number(q.slice(2)) : 1;
    return { q: Number.isFinite(valor) ? valor : 1, pos: i };
  }
  return { q: -1, pos: Infinity };
}

/**
 * ¿Prefiere Markdown? Solo si lo pide por su nombre y no prefiere HTML. Igual
 * que Markdown for Agents de Cloudflare: «*\/*» sigue recibiendo HTML.
 */
export function prefiereMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const md = peso(accept, "text/markdown");
  if (md.q <= 0) return false;
  const html = peso(accept, "text/html");
  if (md.q !== html.q) return md.q > html.q;
  return md.pos < html.pos;
}

/** /servicios/agentes-ia → /servicios/agentes-ia/index.md ; / → /index.md. Null si es un archivo. */
export function rutaMarkdown(pathname: string): string | null {
  const limpia = pathname.replace(/\/+$/, "");
  if (/\.[a-z0-9]+$/i.test(limpia)) return null;
  return `${limpia}/index.md`;
}

function conCabeceras(r: Response, globales: Record<string, string>, extra: Record<string, string> = {}): Response {
  const h = new Headers(r.headers);
  for (const [k, v] of Object.entries(globales)) if (!h.has(k)) h.set(k, v);
  for (const [k, v] of Object.entries(extra)) h.set(k, v);
  return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
}

export async function servirPagina(request: Request, activos: Activos): Promise<Response> {
  const url = new URL(request.url);
  const globales = await cabecerasGlobales(activos, request.url);
  const lectura = request.method === "GET" || request.method === "HEAD";

  // Barra final (10/11/2026): /servicios/ → /servicios con 301 (permanente).
  // Cloudflare lo hacía con 307 (temporal) y Search Console lo contaba como
  // «Página con redirección» sin consolidarla. Solo rutas de página, sin extensión.
  if (lectura && url.pathname.length > 1 && url.pathname.endsWith("/") && !/\.[a-z0-9]+\/?$/i.test(url.pathname)) {
    const destino = url.pathname.replace(/\/+$/, "") + url.search;
    return new Response(null, { status: 301, headers: { Location: destino, ...globales } });
  }

  if (lectura && prefiereMarkdown(request.headers.get("Accept"))) {
    const ruta = rutaMarkdown(url.pathname);
    if (ruta) {
      const md = await activos.fetch(new Request(new URL(ruta, request.url), { method: request.method }));
      if (md.ok) {
        const texto = request.method === "HEAD" ? "" : await md.clone().text();
        return conCabeceras(md, globales, {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "public, max-age=0, must-revalidate",
          Vary: "Accept",
          "Content-Signal": SENALES,
          // La versión buena para Google es la página HTML.
          Link: `<${SITIO}${url.pathname.replace(/\/+$/, "") || "/"}>; rel="canonical"`,
          "X-Robots-Tag": "noindex",
          ...(texto ? { "X-Markdown-Tokens": String(Math.ceil(texto.length / 4)) } : {}),
        });
      }
      // Sin versión Markdown (landings, 404...): sigue con el HTML.
    }
  }

  const r0 = await activos.fetch(request);
  // La página de error pedida por su dirección (/404 o /404.html) responde 404,
  // no 200 (10/11/2026: Search Console la había encontrado).
  const r = /^\/404(\.html)?$/.test(url.pathname) ? new Response(r0.body, { status: 404, headers: r0.headers }) : r0;
  const tipo = r.headers.get("Content-Type") ?? "";
  const extra: Record<string, string> = {};
  if (tipo.includes("text/html")) extra.Vary = "Accept";
  // El Markdown pedido por su dirección directa tampoco va a los buscadores.
  if (url.pathname.endsWith(".md")) {
    extra["X-Robots-Tag"] = "noindex";
    extra["Content-Type"] = "text/markdown; charset=utf-8";
  }
  return conCabeceras(r, globales, extra);
}
