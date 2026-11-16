/**
 * Reel «La IA puede consultar tus documentos» (16/11/2026) · CTA «Sígueme».
 *
 * Avatar de HeyGen de 43,5 s. La voz real (transcrita) manda sobre el guion:
 * el gancho dice «¿Y si pudieras hacerle preguntas a todos los documentos de
 * tu empresa?» y el cierre pide «sígueme», sin palabra clave DOCUMENTOS.
 * La demo es un ejemplo ilustrativo: nombres de archivo genéricos, sin datos
 * ni clientes reales. Fotos reales CC0 (Openverse: rawpixel y StockSnap).
 */
import type { Caption } from "@remotion/captions";
import type { ConfigVideo } from "../tipos";
import subtitulos from "./subtitulos/documentos.json";

export const documentos: ConfigVideo = {
  id: "documentos",
  titulo: "La IA puede consultar tus documentos",
  avatar: "medios/avatar-documentos.mp4",
  subtitulos: subtitulos as Caption[],
  duracion: "auto",
  musica: { archivo: "medios/musica-documentos.wav", volumen: 0.09 },
  sonidoTransiciones: true,
  aviso: "Ejemplo ilustrativo",
  marca: { firma: true },
  estiloSubtitulos: {
    maxCaracteres: 26,
    tamano: 56,
    claves: ["documentos", "contratos", "manuales", "procedimientos", "carpetas", "inteligencia", "artificial", "ia", "cancelación", "fragmentos", "respuesta", "documento", "autorizados", "verificación", "aplicaciones"],
  },
  cta: {
    estilo: "seguir",
    accion: "SÍGUEME",
    palabra: "",
    recurso: "",
    usuario: "@soyluisfloresoficial",
    web: "soyluisflores.es",
    momentos: { seguir: "soy luis flores" },
  },
  escenas: [
    {
      // Gancho: el avatar, con movimiento desde el primer fotograma (momento clave 1).
      id: "gancho",
      seccion: "gancho",
      inicio: 0,
      presentador: "completo",
      zoom: [{ en: 0, escala: 1.08, duracion: 0.6 }, { en: { ancla: "documentos de tu empresa" }, escala: 1.1, duracion: 1.2 }],
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
      id: "sistema",
      seccion: "solucion1",
      inicio: { ancla: "con un sistema" },
      presentador: "oculto",
      fondo: { archivo: "medios/foto-consulta-ia.jpg", credito: "Foto: Direct Media · StockSnap · CC0", movimiento: "derecha" },
      titular: { texto: "IA CONECTADA A TUS DOCUMENTOS", destacar: ["ia"], colorDestacado: "cian", tamano: 80 },
      contenido: {
        tipo: "flujo",
        nodos: [
          { icono: "formulario", titulo: "Tus documentos", detalle: "Solo los autorizados" },
          { icono: "agente", titulo: "Sistema de IA", detalle: "Busca y redacta" },
          { icono: "usuario", titulo: "Tu pregunta", detalle: "En lenguaje normal" },
        ],
      },
    },
    {
      // DEMO a pantalla completa, la cámara va a cada fase.
      id: "demo",
      seccion: "solucion1",
      inicio: { ancla: "puedes preguntar" },
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
        momentos: {
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
          { icono: "formulario", titulo: "Búsqueda", detalle: "Encuentra los fragmentos" },
          { icono: "agente", titulo: "Inteligencia artificial", detalle: "Redacta la respuesta" },
          { icono: "check", titulo: "Respuesta con fuente", detalle: "Sabes de qué documento sale" },
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
      zoom: [{ en: { ancla: "aplicaciones" }, escala: 1.08, duracion: 1 }],
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
export const documentosPortada: ConfigVideo = {
  ...documentos,
  id: "documentos-portada",
  marca: undefined,
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
      titular: { texto: "LA IA PUEDE CONSULTAR TUS DOCUMENTOS", destacar: ["ia", "documentos"], colorDestacado: "cian", tamano: 100 },
    },
  ],
};
