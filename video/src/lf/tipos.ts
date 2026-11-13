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
export type Disposicion = "completo" | "superior" | "burbuja" | "oculto";

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
  /** Palabras que van con el degradado de marca. */
  destacar?: string[];
  posicion?: "arriba" | "centro";
  /** Si es true, cada palabra aparece cuando la voz la dice. */
  sincronizar?: boolean;
  tamano?: number;
};

// ---------------------------------------------------------------- Pantallas
/** Interfaces de ejemplo dibujadas con código (siempre ilustrativas). */
export type PantallaMaqueta =
  | { tipo: "chat"; canal: string; mensajes: { de: "cliente" | "agente" | "estado"; texto: string; hora?: string }[] }
  | { tipo: "formulario"; titulo: string; campos: { etiqueta: string; valor: string }[]; boton: string }
  | { tipo: "crm"; columnas: { titulo: string; tarjetas: string[] }[]; mover?: { tarjeta: string; a: number } }
  | { tipo: "calendario"; dia: string; huecos: { hora: string; texto?: string; nuevo?: boolean }[] }
  | { tipo: "notificacion"; titulo: string; texto: string }
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
export type Icono = "formulario" | "agente" | "crm" | "calendario" | "whatsapp" | "correo" | "alerta" | "check" | "usuario" | "reloj";

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
  | { tipo: "sistema"; nodos: NodoFlujo[]; titulo?: string }
  | { tipo: "cta" };

/**
 * Capa ilustrativa que va encima del avatar, fuera de la zona de contenido.
 * «notificaciones»: avisos de mensajes que llegan uno tras otro y se quedan
 * sin responder (gancho visual de los primeros segundos).
 */
export type Capa = {
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
  /** Etiqueta de la portada del recurso, por ejemplo «GUÍA GRATIS». */
  etiquetaRecurso?: string;
  /** Número grande de la portada (opcional), por ejemplo "7". */
  numeroRecurso?: string;
  /**
   * Frases de la voz que activan cada paso del cierre: seguir, comentar y
   * mostrar el recurso. Sin ellas, los pasos entran escalonados.
   */
  momentos?: { seguir?: string; comentar?: string; recurso?: string };
};

export type ConfigVideo = {
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
};
