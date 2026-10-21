# Sistema de diseño de soyluisflores.es

Referencia de tipografía, color y movimiento. Todo vive en `src/styles/global.css`. Si añades algo, sigue estas reglas en lugar de escribir valores sueltos.

## Tipografía

| Familia | Pesos con fichero real | Uso |
|---|---|---|
| **Manrope** | 700, 800 | Titulares, botones (`.cta`, `.cta-cabecera`) y enlaces de acción (`.card-link`) |
| **Inter** | 400, 500, 600 | Texto, `strong` / `b` (600) |

`font-synthesis-weight: none` está activado: si pides un peso que no existe, el navegador usa el más cercano en vez de engordar el trazo. Antes, todos los botones y negritas salían a 700 en Inter, un peso que no estaba cargado, así que el navegador dibujaba una negrita falsa.

### Escala (de 375 a 1440 px de ancho)

| Token | Tamaño | Uso |
|---|---|---|
| `--step--1` | 13 → 14 px | Antetítulos, notas, migas |
| `--step-0` | 16 → 17 px | Texto base (antes bajaba a 15 px) |
| `--step-1` | 18 → 20 px | `.lead`, H3 base |
| `--step-2` | 21 → 25 px | Títulos de tarjeta, `.h-pequeno` |
| `--step-3` | 28 → 36 px | H2 (antes no tenía tamaño y salía a unos 24 px) |
| `--step-4` | 36 → 52 px | H1 de las páginas interiores |

El H1 de la home tiene sus propios tamaños en `index.astro`.

### Reglas

- Titulares con `text-wrap: balance`; párrafos y listas con `text-wrap: pretty`, para que no quede una palabra sola en la última línea.
- Interlineado: 1,08 en H1, 1,15 en H2, 1,3 en H3 y 1,65 en el texto.
- `.lead` como mucho 62 caracteres por línea.
- Las cifras (`.cifra`, `.paso-numero`, `time`) van con números de ancho fijo.
- Enlaces: sin subrayado por defecto; los que van dentro de un párrafo o una lista, en `main`, sí van subrayados (WCAG 1.4.1).

## Color: acentos

Cada sección elige un acento con `data-acento`. Cambian a la vez el antetítulo, el filete bajo el H2, el borde de las tarjetas al pasar el ratón y los números del método.

| `data-acento` | Relleno | Texto | Contraste del texto sobre el fondo más claro (surface) |
|---|---|---|---|
| *(sin atributo)* azul | `#007bff` | `#66b2ff` | 8,14:1 |
| `violeta` | `#8b5cf6` | `#a78bfa` | 6,70:1 |
| `turquesa` | `#2dd4bf` | igual | 9,79:1 |
| `coral` | `#fb7185` | igual | 6,77:1 |
| `ambar` | `#fbbf24` | igual | 10,92:1 |
| `cian` | `#22d3ee` | igual | 10,08:1 |

Todos los tonos de texto superan holgadamente el 4,5:1 que exige el nivel AA para letra pequeña. **El tono de relleno no sirve para texto**: el violeta `#8b5cf6` se queda en 4,30:1 sobre surface.

Cada página de servicio usa el color de su servicio como acento.

Orden en la home: problema (coral) · público (cian) · servicios (azul) · por dentro (violeta) · métricas (turquesa) · calculadora (ámbar) · estándares (cian) · método (violeta) · sobre mí (coral) · blog (turquesa) · FAQ (azul) · cierre (violeta).

El texto seleccionado se pinta blanco sobre `#1d4ed8` (6,70:1).

## Movimiento

Principios: solo se animan `transform`, `translate`, `scale` y `opacity`. Todo respeta `prefers-reduced-motion`. El contenido se ve completo sin JavaScript.

| Efecto | Dónde | Cómo |
|---|---|---|
| Entrada al hacer scroll | Tarjetas, H2, figuras, listas y FAQ de **todas** las páginas | CSS con `animation-timeline: view()`. Sin JavaScript. En Firefox no se anima y se ve normal |
| Aparición escalonada | Home (`.reveal`) | IntersectionObserver |
| Contador de cifras | 73 %, 12 h y 40 % en la home y en /sobre-mi | JavaScript. El valor final queda en un `span` para lectores de pantalla |
| Deriva de la foto del hero | Home | La foto sube más despacio y se acerca al salir de pantalla. Línea de tiempo de scroll |
| Elevación de tarjetas | Todas las tarjetas con enlace | `translate` + borde del acento + sombra. Solo con ratón |
| Zoom de imagen | Imágenes dentro de tarjetas con enlace | `scale: 1.045` al pasar el ratón |
| Flecha que avanza | `.cta` y `.card-link` | `translate: 4px 0` |
| Filete del menú | Navegación de escritorio | Se dibuja de izquierda a derecha y queda fijo en la página actual |
| Subrayado del pie | Enlaces del pie | `background-size` de 0 a 100 % |
| Transición entre páginas | Todo el sitio | `@view-transition` en CSS. La cabecera y la barra móvil se quedan quietas |
| Barras del embudo y de la calculadora | Home | `scaleX` desde 0 |
| Barra de progreso | Artículos del blog | Línea de tiempo de scroll |

**Qué no se hace, a propósito:** animaciones infinitas de adorno (auroras, brillos, puntos que laten), efectos que siguen al puntero ni capas fijas a pantalla completa. Pesan en móviles de gama media y empeoran el INP. La única animación continua es la marquesina de herramientas, que se para con movimiento reducido.

## Capa premium (20/10/2026)

Al final de `global.css`. Piezas reutilizables:

| Clase | Qué es |
|---|---|
| `.cabecera-seccion` | Cabecera de sección: antetítulo y H2 a la izquierda; entradilla o enlace a la derecha (desde 1024 px) |
| `.banda` | Sección con fondo `navy-2` y filetes arriba y abajo. Se alterna con las normales |
| `.seccion-corta` | Sección con el 60 % del espaciado normal |
| `.num-indice` | Índice 01, 02… en el color del acento, con un filete que se alarga al pasar el ratón por la tarjeta |
| `.tarjeta` / `.tarjeta-cuerpo` | Margen interior de las tarjetas. El `.card-link` va siempre al pie |
| `.tarjeta-articulo` + `.enlace-tarjeta` | Tarjeta entera pulsable con un solo enlace accesible |
| `.media` | Tratamiento común de fotos: saturación igualada, velo inferior y toque del color del servicio |
| `.cta` / `.boton-secundario` / `.botones` | Botón principal, secundario con borde (3,12:1) y grupo de botones. En móvil ocupan todo el ancho |
| `.fondo-reticula` | Retícula fina, quieta y desvanecida hacia los bordes. Va dentro de un contenedor con `position: relative` |

Espaciado entre secciones: de 72 a 120 px. Contenedor: 1240 px.

Micro movimiento añadido: filete del antetítulo que se dibuja al entrar en pantalla, respuesta al pulsar los botones (`scale: 0.97`), botón principal que sube 2 px, entrada encadenada del hero (botones, garantías, foto y etiqueta) y realce del borde de las herramientas.

## Piezas compartidas de las páginas interiores (21/10/2026)

| Pieza | Para qué |
|---|---|
| `CabeceraPagina.astro` | Cabecera de todas las páginas interiores: migas, antetítulo, H1 con parte destacada en degradado, entradilla, botones y una columna lateral opcional |
| `Cierre.astro` | Llamada final «Hablemos de tu negocio» con foto de fondo velada. Título, entradilla y acento por página |
| `TarjetaArticulo.astro` | Tarjeta del blog: portada (foto propia, ilustración o foto del servicio), tema, fecha, minutos de lectura. Variante destacada horizontal |
| `src/data/lectura.ts` | Palabras y minutos de lectura (200 por minuto). Lo usan las tarjetas y el JSON-LD de los artículos |
| Clases globales | `.icono-caja`, `.anillo-degradado`, `.numero-circulo`, `.etiqueta-servicio`, `.lista-check` / `.lista-cruz`, `.info-flotante` |

Espaciado entre secciones: `--space-section` (56 a 88 px). Dos secciones seguidas del mismo fondo no suman el relleno superior.

Sombras y velos: el duotono de las fotos va a brillo 0,98 y el velo inferior solo cubre el 32 % de la imagen (al 50 %). Antes cubría la mitad con un 82 % y tapaba la foto. `--shadow-3` es más corta para no ensuciar la sección de debajo.
