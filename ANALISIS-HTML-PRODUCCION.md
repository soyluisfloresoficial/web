# Análisis del HTML de la home en producción

Fecha: 19 de octubre de 2026. Fuente: el HTML completo de `https://soyluisflores.es/` que me pasaste.

## Antes de nada: de dónde sale este HTML

Este HTML **no sale del repositorio que tengo** (`movimiento-oct-2026`). Es otra base de código: usa Tailwind v4.3.3 y tiene componentes que mi repo no tiene (chat, banner de cookies, sección «Un cliente escribe de noche», tira de métricas, marquesina de herramientas, tarjetas flotantes del hero). Lo he comprobado: en `src/components/` solo hay `Header`, `Footer` y `JsonLd`, y no hay rastro de `/api/chat` ni del banner.

Consecuencia práctica: no puedo editar el código fuente de este HTML porque no lo tengo. Lo que sigue son hallazgos verificados con **el parche exacto para pegar** en esa base de código. Si me pasas su carpeta (o la subes a GitHub), los aplico yo.

Leyenda: **P0** se arregla hoy · **P1** esta semana · **P2** mejora con impacto · **P3** pulido.

---

## P0 · Legal y datos

### 1. El NIF/NIE y la calle salen en el pie de todas las páginas

```
Luis Carlos Flores · Manresa, Barcelona, España · Carrer Pujada Roja, 08243 · NIF/NIE Z2428176W
```

Está en el `<footer>`, así que se repite en las 22 páginas y lo indexan los buscadores y los rastreadores de IA. Tu regla era «NIE/NIF y calle: solo en /aviso-legal». La LSSI (art. 10) exige que esos datos sean accesibles de forma «permanente, fácil, directa y gratuita»; un enlace a /aviso-legal desde el pie lo cumple. **Que lo confirme un abogado**, pero no hay obligación de ponerlo en el pie.

```html
<p>Luis Carlos Flores · Manresa, Barcelona · <a href="/aviso-legal" class="link">Datos del titular</a></p>
```

Después, pide a Google que retire la versión en caché: Search Console → Retiradas → «Borrar URL en caché».

### 2. El correo está ofuscado para las personas, pero en claro en el JSON-LD

En la página se ve `[email protected]` (lo pone la «Email Address Obfuscation» de Cloudflare) y el JSON-LD lleva `"email":"mailto:hola@soyluisflores.es"` en texto plano. La ofuscación no protege nada, porque el dato ya está publicado, y tiene coste:

- Sin JavaScript, el visitante ve «[email protected]».
- Los rastreadores de IA que no ejecutan JS (la mayoría) no ven tu correo de contacto: va en contra del objetivo GEO.
- Si falla el script, el enlace lleva a una página de Cloudflare.

**Arreglo:** Cloudflare → Scrape Shield → desactivar *Email Address Obfuscation*. No hace falta tocar código.

---

## P1 · Cosas que están rotas

### 3. Google Tag Manager no se carga nunca

```js
if (c || !/^GTM-[A-Z0-9]+$/.test(``)) return;      // ID vacío → siempre sale
e.src = `https://www.googletagmanager.com/gtm.js?id=`;
```

El ID está vacío, así que la expresión regular falla y GTM no arranca nunca, ni aceptando todas las cookies. El banner de consentimiento, el Consent Mode y los eventos `cta_calendly_click` funcionan, pero nadie los recoge. **Ahora mismo no mides ni una conversión.** Arreglo: pon el ID real (`GTM-XXXXXXX`) en la variable de entorno o la constante de donde lo lea el componente.

### 4. El chat depende de `/api/chat`, y en un despliegue *Direct Upload* estático probablemente no exista

Si el endpoint da 404, el código falla de forma controlada y responde siempre «Ahora mismo no puedo responder…». El fallo está bien gestionado, pero la interfaz promete otra cosa: un punto verde con «en línea», «Resuelvo dudas sobre IA y automatización» y tres preguntas sugeridas. Si es así, **todos los visitantes que lo prueban reciben una disculpa**. Para un consultor de agentes de IA, un chat que no responde es la peor demostración posible.

Compruébalo: `https://soyluisflores.es/api/chat` en el navegador. Si da 404, quita el widget hasta que exista la función (Cloudflare Pages Functions o un Worker), o conviértelo en un bot de FAQ con respuestas fijas sacadas de las 12 preguntas que ya tienes.

### 5. La imagen del hero se descarga dos veces, en la ruta crítica del LCP

```css
.hv-photo { background: var(--hero-img) center / cover no-repeat, var(--color-navy-2); }
```
```html
<div class="hv-photo" style="--hero-img: url(/_astro/luis-flores-monitores…webp)">
  <picture>…AVIF/WebP/JPG…</picture>
```

El `<img>` cubre todo el contenedor (`width:100%; height:100%; object-fit:cover`), así que el fondo CSS nunca se ve, pero el navegador lo descarga igualmente: un WebP completo que compite con el AVIF precargado. Arreglo: quita `var(--hero-img)` de las dos reglas `.hv-photo` (la base y la de `width>=768px`) y la variable `--hero-img` del `style` en línea.

### 6. En móvil, el botón del chat tapa el banner de cookies

El chat va en `z-index: 80` y `bottom: 5.65rem`; el banner, en `z-index: 50` y abajo del todo. En la primera visita en móvil, el botón queda encima del aviso de cookies, justo sobre los botones. Arreglo:

```css
body:has([data-cookie-banner]:not([hidden])) .chat { display: none; }
```

### 7. El campo del chat hace zoom en iPhone

`.chat-form textarea { font-size: .875rem }` (14 px). iOS Safari amplía la página al enfocar cualquier campo de menos de 16 px. Arreglo: `font-size: 1rem;`.

### 8. El panel del chat usa `100vh` en móvil

`height: min(32rem, 100vh - 7rem)`. En iOS, `100vh` es la altura con la barra del navegador escondida, así que el panel se mete por debajo. El `<body>` ya usa `min-h-dvh`; solo faltaba aquí. Arreglo: `100dvh` en las dos reglas (`.chat-panel` y la de `width<=480px`).

### 9. Siguen saliendo 4 de los 6 servicios

En la home y en el pie hay 4 servicios: Webs, Funnels, Automatización y Agentes. Pero el CSS define `--svc-trafico-de-pago` y `--svc-consultoria-ia`, así que existen 6. **Tráfico de pago** y **Consultoría IA** no reciben ningún enlace interno ni desde la home ni desde el pie, que es la señal más fuerte que tiene Google para saber qué páginas importan. Es el mismo fallo de la auditoría de la fase 0. Arreglo: que la rejilla y el pie lean la misma lista de 6, como hice en mi repo con `src/data/servicios.ts`.

### 10. La nota de las métricas se ve a unos 9 px en portátiles

`.hv-note` (11 px) está dentro de `.hv-cards`, y entre 1024 y 1279 px esa capa lleva `transform: scale(.85)`: 11 × 0,85 = **9,35 px**. Es justo la nota que respalda el 73 %, 12 h y 40 %. Arreglo: saca el `<p class="hv-note">` de `.hv-cards` y ponlo como hermano, o compénsalo con `.hv-note { font-size: calc(.6875rem / .85) }` en ese tramo.

---

## P1 · Una incoherencia de color que se nota

### 11. Hay dos azules marino mezclados

Los tokens dicen que el fondo es casi negro: `--color-navy: #07090d`, `--color-navy-2: #0a0e1a`. Pero buena parte de los componentes llevan escrito a mano el azul marino de antes:

| Valor fijo | Dónde aparece |
|---|---|
| `#07112a` | cabecera, barra CTA móvil, sombreado del hero, `theme-color` |
| `#0a1631` | `.svc-media::after`, `.cta-panel`, `.roi-band`, `.tinted--soft` |
| `#0c1834` | tarjetas flotantes, `.svc-badge`, `.about-card` |
| `#141b2d` | `.std:hover` |

La prueba de que la migración se quedó a medias está en una sola línea:

```css
.hv-shade { … linear-gradient(0deg, var(--color-navy) 0%, #07112a00 32%) }
```

Un extremo usa el token y el otro, el color antiguo. Resultado: la cabecera fija, la barra móvil, el panel final y el difuminado del hero se ven más azules que la página. La diferencia de luminancia es pequeña (1,07:1), pero el tono cambia: es un azul saturado sobre un negro neutro, y en pantallas OLED se ve como una franja.

Arreglo: sustituir los valores fijos por tokens. Si quieres conservar el azul, que sea un token (`--color-navy-tinted`), no un hex suelto.

```css
--color-navy-glass: rgb(7 9 13 / .9);    /* cabecera, barra móvil */
--color-surface-2:  #0d1220;             /* paneles, tarjetas flotantes */
```

Y `<meta name="theme-color" content="#07090d">` para que la barra del navegador móvil coincida con la página.

### 12. El interior de los anillos de los iconos no coincide con su tarjeta

```css
.icon-ring { background: linear-gradient(var(--color-navy), var(--color-navy)) padding-box, var(--grad-icon) border-box; }
```

El relleno siempre es `#07090d`, pero los anillos están sobre tarjetas de color `#0e1320` (métricas) o en secciones `#0a0e1a`. Se ve un disco más oscuro dentro de cada tarjeta. Arreglo:

```css
.icon-ring { background: linear-gradient(var(--ring-bg, var(--color-navy)), var(--ring-bg, var(--color-navy))) padding-box, var(--grad-icon) border-box; }
.metric-card { --ring-bg: #0e1320; }
.bg-navy-2   { --ring-bg: var(--color-navy-2); }
```

---

## P2 · Rendimiento

### 13. Hay demasiadas animaciones infinitas a la vez

En la home corren a la vez, y sin parar:

- 2 auroras con `filter: blur(45px)` animando `transform`
- 3 tarjetas flotantes
- 1 marquesina de 26 elementos
- 1 brillo que anima `background-position` sobre el H1 (repinta texto en cada fotograma, no se puede componer en GPU)
- 4 puntos que laten animando `box-shadow` (otra propiedad que obliga a repintar)
- 1 capa de ruido fija a pantalla completa (`body::after`)

`prefers-reduced-motion` solo protege a quien lo tiene activado, que es una minoría. En un Android de gama media esto pesa en el INP y en la batería. Propuesta, por orden de impacto:

```css
/* El brillo del H1: tres pasadas y se para */
.shimmer { animation-iteration-count: 3; }

/* Los puntos: latido con transform en un pseudoelemento, no con box-shadow */
.pulse-dot { position: relative; animation: none; }
.pulse-dot::after { content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: inherit; animation: latido 2.4s ease-out infinite; }
@keyframes latido { to { transform: scale(2.6); opacity: 0; } }

/* Auroras: sin blur. El radial-gradient ya es suave */
.page-aura > .aura::before, .page-aura > .aura::after { filter: none; }

/* En móvil, ni ruido ni flotación */
@media (width < 768px) { body::after { display: none; } .fc { animation: none; } }
```

### 14. `getBoundingClientRect()` en cada movimiento del ratón

```js
function onMove(e) {
  var card = e.target.closest('.spotlight');
  if (card) { var r = card.getBoundingClientRect(); … }   // fuera del rAF
  if (pending) return; …
}
```

La lectura del rectángulo está **fuera** del `requestAnimationFrame`, así que fuerza un recálculo de maquetación en cada evento `pointermove` (hasta 120 por segundo) mientras el ratón pasa por cualquier tarjeta. Arreglo: guarda solo `lastE` y haz todas las lecturas dentro del rAF que ya existe.

### 15. `content-visibility: auto` con una altura inventada provoca saltos

`.cv-auto { contain-intrinsic-size: auto 640px }` va en secciones que miden entre 500 y más de 1.100 px (la FAQ, la sección «Por dentro»). La primera vez que cada una entra en pantalla, la altura real sustituye a los 640 px y la barra de desplazamiento salta. Arreglo: mide cada sección y dale su propio valor, o quita `cv-auto` de las secciones de menos de dos pantallas.

### 16. Unos 60 KB de CSS incrustados en cada página

Todo el CSS va en línea en el `<head>`, así que no se cachea entre páginas: quien ve tres páginas lo descarga tres veces. Arreglo en `astro.config.mjs`: `build: { inlineStylesheets: 'auto' }`. Astro solo incrustará las hojas pequeñas y el resto se cacheará.

### 17. Manrope 400 se declara pero no se usa

Los titulares usan Manrope 700 y 800, y el texto usa Inter. No he visto nada en Manrope 400. Son entre 15 y 25 KB menos si se quita el `@font-face`. Antes de borrarlo, búscalo en el código fuente (`font-display` + `font-normal`).

---

## P2 · SEO y GEO (buscadores de IA)

### 18. No hay ni una frase que defina lo que haces

El H1 es un beneficio («deja de trabajar 12 horas al día») y el subtítulo es una lista. Un motor de IA que responda «¿qué hace Luis Flores?» tiene que deducirlo. Hace falta una frase declarativa visible cerca del inicio, repetida en el JSON-LD:

> Luis Carlos Flores implementa agentes de IA, automatizaciones y funnels de conversión para pymes y emprendedores de España y Latinoamérica, desde Manresa.

Ahora mismo **ni `Person` ni `Organization` tienen `description`**, y ese es el campo que más leen.

### 19. JSON-LD: lo que falta

```json
{ "@type": "WebPage", "@id": "https://soyluisflores.es/#webpage",
  "url": "https://soyluisflores.es/", "inLanguage": "es-ES",
  "isPartOf": { "@id": "https://soyluisflores.es/#website" },
  "about": { "@id": "https://soyluisflores.es/#person" },
  "dateModified": "2026-10-19" }
```

- El `FAQPage` no tiene `@id` ni relación con la página: añade `"@id": ".../#faq"` y `"isPartOf": {"@id": ".../#webpage"}`.
- `Person` sin `image` ni `description`.
- `"areaServed": ["ES", "Latinoamérica"]` mezcla un código ISO con texto libre. Mejor así: `["ES", {"@type": "Place", "name": "Latinoamérica"}]`.
- Faltan los 6 servicios como `Service` (o un `OfferCatalog` en `Organization`).
- «Actualizado: octubre de 2026» está en el pie como texto. Ponlo como `<time datetime="2026-10">` y en `dateModified`.

### 20. La home no enlaza a ningún artículo del blog

Para una estrategia de contenido y GEO, mostrar los dos o tres artículos más recientes en la home le da a los rastreadores contexto actualizado sobre los temas que trabajas. Es una sección de cinco líneas que lee la colección del blog.

### 21. El snippet de Google y el botón no prometen lo mismo

La meta description dice «Agenda tu llamada gratuita de 30 min», y todos los botones dicen «Reservar diagnóstico». Que el resultado de búsqueda use las mismas palabras que el botón: «Reserva un diagnóstico gratuito de 30 minutos».

### 22. Un «vosotros» en una página que también se dirige a Latinoamérica

> «…sin que tú ni tu equipo **toquéis** nada»

Es correcto en español de España, que es tu regla. Pero en LATAM suena ajeno, y es el único sitio de la home donde aparece. Hay una versión neutra que sigue siendo español de España: «sin que nadie de tu equipo tenga que tocar nada».

---

## P2 · Accesibilidad

### 23. El texto en degradado desaparece en modo de alto contraste

`.gradient-text { color: transparent; background-clip: text }`. Con el contraste alto de Windows (*forced colors*), el navegador quita los fondos y **dos de las tres líneas del H1 quedan invisibles**, igual que las cifras de las métricas. Los iconos con `stroke="url(#lf-grad-stroke)"` tienen el mismo problema.

```css
@media (forced-colors: active) {
  .gradient-text { color: CanvasText; background: none; -webkit-text-fill-color: currentColor; }
  svg [stroke^="url("] { stroke: CanvasText; }
}
```

### 24. La navegación no marca la página actual

En la home, el enlace «Inicio» no lleva `is-active` ni `aria-current="page"`. El CSS para el estado activo existe, pero la lógica que pone la clase no funciona, al menos en `/`. Arreglo en el componente de cabecera: comparar `Astro.url.pathname` con cada `href` y poner `aria-current="page"` (y enganchar el estilo a ese atributo en lugar de a la clase).

### 25. El texto seleccionado no llega al contraste mínimo

`::selection { background: #007bff; color: #fff }` da **3,98:1**, y el mínimo AA es 4,5:1. Arreglo: `background: #0a5bd6` (blanco sobre ese azul pasa de 5:1).

### 26. `<strong>` se debilita en todo el sitio

`strong, b { font-weight: 500 }` hace que el énfasis sea más fino que la negrita del navegador. Solo `.hero-proof b` lo vuelve a poner a 700. Arreglo: `font-weight: 700` en la regla base.

### 27. El chat se ve sin JavaScript y no hace nada

Sin JS, el formulario envía un GET vacío (el `textarea` no tiene `name`). Como ya añades la clase `js` a `<html>`:

```css
html:not(.js) .chat { display: none; }
```

---

## P3 · Seguridad (gravedad baja)

### 28. El chat permite inyectar atributos HTML desde los enlaces

```js
var esc = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
return esc.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" …>$1</a>')
```

No se escapan las comillas, así que una URL que contenga `"` cierra el `href` y permite meter atributos como `onmouseover`. Hoy el texto solo viene de lo que escribe el propio usuario o de la respuesta de `/api/chat`, así que el riesgo es bajo. Pero si el backend llegara a devolver contenido de terceros, el fallo pasaría a ser real. El arreglo es una línea:

```js
var esc = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
```

---

## Lo que está bien hecho

Para que no se pierda al aplicar los cambios:

- **Banner de cookies conforme a la AEPD.** Rechazar, Configurar y Aceptar tienen el mismo peso visual, no se carga nada antes del consentimiento, la elección caduca a los 12 meses y el Consent Mode va por defecto en `denied`.
- **Honestidad en los ejemplos.** «Ejemplos ilustrativos, no capturas de clientes», la calculadora ROI «orientativa y basada en hipótesis» y el aviso «Respuestas generadas por IA». Es exactamente el tono que pediste.
- **LCP bien trabajado**, salvo la doble descarga: precarga AVIF con `imagesrcset`, `fetchpriority="high"` y `object-position` por punto de corte.
- **Fuentes sin saltos.** Las métricas de las fuentes de reserva (`size-adjust`, `ascent-override`) evitan el CLS al cambiar de fuente.
- **`overflow-x: clip`** en lugar de `hidden`, que no rompe el `position: sticky` de la cabecera.
- **Movimiento reducido bien resuelto en la marquesina.** Se para, los elementos pasan a varias líneas y los duplicados se ocultan.
- **Acordeón exclusivo con `<details name>`**, sin JavaScript.
- **Accesibilidad básica sólida.** Enlace para saltar al contenido, `aria-labelledby` en todas las secciones, foco visible de 5:1 en todo el sitio, áreas táctiles de 44 px y jerarquía de encabezados sin saltos.

---

## Lo que no se arregla con código

La mayor palanca de conversión que queda no es técnica: **no hay ni un testimonio ni un caso real**. Hiciste bien en no inventarlos. Pero dos o tres testimonios con nombre y un caso anonimizado con fecha y método de medición harían más por las reservas que todo lo de arriba junto.

Marcadores que siguen abiertos:

- **[COMPLETAR]** Respaldo del 73 %, las 12 h y el 40 % (periodo, número de negocios, cómo se midió). Ahora aparecen tres veces en la home con un asterisco que no enlaza a ninguna parte.
- **[COMPLETAR]** ID de GTM.
- **[VERIFICAR]** Si `/api/chat` existe en producción.
- **[VERIFICAR]** Si la política de privacidad menciona el chat: guarda el historial en `sessionStorage` y lo envía a un servidor. **Que lo revise un abogado**; no he tocado ningún texto legal.
- **[VERIFICAR]** Que `/logo-luis-flores.png` mida al menos 112 × 112 px (el mínimo de Google para el logo).

## Orden recomendado

1. Hoy, y sin tocar código salvo el pie: **1** (NIF), **2** (ofuscación en Cloudflare) y **3** (ID de GTM).
2. Una tarde: **5, 6, 7, 8, 10** (CSS puntual) y **9** (los 6 servicios).
3. Una sesión: **11 y 12** (tokens de color) y **13 y 14** (rendimiento).
4. Después: **18 a 20** (GEO) y el resto.

---

## Estado en este repositorio (rama `movimiento-oct-2026`)

Aplicado el 19/10/2026 y verificado sobre el HTML generado (`dist/`, 22 páginas).

### Aplicado

| # | Qué | Cómo se ha verificado |
|---|---|---|
| 11 | Cabecera y `theme-color` con el negro de la paleta. Nuevos tokens `--color-navy-glass` y `--color-navy-glass-blur` en `global.css` | 0 apariciones de `#07112a` en `dist/`; la cabecera se pinta `rgba(7, 9, 13, 0.77)` |
| 17 | Fuera Manrope 400 (`@font-face` y fichero). Todos los usos de `--font-display` son 700 u 800 | 0 referencias en `dist/` |
| 18 | Frase que define el servicio: `SITIO.descripcion` en `Person.description`, y el subtítulo del hero dice «pymes y emprendedores de España y Latinoamérica» | JSON-LD de la home |
| 19 | Nodo `WebPage` en la home; `FAQPage` enlazado con `isPartOf`; `ItemList` con los 6 servicios; `Person.image` (retrato); `Organization.description`; `areaServed` igual en todos los nodos (`AREA_SERVIDA`); logo de 180 × 180 en vez del logotipo apaisado, que no llegaba al mínimo de 112 px de Google | Todos los `@id` referenciados existen en el grafo |
| 20 | Sección «Del blog» en la home con los 3 artículos más recientes | 3 enlaces a `/blog/…` en la home; tarjetas de la misma altura (317 px) |
| 21 | Meta description con las palabras del botón: «Reserva un diagnóstico gratuito de 30 min» (151 caracteres) | HTML de la home |

### Ya estaba resuelto aquí

- **1** NIF y calle solo en `/aviso-legal`: 0 apariciones en las otras 21 páginas.
- **5** Doble descarga del hero: aquí solo hay un `<Image>`, sin fondo CSS.
- **9** Los 6 servicios en la home, el pie y `/servicios`, todos leídos de `src/data/servicios.ts`.
- **22** Ningún «vosotros» en el contenido.
- **23** `forced-colors` para el texto en degradado.
- **24** `aria-current="page"` en la navegación.
- Barra de progreso: aquí va con CSS (`animation-timeline: scroll()`), sin escuchar el scroll con JavaScript.

### No aplica: este repo no tiene ese componente

- **3** GTM, **4, 6, 7, 8, 27, 28** chat, **10** nota de las tarjetas flotantes, **12** `.icon-ring`, **13** auroras, marquesina, puntos que laten y capa de ruido, **14** spotlight con el puntero, **15** `content-visibility`, **16** `inlineStylesheets` (aquí se usa el valor por defecto, `auto`), **25** `::selection` y **26** `strong` (no hay reglas propias, así que se usan los valores del navegador).
- Si esos componentes se traen a este repo, hay que aplicarles los parches de arriba **antes** de publicarlos.

### Fuera del código

- **2** Desactivar *Email Address Obfuscation* en Cloudflare (Scrape Shield). Este repo pinta el correo como texto normal, pero Cloudflare lo volverá a ofuscar al servir la página si la opción sigue activa.
- **Sin `dateModified` en la home.** Es deliberado, por el mismo criterio que el sitemap: no hay una fecha real de cambio de contenido que poner.

---

## Componentes traídos de producción (20/10/2026)

Este repositorio pasa a ser la versión de referencia. Se han traído las piezas que solo tenía la versión en producción, con los arreglos del análisis ya aplicados. Todo verificado en el navegador, en escritorio y a 375 px.

| Pieza | Dónde | Qué cambia respecto a producción |
|---|---|---|
| Banner de cookies + GTM con Consent Mode v2 | `src/components/CookieBanner.astro` | Solo aparece si `PUBLIC_GTM_ID` tiene un ID válido: sin GTM no hay nada para lo que pedir permiso (**3**). Misma clave `lf-consent-v1`, así que quien ya eligió no vuelve a ver el banner. Comprobado: con el ID de prueba, Rechazar y Guardar no cargan GTM y el consentimiento queda en `denied`; «Configurar cookies» del pie lo reabre con el panel |
| «Un cliente escribe de noche» | `src/components/Showcase.astro` | Las barras del embudo se animan con `transform`, no con `width` (**13**). Sin «vosotros» en el texto de la web (**22**). Mantiene el aviso «Ejemplos ilustrativos, no capturas de clientes» |
| Métricas 73 % · 12 h · 40 % | home, datos en `src/data/home.ts` | El asterisco lleva a `/sobre-mi#como-mido`; en producción no llevaba a ningún sitio. Salen una vez en la home, no tres |
| Banda de la calculadora ROI | home | Barras decorativas con `transform` y marcadas `aria-hidden` |
| Avisos «¿No sabes por cuál empezar?» y «¿Tu duda no está aquí?» | home | Igual que producción |
| Chat de preguntas rápidas | `src/components/Chat.astro` | Responde en el navegador con la FAQ y los servicios: sin `/api/chat`, sin IA y lo dice (**4**). No guarda ni envía nada. Pinta con `textContent`, sin `innerHTML` (**28**). Campo a 16 px (**7**), panel en `dvh` (**8**), oculto sin JavaScript (**27**) y mientras el banner está abierto (**6**). Sin el punto falso de «en línea» |
| Barra de reserva en móvil | `src/components/BarraMovil.astro` | No sale en `/contacto` |

### Cambio de base: fuera `ClientRouter`

`ClientRouter` navegaba sin recargar la página. Con GTM eso hacía que solo se contara la primera página vista, y además el menú móvil dejaba de responder después de la primera navegación, porque la cabecera se reemplazaba sin volver a ejecutar su script. La transición entre páginas la hace ahora el CSS (`@view-transition`) con recargas normales. Comprobado: menú móvil abierto en `/servicios` tras llegar desde la home.

### Lo que no se ha traído, a propósito

- **Auroras con `blur`, capa de ruido fija, brillo infinito del H1, tarjetas flotantes, puntos que laten y spotlight con el puntero.** Son las animaciones infinitas del hallazgo **13** y la lectura de `getBoundingClientRect` del **14**.
- **`content-visibility` con 640 px fijos** (**15**).
- **Los botones que van directos a Calendly.** Aquí todos llevan a `/contacto`, como el resto del repo. Si prefieres el salto directo, es cambiar el `href` en un sitio.
- **`site.webmanifest`.** No es necesario para una web de este tipo.

### Sigue pendiente

- **[COMPLETAR]** `PUBLIC_GTM_ID` en Cloudflare Pages.
- **[COMPLETAR]** Respaldo de las tres métricas.
- **[VERIFICAR]** Que la política de cookies describa GTM tal como lo carga el banner. **Que lo revise un abogado**; no he tocado el texto legal.
- **Desplegar esta rama.** Hasta entonces, soyluisflores.es sigue sirviendo la otra versión, con el NIF en el pie.
