# Crítica de diseño — soyluisflores.es

Hecha el 18/10/2026 sobre el sitio en producción, mirándolo en escritorio y en móvil
(375×812) y midiendo con JavaScript lo que no se puede juzgar a ojo.

Todo lo que sigue está verificado. Donde no he podido confirmar algo sin el código
fuente, lo digo.

---

## Lo que está bien y no hay que tocar

**El sistema visual es coherente.** Base azul marino muy oscuro, acento en degradado
azul→violeta, un único lenguaje de tarjeta con borde sutil y esquinas redondeadas,
repetido sin desviaciones en las 21 páginas. No es un sitio improvisado.

**Las ilustraciones de interfaz son el mejor activo que tienes.** El chat de WhatsApp
con la conversación real, la agenda semanal con la cita creada, las barras del funnel
por etapa, la lista de automatización con las etiquetas de CRM. *Enseñan* el producto
en lugar de describirlo. Es lo que casi ningún consultor de IA tiene, y es lo que te
diferencia. Cualquier rediseño debe conservarlas y, si acaso, darles más espacio.

**Cero fallos de contraste de texto.** Medido componiendo todas las capas translúcidas
contra el fondo real, sobre todos los textos de la home: ninguno baja del mínimo AA.
Ojo, mi primera medición dio seis fallos y eran todos falsos: se tropezaba con los
fondos semitransparentes y con el texto en degradado. Los descarté.

**Sin desbordamiento horizontal en móvil.** `scrollWidth` 375 contra un viewport de
375. El carrusel de herramientas tiene una pista de 3.521 px y está correctamente
contenido, sin arrastrar la página.

**Estructura de encabezados impecable.** Un solo H1 por página en las 21, sin saltos
de nivel.

**Las animaciones de entrada están bien planteadas.** El HTML añade una clase `js` al
`<html>` antes de nada, así que sin JavaScript el contenido se ve igual. Es el patrón
correcto.

---

## P1 — El titular pelea consigo mismo

El H1 dice:

> Automatiza tu negocio con IA **y deja de trabajar 12 horas al día.**

El degradado azul→violeta se aplica a *"y deja de trabajar"* y a *"12 horas al día"*.
Resultado: lo que más pesa visualmente en toda la web, lo que el ojo caza en medio
segundo, es **"12 horas al día"**. Que es el problema, no la promesa.

En móvil es más acusado todavía, porque el titular ocupa tres líneas y las dos
resaltadas son las inferiores: la frase termina con el dolor iluminado en azul
brillante.

**Propuesta tipográfica, sin tocar la copia:** mueve el degradado a *"Automatiza tu
negocio con IA"* y deja el resto en blanco liso, un escalón más pequeño. El beneficio
pasa a dominar y la frase se lee entera sin que ninguna parte grite.

**Propuesta de copia (tu decisión):** reescribir para que lo resaltado sea el
resultado, no la carga. No propongo texto concreto porque toda alternativa fuerte
("recupera X horas") es una cifra, y las cifras están sin respaldo documentado.

---

## P1 — Tres llamadas a la acción compitiendo en el pulgar

Medido en móvil, 375×812:

| Elemento | Posición | Tamaño | z-index |
|---|---|---|---|
| `.mobile-cta` (barra fija) | y = 747 | 375 × 65 | 40 |
| `.chat` (burbuja) | y = 666, x = 303 | 56 × 56 | 80 |

Entre las dos ocupan de forma permanente los 146 px inferiores: **el 18% de la
pantalla**, siempre, en todas las páginas. Y en el primer pantallazo hay además un
tercer "Reservar diagnóstico" dentro del hero.

Son tres invitaciones a la vez. Peor: la burbuja de chat, con z-index 80, **se posa
encima del extremo derecho del botón del hero**. Se ve en la captura: el círculo
morado tapa la flecha del botón.

**Propuesta:**

1. Elige **una** llamada persistente. O la barra fija o el chat, no las dos.
2. Si quieres conservar ambas: oculta la barra fija mientras el CTA del hero esté
   visible, con un `IntersectionObserver`, y súbela solo cuando salga de pantalla.
3. Sube la burbuja a `bottom: 88px` para que nunca caiga sobre un botón, con la barra
   presente o sin ella.

Hoy el usuario tiene que decidir cuál de tres botones idénticos pulsar. Eso no sube la
conversión, la dispersa.

---

## P1 — La parrilla de servicios enseña cuatro de seis

Confirmado visualmente en la home: Webs con IA, Funnels de conversión, Automatización
y Agentes de IA. **Tráfico de pago y Consultoría IA no aparecen** ni en la home ni en
el pie. Solo existen dentro de `/servicios`.

Esto ya salía en la auditoría SEO, pero visualmente tiene una ventaja añadida: seis
tarjetas caen mejor en rejilla que cuatro. 3×2 en escritorio, 2×3 en tablet, 1×6 en
móvil. La parrilla actual de cuatro deja la fila incompleta en varios anchos.

**Propuesta:** las seis, en 3×2. Es más ordenado *y* arregla el agujero comercial.

---

## P2 — Un asterisco que no lleva a ninguna parte

El bloque de resultados muestra **73%**, **12 h**, **40%**, cada uno con asterisco, y
abajo la nota:

> *Métricas validadas en implementaciones propias con negocios reales.

Visualmente eso es un descargo de responsabilidad, no una prueba. Un asterisco que no
es un enlace es la forma más débil de respaldar una cifra: señala que hay letra
pequeña y luego no la enseña.

**Propuesta:** convierte el asterisco en un enlace real a un caso o a una sección de
método, aunque sea anonimizado. Si no hay caso que enseñar, quita las cifras. Mantener
un asterisco mudo es lo peor de las dos opciones: pierdes la credibilidad de la cifra
y además admites por escrito que necesita explicación.

---

## P2 — Las animaciones de entrada se perciben lentas

Al bajar rápido, secciones enteras se quedan en blanco un par de segundos antes de
aparecer. El mecanismo está bien construido —sin JavaScript el contenido se ve— pero
la sensación al desplazarse deprisa es de web que no termina de cargar.

**Propuesta:** anima de `opacity: 0.6` a `1` en vez de desde `0`, reduce el
desplazamiento vertical a unos 8 px, y respeta `prefers-reduced-motion`. El contenido
nunca llega a estar invisible y el efecto se mantiene.

---

## P2 — El texto en degradado puede desaparecer en alto contraste

Los titulares con degradado usan `color: transparent` con `background-clip: text`. En
el modo de alto contraste de Windows (`forced-colors`), ese patrón puede renderizarse
invisible.

**Propuesta:** añade un bloque `@media (forced-colors: active)` que devuelva un color
sólido y anule el `background-clip`. Son cuatro líneas de CSS.

---

## P3 — Imágenes sin texto alternativo

Siete en la home, siete en `/blog`, cinco en `/servicios`, y `fondo-red.webp` suelta en
contacto, ROI y sobre mí.

**Propuesta:** `alt=""` para `fondo-red.webp`, que es decorativa. Alt descriptivo y
único para las de servicios y para las tres del proceso (diagnóstico, implementación,
medición).

---

## P3 — El carrusel de herramientas

La pista mide 3.521 px y se repite en bucle, lo que implica que hay una copia duplicada
de los logos. Esa copia debe llevar `aria-hidden="true"` y `tabindex="-1"` para que un
lector de pantalla no lea dos veces la lista y el tabulador no se pierda dentro.

En el HTML compilado solo veo un contenedor `.tools-marquee`, así que **no puedo
confirmar desde fuera si la copia ya está marcada**. Hay que verlo en el componente.

---

## Orden de ejecución que recomiendo

1. Las seis tarjetas de servicio en la home y en el pie. Arregla diseño y negocio a la vez.
2. Una sola llamada persistente en móvil, y la burbuja fuera de los botones.
3. El degradado del titular al beneficio.
4. El asterisco de las métricas: enlace o fuera.
5. Alt de las imágenes y fallback de alto contraste.
6. Suavizar las animaciones de entrada.

Los puntos 1 a 4 se notan en conversión. Los 5 y 6 son higiene.

---

## Lo que no he podido evaluar

- **Rendimiento real.** Sin medición de campo no sé los Core Web Vitals, y la web no
  tiene analítica: Google Tag Manager no tiene ID configurado y nunca llega a cargar.
- **El marquee duplicado**, como he explicado arriba.
- **Cualquier cosa por debajo del HTML compilado**: componentes, tokens de diseño,
  variantes. Para eso hace falta el repositorio.
