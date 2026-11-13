/**
 * LF Motion System · plantilla maestra.
 *
 * Recibe un ConfigVideo y monta el reel completo. No hay que tocar este
 * archivo para hacer un video nuevo: se crea un config en src/lf/videos/.
 *
 * Capas (de abajo arriba): fondo · avatar · escenas · subtítulos · aviso ·
 * sonido · depuración.
 */
import { useMemo } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Fondo } from "./componentes/Fondo";
import { HeyGenPresenter } from "./componentes/HeyGenPresenter";
import type { GolpeZoom } from "./componentes/ImpactZoom";
import { SoundDesign } from "./componentes/SoundDesign";
import { Subtitles } from "./componentes/Subtitles";
import { Escenario } from "./Escenario";
import { COLOR, FUENTE, ZONA_SEGURA, cargarFuentes } from "./marca";
import { resolverEscenas, resolverMomento, type EscenaResuelta } from "./tiempo";
import type { ConfigVideo } from "./tipos";
import { prog } from "./util";

export type PropsLF = { config: ConfigVideo };

const CON_MAQUETA = new Set(["pantallas", "flujo", "sistema", "contador", "comparativa", "antesDespues", "dividida"]);

function Aviso({ texto, escenas }: { texto: string; escenas: EscenaResuelta[] }) {
  const f = useCurrentFrame();
  const e = escenas.find((x) => f >= x.desde && f < x.hasta);
  if (!e || !CON_MAQUETA.has(e.contenido?.tipo ?? "")) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: ZONA_SEGURA.arriba + 6,
        right: ZONA_SEGURA.derecha,
        zIndex: 25,
        fontFamily: FUENTE.texto,
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: "0.08em",
        color: COLOR.suave,
        textShadow: "0 1px 6px rgb(0 0 0 / 0.6)",
        opacity: 0.55 * prog(f, e.desde, 10),
      }}
    >
      {texto}
    </div>
  );
}

function Depuracion({ escenas, zona, tiempos }: { escenas: EscenaResuelta[]; zona?: boolean; tiempos?: boolean }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = escenas.find((x) => f >= x.desde && f < x.hasta);
  const banda = "rgb(255 0 80 / 0.22)";
  return (
    <AbsoluteFill style={{ zIndex: 100, pointerEvents: "none" }}>
      {zona && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ZONA_SEGURA.arriba, background: banda }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: ZONA_SEGURA.abajo, background: banda }} />
          <div style={{ position: "absolute", left: 0, top: ZONA_SEGURA.arriba, bottom: ZONA_SEGURA.abajo, width: ZONA_SEGURA.izquierda, background: banda }} />
          <div style={{ position: "absolute", right: 0, top: ZONA_SEGURA.arriba, bottom: ZONA_SEGURA.abajo, width: ZONA_SEGURA.derecha, background: banda }} />
        </>
      )}
      {tiempos && e && (
        <div style={{ position: "absolute", left: 20, top: 20, padding: "6px 12px", background: "#000a", color: "#fff", fontFamily: "monospace", fontSize: 26 }}>
          {e.id} · {(f / fps).toFixed(2)} s · {e.presentador ?? "completo"}
        </div>
      )}
    </AbsoluteFill>
  );
}

export function PlantillaLF({ config }: PropsLF) {
  cargarFuentes();
  const { fps, durationInFrames } = useVideoConfig();
  const escenas = useMemo(() => resolverEscenas(config, durationInFrames / fps, fps), [config, durationInFrames, fps]);
  const golpes: GolpeZoom[] = useMemo(
    () =>
      escenas.flatMap((e) =>
        (e.zoom ?? []).map((z) => ({
          frame: Math.round(resolverMomento(z.en, config.subtitulos, e.desde / fps, e.desde / fps) * fps),
          escala: z.escala ?? 1.12,
          duracion: Math.round((z.duracion ?? 1.2) * fps),
        })),
      ),
    [escenas, config.subtitulos, fps],
  );

  return (
    <AbsoluteFill style={{ background: COLOR.base }}>
      <Fondo />
      <HeyGenPresenter avatar={config.avatar} escenas={escenas} golpes={golpes} />
      {escenas.map((e) => (
        <Sequence key={e.id} from={e.desde} durationInFrames={Math.max(1, e.hasta - e.desde)} name={`${e.indice + 1}. ${e.id}`} layout="none">
          <Escenario escena={e} config={config} />
        </Sequence>
      ))}
      {!config.sinSubtitulos && (
        <Subtitles
          subtitulos={config.subtitulos}
          escenas={escenas}
          claves={config.estiloSubtitulos?.claves}
          maxCaracteres={config.estiloSubtitulos?.maxCaracteres}
        />
      )}
      {config.aviso && <Aviso texto={config.aviso} escenas={escenas} />}
      <SoundDesign config={config} escenas={escenas} golpes={golpes} fps={fps} />
      {(config.depuracion?.zonaSegura || config.depuracion?.tiempos) && (
        <Depuracion escenas={escenas} zona={config.depuracion?.zonaSegura} tiempos={config.depuracion?.tiempos} />
      )}
    </AbsoluteFill>
  );
}
