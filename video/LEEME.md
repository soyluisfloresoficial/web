# Videos con código (Remotion)

Videos de *motion graphics* de soyluisflores.es hechos con código en lugar de
con un editor de video. **No forman parte de la web**: se renderizan aquí y,
si se aprueban, el MP4 se pone en la web o se sube a redes aparte.

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

En este ordenador se renderiza con Microsoft Edge en lugar de descargar
Chrome. Si hace falta, añade al comando:

```
--browser-executable="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --chrome-mode=chrome-for-testing
```

## Licencia

Remotion es gratis para personas y empresas de hasta tres empleados. Si eso
cambia, hay que revisar su licencia en remotion.dev/license.
