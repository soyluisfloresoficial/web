/**
 * Registro de las composiciones del LF Motion System. Para añadir un video:
 * crea su config en videos/ y añade aquí un <Composition> igual que el piloto.
 */
import { Composition, staticFile, type CalculateMetadataFunction } from "remotion";
import { LIENZO } from "./marca";
import { PlantillaLF, type PropsLF } from "./PlantillaLF";
import { duracionDesdeSubtitulos } from "./tiempo";
import { pilotoDobleClientes } from "./videos/piloto-doble-clientes";
import { plantillaMaestra } from "./videos/plantilla";

/** Duración: fija, o la del video del avatar, o el final de la voz + 1,5 s. */
const calcularMetadatos: CalculateMetadataFunction<PropsLF> = async ({ props }) => {
  const c = props.config;
  let seg: number | null = typeof c.duracion === "number" ? c.duracion : null;
  if (seg === null && c.avatar) {
    try {
      const { parseMedia } = await import("@remotion/media-parser");
      const r = await parseMedia({
        src: new URL(staticFile(c.avatar), window.location.href).href,
        fields: { durationInSeconds: true },
        acknowledgeRemotionLicense: true,
      });
      seg = r.durationInSeconds ?? null;
    } catch (e) {
      console.warn("[LF] No se pudo leer la duración del avatar:", e);
    }
  }
  seg ??= duracionDesdeSubtitulos(c) ?? 60;
  return { durationInFrames: Math.ceil(seg * LIENZO.fps), fps: LIENZO.fps, width: LIENZO.ancho, height: LIENZO.alto };
};

export function ComposicionesLF() {
  return (
    <>
      <Composition
        id="LF-Piloto-DobleClientes"
        component={PlantillaLF}
        defaultProps={{ config: pilotoDobleClientes }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-Plantilla"
        component={PlantillaLF}
        defaultProps={{ config: plantillaMaestra }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
    </>
  );
}
