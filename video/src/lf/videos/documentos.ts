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
      // Gancho: avatar solo y titular corto.
      id: "gancho",
      seccion: "gancho",
      inicio: 0,
      presentador: "completo",
      zoom: [{ en: { ancla: "documentos de tu empresa" }, escala: 1.1, duracion: 1.2 }],
      titular: { texto: "¿Y SI PUDIERAS HACERLE PREGUNTAS A TUS DOCUMENTOS?", destacar: ["preguntas", "documentos"], colorDestacado: "cian", sincronizar: true, tamano: 78 },
    },
    {
      // «cientos de contratos, manuales y procedimientos… en diferentes carpetas»
      id: "carpetas",
      seccion: "problema",
      inicio: { ancla: "imagina tener" },
      presentador: "dividida",
      titular: { texto: "CIENTOS DE DOCUMENTOS", destacar: ["documentos"], colorDestacado: "cian", tamano: 48 },
      contenido: {
        tipo: "imagenYPantalla",
        imagen: "medios/foto-pilas-archivos.jpg",
        credito: "Foto: rawpixel · CC0",
        etiqueta: "EN CARPETAS",
        derecha: {
          tipo: "flujo",
          nodos: [
            { icono: "formulario", titulo: "Contratos", detalle: "Carpeta 1" },
            { icono: "formulario", titulo: "Manuales", detalle: "Carpeta 2" },
            { icono: "formulario", titulo: "Procedimientos", detalle: "Carpeta 3" },
          ],
        },
      },
    },
    {
      // «Ahora necesitas encontrar una condición específica»
      id: "buscar-a-mano",
      seccion: "problema",
      inicio: { ancla: "ahora necesitas" },
      presentador: "dividida",
      titular: { texto: "UNA CONDICIÓN ESPECÍFICA", destacar: ["específica"], colorDestacado: "cian", tamano: 48 },
      contenido: { tipo: "imagen", archivo: "medios/foto-busqueda-agobio.jpg", credito: "Foto: rawpixel · CC0", movimiento: "acercar", etiqueta: "BUSCANDO A MANO" },
    },
    {
      // Pregunta al espectador: avatar solo.
      id: "uno-por-uno",
      seccion: "problema",
      inicio: { ancla: "vas a abrir" },
      presentador: "completo",
      zoom: [{ en: { ancla: "uno por uno" }, escala: 1.1, duracion: 1 }],
      titular: { texto: "¿VAS A ABRIR LOS ARCHIVOS UNO POR UNO?", destacar: ["uno"], colorDestacado: "cian", sincronizar: true, tamano: 80 },
    },
    {
      // «Con un sistema de inteligencia artificial conectado a tus documentos»
      id: "sistema",
      seccion: "solucion1",
      inicio: { ancla: "con un sistema" },
      presentador: "dividida",
      titular: { texto: "IA CONECTADA A TUS DOCUMENTOS", destacar: ["ia"], colorDestacado: "cian", tamano: 48 },
      contenido: {
        tipo: "imagenYPantalla",
        imagen: "medios/foto-consulta-ia.jpg",
        credito: "Foto: Direct Media · StockSnap · CC0",
        etiqueta: "UNA PREGUNTA",
        derecha: {
          tipo: "flujo",
          nodos: [
            { icono: "formulario", titulo: "Tus documentos", detalle: "Solo los autorizados" },
            { icono: "agente", titulo: "Sistema de IA", detalle: "Busca y redacta" },
            { icono: "usuario", titulo: "Tu pregunta", detalle: "En lenguaje normal" },
          ],
        },
      },
    },
    {
      // DEMO: pregunta → búsqueda → respuesta con citas.
      id: "demo",
      seccion: "solucion1",
      inicio: { ancla: "puedes preguntar" },
      presentador: "dividida",
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
      // Opinión: avatar solo con titular sincronizado.
      id: "tecnologia",
      seccion: "solucion2",
      inicio: { ancla: "no es magia" },
      presentador: "completo",
      zoom: [{ en: { ancla: "búsqueda de información" }, escala: 1.08, duracion: 1.2 }],
      titular: { texto: "BÚSQUEDA DE INFORMACIÓN CON INTELIGENCIA ARTIFICIAL", destacar: ["búsqueda", "inteligencia", "artificial"], colorDestacado: "cian", sincronizar: true, tamano: 76 },
    },
    {
      // Cautela: documentos autorizados y verificación.
      id: "cautela",
      seccion: "sistema",
      inicio: { ancla: "eso sí" },
      presentador: "dividida",
      titular: { texto: "ANTES DE USARLO", destacar: ["antes"], colorDestacado: "cian", tamano: 48 },
      contenido: {
        tipo: "imagenYPantalla",
        imagen: "medios/foto-verificacion.jpg",
        credito: "Foto: rawpixel · CC0",
        etiqueta: "VERIFICAR",
        derecha: {
          tipo: "flujo",
          nodos: [
            { icono: "check", titulo: "Documentos autorizados", detalle: "Solo lo que se puede consultar" },
            { icono: "usuario", titulo: "Verificación", detalle: "Una persona revisa lo importante" },
          ],
        },
      },
    },
    {
      // Vuelta al avatar: «solo una de las aplicaciones».
      id: "aplicaciones",
      seccion: "sistema",
      inicio: { ancla: "y esto es solo" },
      presentador: "completo",
      zoom: [{ en: { ancla: "aplicaciones" }, escala: 1.08, duracion: 1 }],
      titular: { texto: "SOLO UNA DE LAS APLICACIONES", destacar: ["aplicaciones"], colorDestacado: "cian", sincronizar: true, tamano: 80 },
    },
    {
      // «Soy Luis Flores, sígueme…»: 4 s de cierre (la presentación sola duraría 1 s).
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
