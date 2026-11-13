/**
 * Dibuja una escena: el titular cinético y el contenido, colocados en la zona
 * libre que deja el avatar (disposicion.ts) y escalados para que quepan.
 */
import type { ReactNode } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedCounter, Comparativa } from "./componentes/AnimatedCounter";
import { AutomationFlow } from "./componentes/AutomationFlow";
import { BeforeAfterReveal } from "./componentes/BeforeAfterReveal";
import { BrandCTA, CTAMensaje, CTASeguir, type MomentosCTA } from "./componentes/BrandCTA";
import { PantallaDividida } from "./componentes/PantallaDividida";
import { Presentacion } from "./componentes/Presentacion";
import { Revelacion } from "./componentes/Revelacion";
import { ImagenReal } from "./componentes/ImagenReal";
import { ListaPuntos } from "./componentes/ListaPuntos";
import { NotificacionesFlotantes } from "./componentes/NotificacionesFlotantes";
import { FloatingScreen } from "./componentes/FloatingScreen";
import { KineticText } from "./componentes/KineticText";
import { SistemaReveal } from "./componentes/SistemaReveal";
import { ESCENARIO } from "./disposicion";
import { ZONA_SEGURA } from "./marca";
import type { ConfigVideo } from "./tipos";
import { buscarAncla, resolverMomento, type EscenaResuelta } from "./tiempo";

const ANCHO_UTIL = 1080 - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha;

/** Encaja un bloque de tamaño natural (w × h) en el espacio disponible. */
function Encajar({ w, h, maxW, maxH, children }: { w: number; h: number; maxW: number; maxH: number; children: ReactNode }) {
  const s = Math.min(1, maxW / w, maxH / h);
  return (
    <div style={{ width: w * s, height: h * s, position: "relative" }}>
      <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: "top left", position: "absolute" }}>{children}</div>
    </div>
  );
}

export function Escenario({ escena, config }: { escena: EscenaResuelta; config: ConfigVideo }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = escena.hasta - escena.desde;
  const disp = escena.presentador ?? "completo";
  const zona = ESCENARIO[disp];
  const salida = interpolate(f, [dur - 7, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const c = escena.contenido;

  if (c?.tipo === "cta") {
    return (
      <AbsoluteFill style={{ opacity: salida }}>
        {config.cta.estilo === "seguir" ? (
          <CTASeguir cta={config.cta} momentos={momentosCTA(config, escena, fps)} zona={ESCENARIO[disp]} />
        ) : config.cta.estilo === "mensaje" ? (
          <CTAMensaje cta={config.cta} momentos={momentosCTA(config, escena, fps)} zona={disp === "dividida" ? ESCENARIO.dividida : undefined} />
        ) : (
          <BrandCTA cta={config.cta} momentos={momentosCTA(config, escena, fps)} />
        )}
      </AbsoluteFill>
    );
  }

  if (c?.tipo === "revelacion") {
    return (
      <AbsoluteFill style={{ opacity: salida, zIndex: 10 }}>
        <Revelacion titular={c.titular} destacar={c.destacar} inicioEscenaFrame={escena.desde} />
      </AbsoluteFill>
    );
  }

  const capa = escena.capa?.tipo === "notificaciones" ? (
    <NotificacionesFlotantes
      avisos={escena.capa.avisos}
      sello={escena.capa.sello}
      selloFrame={
        escena.capa.selloEn === undefined
          ? Math.round(dur * 0.6)
          : Math.round((resolverMomento(escena.capa.selloEn, config.subtitulos, escena.desde / fps, escena.desde / fps) - escena.desde / fps) * fps)
      }
      duracion={dur}
    />
  ) : null;

  const titular = escena.titular;
  // En pantalla dividida el titular es una línea compacta sobre el gráfico.
  const enFranja = disp === "dividida";
  const tamTitular = enFranja ? Math.min(titular?.tamano ?? 44, 44) : titular?.tamano ?? (c && c.tipo !== "ninguno" ? 64 : 92);
  const altoTitular = titular ? Math.ceil(titular.texto.length / (ANCHO_UTIL / (tamTitular * 0.55))) * tamTitular * 1.12 + (enFranja ? 14 : 30) : 0;
  // Con el avatar en burbuja, el titular va a su derecha y el contenido
  // aprovecha toda la zona de abajo.
  const alLado = !!titular && disp === "burbuja" && titular.posicion !== "arriba";
  const yTitular = titular?.posicion === "arriba" ? ZONA_SEGURA.arriba + 20 : alLado ? 262 : zona.y;
  const yContenido = titular && titular.posicion !== "arriba" && !alLado ? zona.y + altoTitular : zona.y;
  const altoContenido = Math.max(200, zona.y + zona.h - yContenido);

  let contenido: ReactNode = null;
  if (c?.tipo === "pantallas") {
    const total = c.pantallas.length;
    const ancha = enFranja && total === 1;
    const altoPantalla = ancha ? Math.min(560, altoContenido - 6) : total > 1 ? 430 : 560;
    contenido = (
      <Encajar w={ancha ? 936 : 1000} h={ancha ? altoPantalla + 6 : total > 1 ? 760 : 600} maxW={ancha ? 936 : ANCHO_UTIL + 60} maxH={altoContenido}>
        {c.pantallas.map((p, i) => (
          <Sequence key={i} from={Math.round((p.retraso ?? 0) * fps)} layout="none">
            <FloatingScreen
              fuente={p.fuente}
              titulo={p.titulo}
              cursor={p.cursor}
              indice={total > 1 ? i : 0}
              total={total}
              entrada={escena.entrada}
              ancho={ancha ? 936 : total > 1 ? 820 : 900}
              alto={altoPantalla}
              inclinacion={ancha ? 4 : c.inclinacion}
            />
          </Sequence>
        ))}
      </Encajar>
    );
  } else if (c?.tipo === "dividida") {
    const zoomFrame =
      c.zoomMensajes === undefined
        ? undefined
        : Math.round((resolverMomento(c.zoomMensajes, config.subtitulos, escena.desde / fps, escena.desde / fps) - escena.desde / fps) * fps);
    contenido = (
      <Encajar w={936} h={enFranja ? altoContenido : 720} maxW={936} maxH={altoContenido}>
        <PantallaDividida izquierda={c.izquierda} derecha={c.derecha} zoomFrame={zoomFrame} alto={enFranja ? altoContenido : 720} />
      </Encajar>
    );
  } else if (c?.tipo === "lista") {
    const items = c.items.map((it, i) => ({
      texto: it.texto,
      icono: it.icono,
      frame:
        it.en === undefined
          ? 6 + i * 12
          : Math.max(0, Math.round((resolverMomento(it.en, config.subtitulos, escena.desde / fps, escena.desde / fps) - escena.desde / fps) * fps)),
    }));
    contenido = <ListaPuntos items={items} ancho={ANCHO_UTIL} alto={Math.min(altoContenido, 420)} />;
  } else if (c?.tipo === "imagen") {
    contenido = <ImagenReal archivo={c.archivo} credito={c.credito} movimiento={c.movimiento} etiqueta={c.etiqueta} ancho={936} alto={Math.min(altoContenido, 760)} duracion={dur} />;
  } else if (c?.tipo === "presentacion") {
    contenido = (
      <div style={{ width: ANCHO_UTIL, display: "flex", justifyContent: "center" }}>
        <Presentacion nombre={c.nombre} linea={c.linea} web={c.web} escala={enFranja ? 1.35 : 1.25} />
      </div>
    );
  } else if (c?.tipo === "flujo") {
    contenido = <AutomationFlow nodos={c.nodos} titulo={c.titulo} ancho={ANCHO_UTIL} alto={Math.min(780, altoContenido)} duracion={dur} />;
  } else if (c?.tipo === "contador") {
    contenido = (
      <Encajar w={ANCHO_UTIL} h={400} maxW={ANCHO_UTIL} maxH={altoContenido}>
        <AnimatedCounter etiqueta={c.etiqueta} desde={c.desde} hasta={c.hasta} prefijo={c.prefijo} sufijo={c.sufijo} nota={c.nota} />
      </Encajar>
    );
  } else if (c?.tipo === "comparativa") {
    contenido = (
      <Encajar w={880} h={140 + c.filas.length * 150} maxW={ANCHO_UTIL} maxH={altoContenido}>
        <Comparativa titulo={c.titulo} filas={c.filas} etiquetas={c.etiquetas} nota={c.nota} />
      </Encajar>
    );
  } else if (c?.tipo === "antesDespues") {
    contenido = (
      <Encajar w={900} h={520} maxW={ANCHO_UTIL} maxH={altoContenido}>
        <BeforeAfterReveal antes={c.antes} despues={c.despues} />
      </Encajar>
    );
  } else if (c?.tipo === "sistema") {
    contenido = (
      <Encajar w={enFranja ? 936 : 920} h={enFranja ? altoContenido : 760} maxW={enFranja ? 936 : ANCHO_UTIL + 40} maxH={altoContenido}>
        <SistemaReveal nodos={c.nodos} titulo={c.titulo} centro={c.centro} ancho={enFranja ? 936 : 920} alto={enFranja ? altoContenido : 760} escala={enFranja ? 0.68 : 1} />
      </Encajar>
    );
  }

  return (
    <AbsoluteFill style={{ opacity: salida, zIndex: 10 }}>
      {capa}
      {titular && (
        <div
          style={{
            position: "absolute",
            left: alLado ? 352 : ZONA_SEGURA.izquierda,
            width: alLado ? 1080 - 352 - ZONA_SEGURA.derecha : ANCHO_UTIL,
            top: yTitular,
            display: "flex",
            justifyContent: alLado ? "flex-start" : "center",
          }}
        >
          {disp === "completo" && (
            <div
              style={{
                position: "absolute",
                left: -60,
                right: -60,
                top: -50,
                bottom: -50,
                background: "radial-gradient(ellipse 62% 58% at 50% 50%, rgb(7 9 13 / 0.62) 0%, rgb(7 9 13 / 0.35) 55%, transparent 100%)",
                filter: "blur(6px)",
                pointerEvents: "none",
              }}
            />
          )}
          <KineticText
            texto={titular.texto}
            destacar={titular.destacar}
            sincronizar={titular.sincronizar}
            subtitulos={config.subtitulos}
            inicioEscenaFrame={escena.desde}
            tamano={alLado ? Math.min(tamTitular, 60) : tamTitular}
            ancho={alLado ? 1080 - 352 - ZONA_SEGURA.derecha : ANCHO_UTIL}
            alineacion={alLado ? "left" : "center"}
            colorDestacado={titular.colorDestacado}
          />
        </div>
      )}
      {contenido && (
        <div style={{ position: "absolute", left: 0, right: 0, top: yContenido, height: altoContenido, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {contenido}
        </div>
      )}
    </AbsoluteFill>
  );
}

/** Fotogramas (relativos a la escena del CTA) de seguir, comentar y recurso. */
export function momentosCTA(config: ConfigVideo, escena: EscenaResuelta, fps: number): MomentosCTA {
  const ini = escena.desde / fps;
  const m = config.cta.momentos ?? {};
  const rel = (frase: string | undefined, porDefecto: number) => {
    const t = frase ? buscarAncla(config.subtitulos, frase, ini * 1000 - 300) : null;
    return t === null ? porDefecto : Math.max(0, Math.round((t - ini) * fps));
  };
  const seguir = rel(m.seguir, 4);
  const comentar = rel(m.comentar, seguir + 20);
  const recurso = rel(m.recurso, comentar + 40);
  return { seguir, comentar, recurso };
}
