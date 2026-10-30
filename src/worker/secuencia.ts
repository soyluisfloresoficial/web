/**
 * Email marketing: la secuencia de la guía gratis (30/10/2026). Ver
 * EMAIL-MARKETING.md.
 *
 * Quien pide la guía «Qué automatizar primero en tu negocio» confirma su
 * correo y recibe seis correos en 14 días: la guía, cuatro consejos (uno por
 * área, cada uno con su artículo del blog) y la invitación a la llamada de
 * diagnóstico. Después no recibe nada más.
 *
 * Sin dependencias, para probarlo en el ordenador (tools/probar-agenda.mjs).
 * Misma voz que correos/PLANTILLAS.md: directa, sin presionar, sin cifras ni
 * casos. Un solo objetivo por correo y el enlace de baja en todos.
 */
// Con extensión .ts para que tools/probar-agenda.mjs lo pueda cargar con Node.
import { CONTACTO, maquetar, type Correo } from "./correo-plantillas.ts";
import { GUIAS, GUIA_GENERAL, tituloGuia, type Guia } from "../data/guias.ts";

/** La guía de un suscriptor; si el dato no existe, la general. */
export function guiaPedida(slug: string | undefined): Guia {
  return (slug && GUIAS[slug]) || GUIAS[GUIA_GENERAL];
}

/** Lo que dice la casilla del formulario (CapturaGuia.astro). Si cambia allí, cambia aquí. */
export const TEXTO_CONSENTIMIENTO =
  "Quiero recibir la guía y los correos con consejos de Luis Flores. Puedo darme de baja cuando quiera.";

const DIA = 86_400_000;
const PIE = "Recibes este correo porque pediste la guía gratis en soyluisflores.es.";
const FIRMA = ["Luis Flores", "soyluisflores.es"];

/** Enlace con la campaña marcada, para medir qué correo trae cada visita. */
function enlace(ruta: string, paso: string): string {
  const u = new URL(ruta, CONTACTO.web);
  u.searchParams.set("utm_source", "email");
  u.searchParams.set("utm_medium", "secuencia");
  u.searchParams.set("utm_campaign", "guia-automatizar");
  u.searchParams.set("utm_content", paso);
  return u.toString();
}

function hola(nombre: string): string {
  const primero = nombre.trim().split(/\s+/)[0];
  return primero ? `Hola, ${primero}:` : "Hola:";
}

interface DatosCorreo {
  nombre: string;
  /** Enlace firmado de baja (el de la cabecera List-Unsubscribe es el mismo). */
  baja: string;
  /** La guía que pidió: la entrega el primer correo y el último invita desde su servicio. */
  guia: Guia;
}

/** Doble confirmación: lo primero que recibe, antes de entrar en la lista. */
export function confirmarSuscripcion(nombre: string, confirmar: string, guia: Guia = guiaPedida(undefined)): Correo {
  const titulo = tituloGuia(guia);
  return maquetar({
    asunto: "Confirma tu correo y te mando la guía",
    previa: `Un clic y te llega «${titulo}».`,
    bloques: [
      { p: hola(nombre) },
      { p: `Pediste la guía «${titulo}». Para mandártela, confirma que este correo es tuyo:` },
      { boton: { texto: "Confirmar y recibir la guía", url: confirmar } },
      { p: "Si no fuiste tú, ignora este mensaje: sin confirmar no te llega nada más y tus datos se borran solos en unos días." },
    ],
    firma: FIRMA,
    pie: "Recibes este correo porque alguien escribió esta dirección en soyluisflores.es.",
  });
}

export interface PasoSecuencia {
  /** Días desde la confirmación. */
  dia: number;
  nombre: string;
  crear: (d: DatosCorreo) => Correo;
}

export const SECUENCIA: PasoSecuencia[] = [
  {
    dia: 0,
    nombre: "guia",
    crear: (d) =>
      maquetar({
        asunto: `Tu guía: ${tituloGuia(d.guia)}`,
        previa: "Aquí la tienes, con una hoja para aplicarla a tu caso.",
        baja: d.baja,
        bloques: [
          { p: hola(d.nombre) },
          { p: `Gracias por confirmar. Aquí tienes «${tituloGuia(d.guia)}»:` },
          { boton: { texto: "Abrir la guía", url: enlace(`/guia/${d.guia.slug}`, "guia") } },
          {
            p: `Te propongo usarla así: esta semana completa la hoja de la parte 2, «${d.guia.hoja.titulo}». Con eso, el resto de la guía te ayuda a elegir por dónde empezar.`,
          },
          { p: "En unos días te escribo con lo que suele pasar en la atención a clientes, que es por donde más conviene empezar." },
        ],
        firma: ["Luis"],
        pie: PIE,
      }),
  },
  {
    dia: 2,
    nombre: "atencion",
    crear: (d) =>
      maquetar({
        asunto: "Lo que pasa cuando respondes tarde",
        previa: "Por qué la atención suele ser el mejor primer paso.",
        baja: d.baja,
        bloques: [
          { p: hola(d.nombre) },
          {
            p: "Cuando alguien te escribe para preguntar un precio o un horario, casi siempre se queda con la venta el que responde primero. Por eso la atención y el seguimiento de contactos suelen ser la mejor primera automatización.",
          },
          {
            p: "Lo que más preocupa de poner un agente de IA a contestar es que invente información. Se puede evitar: responde solo con lo que tú apruebas y, si no sabe algo, pasa la conversación a una persona.",
          },
          { enlace: { antes: "Te cuento cómo se configura:", texto: "agentes de IA que no inventan información", url: enlace("/blog/agentes-ia-sin-inventar", "atencion") } },
        ],
        firma: ["Luis"],
        pie: PIE,
      }),
  },
  {
    dia: 4,
    nombre: "automatizacion",
    crear: (d) =>
      maquetar({
        asunto: "Herramientas que no se hablan",
        previa: "Cuando tú haces de puente entre aplicaciones.",
        baja: d.baja,
        bloques: [
          { p: hola(d.nombre) },
          {
            p: "Si copias datos de una herramienta a otra, mandas el mismo correo una y otra vez o revisas a mano si alguien ya pagó, tus herramientas no se están hablando y tú haces de puente.",
          },
          {
            p: "Conectarlas es lograr que se pasen los datos solas, con avisos si algo falla y sin duplicados. Bien hecho, casi no se nota: solo ves el tiempo que te devuelve.",
          },
          { enlace: { antes: "Cómo hacerlo sin que nada se rompa:", texto: "conectar tus herramientas", url: enlace("/blog/conectar-herramientas-sin-romper", "automatizacion") } },
        ],
        firma: ["Luis"],
        pie: PIE,
      }),
  },
  {
    dia: 7,
    nombre: "crm",
    crear: (d) =>
      maquetar({
        asunto: "Dónde se te escapan los contactos",
        previa: "Correo, celular, hoja de cálculo… y nadie con la foto completa.",
        baja: d.baja,
        bloques: [
          { p: hola(d.nombre) },
          {
            p: "Unos contactos en el correo, otros en el celular y otros en una hoja de cálculo. Quedas en volver a escribir, se pasa la semana y ese cliente se enfría.",
          },
          {
            p: "Un CRM ordena eso: cada contacto con su etapa, su historial y su siguiente paso, y los recordatorios salen solos. No hace falta empezar con algo complicado.",
          },
          { enlace: { antes: "Por dónde empezar:", texto: "CRM para pymes, paso a paso", url: enlace("/blog/crm-para-pymes-por-donde-empezar", "crm") } },
        ],
        firma: ["Luis"],
        pie: PIE,
      }),
  },
  {
    dia: 10,
    nombre: "metricas",
    crear: (d) =>
      maquetar({
        asunto: "Qué mirar para decidir",
        previa: "Pocas cifras, bien elegidas, valen más que un informe largo.",
        baja: d.baja,
        bloques: [
          { p: hola(d.nombre) },
          {
            p: "Medir de más abruma y no ayuda. Lo que sirve es mirar pocas cifras en cada etapa: cuántos contactos entran, cuántos agendan y cuántos compran. Con eso ya sabes dónde mejorar primero.",
          },
          {
            p: "Y cuando automatizas algo, mide antes y después con tus propios datos. Así sabes si de verdad funcionó.",
          },
          { enlace: { antes: "Las métricas de cada etapa:", texto: "qué medir en tu negocio", url: enlace("/blog/que-medir-en-cada-etapa", "metricas") } },
        ],
        firma: ["Luis"],
        pie: PIE,
      }),
  },
  {
    dia: 14,
    nombre: "llamada",
    crear: (d) =>
      maquetar({
        asunto: "¿Lo vemos en tu negocio?",
        previa: "30 minutos, gratis, para elegir tu primera automatización.",
        baja: d.baja,
        bloques: [
          { p: hola(d.nombre) },
          {
            p: "Estos días te conté por dónde suele convenir empezar. Si quieres verlo con tu caso, en una llamada de 30 minutos me cuentas cómo trabajas y te digo qué haría primero, con qué herramienta y qué puedes esperar.",
          },
          { p: "Es gratis, por videollamada y sin compromiso. Si no tiene sentido trabajar juntos, te lo digo." },
          { boton: { texto: "Elegir día y hora", url: enlace(`/diagnostico/${d.guia.servicio}`, "llamada") } },
          { p: "Si ahora no es el momento, no pasa nada. Este es el último correo de la serie." },
        ],
        firma: ["Luis"],
        pie: PIE,
      }),
  },
];

/** Cuándo toca el siguiente correo, o null si la serie terminó. */
export function proximoEnvio(confirmado: number, paso: number): number | null {
  const siguiente = SECUENCIA[paso];
  return siguiente ? confirmado + siguiente.dia * DIA : null;
}
