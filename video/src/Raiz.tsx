import { Composition } from "remotion";
import { Piloto, DURACION } from "./Piloto";

/**
 * Composiciones del proyecto. El piloto (27/10/2026) cuenta la misma historia
 * que la sección «Por dentro» de la portada, en 15 segundos.
 *
 * - Piloto: 16:9, para la web.
 * - PilotoVertical: 9:16, para Instagram, TikTok y anuncios.
 */
export const Raiz = () => (
  <>
    <Composition
      id="Piloto"
      component={Piloto}
      durationInFrames={DURACION}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ vertical: false }}
    />
    <Composition
      id="PilotoVertical"
      component={Piloto}
      durationInFrames={DURACION}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ vertical: true }}
    />
  </>
);
