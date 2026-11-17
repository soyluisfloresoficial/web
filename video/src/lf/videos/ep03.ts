/**
 * SOYLUISFLORES · Episodio 03 «Un formulario. Cinco tareas automáticas.» (17/11/2026)
 *
 * Avatar de HeyGen de 40,5 s (720×1280, 25 fps). Los tiempos salen de la voz real
 * transcrita (subtitulos/ep03.json). La explicación es la protagonista; el avatar
 * sale en el gancho, en el cambio de intención («aquí viene lo importante»), en la
 * pregunta y en el cierre. La demo es ficticia (DEMO + «datos ficticios»).
 * CTA: «Comenta FLUJO» → plantilla «Diseña tu primera automatización en 5 pasos».
 */
import type { Caption } from "@remotion/captions";
import type { ConfigVideo } from "../tipos";
import subtitulos from "./subtitulos/ep03.json";

const NODOS_MINI = [
  { icono: "crm" as const, titulo: "CRM" },
  { icono: "regla" as const, titulo: "Clasificar" },
  { icono: "tarea" as const, titulo: "Tarea" },
  { icono: "correo" as const, titulo: "Confirmación" },
  { icono: "registro" as const, titulo: "Seguimiento" },
];

export const ep03: ConfigVideo = {
  id: "ep03",
  titulo: "Un formulario. Cinco tareas automáticas.",
  avatar: "medios/avatar-ep03.mp4",
  subtitulos: subtitulos as Caption[],
  duracion: "auto",
  musica: { archivo: "medios/musica-ep03.wav", volumen: 0.08 },
  sonidoTransiciones: true,
  sonidoZoom: false,
  cortes: "secos",
  aviso: "Ejemplo ilustrativo · datos ficticios",
  marca: { firma: true },
  estiloSubtitulos: {
    maxCaracteres: 26,
    tamano: 56,
    claves: ["formulario", "crm", "proceso", "flujo", "plantilla"],
  },
  cta: {
    estilo: "comentar-recurso",
    accion: "COMENTA",
    palabra: "FLUJO",
    etiquetaRecurso: "PLANTILLA GRATIS",
    recurso: "Diseña tu primera automatización en 5 pasos",
    usuario: "@soyluisfloresoficial",
    web: "soyluisflores.es",
    momentos: { seguir: "escribe flujo", comentar: "escribe flujo" },
  },
  escenas: [
    {
      // Gancho: avatar a cámara (65 %), acercamiento lento y vista previa del flujo arriba.
      id: "gancho",
      seccion: "gancho",
      inicio: 0,
      presentador: "dividida",
      acercamiento: 1.05,
      titular: { texto: "5 TAREAS SIN IA", destacar: ["5"], colorDestacado: "cian", tamano: 72, grande: true },
      contenido: { tipo: "flujoMini", nodos: NODOS_MINI },
    },
    {
      // DEMO: formulario → cinco nodos, cada uno cuando la voz lo nombra.
      id: "demo",
      seccion: "solucion1",
      inicio: { ancla: "imagina que" },
      presentador: "oculto",
      fondo: { archivo: "medios/foto-consulta-ia.jpg", credito: "Foto: Direct Media · StockSnap · CC0", movimiento: "acercar" },
      sonidos: [
        { en: { ancla: "de tu negocio", ajuste: 0.4 }, archivo: "sfx/pop.wav", volumen: 0.3 },
        { en: { ancla: "primero" }, archivo: "sfx/clic.wav", volumen: 0.28 },
        { en: { ancla: "segundo" }, archivo: "sfx/clic.wav", volumen: 0.28 },
        { en: { ancla: "tercero" }, archivo: "sfx/clic.wav", volumen: 0.28 },
        { en: { ancla: "cuarto" }, archivo: "sfx/clic.wav", volumen: 0.28 },
        { en: { ancla: "quinto" }, archivo: "sfx/clic.wav", volumen: 0.28 },
      ],
      contenido: {
        tipo: "flujoFormulario",
        titulo: "Solicitud de información",
        campos: [
          { etiqueta: "Nombre", valor: "Ana Ruiz" },
          { etiqueta: "Correo", valor: "ana@ejemplo.com" },
          { etiqueta: "Interés", valor: "Presupuesto" },
          { etiqueta: "Mensaje", valor: "Quiero información" },
        ],
        boton: "Enviar",
        enviar: { ancla: "de tu negocio", ajuste: 0.4 },
        nodos: [
          { icono: "crm", titulo: "Contacto en el CRM", detalle: "Ana Ruiz · creado o actualizado", en: { ancla: "primero" } },
          { icono: "regla", titulo: "Clasificación por regla", detalle: "Interés = Presupuesto → prioridad alta", en: { ancla: "segundo" } },
          { icono: "tarea", titulo: "Tarea al responsable", detalle: "Llamar a Ana · equipo comercial · hoy", en: { ancla: "tercero" } },
          { icono: "correo", titulo: "Confirmación al cliente", detalle: "«Recibimos tu solicitud»", en: { ancla: "cuarto" } },
          { icono: "registro", titulo: "Seguimiento registrado", detalle: "Solicitud → tarea → respuesta", en: { ancla: "quinto" } },
        ],
      },
    },
    {
      // Cambio de intención: vuelve el avatar.
      id: "todo-empieza",
      seccion: "solucion2",
      inicio: { ancla: "todo empieza" },
      presentador: "completo",
      titular: { texto: "TODO EMPIEZA CON UN SOLO FORMULARIO", destacar: ["formulario"], colorDestacado: "cian", sincronizar: true, tamano: 78 },
    },
    {
      // Revelación: automatización ≠ siempre IA.
      id: "revelacion",
      seccion: "sistema",
      inicio: { ancla: "no necesitas" },
      presentador: "oculto",
      titular: { texto: "AUTOMATIZACIÓN ≠ SIEMPRE IA", destacar: ["ia"], colorDestacado: "cian", tamano: 84 },
      contenido: {
        tipo: "lista",
        items: [
          { texto: "Reglas definidas", icono: "regla", en: { ancla: "inteligencia artificial para" } },
          { texto: "Formularios", icono: "formulario", en: { ancla: "conectar" } },
          { texto: "Integraciones configuradas", icono: "crm", en: { ancla: "estas tareas" } },
        ],
      },
    },
    {
      id: "proceso",
      seccion: "sistema",
      inicio: { ancla: "lo que necesitas" },
      presentador: "completo",
      titular: { texto: "UN PROCESO BIEN DISEÑADO", destacar: ["proceso"], colorDestacado: "cian", sincronizar: true, tamano: 84 },
    },
    {
      // Pregunta directa: avatar solo.
      id: "pregunta",
      seccion: "cta",
      inicio: { ancla: "quieres aprender" },
      presentador: "completo",
      titular: { texto: "¿QUIERES APRENDER A ORGANIZAR UNO?", destacar: ["organizar"], colorDestacado: "cian", sincronizar: true, tamano: 78 },
    },
    {
      // Cierre: PLANTILLA GRATIS · COMENTA FLUJO (sin pedir seguir).
      id: "cta",
      seccion: "cta",
      inicio: { ancla: "escribe flujo" },
      presentador: "dividida",
      subtitulos: false,
      contenido: { tipo: "cta" },
    },
  ],
};

/** Variante LinkedIn y Facebook: la firma muestra la web. */
export const ep03Web: ConfigVideo = { ...ep03, id: "ep03-web", cta: { ...ep03.cta, usuario: "soyluisflores.es" } };

/** Portada: tema y vista previa del flujo, todo dentro del recorte 3:4. */
export const ep03Portada: ConfigVideo = {
  ...ep03,
  id: "ep03-portada",
  marca: { firma: true },
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
      presentador: "oculto",
      fondo: { archivo: "medios/foto-consulta-ia.jpg", movimiento: "acercar" },
      titular: { texto: "UN FORMULARIO. 5 TAREAS SIN IA", destacar: ["5", "tareas"], colorDestacado: "cian", tamano: 112 },
      contenido: { tipo: "flujoMini", nodos: NODOS_MINI },
    },
  ],
};
