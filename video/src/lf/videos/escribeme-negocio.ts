/**
 * Anuncio «¿Estás perdiendo clientes?» · CTA «Escríbeme NEGOCIO» (13/11/2026).
 *
 * Avatar de HeyGen de 45,1 s (dentro del máximo de 60 s). Para restaurantes,
 * cafeterías y pequeños comercios de España y Latinoamérica. Objetivo:
 * conversaciones por privado. Se difunde por WhatsApp (grupos y estados),
 * Instagram (Reels e historias) y TikTok.
 *
 * Escenas ancladas a la voz real. Todo lo de pantalla es ilustrativo:
 * mensajes, web, conversación y flujo son ejemplos; el contador de
 * consultas solo cuenta los mensajes de ejemplo que se ven en pantalla.
 */
import type { Caption } from "@remotion/captions";
import type { ConfigVideo } from "../tipos";
import subtitulos from "./subtitulos/escribeme-negocio.json";

export const escribemeNegocio: ConfigVideo = {
  id: "escribeme-negocio",
  titulo: "¿Estás perdiendo clientes?",
  avatar: "medios/avatar-negocio.mp4",
  subtitulos: subtitulos as Caption[],
  duracion: "auto",
  // Música propia (herramientas/generar-musica.mjs), cambia de ritmo en la revelación.
  musica: { archivo: "medios/musica-negocio.wav", volumen: 0.1 },
  sonidoTransiciones: true,
  aviso: "Ejemplo ilustrativo",
  estiloSubtitulos: {
    // Una sola línea en la costura de la pantalla dividida.
    maxCaracteres: 26,
    tamano: 56,
    claves: ["clientes", "mensajes", "negocio", "restaurante", "tienda", "web", "asistente", "inteligencia", "artificial", "sistema", "pedidos", "reservas", "consultas", "privado", "opción"],
  },
  cta: {
    estilo: "mensaje",
    accion: "ESCRÍBEME",
    palabra: "NEGOCIO",
    nota: "Por privado. Lo hablamos sin compromiso.",
    web: "soyluisflores.es",
    recurso: "",
    usuario: "@soyluisfloresoficial",
    momentos: { comentar: "escríbeme" },
  },
  // Momentos (regla del 13/11/2026): avatar solo en gancho, preguntas, emoción y
  // presentación; avatar + imagen o gráfica (65/35) cuando la voz nombra algo
  // concreto; solo gráfica como mucho 2 s.
  escenas: [
    {
      // Gancho: avatar solo con los avisos y el titular.
      id: "gancho",
      seccion: "gancho",
      inicio: 0,
      presentador: "completo",
      zoom: [{ en: 0.05, escala: 1.16, duracion: 1.6 }],
      capa: {
        tipo: "notificaciones",
        avisos: [
          { remitente: "Mensaje nuevo", texto: "¿Estáis abiertos?", hora: "13:42" },
          { remitente: "Mensaje nuevo", texto: "¿Cuánto cuesta?", hora: "13:44" },
          { remitente: "Mensaje nuevo", texto: "¿Tenéis disponibilidad?", hora: "13:47" },
        ],
        sello: "Sin responder",
        selloEn: { ancla: "pequeño negocio" },
      },
      titular: { texto: "¿ESTÁS PERDIENDO CLIENTES?", destacar: ["clientes"], colorDestacado: "cian", tamano: 100 },
    },
    {
      // Pregunta al espectador: avatar solo.
      id: "pregunta",
      seccion: "problema",
      inicio: { ancla: "entonces dime algo" },
      presentador: "completo",
      zoom: [{ en: 0.1, escala: 1.08, duracion: 1.2 }],
    },
    {
      // La voz nombra el local y los mensajes: avatar + imagen real del local y el móvil.
      id: "local-y-movil",
      seccion: "problema",
      inicio: { ancla: "estás atendiendo clientes" },
      presentador: "dividida",
      titular: { texto: "MIENTRAS ATIENDES, TE ESCRIBEN", destacar: ["escriben"], colorDestacado: "cian", tamano: 50 },
      contenido: {
        tipo: "dividida",
        izquierda: { etiqueta: "EN EL LOCAL", imagen: "medios/ia-local-atendiendo.jpg" },
        derecha: {
          etiqueta: "EN EL MÓVIL",
          mensajes: ["¿Estáis abiertos?", "¿Cuánto cuesta?", "¿Tenéis disponibilidad?", "¿Hacéis pedidos para llevar?"],
          contador: { etiqueta: "Sin responder", hasta: 4 },
        },
        zoomMensajes: { ancla: "no puedes responder" },
      },
    },
    {
      // Pregunta y emoción: avatar solo con el titular sincronizado.
      id: "otra-opcion",
      seccion: "problema",
      inicio: { ancla: "y cuando por fin" },
      presentador: "completo",
      zoom: [{ en: { ancla: "otra opción" }, escala: 1.15, duracion: 1.6 }],
      titular: { texto: "ESA PERSONA YA BUSCÓ OTRA OPCIÓN", destacar: ["otra", "opción"], colorDestacado: "cian", sincronizar: true, tamano: 88 },
    },
    {
      // Cambio de idea: solo gráfica, 2 s, la voz sigue sonando.
      id: "revelacion",
      seccion: "solucion1",
      inicio: { ancla: "ahora imagina" },
      presentador: "oculto",
      contenido: { tipo: "revelacion", titular: "HAY UNA FORMA MÁS INTELIGENTE", destacar: ["inteligente"] },
    },
    {
      id: "web",
      seccion: "solucion1",
      inicio: { ancla: "una página web", ajuste: 0.3 },
      presentador: "dividida",
      entrada: "zoom",
      titular: { texto: "TU NEGOCIO EN INTERNET", destacar: ["internet"], colorDestacado: "cian", tamano: 54 },
      contenido: {
        tipo: "pantallas",
        pantallas: [
          {
            titulo: "turestaurante.com · ejemplo",
            fuente: {
              tipo: "web",
              negocio: "Tu restaurante",
              lema: "Comida casera, todos los días",
              secciones: ["Menú", "Para llevar", "Reservas"],
              boton: "Contactar",
              imagen: "medios/ia-comida-casera.jpg",
            },
            cursor: { puntos: [{ x: 80, y: 82 }, { x: 40, y: 70 }, { x: 12, y: 62 }], desde: 1.6, duracion: 1.5, resalte: { ancho: 180, alto: 58 } },
          },
        ],
      },
    },
    {
      id: "asistente",
      seccion: "solucion2",
      inicio: { ancla: "un asistente de" },
      presentador: "dividida",
      titular: { texto: "RESPUESTAS AUTOMÁTICAS", destacar: ["automáticas"], colorDestacado: "cian", tamano: 54 },
      contenido: {
        tipo: "pantallas",
        pantallas: [
          {
            titulo: "Mensajes · ejemplo",
            fuente: {
              tipo: "chat",
              canal: "Tu restaurante",
              mensajes: [
                { de: "cliente", texto: "¿Tenéis mesa para cuatro esta noche?", hora: "13:45" },
                { de: "agente", texto: "¡Hola! Soy el asistente virtual. Te ayudo con la reserva: ¿a qué hora te viene bien?", hora: "13:45" },
              ],
            },
          },
        ],
      },
    },
    {
      id: "organizacion",
      seccion: "automatizacion",
      inicio: { ancla: "un sistema que te ayude" },
      presentador: "dividida",
      titular: { texto: "MENOS TAREAS REPETITIVAS", destacar: ["repetitivas"], colorDestacado: "cian", tamano: 54 },
      contenido: {
        tipo: "flujo",
        nodos: [
          { icono: "formulario", titulo: "Llega una solicitud", detalle: "Pedido, reserva o consulta" },
          { icono: "calendario", titulo: "Se anota en tu calendario", detalle: "Sin escribirlo a mano" },
          { icono: "whatsapp", titulo: "Confirmación al cliente", detalle: "Le llega al momento" },
        ],
      },
    },
    {
      // Las tres soluciones unidas.
      id: "todo-conectado",
      seccion: "sistema",
      inicio: { ancla: "sin tener que hacerlo" },
      presentador: "dividida",
      titular: { texto: "TODO CONECTADO", destacar: ["conectado"], colorDestacado: "cian", tamano: 54 },
      contenido: {
        tipo: "sistema",
        centro: { titulo: "Tu negocio", icono: "usuario" },
        nodos: [
          { icono: "formulario", titulo: "Tu web" },
          { icono: "agente", titulo: "Asistente" },
          { icono: "calendario", titulo: "Calendario" },
        ],
      },
    },
    {
      // Opinión: avatar solo.
      id: "sin-ser-experto",
      seccion: "sistema",
      inicio: { ancla: "no necesitas ser experto" },
      presentador: "completo",
      zoom: [{ en: { ancla: "experto" }, escala: 1.1, duracion: 1.4 }],
      titular: { texto: "NO NECESITAS SER EXPERTO", destacar: ["experto"], colorDestacado: "cian", sincronizar: true, tamano: 84 },
    },
    {
      // Presentación: avatar solo con el rótulo discreto.
      id: "presentacion",
      seccion: "sistema",
      inicio: { ancla: "soy luis flores" },
      presentador: "completo",
      contenido: { tipo: "presentacion", nombre: "LUIS FLORES", linea: "IA · WEB · AUTOMATIZACIÓN", web: "soyluisflores.es" },
    },
    {
      // Pregunta final: avatar solo.
      id: "pregunta-final",
      seccion: "cta",
      inicio: { ancla: "quieres saber" },
      presentador: "completo",
      zoom: [{ en: { ancla: "mejorar" }, escala: 1.1, duracion: 1.4 }],
    },
    {
      // Cierre: avatar y CTA.
      id: "cta",
      seccion: "cta",
      inicio: { ancla: "escríbeme" },
      presentador: "dividida",
      subtitulos: false,
      contenido: { tipo: "cta" },
    },
  ],
};

/** Misma pieza sin subtítulos ni aviso: para sacar la portada. */
export const escribemeNegocioPortada: ConfigVideo = { ...escribemeNegocio, id: "escribeme-negocio-portada", sinSubtitulos: true, aviso: undefined, musica: null, sonidoTransiciones: false };
