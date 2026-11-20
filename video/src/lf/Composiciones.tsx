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
import { escribemeNegocio, escribemeNegocioPortada } from "./videos/escribeme-negocio";
import { organizaTuNegocio, organizaTuNegocioPortada } from "./videos/organiza-tu-negocio";
import { erroresIa, erroresIaPortada } from "./videos/errores-ia";
import { documentos, documentosPortada } from "./videos/documentos";
import { ep03, ep03Portada, ep03Web } from "./videos/ep03";
import { ep04, ep04Portada, ep04Web, ep04v2, ep04v2Portada, ep04v2Web } from "./videos/ep04";
import { documentosV2, documentosV2Portada, documentosV2WhatsApp, documentosV2Web } from "./videos/documentos-v2";

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
        id="LF-EscribemeNegocio"
        component={PlantillaLF}
        defaultProps={{ config: escribemeNegocio }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EscribemeNegocio-Portada"
        component={PlantillaLF}
        defaultProps={{ config: escribemeNegocioPortada }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-OrganizaTuNegocio"
        component={PlantillaLF}
        defaultProps={{ config: organizaTuNegocio }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-OrganizaTuNegocio-Portada"
        component={PlantillaLF}
        defaultProps={{ config: organizaTuNegocioPortada }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EP04-V2"
        component={PlantillaLF}
        defaultProps={{ config: ep04v2 }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EP04-V2-Web"
        component={PlantillaLF}
        defaultProps={{ config: ep04v2Web }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EP04-V2-Portada"
        component={PlantillaLF}
        defaultProps={{ config: ep04v2Portada }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EP04"
        component={PlantillaLF}
        defaultProps={{ config: ep04 }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EP04-Web"
        component={PlantillaLF}
        defaultProps={{ config: ep04Web }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EP04-Portada"
        component={PlantillaLF}
        defaultProps={{ config: ep04Portada }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EP03"
        component={PlantillaLF}
        defaultProps={{ config: ep03 }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EP03-Web"
        component={PlantillaLF}
        defaultProps={{ config: ep03Web }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-EP03-Portada"
        component={PlantillaLF}
        defaultProps={{ config: ep03Portada }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-Documentos-V2"
        component={PlantillaLF}
        defaultProps={{ config: documentosV2 }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-Documentos-V2-Web"
        component={PlantillaLF}
        defaultProps={{ config: documentosV2Web }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-Documentos-V2-WhatsApp"
        component={PlantillaLF}
        defaultProps={{ config: documentosV2WhatsApp }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-Documentos-V2-Portada"
        component={PlantillaLF}
        defaultProps={{ config: documentosV2Portada }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-Documentos"
        component={PlantillaLF}
        defaultProps={{ config: documentos }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-Documentos-Portada"
        component={PlantillaLF}
        defaultProps={{ config: documentosPortada }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-ErroresIA"
        component={PlantillaLF}
        defaultProps={{ config: erroresIa }}
        calculateMetadata={calcularMetadatos}
        durationInFrames={60 * LIENZO.fps}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
      />
      <Composition
        id="LF-ErroresIA-Portada"
        component={PlantillaLF}
        defaultProps={{ config: erroresIaPortada }}
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
