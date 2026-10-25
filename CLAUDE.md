# Instrucciones para trabajar en este repositorio

Este repositorio es la web **soyluisflores.es** de Luis Carlos Flores. Cloudflare (Worker llamado `web`, con Workers Builds) está conectado a GitHub y **publica solo cada subida a la rama `main`**. La configuración está en `wrangler.jsonc`: el nombre `web` tiene que coincidir con el del Worker en Cloudflare, y `html_handling: drop-trailing-slash` mantiene las URL sin barra final.

## Idioma

Habla siempre en español con el titular: respuestas, avisos de progreso y resúmenes. Cuando pida pasos, dalos muy detallados (qué botón tocar, qué copiar y dónde pegarlo).

## Regla permanente del titular: cada cambio se publica

Autorización permanente (20/10/2026), para cualquier conversación: cuando hagas un cambio en la web, termina siempre publicándolo, sin volver a preguntar:

1. `npm run build` sin errores.
2. `node tools/auditar-dist.mjs` con **0 problemas**.
3. Commit con un mensaje claro en español.
4. `git push` a **`main`** de `https://github.com/soyluisfloresoficial/web`. Siempre en avance rápido; **nunca `--force`**.
5. Avisa de qué se ha publicado y con qué commit. Cloudflare tarda uno o dos minutos.

Si el build o la auditoría fallan, **no subas nada** y explica qué ha pasado.

## Dónde se guarda cada cosa

| Qué | Dónde |
|---|---|
| Código de la web | GitHub: `soyluisfloresoficial/web`, rama **`main`** (es la que se publica) |
| Copia de la rama de trabajo | `reconstruccion-oct-2026`: se sube **siempre igual que `main`** (mismo commit). No la borres sin permiso del titular |
| Web publicada | Cloudflare, Worker `web` → `soyluisflores.es` y `www.soyluisflores.es`. Se reconstruye sola con cada subida a `main` |
| Configuración de la publicación | `wrangler.jsonc` y `DESPLIEGUE.md` |
| Variables de compilación (`PUBLIC_GTM_ID`) | Panel de Cloudflare → Worker `web` → Configuración → Compilación. **No** están en el repositorio |
| Contenedor de Google Tag Manager | `gtm/` (ficheros de apoyo; el contenedor real está en tagmanager.google.com) |
| Reglas de trabajo y preferencias | Este fichero y la memoria de Claude del proyecto |

Después de cada cambio, comprueba que **`git status` está limpio** y que `main` y `reconstruccion-oct-2026` apuntan al mismo commit. Nada debe quedarse solo en el ordenador.

Los cambios hechos a mano en el panel de Cloudflare no pasan por GitHub y se pierden en la siguiente publicación: cualquier cambio del sitio se hace en el repositorio.

## Reglas de contenido

- Español latino neutro (decisión del titular, 21/10/2026): tuteo, sin vosotros ni modismos de España (costo, celular, agendar, horas hábiles, «te agendé» mejor que «te he reservado»). Que suene natural, escrito por una persona: sin rayas largas, sin «no es X, es Y», sin frases hechas como «sin humo» o «sin letra pequeña». Los textos legales se quedan como están.
- No inventes cifras, clientes, casos, reseñas, testimonios, fechas ni fuentes. Si falta un dato: `[COMPLETAR: qué falta]` o `[VERIFICAR: dónde]`.
- El NIE/NIF solo puede aparecer en `/aviso-legal`, nunca en el pie, en el JSON-LD ni en `llms.txt`. El domicilio público es solo «Manresa, Barcelona, España», sin calle ni código postal.
- No cambies el texto legal salvo que el titular lo pida; si ves un hueco, avisa de que lo revise un abogado.
- `/aviso-de-privacidad-latinoamerica` es un aviso estándar para Latinoamérica que pidió el titular (21/10/2026). Los textos de España (aviso legal, privacidad, cookies) se mantienen. Ambos están pendientes de revisión por un abogado.
- Tono de quien implementa: directo, sin promesas garantizadas ni urgencia artificial. Nada que suene a principiante («unos tres años», «empecé como freelance») en los textos de presentación.

## Página con identidad propia

`/diagnostico` (22/10/2026) es la landing de la llamada de diagnóstico, con identidad propia: lima `#C6FF3D` sobre negro `#050505`, Space Grotesk, Inter y JetBrains Mono, sin la cabecera ni el pie de la web (`Base.astro` con `identidad="lima"`). El lima es solo para la cinta, los estados activos y el botón principal. No uses esa identidad en el resto de la web ni la azul/violeta en esa página. Desde la auditoría del 26/10/2026 va con `noindex, follow`, canónica hacia `/contacto` y fuera del sitemap, porque repite su contenido; sigue enlazada desde el pie y desde `llms.txt`, y es la página que se usa en campañas.

## Imágenes para compartir

Cada página tiene su imagen para redes (Open Graph) en `public/og/`. Se generan con `node tools/generar-og.mjs` después de `npm run build` (necesita Edge o Chrome en el ordenador). Al añadir un servicio, un artículo o cambiar un título, vuelve a ejecutarlo, compila otra vez y sube las imágenes. Si una página no tiene la suya, usa `og-default.png`.

## Referencias

- `SISTEMA-DISENO.md`: tipografía, acentos de color y movimiento.
- `DESPLIEGUE.md` y `GUIA-CLOUDFLARE.md`: cómo está montada la publicación.
- `src/data/`: textos de la home, servicios, logos e ilustraciones.
