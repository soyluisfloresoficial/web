# Videos con código (Remotion)

Videos de *motion graphics* de soyluisflores.es hechos con código en lugar de
con un editor de video. Esta carpeta no entra en el build de la web: los
videos se renderizan aquí y el que se publica se copia a `public/video/`.

**En la web (27/10/2026):** `public/video/piloto.mp4` (1440 × 810, 1,1 MB) y su
portada `piloto-portada.jpg`, en la sección «Por dentro» de la portada. Si
cambias el video, vuelve a sacarlos con `npm run piloto-web`. La lista de
efectos está en `SISTEMA-DISENO.md`.

## Qué hay

| Composición | Formato | Para qué |
|---|---|---|
| `Piloto` | 1920 × 1080, 15 s | Web (sección «Por dentro») |
| `PilotoVertical` | 1080 × 1920, 15 s | Instagram, TikTok y anuncios |

El piloto (27/10/2026) cuenta la historia de «Por dentro»: son las 22:14 y
entra un mensaje, el agente contesta, la cita entra en la agenda, el papeleo
se hace solo y todo queda medido. Los textos salen de
`src/components/Showcase.astro`; no hay datos nuevos y el video dice en
pantalla que es un ejemplo ilustrativo.

Colores y fuentes son los de la web. Las fuentes se leen de `../public/fonts`.

## Cómo se usa

Desde esta carpeta:

```bash
npm install
```

Para ver y retocar el video en el navegador:

```bash
npm run estudio
```

Para sacar los MP4 en `out/` (no se suben a GitHub):

```bash
npm run piloto
npm run piloto-vertical
```

Para la versión ligera de la web (escribe directamente en `../public/video/`):

```bash
npm run piloto-web
```

En este ordenador se renderiza con Microsoft Edge en lugar de descargar
Chrome. Si hace falta, añade al comando:

```
--browser-executable="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --chrome-mode=chrome-for-testing
```

## Licencia

Remotion es gratis para personas y empresas de hasta tres empleados. Si eso
cambia, hay que revisar su licencia en remotion.dev/license.
