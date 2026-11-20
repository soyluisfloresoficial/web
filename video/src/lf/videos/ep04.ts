/**
 * SOYLUISFLORES · Episodio 04 «No le pidas ideas a la IA: dale las preguntas de tus clientes» (20/11/2026)
 *
 * Avatar HeyGen 1080×1920, 25 fps, 39,9 s. Tiempos de la voz real (subtitulos/ep04.json).
 * Método del skill reel-efectos-motion sobre LF Motion: gancho como escena (palabra 3D
 * detrás de la cabeza con el presentador recortado), un efecto por idea cada 2-4 s,
 * la cara siempre libre y cierre con el enlace del perfil.
 * La demo usa 20 preguntas de ejemplo (ficticias) y una interfaz de chat genérica.
 */
import type { Caption } from "@remotion/captions";
import type { ConfigVideo } from "../tipos";
import subtitulos from "./subtitulos/ep04.json";

export const ep04: ConfigVideo = {
  id: "ep04",
  titulo: "No le pidas ideas a la IA: dale las preguntas de tus clientes",
  avatar: "medios/avatar-ep04.mp4",
  subtitulos: subtitulos as Caption[],
  duracion: "auto",
  musica: { archivo: "medios/musica-ep04.wav", volumen: 0.08 },
  sonidoTransiciones: true,
  sonidoZoom: false,
  cortes: "secos",
  aviso: "Ejemplo ilustrativo · preguntas ficticias",
  marca: { firma: true },
  estiloSubtitulos: {
    maxCaracteres: 26,
    tamano: 56,
    claves: ["chatgpt", "preguntas", "clientes", "plazos", "plantilla"],
  },
  cta: {
    estilo: "perfil",
    accion: "ENLACE EN MI PERFIL",
    palabra: "",
    etiquetaRecurso: "PLANTILLA GRATIS",
    recurso: "Analiza las preguntas de tus clientes con IA",
    usuario: "@soyluisfloresoficial",
    web: "soyluisflores.es/recursos",
    momentos: { seguir: "si quieres hacer" },
  },
  escenas: [
    {
      // Gancho: set de marca, «IDEAS» en 3D detrás de la cabeza; se tacha en «yo no empezaría».
      id: "gancho",
      seccion: "gancho",
      inicio: 0,
      presentador: "oculto",
      contenido: { tipo: "ganchoGlass", palabra: "IDEAS", recorte: "medios/avatar-ep04-recorte.webm", tachar: { ancla: "yo no empezaría" }, nota: "NO EMPIECES POR AQUÍ" },
      sonidos: [{ en: { ancla: "yo no empezaría" }, archivo: "sfx/whoosh.wav", volumen: 0.25 }],
    },
    {
      // «Las preguntas que te hacen tus clientes»: foto real + mensajes que llegan.
      id: "preguntas",
      seccion: "problema",
      inicio: { ancla: "le daría" },
      presentador: "oculto",
      fondo: { archivo: "medios/foto-duena-mensajes.jpg", credito: "Foto: Kristin Hardwick · StockSnap · CC0", movimiento: "acercar" },
      capa: {
        tipo: "notificaciones",
        avisos: [
          { remitente: "Cliente", texto: "¿Cuánto tardan en entregar?", hora: "10:02" },
          { remitente: "Cliente", texto: "¿Qué incluye el servicio?", hora: "11:15" },
          { remitente: "Cliente", texto: "¿Cómo empiezo con ustedes?", hora: "12:40" },
        ],
      },
    },
    {
      // DEMO: 20 preguntas de ejemplo → temas, repetidas y lo que falta.
      id: "demo",
      seccion: "solucion1",
      inicio: { ancla: "mira esta prueba" },
      presentador: "oculto",
      sonidos: [
        { en: { ancla: "agrupe por temas" }, archivo: "sfx/whoosh.wav", volumen: 0.22 },
        { en: { ancla: "se repiten" }, archivo: "sfx/pop.wav", volumen: 0.3 },
        { en: { ancla: "información falta" }, archivo: "sfx/clic.wav", volumen: 0.3 },
      ],
      contenido: {
        tipo: "analisisPreguntas",
        preguntas: [
          "¿Cuánto tardan en entregar?",
          "¿Qué incluye el plan básico?",
          "¿Cómo empiezo con ustedes?",
          "¿En cuántos días responden?",
          "¿Emiten factura?",
          "¿Qué necesito enviarles?",
          "¿El plazo cambia en temporada alta?",
          "¿Puedo cambiar de plan?",
          "¿Hay una llamada inicial?",
        ],
        peticion: "Agrúpalas por temas, señala cuáles se repiten y dime qué información falta para responderlas bien.",
        grupos: [
          { tema: "Plazos", indices: [0, 3, 6], repetida: 0, total: 8 },
          { tema: "Servicio", indices: [1, 4, 7], total: 6 },
          { tema: "Cómo empezar", indices: [2, 5, 8], repetida: 2, total: 6 },
        ],
        falta: "El plazo de entrega y los primeros pasos no están en la web.",
        momentos: {
          preguntas: { ancla: "he preparado" },
          peticion: { ancla: "le pido" },
          agrupar: { ancla: "agrupe por temas" },
          repetidas: { ancla: "se repiten" },
          falta: { ancla: "información falta" },
        },
      },
    },
    {
      // Cambio de intención: vuelve el avatar.
      id: "interesante",
      seccion: "solucion2",
      inicio: { ancla: "aquí viene" },
      presentador: "completo",
      zoom: [{ en: { ancla: "interesante" }, escala: 1.1, duracion: 1 }],
      titular: { texto: "AQUÍ VIENE LO INTERESANTE", destacar: ["interesante"], colorDestacado: "cian", sincronizar: true, tamano: 84 },
    },
    {
      id: "no-es-esto",
      seccion: "solucion2",
      inicio: { ancla: "el resultado" },
      presentador: "oculto",
      titular: { texto: "EL RESULTADO NO ES…", destacar: ["no"], colorDestacado: "cian", tamano: 84 },
      contenido: { tipo: "tarjetasTachadas", titulos: ["10 ideas de contenido", "Frases para motivar", "Tendencias del mes"], etiqueta: "NO ES ESTO", tachar: { ancla: "publicaciones bonitas" } },
    },
    {
      // Lo que revela: cada punto cuando la voz lo nombra.
      id: "revela",
      seccion: "solucion2",
      inicio: { ancla: "puede mostrar" },
      presentador: "oculto",
      titular: { texto: "LO QUE TU CLIENTE NO ENTIENDE", destacar: ["no", "entiende"], colorDestacado: "cian", tamano: 80 },
      contenido: {
        tipo: "lista",
        items: [
          { texto: "Tus plazos", icono: "reloj", en: { ancla: "plazos" } },
          { texto: "Tu servicio", icono: "tarea", en: { ancla: "tu servicio" } },
          { texto: "Cómo empezar contigo", icono: "check", en: { ancla: "cómo empezar" } },
        ],
      },
    },
    {
      id: "pista",
      seccion: "sistema",
      inicio: { ancla: "eso te da" },
      presentador: "oculto",
      titular: { texto: "UNA PISTA PARA ACTUAR", destacar: ["pista"], colorDestacado: "cian", tamano: 84 },
      contenido: {
        tipo: "flujo",
        nodos: [
          { icono: "formulario", titulo: "Mejorar tu web", detalle: "Plazos y primeros pasos claros" },
          { icono: "agente", titulo: "Respuestas útiles", detalle: "Para las dudas que se repiten" },
          { icono: "regla", titulo: "Una automatización", detalle: "Cuando el proceso ya está claro" },
        ],
      },
    },
    {
      // Momento clave: decide una persona.
      id: "decide",
      seccion: "sistema",
      inicio: { ancla: "después toca" },
      presentador: "completo",
      titular: { texto: "REVISAR LAS PREGUNTAS Y DECIDIR", destacar: ["decidir"], colorDestacado: "cian", sincronizar: true, tamano: 82 },
    },
    {
      // Cierre: plantilla gratis en el enlace del perfil.
      id: "cta",
      seccion: "cta",
      inicio: { ancla: "si quieres hacer" },
      presentador: "dividida",
      subtitulos: false,
      contenido: { tipo: "cta" },
    },
  ],
};

/** Variante LinkedIn y Facebook: la firma muestra la web. */
export const ep04Web: ConfigVideo = { ...ep04, id: "ep04-web", cta: { ...ep04.cta, usuario: "soyluisflores.es" } };

/** Portada: el gancho ya tachado (presentador recortado y «IDEAS» detrás). */
export const ep04Portada: ConfigVideo = {
  ...ep04,
  id: "ep04-portada",
  sinSubtitulos: true,
  aviso: undefined,
  musica: null,
  sonidoTransiciones: false,
  duracion: 6,
  escenas: [{ ...ep04.escenas[0], sonidos: undefined, contenido: { tipo: "ganchoGlass", palabra: "IDEAS", recorte: "medios/avatar-ep04-recorte.webm", tachar: 1, nota: "NO EMPIECES POR AQUÍ" } }],
};
