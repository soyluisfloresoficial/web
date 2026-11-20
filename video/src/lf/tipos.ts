/**
 * Contrato de configuración de un video. Cada video nuevo es un archivo en
 * src/lf/videos/ que exporta un ConfigVideo: guion, escenas, textos y
 * duración se cambian ahí, sin tocar los componentes.
 *
 * Todo es serializable a JSON, así que también se puede pasar con
 * `--props=archivo.json` al renderizar.
 */
import type { Caption } from "@remotion/captions";

/** Las siete partes del timeline base de 60 s. */
export type Seccion = "gancho" | "problema" | "solucion1" | "solucion2" | "automatizacion" | "sistema" | "cta";

/** Timeline base en segundos [inicio, fin]. Se escala a la duración real de la voz. */
export const TIMELINE_BASE: Record<Seccion, readonly [number, number]> = {
  gancho: [0, 3],
  problema: [3, 10],
  solucion1: [10, 20],
  solucion2: [20, 30],
  automatizacion: [30, 42],
  sistema: [42, 52],
  cta: [52, 60],
};

/**
 * Un momento del video: segundos fijos, o anclado a una palabra (o frase
 * corta) de los subtítulos. El ancla se busca a partir del inicio de la
 * escena anterior, así que la escena se mueve sola si la voz cambia.
 */
export type Momento = number | { ancla: string; ajuste?: number };

/** Dónde va el avatar durante la escena. Los cambios se animan solos. */
export type Disposicion = "completo" | "superior" | "dividida" | "burbuja" | "tarjeta" | "oculto";

export type Sonido = {
  /** Archivo dentro de publico/ (por ejemplo "sfx/clic.wav"). */
  archivo: string;
  /** Segundos desde el inicio de la escena, o un ancla de palabra. */
  en: Momento;
  volumen?: number;
};

export type Zoom = {
  en: Momento;
  /** Escala máxima, por defecto 1.12. */
  escala?: number;
  /** Duración total del golpe en segundos (entra, se mantiene y vuelve). */
  duracion?: number;
};

export type Titular = {
  texto: string;
  /** Palabras destacadas (degradado de marca o cian). */
  destacar?: string[];
  colorDestacado?: "degradado" | "cian";
  posicion?: "arriba" | "centro";
  /** Si es true, cada palabra aparece cuando la voz la dice. */
  sincronizar?: boolean;
  tamano?: number;
  /** En pantalla dividida, permite un titular grande (hasta 72 px) en lugar de la línea compacta. */
  grande?: boolean;
};

// ---------------------------------------------------------------- Pantallas
/** Interfaces de ejemplo dibujadas con código (siempre ilustrativas). */
export type PantallaMaqueta =
  | { tipo: "chat"; canal: string; mensajes: { de: "cliente" | "agente" | "estado"; texto: string; hora?: string }[] }
  | { tipo: "formulario"; titulo: string; campos: { etiqueta: string; valor: string }[]; boton: string }
  | { tipo: "crm"; columnas: { titulo: string; tarjetas: string[] }[]; mover?: { tarjeta: string; a: number } }
  | { tipo: "calendario"; dia: string; huecos: { hora: string; texto?: string; nuevo?: boolean; /** Reserva en conflicto (doble reserva). */ conflicto?: boolean }[] }
  | { tipo: "notificacion"; titulo: string; texto: string }
  | { tipo: "web"; negocio: string; lema: string; secciones: string[]; boton: string; /** Foto real de portada (en publico/). */ imagen?: string }
  | { tipo: "pendiente"; descripcion: string };

/** Una pantalla puede ser una maqueta, una imagen o una grabación real. */
export type FuentePantalla = PantallaMaqueta | { tipo: "archivo"; archivo: string };

export type Cursor = {
  /** Puntos en % del ancho/alto de la pantalla (0–100). El último es el clic. */
  puntos: { x: number; y: number }[];
  /** Segundos desde el inicio de la escena. */
  desde?: number;
  duracion?: number;
  clic?: boolean;
  /** Tamaño en px del resaltado tras el clic (por defecto 360 × 84). */
  resalte?: { ancho: number; alto: number };
};

export type NodoFlujo = { titulo: string; detalle?: string; icono: Icono };
export type Icono = "formulario" | "agente" | "crm" | "calendario" | "whatsapp" | "correo" | "alerta" | "check" | "usuario" | "reloj" | "regla" | "tarea" | "registro";

export type Contenido =
  | { tipo: "ninguno" }
  | {
      tipo: "pantallas";
      pantallas: { fuente: FuentePantalla; titulo?: string; cursor?: Cursor; /** Segundos de espera desde el inicio de la escena. */ retraso?: number }[];
      /** Inclinación 3D en grados. */
      inclinacion?: number;
    }
  | { tipo: "flujo"; nodos: NodoFlujo[]; titulo?: string }
  | {
      tipo: "contador";
      etiqueta: string;
      desde: number;
      hasta: number;
      prefijo?: string;
      sufijo?: string;
      nota?: string;
    }
  | {
      tipo: "comparativa";
      titulo?: string;
      filas: { etiqueta: string; antes: number; despues: number; sufijo?: string }[];
      etiquetas?: [string, string];
      nota?: string;
    }
  | {
      tipo: "antesDespues";
      antes: { titulo: string; puntos: string[] };
      despues: { titulo: string; puntos: string[] };
    }
  | { tipo: "sistema"; nodos: NodoFlujo[]; titulo?: string; centro?: NodoFlujo }
  | {
      /** Pantalla dividida: lo presencial a la izquierda, lo digital a la derecha. */
      tipo: "dividida";
      izquierda: { etiqueta: string; imagen?: string };
      derecha: { etiqueta: string; mensajes: string[]; contador?: { etiqueta: string; hasta: number } };
      /** Momento del zoom sobre los mensajes. */
      zoomMensajes?: Momento;
    }
  | { tipo: "revelacion"; titular: string; destacar?: string[] }
  | {
      /**
       * Imagen real (foto propia, de banco o generada con IA) acorde con lo
       * que dice la voz, con movimiento lento de cámara (Ken Burns).
       */
      tipo: "imagen";
      archivo: string;
      /** Autor y fuente, por ejemplo «Foto: Ana Pérez · Pexels». */
      credito?: string;
      /** Hacia dónde se mueve la cámara. */
      movimiento?: "acercar" | "alejar" | "izquierda" | "derecha";
      /** Etiqueta pequeña sobre la imagen, por ejemplo «EN EL LOCAL». */
      etiqueta?: string;
    }
  | { tipo: "presentacion"; nombre: string; linea: string; web: string }
  | {
      /**
       * Imagen real acorde con la voz (izquierda) junto a la interfaz o el
       * flujo que la explica (derecha). Es la combinación preferida en las
       * escenas con gráfica.
       */
      tipo: "imagenYPantalla";
      imagen: string;
      credito?: string;
      etiqueta?: string;
      derecha: { tipo: "pantalla"; fuente: FuentePantalla; titulo?: string } | { tipo: "flujo"; nodos: NodoFlujo[] };
    }
  | {
      /** Lista de puntos que entran uno a uno cuando la voz dice cada uno. */
      tipo: "lista";
      items: { texto: string; icono: Icono; en?: Momento }[];
    }
  | {
      /** Demo «la IA consulta tus documentos»: agrupar, preguntar, buscar, responder y citar. */
      tipo: "buscadorDocs";
      documentos: string[];
      pregunta: string;
      resaltar: number[];
      respuesta: string;
      citas: { doc: number; ref: string }[];
      momentos: { pregunta: Momento; busca: Momento; respuesta: Momento; citas: Momento; agrupar?: Momento };
      /** Zoom de cámara dentro de un visor sobre la pregunta, la respuesta y las fuentes. */
      zoomVisor?: boolean;
    }
  | {
      /** DEMO: formulario que se rellena y activa cinco nodos (datos ficticios). */
      tipo: "flujoFormulario";
      titulo: string;
      campos: { etiqueta: string; valor: string }[];
      boton: string;
      enviar: Momento;
      nodos: { icono: Icono; titulo: string; detalle: string; en: Momento }[];
    }
  | {
      /** Vista previa del flujo en fila (gancho). */
      tipo: "flujoMini";
      nodos: { icono: Icono; titulo: string }[];
    }
  | {
      /** Gancho como escena: palabra 3D detrás de la cabeza y presentador recortado delante. */
      tipo: "ganchoGlass";
      palabra: string;
      recorte: string;
      tachar?: Momento;
      nota?: string;
    }
  | {
      /** DEMO: la IA agrupa las preguntas de los clientes (datos de ejemplo). */
      tipo: "analisisPreguntas";
      preguntas: string[];
      peticion: string;
      grupos: { tema: string; indices: number[]; repetida?: number; total: number }[];
      falta: string;
      momentos: { preguntas: Momento; peticion: Momento; agrupar: Momento; repetidas: Momento; falta: Momento };
    }
  | {
      /** Publicaciones genéricas que se tachan («no es esto»). */
      tipo: "tarjetasTachadas";
      titulos: string[];
      etiqueta: string;
      tachar: Momento;
    }
  | { tipo: "cta" };

/**
 * Capa ilustrativa que va encima del avatar, fuera de la zona de contenido.
 * «notificaciones»: avisos de mensajes que llegan uno tras otro y se quedan
 * sin responder (gancho visual de los primeros segundos).
 */
export type Capa =
  | CapaNotificaciones
  | {
      /** Alerta de error: destello rojo, sacudida y sello grande sobre la franja de gráficos. */
      tipo: "alerta";
      texto: string;
      /** Momento de la alerta (segundos de la escena o ancla). */
      en?: Momento;
    };

export type CapaNotificaciones = {
  tipo: "notificaciones";
  avisos: { remitente: string; texto: string; hora: string }[];
  /** Texto del sello que aparece en todos a la vez, por ejemplo «Sin responder». */
  sello?: string;
  /** Momento en que aparece el sello (segundos de la escena o ancla). */
  selloEn?: Momento;
};

export type Escena = {
  id: string;
  seccion: Seccion;
  capa?: Capa;
  /** Si no se indica, se usa el inicio de la sección en el timeline base escalado. */
  inicio?: Momento;
  presentador?: Disposicion;
  zoom?: Zoom[];
  titular?: Titular;
  contenido?: Contenido;
  /** Subtítulos visibles en esta escena (por defecto sí). */
  subtitulos?: boolean;
  sonidos?: Sonido[];
  /** Transición de entrada del contenido. */
  entrada?: "deslizar" | "mascara" | "zoom";
  /** Plano de recurso a pantalla completa detrás del titular y el contenido (foto o video real). */
  fondo?: { archivo: string; credito?: string; movimiento?: "acercar" | "alejar" | "izquierda" | "derecha" };
  /** Acercamiento lento y continuo al avatar durante la escena (1.04 = 4 %). */
  acercamiento?: number;
  /** Capítulo al que pertenece la escena (enciende el marcador 01 · 02 · 03). */
  capitulo?: number;
  /** En pantalla completa, el titular se muestra como rótulo de capítulo de marca (número grande + título). */
  rotuloCapitulo?: boolean;
};

export type ConfigCTA = {
  /** Texto grande, por ejemplo «Comenta GUÍA». */
  accion: string;
  /** La palabra que la gente debe comentar (se resalta). */
  palabra: string;
  /** Qué recibe a cambio. */
  recurso: string;
  usuario: string;
  /** Línea pequeña bajo el recurso, por ejemplo «Te llega por mensaje directo». */
  entrega?: string;
  /** Caja animada del cierre: comentario (redes) o mensaje (WhatsApp). */
  caja?: "comentario" | "mensaje";
  /** Etiqueta de la portada del recurso, por ejemplo «GUÍA GRATIS». */
  etiquetaRecurso?: string;
  /** Número grande de la portada (opcional), por ejemplo "7". */
  numeroRecurso?: string;
  /**
   * Frases de la voz que activan cada paso del cierre: seguir, comentar y
   * mostrar el recurso. Sin ellas, los pasos entran escalonados.
   */
  momentos?: { seguir?: string; comentar?: string; recurso?: string };
  /** «comentario» (Comenta PALABRA + recurso) o «mensaje» (escríbeme por privado). */
  estilo?: "comentario" | "mensaje" | "seguir" | "seguir-comentar" | "comentar-recurso" | "perfil";
  /** Para el estilo «mensaje»: línea bajo el texto y web. */
  nota?: string;
  web?: string;
};

export type ConfigVideo = {
  /** false: los zooms del avatar no llevan golpe de sonido. */
  sonidoZoom?: boolean;
  /** «secos»: cortes limpios entre avatar y explicación a pantalla completa (sin fundidos ni oscuros). */
  cortes?: "secos";
  /** Capa de marca persistente: firma LF con el usuario y marcador de capítulos. */
  marca?: { firma?: boolean; capitulos?: number };
  id: string;
  titulo: string;
  /** Video del avatar dentro de publico/ (null = placeholder). */
  avatar: string | null;
  /** Subtítulos con tiempos por palabra (herramientas/transcribir.py). */
  subtitulos: Caption[] | null;
  /** "auto" = duración del video del avatar; o segundos fijos. */
  duracion: "auto" | number;
  musica?: { archivo: string; volumen?: number } | null;
  /** Efectos de sonido automáticos en cada cambio de escena. */
  sonidoTransiciones?: boolean;
  escenas: Escena[];
  cta: ConfigCTA;
  /** Texto pequeño fijo, por ejemplo «Ejemplo ilustrativo». */
  aviso?: string;
  depuracion?: { zonaSegura?: boolean; tiempos?: boolean };
  /** Palabras clave que van en cian en los subtítulos y máximo de caracteres por bloque (≈ 2 líneas). */
  estiloSubtitulos?: { claves?: string[]; maxCaracteres?: number; tamano?: number };
  /** Oculta los subtítulos (por ejemplo, para la portada). */
  sinSubtitulos?: boolean;
};
