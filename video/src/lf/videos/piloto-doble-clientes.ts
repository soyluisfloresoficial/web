/**
 * Piloto: «¿Podrías atender el doble de clientes?» (13/11/2026).
 *
 * Avatar de HeyGen de 56,5 s. Las escenas están ancladas a frases de la voz,
 * así que si se regenera el avatar con otro ritmo basta con volver a
 * transcribir (herramientas/transcribir.py) y todo se recoloca.
 *
 * Todo lo que sale en pantalla es ilustrativo: no hay clientes, cifras ni
 * resultados reales. El único número (8 h → 24 h) compara una jornada de
 * ejemplo con un asistente disponible todo el día, y lo dice en la nota.
 */
import type { Caption } from "@remotion/captions";
import type { ConfigVideo } from "../tipos";
import subtitulos from "./subtitulos/piloto-doble-clientes.json";

export const pilotoDobleClientes: ConfigVideo = {
  id: "piloto-doble-clientes",
  titulo: "¿Podrías atender el doble de clientes?",
  avatar: "medios/avatar-piloto.mp4",
  subtitulos: subtitulos as Caption[],
  duracion: "auto",
  musica: null, // PENDIENTE: música con licencia en publico/medios/
  sonidoTransiciones: true,
  aviso: "Ejemplo ilustrativo",
  cta: {
    accion: "Comenta",
    palabra: "GUÍA",
    etiquetaRecurso: "GUÍA GRATIS",
    numeroRecurso: "7",
    recurso: "formas prácticas de aplicar IA en tu negocio",
    entrega: "Te llega por mensaje directo",
    usuario: "@soyluisfloresoficial",
    momentos: { seguir: "sígueme", comentar: "comenta", recurso: "te comparto" },
  },
  escenas: [
    {
      id: "gancho",
      seccion: "gancho",
      inicio: 0,
      presentador: "completo",
      zoom: [{ en: 0.1, escala: 1.14, duracion: 1.8 }],
      // Gancho visual: llegan mensajes de noche y se quedan sin responder.
      capa: {
        tipo: "notificaciones",
        avisos: [
          { remitente: "Nuevo mensaje", texto: "¿Tienen cita mañana?", hora: "23:41" },
          { remitente: "Nuevo mensaje", texto: "Hola, quiero información", hora: "23:47" },
          { remitente: "Nuevo mensaje", texto: "¿Siguen atendiendo?", hora: "23:52" },
          { remitente: "Nuevo mensaje", texto: "¿Me pueden escribir?", hora: "00:06" },
        ],
        sello: "Sin responder",
        selloEn: { ancla: "clientes" },
      },
      titular: { texto: "¿Podrías atender el doble de clientes?", destacar: ["doble"], tamano: 96 },
      subtitulos: false,
    },
    {
      id: "duda",
      seccion: "problema",
      inicio: { ancla: "y probablemente" },
      presentador: "completo",
      zoom: [{ en: { ancla: "dando cuenta" }, escala: 1.08, duracion: 1 }],
    },
    {
      id: "mensaje-sin-respuesta",
      seccion: "problema",
      inicio: { ancla: "son las once" },
      presentador: "superior",
      entrada: "deslizar",
      contenido: {
        tipo: "pantallas",
        pantallas: [
          {
            titulo: "Mensajes · 23:04",
            fuente: {
              tipo: "chat",
              canal: "Tu negocio",
              mensajes: [
                { de: "cliente", texto: "Hola, ¿tienen disponibilidad esta semana? Quiero pedir información.", hora: "23:04" },
                { de: "estado", texto: "Sin respuesta" },
              ],
            },
          },
        ],
      },
    },
    {
      id: "cuanto-espera",
      seccion: "problema",
      inicio: { ancla: "y aquí viene" },
      presentador: "completo",
      zoom: [{ en: { ancla: "cuánto tiempo" }, escala: 1.15, duracion: 2 }],
      titular: { texto: "¿Cuánto va a esperar?", destacar: ["esperar"], sincronizar: true },
    },
    {
      id: "responde-el-asistente",
      seccion: "solucion1",
      inicio: { ancla: "ahora imagina" },
      presentador: "superior",
      entrada: "mascara",
      contenido: {
        tipo: "pantallas",
        pantallas: [
          {
            titulo: "Mensajes · 23:04",
            fuente: {
              tipo: "chat",
              canal: "Tu negocio",
              mensajes: [
                { de: "cliente", texto: "Hola, ¿tienen disponibilidad esta semana?", hora: "23:04" },
                { de: "agente", texto: "¡Hola! Soy el asistente virtual. Te cuento los servicios y te ayudo a pedir cita ahora mismo.", hora: "23:04" },
              ],
            },
          },
        ],
      },
    },
    {
      id: "pide-cita",
      seccion: "solucion2",
      inicio: { ancla: "un asistente que puede" },
      presentador: "burbuja",
      contenido: {
        tipo: "pantallas",
        inclinacion: 12,
        pantallas: [
          {
            titulo: "Solicitar cita",
            fuente: {
              tipo: "formulario",
              titulo: "Pide tu cita",
              campos: [
                { etiqueta: "Servicio", valor: "Primera consulta" },
                { etiqueta: "Día", valor: "Jueves · 10:00" },
              ],
              boton: "Solicitar cita",
            },
            cursor: { puntos: [{ x: 82, y: 14 }, { x: 62, y: 52 }, { x: 50, y: 84 }], desde: 1.1, duracion: 1.4, resalte: { ancho: 790, alto: 72 } },
          },
          {
            titulo: "Agenda",
            retraso: 2.7,
            fuente: {
              tipo: "calendario",
              dia: "Jueves",
              huecos: [
                { hora: "09:00", texto: "Ocupado" },
                { hora: "10:00", texto: "Nueva cita · Primera consulta", nuevo: true },
                { hora: "11:00" },
                { hora: "12:00", texto: "Ocupado" },
              ],
            },
          },
        ],
      },
    },
    {
      id: "deriva-a-tu-equipo",
      seccion: "automatizacion",
      inicio: { ancla: "incluso" },
      presentador: "burbuja",
      contenido: {
        tipo: "flujo",
        titulo: "Así funciona fuera de horario",
        nodos: [
          { icono: "whatsapp", titulo: "Llega un mensaje", detalle: "Con el negocio cerrado" },
          { icono: "agente", titulo: "Responde el asistente", detalle: "Explica servicios y propone cita" },
          { icono: "alerta", titulo: "¿Caso especial?", detalle: "No improvisa: lo deriva" },
          { icono: "usuario", titulo: "Tu equipo", detalle: "Recibe el aviso y continúa" },
        ],
      },
    },
    {
      id: "no-sustituye",
      seccion: "automatizacion",
      inicio: { ancla: "esto no significa" },
      presentador: "burbuja",
      contenido: {
        tipo: "antesDespues",
        antes: { titulo: "Sustituir a tu equipo", puntos: ["Todo en manos de la IA", "Nadie revisa los casos raros"] },
        despues: { titulo: "Trabajar con tu equipo", puntos: ["La IA atiende lo repetitivo", "Tu equipo, lo que pide criterio"] },
      },
    },
    {
      id: "atencion-todo-el-dia",
      seccion: "automatizacion",
      inicio: { ancla: "mientras tú" },
      presentador: "superior",
      contenido: {
        tipo: "contador",
        etiqueta: "Horas de atención al día",
        desde: 8,
        hasta: 24,
        sufijo: " h",
        nota: "Ejemplo: jornada de 8 h frente a un asistente disponible todo el día",
      },
    },
    {
      id: "sistema",
      seccion: "sistema",
      inicio: { ancla: "porque la inteligencia" },
      presentador: "burbuja",
      titular: { texto: "Sistemas que trabajen contigo", destacar: ["contigo"], sincronizar: true, tamano: 64 },
      contenido: {
        tipo: "sistema",
        nodos: [
          { icono: "whatsapp", titulo: "Mensajes" },
          { icono: "formulario", titulo: "Tu web" },
          { icono: "calendario", titulo: "Agenda" },
          { icono: "crm", titulo: "CRM" },
          { icono: "usuario", titulo: "Tu equipo" },
        ],
      },
    },
    {
      id: "pregunta-final",
      seccion: "sistema",
      inicio: { ancla: "y ahora dime" },
      presentador: "completo",
      zoom: [{ en: { ancla: "preparado" }, escala: 1.14, duracion: 2.2 }],
      titular: { texto: "¿Preparado para atender fuera de horario?", destacar: ["horario?"], sincronizar: true, tamano: 84 },
    },
    {
      id: "cta",
      seccion: "cta",
      inicio: { ancla: "sígueme" },
      presentador: "burbuja",
      subtitulos: false,
      contenido: { tipo: "cta" },
    },
  ],
};
