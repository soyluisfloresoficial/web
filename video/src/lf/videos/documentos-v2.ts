/**
 * Episodio 01 · V2 (16/11/2026). Copia optimizada de documentos.ts (la V1 no se toca).
 * Cambios: CTA «Comenta DOCUMENTOS» (checklist), demo con visor y zoom sobre
 * pregunta, respuesta y fuentes, documentos que se agrupan al decir «documentos»,
 * cortes secos entre avatar y explicación, menos texto y menos efectos.
 * Variantes de firma: @soyluisfloresoficial (Instagram y TikTok) y la web (resto).
 */
import type { Caption } from "@remotion/captions";
import type { ConfigVideo } from "../tipos";
import subtitulos from "./subtitulos/documentos.json";

export const documentosV2: ConfigVideo = {
  id: "documentos-v2",
  titulo: "La IA puede consultar tus documentos",
  avatar: "medios/avatar-documentos.mp4",
  subtitulos: subtitulos as Caption[],
  duracion: "auto",
  musica: { archivo: "medios/musica-documentos.wav", volumen: 0.09 },
  sonidoTransiciones: true,
  aviso: "Ejemplo ilustrativo",
  marca: { firma: true },
  cortes: "secos",
  estiloSubtitulos: {
    maxCaracteres: 26,
    tamano: 56,
    claves: ["documentos", "contratos", "manuales", "procedimientos", "carpetas", "inteligencia", "artificial", "ia", "cancelación", "fragmentos", "respuesta", "documento", "autorizados", "verificación", "aplicaciones"],
  },
  cta: {
    estilo: "comentar-recurso",
    accion: "COMENTA",
    palabra: "DOCUMENTOS",
    recurso: "y consigue una checklist gratuita para organizar tus archivos",
    usuario: "@soyluisfloresoficial",
    web: "soyluisflores.es",
    momentos: { seguir: "soy luis flores", comentar: "soy luis flores" },
  },
  escenas: [
    {
      // Gancho: el avatar, con movimiento desde el primer fotograma (momento clave 1).
      id: "gancho",
      seccion: "gancho",
      inicio: 0,
      presentador: "completo",
      zoom: [{ en: 0, escala: 1.08, duracion: 0.8 }],
      titular: { texto: "¿Y SI PUDIERAS HACERLE PREGUNTAS A TUS DOCUMENTOS?", destacar: ["preguntas", "documentos"], colorDestacado: "cian", sincronizar: true, tamano: 78 },
    },
    {
      // Explicación a pantalla completa: pilas reales de archivos.
      id: "carpetas",
      seccion: "problema",
      inicio: { ancla: "imagina tener" },
      presentador: "oculto",
      fondo: { archivo: "medios/foto-pilas-archivos.jpg", credito: "Foto: rawpixel · CC0", movimiento: "acercar" },
      titular: { texto: "CIENTOS DE DOCUMENTOS", destacar: ["documentos"], colorDestacado: "cian", tamano: 84 },
      contenido: {
        tipo: "lista",
        items: [
          { texto: "Contratos", icono: "formulario", en: { ancla: "contratos" } },
          { texto: "Manuales", icono: "formulario", en: { ancla: "manuales" } },
          { texto: "Procedimientos", icono: "formulario", en: { ancla: "procedimientos" } },
        ],
      },
    },
    {
      id: "buscar-a-mano",
      seccion: "problema",
      inicio: { ancla: "ahora necesitas" },
      presentador: "oculto",
      fondo: { archivo: "medios/foto-busqueda-agobio.jpg", credito: "Foto: rawpixel · CC0", movimiento: "alejar" },
      titular: { texto: "BUSCAR UNA SOLA CONDICIÓN", destacar: ["condición"], colorDestacado: "cian", tamano: 84 },
    },
    {
      // Pregunta directa al espectador (momento clave 2).
      id: "uno-por-uno",
      seccion: "problema",
      inicio: { ancla: "vas a abrir" },
      presentador: "completo",
      zoom: [{ en: { ancla: "uno por uno" }, escala: 1.12, duracion: 1 }],
      titular: { texto: "¿VAS A ABRIR LOS ARCHIVOS UNO POR UNO?", destacar: ["uno"], colorDestacado: "cian", sincronizar: true, tamano: 80 },
    },
    {
      // DEMO a pantalla completa, la cámara va a cada fase.
      id: "demo",
      seccion: "solucion1",
      inicio: { ancla: "con un sistema" },
      presentador: "oculto",
      sonidos: [
        { en: { ancla: "busca los fragmentos" }, archivo: "sfx/whoosh.wav", volumen: 0.25 },
        { en: { ancla: "prepara una respuesta" }, archivo: "sfx/pop.wav", volumen: 0.35 },
        { en: { ancla: "mostrarte exactamente" }, archivo: "sfx/clic.wav", volumen: 0.4 },
      ],
      contenido: {
        tipo: "buscadorDocs",
        documentos: ["Contrato_A.pdf", "Manual_Ventas.pdf", "Contrato_B.pdf", "Politica_Cancelacion.pdf", "Manual_Equipo.pdf"],
        pregunta: "¿Qué condiciones de cancelación aparecen en nuestros contratos?",
        resaltar: [2, 3],
        respuesta: "Piden aviso previo por escrito y remiten a la política de cancelación.",
        citas: [
          { doc: 2, ref: "pág. 4" },
          { doc: 3, ref: "pág. 2" },
        ],
        zoomVisor: true,
        momentos: {
          agrupar: { ancla: "tus documentos" },
          pregunta: { ancla: "qué condiciones" },
          busca: { ancla: "busca los fragmentos" },
          respuesta: { ancla: "prepara una respuesta" },
          citas: { ancla: "mostrarte exactamente" },
        },
      },
    },
    {
      // Cómo funciona: búsqueda + IA = respuesta con fuente.
      id: "tecnologia",
      seccion: "solucion2",
      inicio: { ancla: "no es magia" },
      presentador: "oculto",
      titular: { texto: "BÚSQUEDA + IA", destacar: ["ia"], colorDestacado: "cian", tamano: 96 },
      contenido: {
        tipo: "flujo",
        nodos: [
          { icono: "formulario", titulo: "Búsqueda" },
          { icono: "agente", titulo: "Inteligencia artificial" },
          { icono: "check", titulo: "Respuesta con fuente" },
        ],
      },
    },
    {
      id: "cautela",
      seccion: "sistema",
      inicio: { ancla: "eso sí" },
      presentador: "oculto",
      fondo: { archivo: "medios/foto-verificacion.jpg", credito: "Foto: rawpixel · CC0", movimiento: "acercar" },
      titular: { texto: "ANTES DE USARLO", destacar: ["antes"], colorDestacado: "cian", tamano: 84 },
      contenido: {
        tipo: "lista",
        items: [
          { texto: "Documentos autorizados", icono: "check", en: { ancla: "autorizados" } },
          { texto: "Verificar lo importante", icono: "usuario", en: { ancla: "verificación" } },
        ],
      },
    },
    {
      // Vuelta al avatar para el cierre (momento clave 3).
      id: "aplicaciones",
      seccion: "sistema",
      inicio: { ancla: "y esto es solo" },
      presentador: "completo",
      titular: { texto: "SOLO UNA DE LAS APLICACIONES", destacar: ["aplicaciones"], colorDestacado: "cian", sincronizar: true, tamano: 80 },
    },
    {
      id: "cta",
      seccion: "cta",
      inicio: { ancla: "soy luis flores" },
      presentador: "dividida",
      subtitulos: false,
      contenido: { tipo: "cta" },
    },
  ],
};

/** Portada: avatar con el titular, sin subtítulos ni capa de marca. */
export const documentosV2Portada: ConfigVideo = {
  ...documentosV2,
  id: "documentos-v2-portada",
  sinSubtitulos: true,
  aviso: undefined,
  musica: null,
  sonidoTransiciones: false,
  duracion: 4,
  escenas: [
    {
      // Portada centrada en el tema; todo dentro del recorte 3:4 de la cuadrícula (y 240–1680).
      id: "portada",
      seccion: "gancho",
      inicio: 0,
      presentador: "oculto",
      fondo: { archivo: "medios/foto-pilas-archivos.jpg", movimiento: "acercar" },
      titular: { texto: "LA IA CONSULTA TUS DOCUMENTOS", destacar: ["documentos"], colorDestacado: "cian", tamano: 118 },
      contenido: {
        tipo: "lista",
        items: [{ texto: "Respuestas con la fuente citada", icono: "check" }],
      },
    },
  ],
};

/** Variante para LinkedIn, Facebook y WhatsApp: la firma muestra la web (el @ de Instagram no es el mismo en LinkedIn). */
export const documentosV2Web: ConfigVideo = {
  ...documentosV2,
  id: "documentos-v2-web",
  cta: { ...documentosV2.cta, usuario: "soyluisflores.es" },
};
