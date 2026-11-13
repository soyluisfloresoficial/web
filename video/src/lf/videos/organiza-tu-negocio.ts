/**
 * Video «¿Te faltan horas al día?» · CTA «Sígueme» (13/11/2026).
 *
 * Avatar de HeyGen de 57,2 s. Montado con las reglas del titular:
 * imágenes reales acordes con la voz (generadas con IA en Higgsfield) y
 * momentos del avatar (solo en gancho, ideas, preguntas y presentación;
 * pantalla dividida 65/35 cuando la voz nombra algo concreto).
 * Todo lo de pantalla es ilustrativo: no hay clientes ni cifras reales.
 */
import type { Caption } from "@remotion/captions";
import type { ConfigVideo } from "../tipos";
import subtitulos from "./subtitulos/video3.json";

export const organizaTuNegocio: ConfigVideo = {
  id: "organiza-tu-negocio",
  titulo: "¿Te faltan horas al día?",
  avatar: "medios/avatar-video3.mp4",
  subtitulos: subtitulos as Caption[],
  duracion: "auto",
  musica: { archivo: "medios/musica-video3.wav", volumen: 0.1 },
  sonidoTransiciones: true,
  aviso: "Ejemplo ilustrativo",
  estiloSubtitulos: {
    maxCaracteres: 26,
    tamano: 56,
    claves: ["negocio", "whatsapp", "cliente", "clientes", "información", "tareas", "atención", "control", "citas", "mensajes", "inteligencia", "artificial", "organizada", "tiempo", "sistemas", "organizar"],
  },
  cta: {
    estilo: "seguir",
    accion: "SÍGUEME",
    palabra: "",
    recurso: "",
    usuario: "@soyluisfloresoficial",
    web: "soyluisflores.es",
    momentos: { seguir: "sígueme" },
  },
  escenas: [
    {
      // Gancho: avatar solo con las tareas pendientes que se acumulan.
      id: "gancho",
      seccion: "gancho",
      inicio: 0,
      presentador: "completo",
      zoom: [{ en: 0.05, escala: 1.16, duracion: 1.6 }],
      capa: {
        tipo: "notificaciones",
        avisos: [
          { remitente: "Pendiente", texto: "Responder mensajes", hora: "09:15" },
          { remitente: "Pendiente", texto: "Confirmar las citas", hora: "11:40" },
          { remitente: "Pendiente", texto: "Llamar a un cliente", hora: "13:05" },
        ],
        sello: "Sin hacer",
        selloEn: { ancla: "atenderlo todo" },
      },
      titular: { texto: "¿TE FALTAN HORAS AL DÍA?", destacar: ["horas"], colorDestacado: "cian", tamano: 100 },
    },
    {
      // Idea: avatar solo.
      id: "trabajar-mas",
      seccion: "problema",
      inicio: { ancla: "déjame explicarte" },
      presentador: "completo",
      zoom: [{ en: { ancla: "trabajar más" }, escala: 1.1, duracion: 1.3 }],
      titular: { texto: "NO NECESITAS TRABAJAR MÁS", destacar: ["más"], colorDestacado: "cian", sincronizar: true, tamano: 88 },
    },
    {
      id: "organizar-mejor",
      seccion: "problema",
      inicio: { ancla: "necesitas organizar" },
      presentador: "completo",
      titular: { texto: "NECESITAS ORGANIZAR MEJOR TU NEGOCIO", destacar: ["organizar"], colorDestacado: "cian", sincronizar: true, tamano: 84 },
    },
    {
      // Concreto: el cliente escribe mientras atiendes → imagen real + móvil.
      id: "cliente-escribe",
      seccion: "problema",
      inicio: { ancla: "un cliente te escribe" },
      presentador: "dividida",
      titular: { texto: "TE ESCRIBEN MIENTRAS ATIENDES", destacar: ["escriben"], colorDestacado: "cian", tamano: 50 },
      contenido: {
        tipo: "dividida",
        izquierda: { etiqueta: "ATENDIENDO", imagen: "medios/ia-panaderia-atendiendo.jpg" },
        derecha: {
          etiqueta: "EN EL MÓVIL",
          mensajes: ["Hola, ¿tienes disponibilidad hoy?", "¿Me confirmas el precio?"],
          contador: { etiqueta: "Sin responder", hasta: 2 },
        },
        zoomMensajes: { ancla: "no puedes responder" },
      },
    },
    {
      id: "sin-seguimiento",
      seccion: "problema",
      inicio: { ancla: "otro te pide" },
      presentador: "dividida",
      titular: { texto: "Y NADIE VUELVE A ESCRIBIRLE", destacar: ["nadie"], colorDestacado: "cian", tamano: 50 },
      contenido: {
        tipo: "pantallas",
        pantallas: [
          {
            titulo: "Mensajes · ejemplo",
            fuente: {
              tipo: "chat",
              canal: "Tu negocio",
              mensajes: [
                { de: "cliente", texto: "Hola, ¿me pasas información de tus servicios?", hora: "Lunes 10:12" },
                { de: "estado", texto: "Sin seguimiento" },
              ],
            },
          },
        ],
      },
    },
    {
      // Concreto: las mismas tareas al final del día → imagen real.
      id: "mismas-tareas",
      seccion: "problema",
      inicio: { ancla: "y al final del día" },
      presentador: "dividida",
      titular: { texto: "LAS MISMAS TAREAS, UNA Y OTRA VEZ", destacar: ["mismas"], colorDestacado: "cian", tamano: 48 },
      contenido: { tipo: "imagen", archivo: "medios/ia-tareas-noche.jpg", credito: "Imagen generada con IA", movimiento: "acercar", etiqueta: "AL FINAL DEL DÍA" },
    },
    {
      // Cambio de idea: avatar solo con zoom y el titular de las tres cosas.
      id: "la-solucion",
      seccion: "solucion1",
      inicio: { ancla: "la solución" },
      presentador: "completo",
      zoom: [{ en: 0.05, escala: 1.15, duracion: 1.4 }],
      titular: { texto: "TRES COSAS QUE PUEDES MEJORAR", destacar: ["tres"], colorDestacado: "cian", sincronizar: true, tamano: 88 },
    },
    {
      id: "uno-atencion",
      seccion: "solucion1",
      inicio: { ancla: "primera" },
      presentador: "dividida",
      titular: { texto: "1 · ATENCIÓN AUNQUE NO ESTÉS", destacar: ["atención"], colorDestacado: "cian", tamano: 50 },
      contenido: {
        tipo: "pantallas",
        pantallas: [
          {
            titulo: "Mensajes · 22:15 · ejemplo",
            fuente: {
              tipo: "chat",
              canal: "Tu negocio",
              mensajes: [
                { de: "cliente", texto: "¿Tienes cita mañana por la tarde?", hora: "22:15" },
                { de: "agente", texto: "¡Hola! Soy el asistente virtual. Te ayudo a reservar: ¿qué hora te viene mejor?", hora: "22:15" },
              ],
            },
          },
        ],
      },
    },
    {
      id: "dos-seguimiento",
      seccion: "solucion2",
      inicio: { ancla: "segunda" },
      presentador: "dividida",
      titular: { texto: "2 · SEGUIMIENTO A TIEMPO", destacar: ["seguimiento"], colorDestacado: "cian", tamano: 50 },
      contenido: {
        tipo: "pantallas",
        pantallas: [
          {
            titulo: "Personas interesadas · ejemplo",
            fuente: {
              tipo: "crm",
              columnas: [
                { titulo: "NUEVOS", tarjetas: ["Consulta por la web", "Pidió información"] },
                { titulo: "INTERESADOS", tarjetas: ["Presupuesto enviado"] },
                { titulo: "VOLVER A CONTACTAR", tarjetas: ["Recordar el jueves"] },
              ],
              mover: { tarjeta: "Pidió información", a: 2 },
            },
          },
        ],
      },
    },
    {
      id: "tres-tareas",
      seccion: "automatizacion",
      inicio: { ancla: "tercera" },
      presentador: "dividida",
      titular: { texto: "3 · TAREAS QUE SE HACEN SOLAS", destacar: ["solas"], colorDestacado: "cian", tamano: 50 },
      contenido: {
        tipo: "flujo",
        nodos: [
          { icono: "calendario", titulo: "Se reserva una cita", detalle: "Desde la web o un mensaje" },
          { icono: "whatsapp", titulo: "Confirmación automática", detalle: "Sin escribirla a mano" },
          { icono: "reloj", titulo: "Recordatorio el día antes", detalle: "Menos citas olvidadas" },
        ],
      },
    },
    {
      // Idea: avatar solo.
      id: "hoy-ia",
      seccion: "sistema",
      inicio: { ancla: "hoy" },
      presentador: "completo",
      zoom: [{ en: { ancla: "inteligencia artificial" }, escala: 1.1, duracion: 1.4 }],
      titular: { texto: "LA INTELIGENCIA ARTIFICIAL", destacar: ["inteligencia", "artificial"], colorDestacado: "cian", sincronizar: true, tamano: 84 },
    },
    {
      // Concreto: un pequeño negocio organizado → imagen real.
      id: "negocio-organizado",
      seccion: "sistema",
      inicio: { ancla: "pequeño negocio" },
      presentador: "dividida",
      titular: { texto: "UN NEGOCIO MÁS ORGANIZADO", destacar: ["organizado"], colorDestacado: "cian", tamano: 50 },
      contenido: { tipo: "imagen", archivo: "medios/ia-negocio-organizado.jpg", credito: "Imagen generada con IA", movimiento: "derecha" },
    },
    {
      // Opinión: avatar solo.
      id: "sin-ser-experto",
      seccion: "sistema",
      inicio: { ancla: "y no" },
      presentador: "completo",
      zoom: [{ en: { ancla: "experto" }, escala: 1.1, duracion: 1.4 }],
      titular: { texto: "NO NECESITAS SER EXPERTO", destacar: ["experto"], colorDestacado: "cian", sincronizar: true, tamano: 84 },
    },
    {
      // Presentación: avatar solo con el rótulo.
      id: "presentacion",
      seccion: "sistema",
      inicio: { ancla: "soy luis flores" },
      presentador: "completo",
      contenido: { tipo: "presentacion", nombre: "LUIS FLORES", linea: "IA · WEB · AUTOMATIZACIÓN", web: "soyluisflores.es" },
    },
    {
      // Concreto: los tres beneficios, cada uno cuando la voz lo dice.
      id: "beneficios",
      seccion: "cta",
      inicio: { ancla: "ahorrar tiempo" },
      presentador: "dividida",
      contenido: {
        tipo: "lista",
        items: [
          { texto: "Ahorrar tiempo", icono: "reloj", en: { ancla: "ahorrar tiempo" } },
          { texto: "Mejor atención a tus clientes", icono: "usuario", en: { ancla: "mejorar la atención" } },
          { texto: "Crecer con mejores sistemas", icono: "crm", en: { ancla: "crecer con" } },
        ],
      },
    },
    {
      // Cierre: avatar y CTA.
      id: "cta",
      seccion: "cta",
      inicio: { ancla: "sígueme" },
      presentador: "dividida",
      contenido: { tipo: "cta" },
    },
  ],
};

/** Misma pieza sin subtítulos ni aviso: para la portada. */
export const organizaTuNegocioPortada: ConfigVideo = { ...organizaTuNegocio, id: "organiza-tu-negocio-portada", sinSubtitulos: true, aviso: undefined, musica: null, sonidoTransiciones: false };
