/**
 * Casos y testimonios reales.
 *
 * Las dos listas están vacías a propósito (26/10/2026): no hay ninguno
 * publicable todavía. No se inventan ni como ejemplo, ni como marcador de
 * posición: el componente PruebaSocial no pinta nada mientras estén vacías,
 * así que puede quedarse puesto en las páginas sin que se vea nada.
 *
 * Para publicar un caso hacen falta los siete campos de CasoReal. El más
 * importante es «permiso»: sin permiso escrito del cliente, el caso no sale.
 * Si falta algún dato, se deja la ficha fuera de la lista hasta tenerlo.
 *
 * TODO (titular): pasar los casos y testimonios reales con su permiso.
 */

export interface CasoReal {
  /** Nombre del cliente, o cómo acepta que se le nombre. */
  cliente: string;
  /** Sector o tipo de negocio, para que el lector se reconozca. */
  sector: string;
  /** Cómo y cuándo dio permiso para publicarlo. */
  permiso: string;
  /** Qué se implementó, en una frase. */
  queSeHizo: string;
  /** Qué cambió en el negocio. Sin cifras que no se puedan respaldar. */
  queCambio: string;
  /** Con qué dato se midió y de dónde sale. */
  comoSeMidio: string;
  /** Fecha del trabajo, en formato AAAA-MM. */
  fecha: string;
}

export interface Testimonio {
  /** Lo que dijo el cliente, tal cual. Sin retocar. */
  texto: string;
  nombre: string;
  /** Cargo y negocio, si acepta que se nombren. */
  cargo: string;
  /** Cómo y cuándo dio permiso para publicarlo. */
  permiso: string;
  fecha: string;
}

export const casos: CasoReal[] = [];

export const testimonios: Testimonio[] = [];
