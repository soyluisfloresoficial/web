# Parches listos para aplicar — soyluisflores.es

Escritos contra el CSS real de producción, que está incrustado en el HTML
(79.126 caracteres, 0 hojas externas).

## Aviso importante sobre los selectores

Tu CSS usa el aislamiento de Astro: `[data-astro-cid-i3irphx7]`,
`[data-astro-cid-pmyxn7tj]`, etc. **Esos hashes cambian en cada compilación.** Por eso
NO te entrego un fichero de overrides: se rompería al primer `npm run build`.

Cada parche va donde le corresponde: en el `<style>` del propio componente o en su
plantilla. Así el hash se regenera solo y nada se rompe.

---

## Correcciones a mi crítica anterior

Dos cosas que señalé como mejorables y que **ya están bien**:

1. **`prefers-reduced-motion` sí se respeta.** Existe este bloque, que anula todo:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, :before, :after {
       scroll-behavior: auto !important;
       transition-duration: .01ms !important;
       animation-duration: .01ms !important;
       animation-iteration-count: 1 !important;
     }
   }
   ```
   Retiro esa recomendación.

2. **La burbuja de chat ya está colocada por encima de la barra fija**, con
   `bottom: 5.65rem` en el breakpoint móvil. No se solapan entre ellas. Lo que sí
   ocurre es que, al cargar en 375×812, la burbuja cae encima del botón del hero,
   porque un elemento fijo siempre tapa contenido. El problema real no es la posición:
   es tener dos llamadas permanentes.

---

## P1-A — El degradado al beneficio, no al problema

**Dónde:** el componente del hero (hoy `data-astro-cid-i3irphx7`).

**Marcado actual:**
```html
<h1 id="hero-title" class="hero-title mt-4">
  <span class="hero-line-1 block">Automatiza tu negocio con IA</span>
  <span class="hero-line-grad block"><span class="gradient-text shimmer">y deja de trabajar</span></span>
  <span class="hero-line-grad block"><span class="gradient-text shimmer">12 horas al día.</span></span>
</h1>
```

**Marcado propuesto:** el degradado pasa a la primera línea y las dos siguientes bajan
de peso visual.
```html
<h1 id="hero-title" class="hero-title mt-4">
  <span class="hero-line-grad block"><span class="gradient-text shimmer">Automatiza tu negocio con IA</span></span>
  <span class="hero-line-2 block">y deja de trabajar</span>
  <span class="hero-line-2 block">12 horas al día.</span>
</h1>
```

**CSS nuevo en el mismo componente:**
```css
.hero-line-2 {
  letter-spacing: -.03em;
  color: var(--color-soft);
  font-size: clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem);
}
```

El tamaño es deliberadamente menor que el `clamp(2.375rem, 3.85vw, 3.75rem)` de
`.hero-line-grad`, para que la jerarquía quede clara: primero el beneficio, después la
consecuencia.

---

## P1-B — Una sola llamada persistente en móvil

**Dónde:** el componente de la barra fija (`.mobile-cta`).

La regla actual:
```css
.mobile-cta {
  z-index: 40;
  position: fixed;
  inset: auto 0 0;
  /* ... */
}
```

**CSS a añadir:**
```css
.mobile-cta {
  transition: transform .25s cubic-bezier(.2,.7,.2,1), opacity .25s ease;
}
.mobile-cta[data-hidden] {
  transform: translateY(100%);
  opacity: 0;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .mobile-cta { transition: none; }
}
```

**JavaScript a añadir en el mismo componente:**
```js
const bar = document.querySelector('.mobile-cta');
const heroCta = document.querySelector('#hero-title')
  ?.closest('section')
  ?.querySelector('a[href*="calendly"], a[href*="contacto"]');

if (bar && heroCta && 'IntersectionObserver' in window) {
  bar.setAttribute('data-hidden', '');
  new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) bar.setAttribute('data-hidden', '');
      else bar.removeAttribute('data-hidden');
    },
    { threshold: 0.1 }
  ).observe(heroCta);
}
```

Mientras el botón del hero se ve, la barra está escondida. Cuando sale de pantalla, la
barra sube. Nunca hay dos llamadas idénticas a la vez.

**Ajusta el selector de `heroCta`** al que realmente uses: no he podido ver el
componente, así que esa línea es la única que depende de tu marcado.

---

## P1-C — Las seis tarjetas de servicio

**Dónde:** la sección de servicios de la home y el componente del pie.

La home enseña cuatro: Webs con IA, Funnels de conversión, Automatización y Agentes de
IA. Faltan estas dos, con los textos que ya usas en `/servicios`:

```
Tráfico de pago    → /servicios/trafico-de-pago
  "Meta Ads y Google Ads con medición correcta desde el primer día."

Consultoría IA     → /servicios/consultoria-ia
  "Diagnóstico de tu negocio y hoja de ruta priorizada."
```

**CSS de la rejilla**, para que seis caigan limpias:
```css
.services-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1fr;
}
@media (width >= 640px)  { .services-grid { grid-template-columns: repeat(2, 1fr); } }
@media (width >= 1024px) { .services-grid { grid-template-columns: repeat(3, 1fr); } }
```

3×2 en escritorio, 2×3 en tablet, 1×6 en móvil. Sin filas huérfanas en ningún ancho.

**En el pie**, la columna "Servicios" lista hoy cuatro enlaces. Añade los dos que
faltan. Lo ideal es que esa lista salga de un único array de servicios compartido entre
la home, el pie y `/servicios`, para que no se vuelva a descuadrar.

---

## P2 — El asterisco de las métricas, enlazado

**Dónde:** el componente de métricas.

Hoy: `73%*`, `12 h*`, `40%*` y abajo *"Métricas validadas en implementaciones propias
con negocios reales."*, sin destino.

**Propuesta:** convierte la nota en enlace a una sección de método.
```html
<p class="metrics-note">
  <a href="/sobre-mi#como-mido">Cómo se midieron estas cifras</a>
</p>
```

```css
.metrics-note a {
  color: var(--color-electric-soft);
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

**[COMPLETAR: contenido de esa sección — caso, periodo, método y fuente de cada cifra.]**

Si no hay caso que enseñar, la alternativa correcta es quitar las tres cifras. Un
asterisco mudo es peor que no poner nada: señala que hay letra pequeña y luego no la
enseña.

---

## P2 — Fallback de alto contraste para el texto en degradado

**Dónde:** donde esté definida `.gradient-text` (es global, sin hash).

Regla actual:
```css
.gradient-text {
  background: var(--grad-text);
  color: #0000;
  -webkit-background-clip: text;
  background-clip: text;
}
```

Ese `color: #0000` es texto transparente. En el modo de alto contraste de Windows
puede quedar invisible.

**CSS a añadir justo después:**
```css
@media (forced-colors: active) {
  .gradient-text {
    background: none;
    color: CanvasText;
    -webkit-text-fill-color: CanvasText;
  }
}
```

---

## P2 — Suavizar la aparición al hacer scroll

**Dónde:** la regla global `.reveal`.

Actual:
```css
@media (prefers-reduced-motion: no-preference) {
  .js .reveal { opacity: 0; transform: translateY(16px); transition: opacity .5s, transform .5s cubic-bezier(.2,.7,.2,1); }
}
```

**Propuesta:** que nunca llegue a invisible.
```css
@media (prefers-reduced-motion: no-preference) {
  .js .reveal { opacity: .55; transform: translateY(8px); transition: opacity .35s, transform .35s cubic-bezier(.2,.7,.2,1); }
}
```

Al bajar deprisa ya no quedan zonas en blanco, y el efecto se mantiene.

---

## P3 — Texto alternativo de las imágenes

**Decorativa**, en contacto, ROI, sobre mí, home, blog y servicios:
```html
<img src="/_astro/fondo-red...webp" alt="" aria-hidden="true">
```

**Descriptivas**, una por imagen y sin repetir:

| Imagen | alt propuesto |
|---|---|
| `agentes-ia.webp` | Agente de IA respondiendo a un cliente por chat |
| `webs-ia.webp` | Web mobile-first con formulario de contacto |
| `funnels-conversion.webp` | Embudo de conversión con las etapas medidas |
| `automatizacion.webp` | Flujo de automatización conectando varias herramientas |
| `trafico-de-pago.webp` | Panel de campañas de Meta Ads y Google Ads |
| `consultoria-ia.webp` | Hoja de ruta de adopción de IA priorizada |
| `proceso-diagnostico.jpg` | Luis Carlos Flores analizando el proceso de un cliente |
| `proceso-implementacion.jpg` | Configuración de una automatización en pantalla |
| `proceso-medicion.jpg` | Panel de métricas de un sistema ya en marcha |
| `escritorio-trabajo.jpg` | Puesto de trabajo con los paneles de seguimiento |

**[VERIFICAR: que cada alt describe lo que realmente se ve en esa imagen.]** Los he
deducido del nombre del fichero y del contexto, no las he abierto una a una.

---

## P3 — El carrusel duplicado

**Dónde:** el componente del marquee (`.tools-marquee` / `.tools-track`).

La pista mide 3.521 px y se anima en bucle, así que hay una copia de los logos. Esa
copia necesita:
```html
<ul class="tools-track" aria-hidden="true" tabindex="-1"> ... </ul>
```

Así el lector de pantalla no lee la lista dos veces y el tabulador no entra en la copia.

**No he podido confirmar desde el HTML compilado si ya está marcada.** Compruébalo en
el componente antes de tocar nada.

---

## Orden de aplicación

1. P1-C, las seis tarjetas. Arregla diseño y negocio a la vez.
2. P1-B, una sola llamada persistente.
3. P1-A, el degradado al beneficio.
4. P2, el asterisco enlazado.
5. P2, fallback de alto contraste y suavizado del reveal.
6. P3, alt y marquee.

## Marcadores pendientes

- `[COMPLETAR: contenido de la sección "cómo se midieron" — caso, periodo, método y fuente]`
- `[VERIFICAR: que cada alt propuesto describe la imagen real]`
- `[VERIFICAR: si la copia del marquee ya lleva aria-hidden]`
- `[VERIFICAR: el selector del botón del hero para el IntersectionObserver]`
