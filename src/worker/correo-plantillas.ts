/**
 * Correos de la agenda con la marca de la web (29/10/2026). Ver AGENDA.md.
 *
 * Los textos salen de correos/PLANTILLAS.md (confirmación y recordatorios),
 * con la voz del titular. Aquí solo se arma el HTML y la versión en texto.
 *
 * Sin dependencias, para probarlo en el ordenador (tools/probar-agenda.mjs).
 * Todo lo que escribe el cliente pasa por escapar() antes de ir al HTML.
 *
 * HTML de correo: tablas y estilos en línea, porque Gmail y Outlook ignoran
 * casi todo lo demás. Fondo claro: en modo oscuro cada cliente lo invierte a
 * su manera y así se lee bien en todos.
 */

export const CONTACTO = {
  web: "https://soyluisflores.es",
  correo: "hola@soyluisflores.es",
  whatsapp: "+34 631 65 49 19",
  whatsappEnlace: "https://wa.me/34631654919",
  firma: "Luis Carlos Flores · Manresa, Barcelona, España",
};

export interface Correo {
  asunto: string;
  html: string;
  texto: string;
}

export interface DatosCita {
  nombre: string;
  /** Inicio de la llamada, en ms UTC. */
  inicio: number;
  duracion: number;
  /** Zona horaria en la que se muestra la hora (la del cliente o la del titular). */
  zona: string;
  meet: string | null;
  /** Enlace firmado para cancelar o cambiar la cita. */
  cambiar: string;
}

export function escapar(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** «jueves, 5 de noviembre, a las 16:30 (hora de Perú)». */
export function cuando(ms: number, zona: string): string {
  const dia = new Intl.DateTimeFormat("es", { timeZone: zona, weekday: "long", day: "numeric", month: "long" }).format(ms);
  const hora = new Intl.DateTimeFormat("es", { timeZone: zona, hour: "2-digit", minute: "2-digit" }).format(ms);
  const nombreZona =
    new Intl.DateTimeFormat("es", { timeZone: zona, timeZoneName: "long" })
      .formatToParts(ms)
      .find((p) => p.type === "timeZoneName")?.value ?? zona;
  return `${dia}, a las ${hora} (${nombreZona})`;
}

function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] ?? nombre;
}

// --------------------------------------------------------------- Diseño

interface Bloque {
  /** Párrafo en texto plano; se escapa. */
  p?: string;
  /** Lista de puntos; se escapan. */
  lista?: string[];
  /** Recuadro destacado con filas etiqueta / valor. */
  ficha?: [string, string][];
  /** Botón principal. */
  boton?: { texto: string; url: string };
  /** Enlace de texto. */
  enlace?: { antes: string; texto: string; url: string };
}

const C = {
  fondo: "#eef1f7",
  tarjeta: "#ffffff",
  tinta: "#0f172a",
  suave: "#475569",
  linea: "#e2e8f0",
  marca: "#07090d",
  azul: "#0059c9",
  violeta: "#4f46e5",
};

const FUENTE = "font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif";

function bloqueHtml(b: Bloque): string {
  if (b.p) return `<p style="margin:0 0 16px;${FUENTE};font-size:16px;line-height:1.6;color:${C.tinta}">${escapar(b.p)}</p>`;
  if (b.lista) {
    const items = b.lista
      .map((l) => `<li style="margin:0 0 6px;${FUENTE};font-size:16px;line-height:1.55;color:${C.tinta}">${escapar(l)}</li>`)
      .join("");
    return `<ul style="margin:0 0 18px;padding-left:20px">${items}</ul>`;
  }
  if (b.ficha) {
    const filas = b.ficha
      .map(
        ([k, v]) => `<tr>
<td style="padding:10px 16px 2px;${FUENTE};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${C.suave}">${escapar(k)}</td></tr>
<tr><td style="padding:0 16px 10px;${FUENTE};font-size:16px;font-weight:700;color:${C.tinta}">${escapar(v)}</td></tr>`,
      )
      .join("");
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 22px;border:1px solid ${C.linea};border-left:4px solid ${C.violeta};border-radius:10px;background:#f8fafc">${filas}</table>`;
  }
  if (b.boton) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 24px"><tr>
<td style="border-radius:999px;background:${C.violeta};background-image:linear-gradient(110deg,${C.azul},${C.violeta})">
<a href="${escapar(b.boton.url)}" style="display:inline-block;padding:14px 26px;${FUENTE};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px">${escapar(b.boton.texto)} &rarr;</a>
</td></tr></table>`;
  }
  if (b.enlace) {
    return `<p style="margin:0 0 16px;${FUENTE};font-size:15px;line-height:1.6;color:${C.suave}">${escapar(b.enlace.antes)} <a href="${escapar(b.enlace.url)}" style="color:${C.violeta};font-weight:600">${escapar(b.enlace.texto)}</a></p>`;
  }
  return "";
}

function bloqueTexto(b: Bloque): string {
  if (b.p) return b.p;
  if (b.lista) return b.lista.map((l) => `- ${l}`).join("\n");
  if (b.ficha) return b.ficha.map(([k, v]) => `${k}: ${v}`).join("\n");
  if (b.boton) return `${b.boton.texto}: ${b.boton.url}`;
  if (b.enlace) return `${b.enlace.antes} ${b.enlace.texto}: ${b.enlace.url}`;
  return "";
}

/** Arma el correo completo con la marca. */
export function maquetar(o: { asunto: string; previa: string; bloques: Bloque[]; firma: string[]; pie: string }): Correo {
  const cuerpo = o.bloques.map(bloqueHtml).join("\n");
  const firma = o.firma
    .map((l, i) => `<span style="${i === 0 ? "font-weight:700;" : ""}color:${i === 0 ? C.tinta : C.suave}">${escapar(l)}</span>`)
    .join("<br>");
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>${escapar(o.asunto)}</title></head>
<body style="margin:0;padding:0;background:${C.fondo}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapar(o.previa)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.fondo}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:${C.tarjeta};border-radius:18px;overflow:hidden;border:1px solid ${C.linea}">
<tr><td style="background:${C.marca};padding:22px 32px">
<a href="${CONTACTO.web}" style="${FUENTE};font-size:15px;font-weight:800;letter-spacing:.28em;color:#ffffff;text-decoration:none">LUIS FLORES</a>
<div style="${FUENTE};font-size:11px;letter-spacing:.18em;color:#8ea2c6;margin-top:4px">IA · AUTOMATIZACIÓN · NEGOCIOS</div>
</td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;background:${C.violeta};background-image:linear-gradient(90deg,#007bff,${C.violeta},#8b5cf6)">&nbsp;</td></tr>
<tr><td style="padding:32px 32px 12px">
${cuerpo}
<p style="margin:8px 0 28px;${FUENTE};font-size:15px;line-height:1.6">${firma}</p>
</td></tr>
<tr><td style="padding:18px 32px 22px;background:#f8fafc;border-top:1px solid ${C.linea};${FUENTE};font-size:12px;line-height:1.6;color:${C.suave}">
${escapar(o.pie)}<br>${escapar(CONTACTO.firma)} · <a href="${CONTACTO.web}" style="color:${C.suave}">soyluisflores.es</a>
</td></tr>
</table></td></tr></table></body></html>`;

  const texto = [...o.bloques.map(bloqueTexto), "", ...o.firma, "", "--", o.pie, CONTACTO.firma].join("\n\n").replace(/\n{3,}/g, "\n\n");
  return { asunto: o.asunto, html, texto };
}

const PIE_CITA = "Recibes este correo porque agendaste una llamada en soyluisflores.es.";
const FIRMA = ["Luis Flores", "soyluisflores.es"];

function fichaCita(d: DatosCita): Bloque {
  const filas: [string, string][] = [["Cuándo", cuando(d.inicio, d.zona)], ["Duración", `${d.duracion} minutos`]];
  filas.push(["Dónde", d.meet ? "Videollamada por Google Meet" : "Videollamada: te mando el enlace por correo"]);
  return { ficha: filas };
}

// ------------------------------------------------------------- Plantillas

/** 1. Confirmación, al reservar. */
export function confirmacion(d: DatosCita): Correo {
  return maquetar({
    asunto: `Tu llamada con Luis: ${cuando(d.inicio, d.zona)}`,
    previa: "Aquí tienes el enlace y lo que conviene tener a mano.",
    bloques: [
      { p: `Hola, ${primerNombre(d.nombre)}:` },
      { p: "Tu llamada de diagnóstico está agendada." },
      fichaCita(d),
      ...(d.meet ? [{ boton: { texto: "Entrar a la videollamada", url: d.meet } }] : []),
      {
        p: `Dura ${d.duracion} minutos y no tienes que preparar nada especial. Si quieres aprovechar mejor el tiempo, ten a mano tres cosas:`,
      },
      {
        lista: [
          "Cómo te llegan hoy los clientes o las consultas.",
          "Qué herramientas usas, aunque sea una hoja de cálculo.",
          "Qué tarea te quita más tiempo cada semana.",
        ],
      },
      { enlace: { antes: "Si necesitas cambiar la hora, cancela esta y elige otra:", texto: "cambiar mi llamada", url: d.cambiar } },
      { p: `Cualquier duda, responde a este correo o escríbeme por WhatsApp al ${CONTACTO.whatsapp}.` },
    ],
    firma: ["Hasta pronto,", ...FIRMA],
    pie: PIE_CITA,
  });
}

/** 2. Recordatorio, un día antes. */
export function recordatorio24(d: DatosCita): Correo {
  return maquetar({
    asunto: `Mañana hablamos: ${cuando(d.inicio, d.zona)}`,
    previa: "El enlace de la videollamada, por si lo necesitas.",
    bloques: [
      { p: `Hola, ${primerNombre(d.nombre)}:` },
      { p: "Te recuerdo que mañana tenemos la llamada de diagnóstico." },
      fichaCita(d),
      ...(d.meet ? [{ boton: { texto: "Entrar a la videollamada", url: d.meet } }] : []),
      { enlace: { antes: "Si no te viene bien, puedes cambiar la hora aquí:", texto: "cambiar mi llamada", url: d.cambiar } },
    ],
    firma: ["Nos vemos mañana.", "Luis"],
    pie: PIE_CITA,
  });
}

/** 3. Recordatorio, una hora antes. Corto a propósito. */
export function recordatorio1(d: DatosCita): Correo {
  return maquetar({
    asunto: "En una hora: tu llamada con Luis",
    previa: "Aquí está el enlace.",
    bloques: [
      { p: `Hola, ${primerNombre(d.nombre)}:` },
      { p: "En una hora empieza nuestra llamada." },
      ...(d.meet ? [{ boton: { texto: "Entrar a la videollamada", url: d.meet } }] : []),
      { p: `Si te surge algo, avísame por WhatsApp al ${CONTACTO.whatsapp} y la movemos.` },
    ],
    firma: ["Luis"],
    pie: PIE_CITA,
  });
}

/** 4. Confirmación de que la cita quedó cancelada. */
export function cancelacion(d: Pick<DatosCita, "nombre" | "inicio" | "zona">): Correo {
  return maquetar({
    asunto: "Tu llamada quedó cancelada",
    previa: "Si quieres, elige otro momento.",
    bloques: [
      { p: `Hola, ${primerNombre(d.nombre)}:` },
      { p: `Cancelé la llamada del ${cuando(d.inicio, d.zona)}. Ese horario quedó libre.` },
      { p: "Si quieres hablar en otro momento, elige el día y la hora que te queden bien:" },
      { boton: { texto: "Elegir otra hora", url: `${CONTACTO.web}/contacto#agenda` } },
    ],
    firma: ["Luis"],
    pie: PIE_CITA,
  });
}

export interface DatosAviso {
  nombre: string;
  correo: string;
  empresa: string;
  mensaje: string;
  zonaCliente: string;
  origen: string;
  inicio: number;
  duracion: number;
  zona: string;
  meet: string | null;
  evento: string | null;
}

/** 5. Aviso para el titular: nueva reserva o cancelación. */
export function avisoTitular(d: DatosAviso, tipo: "nueva" | "cancelada"): Correo {
  const titulo = tipo === "nueva" ? "Nueva llamada" : "Llamada cancelada";
  const filas: [string, string][] = [
    ["Cuándo (tu hora)", cuando(d.inicio, d.zona)],
    ["Cuándo (su hora)", cuando(d.inicio, d.zonaCliente)],
    ["Nombre", d.nombre],
    ["Correo", d.correo],
  ];
  if (d.empresa) filas.push(["Negocio", d.empresa]);
  if (d.origen) filas.push(["Llegó desde", d.origen]);
  const bloques: Bloque[] = [
    { p: tipo === "nueva" ? "Alguien agendó la llamada de diagnóstico desde la web." : "El cliente canceló la llamada desde el enlace de su correo. El hueco ya está libre en la agenda." },
    { ficha: filas },
  ];
  if (tipo === "nueva") bloques.push({ p: d.mensaje ? `Lo que quiere resolver: ${d.mensaje}` : "No dejó mensaje." });
  if (tipo === "nueva" && d.meet) bloques.push({ boton: { texto: "Abrir la videollamada", url: d.meet } });
  if (tipo === "nueva" && d.evento) bloques.push({ enlace: { antes: "La cita está en tu Google Calendar:", texto: "ver el evento", url: d.evento } });
  return maquetar({
    asunto: `${titulo}: ${d.nombre} · ${cuando(d.inicio, d.zona)}`,
    previa: tipo === "nueva" ? `${d.nombre} agendó desde la web.` : `${d.nombre} canceló su llamada.`,
    bloques,
    firma: ["Agenda de soyluisflores.es"],
    pie: "Aviso automático de la agenda de la web.",
  });
}
