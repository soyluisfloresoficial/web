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
| Clave del asistente de IA (`ANTHROPIC_API_KEY`) | Panel de Cloudflare → Worker `web` → Configuración → Variables y secretos (tiempo de ejecución, tipo **Secreto**). **No** está en el repositorio. Ver `AGENTE.md` |
| Agenda propia (Google Calendar): horario, servidor y guía | `src/data/agenda.ts`, `src/worker/agenda.ts` y `AGENDA.md`. Claves `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y `GOOGLE_REFRESH_TOKEN`: panel de Cloudflare, tipo **Secreto**. Sin ellas la web ofrece WhatsApp y correo (Calendly se quitó el 29/10/2026). El horario lo edita el panel (KV `web-agenda`, clave `AGENDA_ADMIN_TOKEN`) |
| Correos automáticos de la agenda (confirmación, aviso, recordatorios, cancelación) | `src/worker/correo-plantillas.ts` y `src/worker/correo.ts`, con Resend. Clave `RESEND_API_KEY`: panel de Cloudflare, tipo **Secreto**. Pasos en `AGENDA.md` |
| Email marketing: guía gratis, lista y secuencia de correos | `EMAIL-MARKETING.md`. Textos en `src/worker/secuencia.ts`, lista en el KV `web-suscriptores`. Usa la misma clave de Resend |
| Conexión con el panel (panel.soyluisflores.es) | Cada reserva entra como lead por el webhook `webhookFormulario` del panel (`src/worker/panel.ts`). Secretos `PANEL_WEBHOOK_URL` y `PANEL_SECRETO` en Cloudflare, que pone solo `node tools/conectar-panel.mjs`. Pasos en `AGENDA.md` |
| Asistente de IA: instrucciones y servidor | `src/worker/` y `AGENTE.md`. Lo que sabe se genera solo desde `src/data` y el blog |
| Plantillas de los correos (confirmación, recordatorios, seguimiento) | `correos/PLANTILLAS.md`. Las 1 a 3 ya las envía la web sola; el resto se pegan a mano en GoHighLevel o ActiveCampaign |
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

## Landings de campaña

`/diagnostico` (22/10/2026) y los funnels por servicio en `/diagnostico/[servicio]` (28/10/2026, por ejemplo `/diagnostico/agentes-ia`) son las landings para anuncios en Meta Ads y Google Ads. Su único objetivo es agendar la llamada de diagnóstico.

- **Identidad (decisión del titular, 29/10/2026):** los mismos colores, fuentes y piezas de la web (navy, degradado azul → violeta, Manrope e Inter). Cada funnel toma además el color de su servicio, igual que su página de servicio. La identidad lima anterior ya no existe: no la recuperes.
- **Estructura:** sin la cabecera ni el pie de la web (`Base.astro` con `identidad="campana"`), con cabecera mínima, barra fija de reserva en celular y pie legal. Plantilla: `src/components/LandingDiagnostico.astro`.
- **Gráfico animado del hero:** uno por servicio en `src/components/EscenaFunnel.astro`. Se reproduce una vez al entrar en pantalla y queda quieto; sin JavaScript o con movimiento reducido se ve terminado. Son maquetas de ejemplo: sin cifras ni clientes reales.
- **Indexación:** `noindex, follow`, canónica hacia `/contacto` (la general) o `/servicios/[servicio]`, y fuera del sitemap, porque repiten contenido. `/diagnostico` sigue enlazada desde el pie y desde `llms.txt`.
- **Textos** en `src/data/funnels.ts`; enlaces, parámetros de campaña y conversiones en `FUNNELS.md`.

## Imágenes para compartir

Cada página tiene su imagen para redes (Open Graph) en `public/og/`. Se generan con `node tools/generar-og.mjs` después de `npm run build` (necesita Edge o Chrome en el ordenador). Al añadir un servicio, un artículo o cambiar un título, vuelve a ejecutarlo, compila otra vez y sube las imágenes. Si una página no tiene la suya, usa `og-default.png`.

## Referencias

- `SISTEMA-DISENO.md`: tipografía, acentos de color y movimiento.
- `DESPLIEGUE.md` y `GUIA-CLOUDFLARE.md`: cómo está montada la publicación.
- `src/data/`: textos de la home, servicios, logos e ilustraciones.
