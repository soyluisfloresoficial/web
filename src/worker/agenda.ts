/**
 * Agenda propia conectada a Google Calendar (28/10/2026). Ver AGENDA.md.
 *
 * GET  /api/agenda  → huecos libres de los próximos días.
 * POST /api/agenda  → reserva un hueco: crea el evento en el calendario con
 *                     enlace de Google Meet y Google le manda la invitación
 *                     al cliente.
 *
 * - Sin las tres claves de Google responde 503 {error:"sin-google"} y la web
 *   sigue mostrando Calendly. La web nunca se queda sin agenda.
 * - Antes de crear el evento vuelve a mirar el calendario: si alguien tomó
 *   esa hora un segundo antes, responde 409 y la web pide elegir otra.
 * - En los registros solo quedan el resultado y los códigos de error, nunca
 *   el nombre, el correo ni el mensaje del cliente.
 */
import { AGENDA } from "../data/agenda";
import { calcularHuecos, estaLibre, type Tramo } from "./agenda-huecos";

export interface EnvAgenda {
  /** Secretos del Worker, en el panel de Cloudflare. Ver AGENDA.md. */
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
  /** Opcional: otro calendario que no sea el principal. */
  GOOGLE_CALENDARIO_ID?: string;
  LIMITE_AGENDA?: { limit(opciones: { key: string }): Promise<{ success: boolean }> };
}

const MINUTO = 60_000;
const API = "https://www.googleapis.com/calendar/v3";

type Responder = (cuerpo: unknown, estado?: number) => Response;

class ErrorGoogle extends Error {
  constructor(
    public paso: string,
    public estado: number,
  ) {
    super(`${paso}: ${estado}`);
  }
}

// El token de acceso dura una hora: se reutiliza mientras la instancia viva.
let token: { valor: string; caduca: number } | null = null;

async function tokenAcceso(env: EnvAgenda): Promise<string> {
  if (token && token.caduca > Date.now() + MINUTO) return token.valor;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.GOOGLE_CLIENT_ID ?? "",
      client_secret: env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: env.GOOGLE_REFRESH_TOKEN ?? "",
    }),
  });
  if (!r.ok) throw new ErrorGoogle("token", r.status);
  const d = (await r.json()) as { access_token: string; expires_in: number };
  token = { valor: d.access_token, caduca: Date.now() + d.expires_in * 1000 };
  return token.valor;
}

function calendario(env: EnvAgenda): string {
  return env.GOOGLE_CALENDARIO_ID || "primary";
}

/** Tramos ocupados del calendario entre dos instantes. */
async function ocupados(env: EnvAgenda, desde: number, hasta: number): Promise<Tramo[]> {
  const id = calendario(env);
  const r = await fetch(`${API}/freeBusy`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await tokenAcceso(env)}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeMin: new Date(desde).toISOString(),
      timeMax: new Date(hasta).toISOString(),
      items: [{ id }],
    }),
  });
  if (!r.ok) throw new ErrorGoogle("freebusy", r.status);
  const d = (await r.json()) as {
    calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }>;
  };
  const cal = d.calendars[id] ?? Object.values(d.calendars)[0];
  if (!cal || cal.errors?.length) throw new ErrorGoogle("freebusy-calendario", 404);
  return (cal.busy ?? []).map((b) => ({ inicio: Date.parse(b.start), fin: Date.parse(b.end) }));
}

async function huecosLibres(env: EnvAgenda, ahora: number): Promise<number[]> {
  const hasta = ahora + (AGENDA.dias + 1) * 24 * 60 * MINUTO;
  return calcularHuecos(AGENDA, ahora, await ocupados(env, ahora, hasta));
}

// ------------------------------------------------------------- Validación

const CORREO = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

interface Reserva {
  inicio: number;
  nombre: string;
  correo: string;
  empresa: string;
  mensaje: string;
  zonaCliente: string;
  /** Funnel y campaña de la que llegó (utm_*), si la hay. */
  origen: string;
}

function texto(v: unknown, max: number): string | null {
  if (v === undefined || v === null) return "";
  if (typeof v !== "string") return null;
  // Sin saltos de línea raros ni caracteres de control.
  const limpio = v.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").trim();
  return limpio.length > max ? null : limpio;
}

function zonaValida(zona: string): boolean {
  try {
    new Intl.DateTimeFormat("es", { timeZone: zona });
    return true;
  } catch {
    return false;
  }
}

function aReserva(datos: unknown): Reserva | null {
  if (!datos || typeof datos !== "object") return null;
  const d = datos as Record<string, unknown>;
  // Campo trampa: invisible para las personas, los programas lo rellenan.
  if (typeof d.web === "string" && d.web.trim() !== "") return null;

  const inicio = typeof d.inicio === "string" ? Date.parse(d.inicio) : NaN;
  const nombre = texto(d.nombre, 80);
  const correo = texto(d.correo, 120);
  const empresa = texto(d.empresa, 120);
  const mensaje = texto(d.mensaje, 1000);
  const zonaCliente = texto(d.zona, 64);
  const origen = texto(d.origen, 300) ?? "";
  if (!Number.isFinite(inicio) || !nombre || nombre.length < 2) return null;
  if (!correo || !CORREO.test(correo)) return null;
  if (empresa === null || mensaje === null || zonaCliente === null) return null;
  return {
    inicio,
    nombre,
    correo: correo.toLowerCase(),
    empresa,
    mensaje,
    zonaCliente: zonaCliente && zonaValida(zonaCliente) ? zonaCliente : AGENDA.zona,
    origen,
  };
}

function horaLegible(ms: number, zona: string): string {
  return new Intl.DateTimeFormat("es", {
    timeZone: zona,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ms);
}

async function crearEvento(env: EnvAgenda, r: Reserva): Promise<{ meet: string | null }> {
  const fin = r.inicio + AGENDA.duracion * MINUTO;
  const descripcion = [
    "Reserva hecha desde soyluisflores.es.",
    "",
    `Nombre: ${r.nombre}`,
    `Correo: ${r.correo}`,
    r.empresa ? `Negocio: ${r.empresa}` : "",
    `Zona horaria del cliente: ${r.zonaCliente} (${horaLegible(r.inicio, r.zonaCliente)})`,
    r.origen ? `Llegó desde: ${r.origen}` : "",
    "",
    r.mensaje ? `Lo que quiere resolver:\n${r.mensaje}` : "No dejó mensaje.",
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  const url = new URL(`${API}/calendars/${encodeURIComponent(calendario(env))}/events`);
  url.searchParams.set("conferenceDataVersion", "1");
  // Google manda la invitación al cliente, con el enlace de Meet y la opción
  // de añadirla a su calendario.
  url.searchParams.set("sendUpdates", "all");

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${await tokenAcceso(env)}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: `${AGENDA.titulo} · ${r.nombre}`,
      description: descripcion,
      start: { dateTime: new Date(r.inicio).toISOString(), timeZone: AGENDA.zona },
      end: { dateTime: new Date(fin).toISOString(), timeZone: AGENDA.zona },
      attendees: [{ email: r.correo, displayName: r.nombre }],
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
      reminders: { useDefault: true },
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }),
  });
  if (!respuesta.ok) throw new ErrorGoogle("crear-evento", respuesta.status);
  const evento = (await respuesta.json()) as { hangoutLink?: string };
  return { meet: evento.hangoutLink ?? null };
}

// -------------------------------------------------------------- Peticiones

async function limite(env: EnvAgenda, request: Request, tipo: string): Promise<boolean> {
  if (!env.LIMITE_AGENDA) return true;
  const ip = request.headers.get("CF-Connecting-IP") ?? "sin-ip";
  const { success } = await env.LIMITE_AGENDA.limit({ key: `${tipo}:${ip}` });
  return success;
}

export async function agenda(
  request: Request,
  env: EnvAgenda,
  json: Responder,
  origenPermitido: (origen: string | null) => boolean,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "POST") return json({ error: "metodo" }, 405);
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REFRESH_TOKEN) {
    return json({ error: "sin-google" }, 503);
  }

  try {
    if (request.method === "GET") {
      if (!(await limite(env, request, "huecos"))) return json({ error: "limite" }, 429);
      const huecos = await huecosLibres(env, Date.now());
      return json({
        zona: AGENDA.zona,
        duracion: AGENDA.duracion,
        huecos: huecos.map((t) => new Date(t).toISOString()),
      });
    }

    // POST: reservar.
    if (!origenPermitido(request.headers.get("Origin"))) return json({ error: "origen" }, 403);
    if (!(await limite(env, request, "reserva"))) return json({ error: "limite" }, 429);

    let datos: unknown;
    try {
      datos = await request.json();
    } catch {
      return json({ error: "invalido" }, 400);
    }
    const reserva = aReserva(datos);
    if (!reserva) return json({ error: "invalido" }, 400);

    // El hueco tiene que ser uno de los ofrecidos y seguir libre ahora mismo.
    const ahora = Date.now();
    const disponibles = await huecosLibres(env, ahora);
    if (!disponibles.includes(reserva.inicio)) return json({ error: "ocupado" }, 409);
    const fin = reserva.inicio + AGENDA.duracion * MINUTO;
    const margen = AGENDA.margen * MINUTO;
    const justoAhora = await ocupados(env, reserva.inicio - margen, fin + margen);
    if (!estaLibre(reserva.inicio, AGENDA, justoAhora)) return json({ error: "ocupado" }, 409);

    const { meet } = await crearEvento(env, reserva);
    console.log(JSON.stringify({ agenda: "reserva-ok", con_meet: Boolean(meet) }));
    return json({ ok: true, inicio: new Date(reserva.inicio).toISOString(), duracion: AGENDA.duracion, meet });
  } catch (error) {
    if (error instanceof ErrorGoogle) {
      console.error(JSON.stringify({ agenda: error.paso, estado: error.estado }));
      // Token revocado o claves mal copiadas: la web vuelve a Calendly.
      if (error.paso === "token" && (error.estado === 400 || error.estado === 401)) {
        token = null;
        return json({ error: "sin-google" }, 503);
      }
    } else {
      console.error(JSON.stringify({ agenda: "fallo", tipo: error instanceof Error ? error.name : "desconocido" }));
    }
    return json({ error: "fallo" }, 502);
  }
}
