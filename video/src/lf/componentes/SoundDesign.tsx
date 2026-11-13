/**
 * Diseño sonoro. Calcula los momentos a partir de la configuración y coloca
 * cada efecto: «whoosh» en los cambios de escena, «impacto» en los zooms,
 * «clic» cuando el cursor pulsa y «pop» en el CTA. La música (si la hay)
 * va baja para no tapar la voz.
 *
 * Los efectos por defecto (publico/sfx/) los genera `npm run lf:preparar`
 * con síntesis propia: no tienen licencia de terceros. La música se pone a
 * mano en publico/medios/ y tiene que tener licencia para redes.
 */
import { Audio, Sequence, staticFile } from "remotion";
import type { ConfigVideo } from "../tipos";
import { resolverMomento, type EscenaResuelta } from "../tiempo";
import { momentosCTA } from "../Escenario";
import { frameClic } from "./GuidedCursor";
import { PASO_AVISO } from "./NotificacionesFlotantes";
import type { GolpeZoom } from "./ImpactZoom";

type Cue = { frame: number; archivo: string; volumen: number };

export function calcularSonidos(config: ConfigVideo, escenas: EscenaResuelta[], golpes: GolpeZoom[], fps: number): Cue[] {
  const cues: Cue[] = [];
  const auto = config.sonidoTransiciones !== false;
  for (const e of escenas) {
    if (auto && e.indice > 0) cues.push({ frame: Math.max(0, e.desde - 5), archivo: "sfx/whoosh.wav", volumen: 0.28 });
    if (e.contenido?.tipo === "pantallas") {
      for (const p of e.contenido.pantallas) {
        if (p.cursor && p.cursor.clic !== false) cues.push({ frame: e.desde + Math.round((p.retraso ?? 0) * fps) + frameClic(p.cursor, fps), archivo: "sfx/clic.wav", volumen: 0.55 });
      }
    }
    if (e.contenido?.tipo === "cta" && auto) {
      const m = momentosCTA(config, e, fps);
      cues.push({ frame: e.desde + m.seguir + 10, archivo: "sfx/pop.wav", volumen: 0.45 });
      cues.push({ frame: e.desde + m.comentar + 10 + config.cta.palabra.length * 3 + 6, archivo: "sfx/clic.wav", volumen: 0.5 });
      cues.push({ frame: Math.max(0, e.desde + m.recurso - 4), archivo: "sfx/whoosh.wav", volumen: 0.3 });
    }
    if (e.capa?.tipo === "notificaciones" && auto) {
      e.capa.avisos.slice(0, 4).forEach((_, i) => cues.push({ frame: e.desde + 2 + i * PASO_AVISO, archivo: "sfx/aviso.wav", volumen: 0.32 }));
    }
    for (const s of e.sonidos ?? []) {
      const seg = resolverMomento(s.en, config.subtitulos, e.desde / fps, e.desde / fps);
      cues.push({ frame: Math.round(seg * fps), archivo: s.archivo, volumen: s.volumen ?? 0.5 });
    }
  }
  if (auto) for (const g of golpes) cues.push({ frame: g.frame, archivo: "sfx/impacto.wav", volumen: 0.4 });
  return cues.sort((a, b) => a.frame - b.frame);
}

export function SoundDesign({ config, escenas, golpes, fps }: { config: ConfigVideo; escenas: EscenaResuelta[]; golpes: GolpeZoom[]; fps: number }) {
  const cues = calcularSonidos(config, escenas, golpes, fps);
  return (
    <>
      {config.musica && <Audio src={staticFile(config.musica.archivo)} volume={config.musica.volumen ?? 0.1} loop />}
      {cues.map((c, i) => (
        <Sequence key={i} from={c.frame} durationInFrames={Math.round(fps * 2)} layout="none" name={`sfx ${c.archivo}`}>
          <Audio src={staticFile(c.archivo)} volume={c.volumen} />
        </Sequence>
      ))}
    </>
  );
}
