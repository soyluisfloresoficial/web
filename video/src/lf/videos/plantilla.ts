/**
 * Plantilla maestra: un video de 60 s con el timeline base y un ejemplo de
 * cada efecto. Copia este archivo para empezar un video nuevo.
 *
 * Todo lo que falta está marcado: avatar = null muestra un hueco PENDIENTE,
 * y los textos entre corchetes se cambian por los reales. Las cifras de la
 * comparativa son marcadores, no datos.
 */
import type { ConfigVideo } from "../tipos";

export const plantillaMaestra: ConfigVideo = {
  id: "plantilla",
  titulo: "[Título del video]",
  avatar: null, // PENDIENTE: "medios/avatar-xxx.mp4"
  subtitulos: null, // PENDIENTE: herramientas/transcribir.py
  duracion: 60,
  musica: null,
  sonidoTransiciones: true,
  aviso: "Ejemplo ilustrativo",
  depuracion: { zonaSegura: true, tiempos: true },
  cta: { accion: "Comenta", palabra: "[PALABRA]", recurso: "[Recurso que recibe]", usuario: "@[usuario]" },
  escenas: [
    // Sin `inicio`: cada escena toma el inicio de su sección del timeline base.
    { id: "gancho", seccion: "gancho", presentador: "completo", zoom: [{ en: 0.1 }], titular: { texto: "[Gancho de impacto en una línea]", destacar: ["impacto"] } },
    {
      id: "problema",
      seccion: "problema",
      presentador: "dividida",
      titular: { texto: "[Titular corto de la escena]", destacar: ["escena"], colorDestacado: "cian" },
      // Imagen real acorde con la voz: foto propia, de banco o generada con IA.
      contenido: { tipo: "imagen", archivo: "ejemplo/imagen.png", credito: "[Autor · fuente]", movimiento: "acercar", etiqueta: "[ETIQUETA]" },
    },
    {
      id: "solucion-1",
      seccion: "solucion1",
      presentador: "burbuja",
      contenido: {
        tipo: "pantallas",
        pantallas: [
          { titulo: "[Paso 1]", fuente: { tipo: "pendiente", descripcion: "Captura o maqueta 1" } },
          {
            titulo: "[Paso 2]",
            retraso: 1.5,
            fuente: { tipo: "formulario", titulo: "[Formulario]", campos: [{ etiqueta: "[Campo]", valor: "[Valor de ejemplo]" }], boton: "[Botón]" },
            cursor: { puntos: [{ x: 80, y: 20 }, { x: 50, y: 62 }], desde: 2, duracion: 1.4 },
          },
        ],
      },
    },
    {
      id: "solucion-2",
      seccion: "solucion2",
      presentador: "superior",
      contenido: {
        tipo: "comparativa",
        titulo: "[Comparativa]",
        filas: [{ etiqueta: "[COMPLETAR: métrica real y su fuente]", antes: 1, despues: 2 }],
        nota: "[COMPLETAR: fuente del dato]",
      },
    },
    {
      id: "automatizacion",
      seccion: "automatizacion",
      presentador: "burbuja",
      contenido: {
        tipo: "flujo",
        titulo: "[Nombre del flujo]",
        nodos: [
          { icono: "formulario", titulo: "[Entrada]" },
          { icono: "agente", titulo: "[Agente IA]" },
          { icono: "crm", titulo: "[CRM]" },
          { icono: "calendario", titulo: "[Agenda]" },
        ],
      },
    },
    {
      id: "sistema",
      seccion: "sistema",
      presentador: "oculto",
      contenido: {
        tipo: "sistema",
        titulo: "[Sistema completo]",
        nodos: [
          { icono: "whatsapp", titulo: "[Canal]" },
          { icono: "formulario", titulo: "[Web]" },
          { icono: "calendario", titulo: "[Agenda]" },
          { icono: "crm", titulo: "[CRM]" },
        ],
      },
    },
    { id: "cta", seccion: "cta", presentador: "burbuja", subtitulos: false, contenido: { tipo: "cta" } },
  ],
};
