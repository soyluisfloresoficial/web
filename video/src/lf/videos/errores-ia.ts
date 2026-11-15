/**
 * Reel educativo «3 errores al usar IA en tu negocio» · CTA «Sígueme + comenta GUÍA» (15/11/2026).
 *
 * Avatar de HeyGen de 42,6 s. Estructura modelada en los reels educativos de
 * referencia (interfaz que funciona → alerta → tres puntos numerados →
 * conclusión → cierre), con la identidad SOYLUISFLORES y sin copiar gráficos.
 * Todas las interfaces son ejemplos ilustrativos (chat, calendario, flujo):
 * no hay clientes, precios ni resultados reales.
 */
import type { Caption } from "@remotion/captions";
import type { ConfigVideo } from "../tipos";
import subtitulos from "./subtitulos/errores-ia.json";

export const erroresIa: ConfigVideo = {
  id: "errores-ia",
  titulo: "3 errores al usar IA en tu negocio",
  avatar: "medios/avatar-errores-ia.mp4",
  subtitulos: subtitulos as Caption[],
  duracion: "auto",
  musica: { archivo: "medios/musica-errores-ia.wav", volumen: 0.1 },
  sonidoTransiciones: true,
  aviso: "Ejemplo ilustrativo",
  estiloSubtitulos: {
    maxCaracteres: 26,
    tamano: 56,
    claves: ["inteligencia", "artificial", "ia", "errores", "información", "incorrecta", "promesas", "control", "persona", "límites", "supervisión", "guía", "precios", "horarios", "reserva", "disponibilidad"],
  },
  cta: {
    estilo: "seguir-comentar",
    accion: "SÍGUEME",
    palabra: "GUÍA",
    recurso: "",
    usuario: "@soyluisfloresoficial",
    web: "soyluisflores.es",
    momentos: { seguir: "sígueme", comentar: "comenta" },
  },
  escenas: [
    {
      // 1. Interfaz que parece funcionar perfectamente (la voz nombra al asistente).
      id: "todo-bien",
      seccion: "gancho",
      inicio: 0,
      presentador: "dividida",
      titular: { texto: "TU ASISTENTE DE IA", destacar: ["ia"], colorDestacado: "cian", tamano: 50 },
      contenido: {
        tipo: "imagenYPantalla",
        imagen: "medios/ia-negocio-organizado.jpg",
        credito: "Imagen generada con IA",
        etiqueta: "TODO EN ORDEN",
        derecha: {
          tipo: "pantalla",
          titulo: "Asistente · ejemplo",
          fuente: {
            tipo: "chat",
            canal: "Tu negocio",
            mensajes: [
              { de: "cliente", texto: "¿Tienen hueco hoy por la tarde?", hora: "16:02" },
              { de: "agente", texto: "¡Hola! Soy el asistente virtual. Lo reviso y te ayudo.", hora: "16:02" },
            ],
          },
        },
      },
    },
    {
      // 2. Alerta sincronizada con «hasta que empieza a cometer errores».
      id: "alerta",
      seccion: "gancho",
      inicio: { ancla: "hasta que empieza" },
      presentador: "dividida",
      zoom: [{ en: { ancla: "cometer errores" }, escala: 1.08, duracion: 1.2 }],
      capa: { tipo: "alerta", texto: "ERROR", en: { ancla: "cometer errores" } },
      titular: { texto: "HASTA QUE SE EQUIVOCA", destacar: ["equivoca"], colorDestacado: "cian", tamano: 50 },
      contenido: {
        tipo: "pantallas",
        pantallas: [
          {
            titulo: "Asistente · ejemplo",
            fuente: {
              tipo: "chat",
              canal: "Tu negocio",
              mensajes: [
                { de: "agente", texto: "¡Listo! Te confirmo la cita de hoy a las 18:00 ✅", hora: "16:03" },
                { de: "estado", texto: "Ese hueco no estaba libre" },
              ],
            },
          },
        ],
      },
    },
    {
      // Pregunta al espectador: avatar solo.
      id: "presta-atencion",
      seccion: "problema",
      inicio: { ancla: "si estás pensando" },
      presentador: "completo",
      zoom: [{ en: { ancla: "tres cosas" }, escala: 1.1, duracion: 1.2 }],
      titular: { texto: "PRESTA ATENCIÓN A ESTAS TRES COSAS", destacar: ["tres"], colorDestacado: "cian", sincronizar: true, tamano: 86 },
    },
    {
      // Error 1: titular grande con el avatar solo.
      id: "error-1",
      seccion: "solucion1",
      inicio: { ancla: "1" },
      presentador: "completo",
      zoom: [{ en: 0.05, escala: 1.12, duracion: 1 }],
      titular: { texto: "1. INFORMACIÓN INCORRECTA", destacar: ["1", "incorrecta"], colorDestacado: "cian", sincronizar: true, tamano: 92 },
    },
    {
      id: "error-1-ejemplo",
      seccion: "solucion1",
      inicio: { ancla: "si no configuras" },
      presentador: "dividida",
      titular: { texto: "1 · INFORMACIÓN INCORRECTA", destacar: ["incorrecta"], colorDestacado: "cian", tamano: 48 },
      contenido: {
        tipo: "imagenYPantalla",
        imagen: "medios/ia-local-cerrado.jpg",
        credito: "Imagen generada con IA",
        etiqueta: "DOMINGO · CERRADO",
        derecha: {
          tipo: "pantalla",
          titulo: "Asistente sin configurar · ejemplo",
          fuente: {
            tipo: "chat",
            canal: "Tu negocio",
            mensajes: [
              { de: "cliente", texto: "¿Abren los domingos?", hora: "11:20" },
              { de: "agente", texto: "¡Claro! Abrimos todos los domingos.", hora: "11:20" },
              { de: "estado", texto: "Horario que no es real" },
            ],
          },
        },
      },
    },
    {
      // Error 2: titular grande con el avatar solo.
      id: "error-2",
      seccion: "solucion2",
      inicio: { ancla: "2" },
      presentador: "completo",
      zoom: [{ en: 0.05, escala: 1.12, duracion: 1 }],
      titular: { texto: "2. PROMESAS QUE NO PUEDE CUMPLIR", destacar: ["2", "promesas"], colorDestacado: "cian", sincronizar: true, tamano: 86 },
    },
    {
      id: "error-2-ejemplo",
      seccion: "solucion2",
      inicio: { ancla: "por ejemplo" },
      presentador: "dividida",
      titular: { texto: "2 · RESERVA SIN COMPROBAR", destacar: ["comprobar"], colorDestacado: "cian", tamano: 48 },
      contenido: {
        tipo: "imagenYPantalla",
        imagen: "medios/ia-doble-reserva.jpg",
        credito: "Imagen generada con IA",
        etiqueta: "MISMA HORA",
        derecha: {
          tipo: "pantalla",
          titulo: "Calendario · ejemplo",
          fuente: {
            tipo: "calendario",
            dia: "Hoy",
            huecos: [
              { hora: "17:00", texto: "Ocupado" },
              { hora: "18:00", texto: "Ocupado" },
              { hora: "18:00", texto: "Doble reserva", conflicto: true },
            ],
          },
        },
      },
    },
    {
      // Error 3: titular grande con el avatar solo.
      id: "error-3",
      seccion: "automatizacion",
      inicio: { ancla: "3" },
      presentador: "completo",
      zoom: [{ en: 0.05, escala: 1.12, duracion: 1 }],
      titular: { texto: "3. FALTA DE CONTROL", destacar: ["3", "control"], colorDestacado: "cian", sincronizar: true, tamano: 96 },
    },
    {
      id: "error-3-ejemplo",
      seccion: "automatizacion",
      inicio: { ancla: "tu asistente debe" },
      presentador: "dividida",
      titular: { texto: "3 · PASAR A UNA PERSONA", destacar: ["persona"], colorDestacado: "cian", tamano: 48 },
      contenido: {
        tipo: "imagenYPantalla",
        imagen: "medios/ia-equipo-atiende.jpg",
        credito: "Imagen generada con IA",
        etiqueta: "UNA PERSONA SIGUE",
        derecha: {
          tipo: "flujo",
          nodos: [
            { icono: "whatsapp", titulo: "Caso delicado", detalle: "Queja o algo fuera de lo normal" },
            { icono: "alerta", titulo: "El asistente se detiene", detalle: "No improvisa" },
            { icono: "usuario", titulo: "Pasa a una persona", detalle: "Tu equipo continúa" },
          ],
        },
      },
    },
    {
      // Conclusión (opinión): avatar solo.
      id: "conclusion",
      seccion: "sistema",
      inicio: { ancla: "la ia puede ayudarte" },
      presentador: "completo",
      zoom: [{ en: { ancla: "muchísimo" }, escala: 1.08, duracion: 1.2 }],
    },
    {
      // Lo que necesita, cada punto cuando la voz lo dice.
      id: "lo-que-necesita",
      seccion: "sistema",
      inicio: { ancla: "pero necesita" },
      presentador: "dividida",
      titular: { texto: "LO QUE NECESITA", destacar: ["necesita"], colorDestacado: "cian", tamano: 48 },
      contenido: {
        tipo: "lista",
        items: [
          { texto: "Información correcta", icono: "check", en: { ancla: "información correcta" } },
          { texto: "Límites claros", icono: "alerta", en: { ancla: "límites claros" } },
          { texto: "Supervisión", icono: "usuario", en: { ancla: "supervisión" } },
        ],
      },
    },
    {
      // Presentación: avatar solo con el rótulo.
      id: "presentacion",
      seccion: "cta",
      inicio: { ancla: "soy luis flores" },
      presentador: "completo",
      contenido: { tipo: "presentacion", nombre: "LUIS FLORES", linea: "IA · WEB · AUTOMATIZACIÓN", web: "soyluisflores.es" },
    },
    {
      // Pregunta: avatar solo.
      id: "quieres-guia",
      seccion: "cta",
      inicio: { ancla: "quieres una guía" },
      presentador: "completo",
      zoom: [{ en: { ancla: "guía" }, escala: 1.1, duracion: 1 }],
    },
    {
      // Cierre: SÍGUEME + COMENTA GUÍA.
      id: "cta",
      seccion: "cta",
      inicio: { ancla: "sígueme" },
      presentador: "dividida",
      subtitulos: false,
      contenido: { tipo: "cta" },
    },
  ],
};

/** Portada: el avatar con el titular «3 ERRORES AL USAR IA EN TU NEGOCIO», sin subtítulos. */
export const erroresIaPortada: ConfigVideo = {
  ...erroresIa,
  id: "errores-ia-portada",
  sinSubtitulos: true,
  aviso: undefined,
  musica: null,
  sonidoTransiciones: false,
  duracion: 4,
  escenas: [
    {
      id: "portada",
      seccion: "gancho",
      inicio: 0,
      presentador: "completo",
      titular: { texto: "3 ERRORES AL USAR IA EN TU NEGOCIO", destacar: ["3", "errores"], colorDestacado: "cian", tamano: 100 },
    },
  ],
};
