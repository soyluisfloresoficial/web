# soyluisflores.es

Código fuente de la web de Luis Carlos Flores: consultor de IA, automatización
y funnels de conversión para pymes de España y LATAM.

Reconstruido en octubre de 2026 a partir del HTML de producción, porque el
sitio estaba desplegado en Cloudflare Pages como **Direct Upload** y no existía
código fuente en ningún sitio.

> **Este repositorio es la versión de referencia de la web** (decisión del
> 20/10/2026). El sitio que está ahora en soyluisflores.es salió de otra base
> de código (Tailwind v4.3.3) cuyo código fuente no se conserva. Lo que solo
> tenía aquella versión se ha traído aquí con los arreglos del análisis ya
> aplicados: banner de cookies con GTM, la sección «Un cliente escribe de
> noche», métricas, banda de la calculadora, chat de preguntas rápidas y
> barra de reserva en móvil. Hasta que se despliegue esta rama, lo que hay en
> el aire sigue siendo la otra versión. El detalle está en
> [`ANALISIS-HTML-PRODUCCION.md`](ANALISIS-HTML-PRODUCCION.md).

## Variables de entorno

| Variable | Para qué | Si falta |
|---|---|---|
| `PUBLIC_GTM_ID` | ID de Google Tag Manager (`GTM-XXXXXXX`). En Cloudflare Pages: Settings → Environment variables | No se carga GTM, no se muestra el banner de cookies ni el botón «Configurar cookies» del pie |

## Stack

- [Astro](https://astro.build) 7.4.0, salida estática
- CSS propio con variables, sin frameworks de utilidades
- Fuentes autoalojadas (Manrope y Inter, subset latin)
- `@astrojs/sitemap` para el sitemap, con `lastmod` real en los posts

## Empezar

```bash
npm install
npm run dev      # desarrollo en localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/ para comprobarlo
```

## Aviso importante sobre la ruta del proyecto

**No construyas este proyecto dentro de una carpeta redirigida por MSIX**
(las rutas tipo `AppData\Local\Packages\<app>\LocalCache\...`). En esas rutas
Vite ve dos rutas absolutas distintas para el mismo fichero, el CSS se compila
en `dist/_astro/` pero **nunca se enlaza desde el HTML**, y la web se publica
sin estilos. El build no da ningún error: hay que mirar el HTML generado.

Si te pasa, comprueba:

```bash
grep -c 'rel="stylesheet"' dist/index.html
```

Debe devolver al menos 1.

## Estructura

```
src/
  data/           origen único de servicios, contenido de la home y detalles
  content/
    blog/         los posts, en Markdown con frontmatter
    legal/        aviso legal, privacidad y cookies (texto sin tocar)
  components/     cabecera, pie, JSON-LD
  layouts/        Base.astro: head, metadatos y grafo de schema
  pages/          rutas
  styles/         global.css: tokens de diseño y utilidades
```

### Un solo origen para los servicios

`src/data/servicios.ts` es la única lista de los seis servicios. La home, el
pie, `/servicios`, el 404 y el `llms.txt` leen de ahí. La web anterior tenía
una lista distinta en cada sitio y por eso enseñaba cuatro de los seis.

### llms.txt

Se genera en cada build desde los servicios y los posts reales
(`src/pages/llms.txt.ts`). El anterior se mantenía a mano y había quedado
desactualizado, describiendo páginas que ya no existían.

## Pendiente

- Respaldo documentado de las cifras 73% / 12 h / 40%.
- Número real de WhatsApp (en producción el enlace es un marcador sin sustituir).
- Sección de demo de la home (chat, agenda, funnel) y banner de cookies.
- Google Tag Manager: en producción no tiene ID y nunca llega a cargar.
