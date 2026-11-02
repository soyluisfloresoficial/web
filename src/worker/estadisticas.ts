/**
 * Cifras del chat y resumen semanal por correo (2/11/2026).
 *
 * Solo se cuentan números, nunca lo que escribe nadie:
 * - conversaciones: chats con al menos un mensaje a la IA.
 * - tarjetas: veces que el asistente mostró la tarjeta de la cita.
 * - citasChat / citasWeb: citas confirmadas desde el chat o desde el formulario.
 *
 * Se guardan por semana (de lunes a domingo, hora de Madrid) en el KV de la
 * agenda (AGENDA_CONFIG), con claves «stats:2026-W45». Cada lunes, en la
 * primera vuelta del cron a partir de las 8:00 de Madrid, sale un correo a
 * CORREO_AVISOS (hola@ por defecto) con la semana anterior.
 *
 * Sin el KV o sin la clave de Resend no hace nada: la web sigue igual.
 */
import { enviar, correoAvisos } from "./correo";
import { maquetar } from "./correo-plantillas";
import type { EnvAgenda } from "./agenda";
import { nombreSeccion } from "./origen";

export type Cifra = "conversaciones" | "tarjetas" | "citasChat" | "citasWeb";
type Semana = Record<Cifra, number>;

const ZONA = "Europe/Madrid";
const VACIA: Semana = { conversaciones: 0, tarjetas: 0, citasChat: 0, citasWeb: 0 };

/** Fecha de Madrid en piezas. */
function partes(ms: number) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(ms);
  const v = (t: string) => f.find((p) => p.type === t)?.value ?? "";
  return { anio: +v("year"), mes: +v("month"), dia: +v("day"), hora: +v("hour") % 24, semanaDia: v("weekday") };
}

/** Semana ISO («2026-W45») del día de Madrid en que cae ms. */
export function semanaIso(ms: number): string {
  const { anio, mes, dia } = partes(ms);
  const d = new Date(Date.UTC(anio, mes - 1, dia));
  const diaSemana = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - diaSemana);
  const inicioAnio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const n = Math.ceil(((d.getTime() - inicioAnio.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(n).padStart(2, "0")}`;
}

async function leer(env: EnvAgenda, semana: string): Promise<Semana> {
  const guardada = (await env.AGENDA_CONFIG?.get(`stats:${semana}`, "json")) as Partial<Semana> | null;
  return { ...VACIA, ...(guardada ?? {}) };
}

/**
 * Suma 1 a una cifra de esta semana. No es atómico: si dos personas coinciden
 * en el mismo segundo puede perderse una. Para un resumen semanal sobra.
 */
export async function contar(env: EnvAgenda, cifra: Cifra): Promise<void> {
  if (!env.AGENDA_CONFIG) return;
  try {
    const semana = semanaIso(Date.now());
    const s = await leer(env, semana);
    s[cifra] += 1;
    await env.AGENDA_CONFIG.put(`stats:${semana}`, JSON.stringify(s));
  } catch {
    console.error(JSON.stringify({ estadisticas: "fallo-contar" }));
  }
}

/**
 * De qué sección llegan los correos de la guía y las citas (2/11/2026), por
 * semana: «stats:2026-W45:secciones» = { "blog-articulo": { correos: 3,
 * citas: 1 }, ... }. Las claves salen de origen.ts.
 */
type Secciones = Record<string, { correos: number; citas: number }>;

export async function contarSeccion(
  env: { AGENDA_CONFIG?: EnvAgenda["AGENDA_CONFIG"] },
  tipo: "correos" | "citas",
  clave: string,
): Promise<void> {
  if (!env.AGENDA_CONFIG) return;
  try {
    const k = `stats:${semanaIso(Date.now())}:secciones`;
    const s = ((await env.AGENDA_CONFIG.get(k, "json")) as Secciones | null) ?? {};
    s[clave] ??= { correos: 0, citas: 0 };
    s[clave][tipo] += 1;
    await env.AGENDA_CONFIG.put(k, JSON.stringify(s));
  } catch {
    console.error(JSON.stringify({ estadisticas: "fallo-seccion" }));
  }
}

const porcentaje = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "sin datos");

/** Lo llama el cron cada 10 minutos: los lunes desde las 8:00 de Madrid manda la semana anterior, una vez. */
export async function resumenSemanal(env: EnvAgenda): Promise<void> {
  if (!env.AGENDA_CONFIG || !env.RESEND_API_KEY) return;
  const ahora = Date.now();
  const { semanaDia, hora } = partes(ahora);
  if (semanaDia !== "Mon" || hora < 8) return;

  const anterior = semanaIso(ahora - 7 * 86_400_000);
  const marca = `stats:enviado:${anterior}`;
  try {
    if (await env.AGENDA_CONFIG.get(marca, "json")) return;
    const s = await leer(env, anterior);
    const citas = s.citasChat + s.citasWeb;
    const secciones = Object.entries(
      ((await env.AGENDA_CONFIG.get(`stats:${anterior}:secciones`, "json")) as Secciones | null) ?? {},
    ).sort((a, b) => b[1].correos + b[1].citas - (a[1].correos + a[1].citas));
    const correosGuia = secciones.reduce((n, [, v]) => n + v.correos, 0);
    const correo = maquetar({
      asunto: `Resumen semanal de la web · ${anterior}: ${citas} ${citas === 1 ? "llamada agendada" : "llamadas agendadas"}`,
      previa: `${s.conversaciones} conversaciones en el chat y ${citas} citas la semana pasada.`,
      bloques: [
        { p: "Así fue la semana pasada (lunes a domingo, hora de Madrid):" },
        {
          ficha: [
            ["Conversaciones en el chat", String(s.conversaciones)],
            ["Llegaron a la tarjeta de la cita", `${s.tarjetas} (${porcentaje(s.tarjetas, s.conversaciones)} de las conversaciones)`],
            ["Citas confirmadas desde el chat", String(s.citasChat)],
            ["Citas desde el formulario", String(s.citasWeb)],
            ["Correos nuevos de la guía (confirmados)", String(correosGuia)],
          ],
        },
        { p: "De dónde llegaron (sección de la web):" },
        secciones.length
          ? {
              ficha: secciones.slice(0, 8).map(([clave, v]): [string, string] => [
                nombreSeccion(clave),
                [v.correos ? `${v.correos} ${v.correos === 1 ? "correo" : "correos"}` : "", v.citas ? `${v.citas} ${v.citas === 1 ? "cita" : "citas"}` : ""]
                  .filter(Boolean)
                  .join(" · "),
              ]),
            }
          : { p: "Esta semana no entró ningún correo ni cita." },
        {
          p:
            s.tarjetas > 0
              ? `De cada 100 personas que vieron la tarjeta, ${Math.round((s.citasChat / s.tarjetas) * 100)} confirmaron la llamada.`
              : "Nadie llegó a la tarjeta de la cita esta semana.",
        },
        { p: "Para más detalle (de qué página vienen, qué botones tocan), mira Google Analytics. Aquí no se guarda lo que escribe nadie, solo estos números." },
      ],
      firma: ["Agenda de soyluisflores.es"],
      pie: "Resumen automático de la web. Sale los lunes por la mañana.",
    });
    const ok = await enviar(env, correoAvisos(env), correo, "resumen-semanal");
    if (ok) await env.AGENDA_CONFIG.put(marca, "true");
  } catch {
    console.error(JSON.stringify({ estadisticas: "fallo-resumen" }));
  }
}
