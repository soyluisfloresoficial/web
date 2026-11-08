/**
 * Topes diarios y avisos por correo (08/11/2026). Ver AGENTE.md.
 *
 * - Chat: el tope de mensajes con IA al día ya existía (index.ts). Ahora,
 *   al llegar al 80 % y al 100 %, sale un correo a CORREO_AVISOS (hola@ por
 *   defecto) para que el titular sepa que el chat va a pasar, o ha pasado, a
 *   las respuestas fijas.
 * - Voz: tope de caracteres al día en toda la web (LIMITE_DIARIO_VOZ de
 *   wrangler.jsonc). Así nadie puede gastar sin fin la voz de Flora con un
 *   programa, lo que con el plan de pago de Cloudflare costaría dinero.
 *   Al llegar, /api/voz responde 503 y el chat sigue por escrito.
 *
 * El contador de la voz se guarda en el KV de la agenda, pero no en cada
 * petición: cada instancia del Worker suma en memoria y escribe al juntar
 * 1.000 caracteres. Así no se gasta el cupo de escrituras del KV (1.000 al
 * día en el plan gratuito). Es aproximado, como el del chat: basta para
 * poner un techo al gasto.
 *
 * Cada aviso sale una sola vez al día (marca «aviso:<tipo>:<día>:<nivel>»).
 */
import { enviar, correoAvisos } from "./correo";
import { maquetar } from "./correo-plantillas";
import type { EnvAgenda } from "./agenda";

type Tipo = "chat" | "voz";

const hoy = () => new Date().toISOString().slice(0, 10);

const TEXTOS: Record<Tipo, { nombre: string; unidad: string; al100: string }> = {
  chat: {
    nombre: "el chat de Flora",
    unidad: "mensajes con IA",
    al100: "Flora sigue respondiendo con las preguntas frecuentes, sin IA, hasta las 01:00 de Madrid (00:00 UTC).",
  },
  voz: {
    nombre: "la voz de Flora",
    unidad: "caracteres de voz",
    al100: "Flora sigue respondiendo por escrito, sin voz, hasta las 01:00 de Madrid (00:00 UTC). Los audios grabados siguen sonando.",
  },
};

/** Manda el aviso del 80 % o del 100 % si hoy no ha salido ya. */
export async function avisarTope(env: EnvAgenda, tipo: Tipo, usados: number, tope: number): Promise<void> {
  const kv = env.AGENDA_CONFIG;
  if (!kv || tope <= 0) return;
  const nivel = usados >= tope ? 100 : usados >= tope * 0.8 ? 80 : 0;
  if (!nivel) return;
  const marca = `aviso:${tipo}:${hoy()}:${nivel}`;
  try {
    if (await kv.get(marca)) return;
    // La marca va antes del envío: si dos peticiones coinciden, mejor un
    // aviso de menos que dos iguales.
    await kv.put(marca, "1", { expirationTtl: 2 * 86_400 });
    const t = TEXTOS[tipo];
    const asunto = nivel === 100 ? `Tope diario alcanzado en ${t.nombre}` : `${t.nombre[0].toUpperCase()}${t.nombre.slice(1)} va por el 80 % del tope diario`;
    const correo = maquetar({
      asunto,
      previa: `${usados} de ${tope} ${t.unidad} hoy.`,
      bloques: [
        { p: `Hoy se han usado unos ${usados} de ${tope} ${t.unidad} (día en hora UTC).` },
        {
          p:
            nivel === 100
              ? t.al100
              : "Si sigue a este ritmo llegará al tope antes de que termine el día. No tienes que hacer nada: la web sigue funcionando.",
        },
        { p: "El tope se cambia en wrangler.jsonc (LIMITE_DIARIO_CHAT y LIMITE_DIARIO_VOZ). Si el uso es de personas reales, es buena señal; si parece raro, revisa los registros del Worker en Cloudflare." },
      ],
      firma: ["Web de soyluisflores.es"],
      pie: "Aviso automático de la web. Sale como mucho una vez al día por cada nivel.",
    });
    await enviar(env, correoAvisos(env), correo, `aviso-tope-${tipo}`);
  } catch {
    console.error(JSON.stringify({ tope: "fallo-aviso", tipo }));
  }
}

// Contador de la voz: lo que esta instancia aún no ha escrito en el KV.
let vozDia = "";
let vozPendiente = 0;
const CADA = 1000;

/**
 * ¿Cabe este texto en el tope diario de voz? Si cabe, lo suma. Sin KV no
 * limita. Devuelve también lo usado, para el aviso.
 */
export async function dentroTopeVoz(env: EnvAgenda, caracteres: number, tope: number): Promise<{ dentro: boolean; usados: number }> {
  const kv = env.AGENDA_CONFIG;
  if (!kv || tope <= 0) return { dentro: true, usados: 0 };
  const dia = hoy();
  if (dia !== vozDia) {
    vozDia = dia;
    vozPendiente = 0;
  }
  const clave = `voz:dia:${dia}`;
  const guardados = Number(await kv.get(clave, "json")) || 0;
  const usados = guardados + vozPendiente;
  if (usados + caracteres > tope) return { dentro: false, usados };
  vozPendiente += caracteres;
  if (vozPendiente >= CADA) {
    const total = guardados + vozPendiente;
    vozPendiente = 0;
    await kv.put(clave, String(total), { expirationTtl: 3 * 86_400 });
  }
  return { dentro: true, usados: usados + caracteres };
}
