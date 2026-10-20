# Publicar soyluisflores.es y que se actualice sola

Hoy la web está en Cloudflare Pages como **Direct Upload**: se sube a mano y no está conectada a ningún repositorio. Cloudflare no permite convertir un proyecto Direct Upload en uno conectado a Git, así que el camino es **crear un proyecto nuevo conectado a GitHub y pasarle el dominio**. Desde ese momento, cada cambio que se suba a la rama `main` se publica solo en uno o dos minutos.

## Comprobado antes de publicar (20/10/2026)

| Comprobación | Resultado |
|---|---|
| Las 21 URL del sitemap de producción existen en esta versión | ✅ Ninguna dará 404 |
| `/api/chat` en producción | Existe una función, pero responde `503 not_configured`: **nunca ha contestado**. Esta versión no la necesita |
| Auditoría de las 22 páginas | ✅ 0 problemas |
| NIF/NIE | Solo en /aviso-legal |
| Versión de Node | El fichero `.node-version` fija la 24, la misma con la que se ha probado |

## Paso 1. Fusionar la rama en `main`

Lo hago yo cuando me lo digas. Es un avance rápido: `main` solo tiene el commit inicial, así que no hay conflictos.

## Paso 2. Crear el proyecto conectado a GitHub (lo haces tú, unos 5 minutos)

1. Entra en https://dash.cloudflare.com → **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git** (también puede aparecer como *Import an existing Git repository*).
2. Autoriza a Cloudflare en GitHub y elige el repositorio **soyluisfloresoficial/web**.
3. Configuración de compilación:

   | Campo | Valor |
   |---|---|
   | Nombre del proyecto | `soyluisflores-web` (o el que prefieras) |
   | Rama de producción | `main` |
   | Framework preset | **Astro** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. **Environment variables**: añade `PUBLIC_GTM_ID` = `GTM-NHS23ZRB` (lee antes el paso 4).
5. **Save and Deploy**. Cuando termine, Cloudflare te da una dirección `https://soyluisflores-web.pages.dev`. **Ábrela y revísala antes de seguir.**

## Paso 3. Pasar el dominio al proyecto nuevo (2 minutos; la web puede no responder unos minutos)

1. En el proyecto **antiguo** (el de Direct Upload) → **Custom domains** → quita `soyluisflores.es` y `www.soyluisflores.es`. **No borres el proyecto**: es tu vuelta atrás.
2. En el proyecto **nuevo** → **Custom domains** → **Set up a custom domain** → `soyluisflores.es` → **Activate domain**. Repite con `www.soyluisflores.es`.
3. Como el dominio ya está en Cloudflare, los registros DNS se actualizan solos.

**Para volver atrás:** quita el dominio del proyecto nuevo y vuelve a añadirlo al antiguo.

## Paso 4. Google Tag Manager: decide una de las dos opciones

En producción, GTM (`GTM-NHS23ZRB`) lo inyecta la **pasarela de etiquetas de Google de Cloudflare** (el script que carga desde `/xf06/`), y **se carga antes de que la persona acepte las cookies**. Esa inyección es una opción de la zona de Cloudflare, no del código, así que seguirá activa aunque cambies de proyecto.

- **Opción A (recomendada): que GTM lo cargue el banner de la web.** En Cloudflare, desactiva la inyección automática de la pasarela (en la zona soyluisflores.es → *Google tag gateway*) y pon `PUBLIC_GTM_ID=GTM-NHS23ZRB` en el proyecto. Así GTM solo se carga si la persona acepta, que es lo que exige la AEPD.
- **Opción B: dejar la pasarela como está** y **no** poner `PUBLIC_GTM_ID`. GTM seguirá cargando antes del consentimiento y la web no mostrará banner. **No te lo recomiendo**: que lo valore un abogado.

No pongas `PUBLIC_GTM_ID` sin desactivar la pasarela: GTM se cargaría dos veces y contaría todo doble.

## Después: cómo se publica cada cambio

- Cualquier cambio que se suba a `main` se publica solo.
- Cada rama que no sea `main` tiene su propia dirección de vista previa (`https://<rama>.soyluisflores-web.pages.dev`), útil para revisar antes de publicar.
- Si un cambio sale mal: en el proyecto → **Deployments** → el despliegue anterior → **Rollback to this deployment**.
