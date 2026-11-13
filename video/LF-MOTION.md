# LF Motion System

Sistema de edición de reels verticales (Instagram Reels, TikTok, YouTube Shorts y LinkedIn) para **SOYLUISFLORES**. Parte de un avatar ya generado en HeyGen y le añade, con código:

- tipografía cinética;
- pantallas 3D;
- flujos animados;
- subtítulos palabra por palabra;
- sonido;
- el cierre de marca.

Está hecho con **Remotion 4.0.539 + React + TypeScript**, dentro del proyecto `video/` que ya existía. El piloto anterior (`Piloto*`, el video de la web) sigue igual.

**Formato:** 1080 × 1920, 30 fps, duración automática (la de la voz).

---

## 1. Instalación (una vez)

Desde la carpeta `video/`:

```bash
npm install
```

```bash
npm run lf:preparar
```

`lf:preparar` hace tres cosas:

- Copia las fuentes (Manrope e Inter) y el logo de la web a `publico/`.
- Genera los efectos de sonido en `publico/sfx/`.
- Crea `publico/medios/`, donde van el avatar, la música y las grabaciones.

`publico/` no se sube a GitHub, porque el repositorio es público. Tus medios se quedan en tu ordenador.

Para transcribir hace falta Python con faster-whisper, una sola vez:

```bash
pip install faster-whisper
```

### Navegador

Remotion renderiza con un navegador. Indica cuál con la variable `NAVEGADOR`.

En Windows (PowerShell), con Edge:

```bash
$env:NAVEGADOR="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
```

En Linux:

```bash
export NAVEGADOR=/ruta/a/chrome-headless-shell
```

Sin la variable, Remotion descarga su propio navegador la primera vez.

---

## 2. Producir un reel nuevo, paso a paso

1. **HeyGen:** genera el avatar en vertical 9:16 y descarga el MP4.
2. **Copia el MP4** a `video/publico/medios/`, por ejemplo `avatar-agenda.mp4`.
3. **Transcribe la voz.** Saca los tiempos de cada palabra:

   ```bash
   python herramientas/transcribir.py publico/medios/avatar-agenda.mp4 src/lf/videos/subtitulos/agenda.json
   ```

   Revisa las palabras que el script marque con poca confianza y corrígelas en el JSON (el campo `text`).
4. **Crea la configuración.** Copia `src/lf/videos/plantilla.ts` como `agenda.ts`. Cambia:
   - `avatar`;
   - `subtitulos` (importa el JSON);
   - `duracion: "auto"`;
   - las escenas;
   - el CTA.
5. **Registra el video** en `src/lf/Composiciones.tsx`: copia el bloque del piloto y cambia `id` y `config`.
6. **Previsualiza:**

   ```bash
   npm run lf:estudio
   ```

   Se abre en el navegador. Elige tu composición y muévete por la línea de tiempo.
7. **Revisa la zona segura.** Pon `depuracion: { zonaSegura: true, tiempos: true }` en la configuración: se pintan en rojo las franjas que tapan las apps y arriba ves el nombre de la escena. Quítalo antes de exportar.
8. **Comprueba los tipos:**

   ```bash
   npm run lf:tipos
   ```

9. **Exporta.** Copia el script `lf:piloto` de `package.json` con tu `id`, o ejecuta:

   ```bash
   npx remotion render src/index.ts LF-Agenda out/agenda.mp4 --public-dir=publico --codec=h264 --crf=18
   ```

El MP4 queda en `video/out/`, que no se sube a GitHub.

### Revisar fotogramas sin renderizar todo

```bash
node herramientas/revisar.mjs LF-Piloto-DobleClientes 1 9 24.5 49
```

Saca los segundos indicados en `out/revision/` a media resolución.

---

## 3. Cómo se define un video

Todo está en un objeto `ConfigVideo` (`src/lf/tipos.ts`). Los componentes no se tocan.

```ts
{
  id: "agenda",
  titulo: "...",
  avatar: "medios/avatar-agenda.mp4",   // null = hueco PENDIENTE
  subtitulos,                           // JSON de transcribir.py, o null
  duracion: "auto",                     // o segundos fijos
  musica: null,                         // { archivo: "medios/musica.mp3", volumen: 0.1 }
  sonidoTransiciones: true,
  aviso: "Ejemplo ilustrativo",         // texto pequeño y tenue cuando hay maquetas
  cta: {
    accion: "Comenta", palabra: "GUÍA",
    etiquetaRecurso: "GUÍA GRATIS", numeroRecurso: "7", recurso: "formas prácticas…",
    entrega: "Te llega por mensaje directo",
    usuario: "@soyluisfloresoficial",
    // Frases de la voz que activan cada paso del cierre.
    momentos: { seguir: "sígueme", comentar: "comenta", recurso: "te comparto" },
  },
  escenas: [ ... ],
}
```

### Timeline adaptable

El timeline base es de 60 s:

| Sección | Segundos |
|---|---|
| `gancho` | 0–3 |
| `problema` | 3–10 |
| `solucion1` | 10–20 |
| `solucion2` | 20–30 |
| `automatizacion` | 30–42 |
| `sistema` | 42–52 |
| `cta` | 52–60 |

Cada escena decide cuándo empieza:

- **Sin `inicio`:** usa el de su sección, escalado a la duración real. En un video de 45 s todo se comprime en proporción.
- **`inicio: 12.5`:** empieza en ese segundo exacto.
- **`inicio: { ancla: "imagina esto" }`:** empieza cuando la voz dice esa frase. Es lo recomendado: si regeneras el avatar con otro ritmo, transcribes de nuevo y todo se recoloca solo.

Cada escena termina donde empieza la siguiente. Los zooms y sonidos también admiten anclas.

### Escena

```ts
{
  id: "pide-cita",
  seccion: "solucion2",
  inicio: { ancla: "un asistente que puede" },
  presentador: "burbuja",         // completo | superior | burbuja | oculto
  capa: { tipo: "notificaciones", avisos: [...], sello: "Sin responder", selloEn: { ancla: "clientes" } },
  zoom: [{ en: { ancla: "cuánto tiempo" }, escala: 1.15, duracion: 2 }],
  titular: { texto: "...", destacar: ["palabra"], sincronizar: true },
  contenido: { tipo: "pantallas", pantallas: [ ... ] },
  subtitulos: true,               // false para ocultarlos en la escena
  entrada: "deslizar",            // deslizar | mascara | zoom
  sonidos: [{ archivo: "sfx/pop.wav", en: 1.2 }],
}
```

### Disposición del avatar

| Valor | Avatar | Contenido |
|---|---|---|
| `completo` | Pantalla completa | Titular sobre el pecho |
| `superior` | Mitad de arriba | Abajo, 560 px |
| `dividida` | Abajo, 65 % de la pantalla (1248 px) | Arriba, 35 %: franja segura de 936 × 396 px; subtítulos en una línea en la costura |
| `burbuja` | Círculo arriba a la izquierda | Toda la zona central; el titular va al lado |
| `oculto` | No se ve (la voz sigue) | Toda la pantalla |

El avatar es un único video continuo: la voz nunca se corta, ni siquiera en `oculto` (el video sigue sonando aunque no se vea; antes del 13/11/2026 se cortaba, ya corregido). Solo cambia la caja donde se ve, con una transición de medio segundo.

---

## 4. Biblioteca de componentes y efectos

Todos están en `src/lf/componentes/` y se pueden usar sueltos en otras composiciones.

| Componente | Efecto | En la configuración |
|---|---|---|
| `ImpactZoom` | Zoom de impacto con interpolación y curva (entra en 6 fotogramas, vuelve suave) | `zoom` |
| `KineticText` | Palabras que entran con desenfoque → nitidez; con `sincronizar`, al ritmo de la voz | `titular` |
| `FloatingScreen` | Pantalla 3D con perspectiva, sombra, reflejo y parallax. Admite maqueta, imagen o grabación | `contenido.tipo: "pantallas"` |
| `AutomationFlow` | Nodos que se conectan; la línea se dibuja y un pulso enciende el siguiente | `"flujo"` |
| `AnimatedCounter` y `Comparativa` | Contador y barras con valores configurables | `"contador"`, `"comparativa"` |
| `BeforeAfterReveal` | Antes y después con barrido de máscara y línea de luz | `"antesDespues"` |
| `SistemaReveal` | Máscara circular que revela el sistema completo con pulsos | `"sistema"` |
| `GuidedCursor` | Cursor que recorre puntos, hace clic y resalta el botón | `cursor` dentro de una pantalla |
| `HeyGenPresenter` | El avatar con sus cuatro disposiciones | `presentador` |
| `Subtitles` | Subtítulos palabra por palabra; la palabra que suena va en cian | automático |
| `NotificacionesFlotantes` | Gancho visual: avisos de mensajes que llegan con sonido alrededor del avatar (la mirada queda libre) y un sello «Sin responder» sincronizado con la voz | `capa` |
| `PantallaDividida` | Presencial frente a digital: el local (dibujado o con foto) y los mensajes que llegan, con contador de consultas pendientes y zoom | `"dividida"` |
| `Revelacion` | De pantalla desordenada a composición limpia: barrido de luz, rejilla y titular, con acercamiento suave de cámara | `"revelacion"` |
| `Presentacion` | Rótulo discreto: nombre, especialidad y web, con el avatar en `tarjeta` | `"presentacion"` |
| `CTAMensaje` | Cierre «escríbeme por privado»: texto grande con la palabra en verde, burbuja que se escribe y se envía (✓✓), logo y web | `cta.estilo: "mensaje"` |
| `BrandCTA` | Cierre en tres pasos sincronizados con la voz: «Seguir» → «Siguiendo ✓», «Comenta PALABRA» con la caja que se escribe sola y portada 3D del recurso con el logo | `"cta"` |
| `SoundDesign` | Whoosh en cambios de escena, aviso en cada notificación, impacto en zooms, clic del cursor, pop al seguir y música baja | automático + `sonidos` |

**Maquetas de interfaz** (`src/lf/pantallas/Maquetas.tsx`):

- `chat` (mensajes del cliente, del asistente y estados como «Sin respuesta»);
- `formulario` (se rellena solo);
- `crm` (una tarjeta cambia de columna);
- `calendario` (aparece la cita nueva);
- `notificacion`;
- `pendiente`.

Son genéricas, sin logos de terceros.

---

## 5. Marca y zonas seguras

Los tokens están en `src/lf/marca.ts`:

| Token | Valor |
|---|---|
| Base | `#07090D` |
| Cian | `#00C2FF` |
| Violeta | `#8B5CF6` |
| CTA | `#00FFB3` |
| Tipografía | Manrope (titulares y subtítulos), Inter (etiquetas pequeñas) |

**Zona segura:** 230 px arriba, 440 abajo, 72 a la izquierda y 150 a la derecha, sobre 1080 × 1920. Es una estimación conservadora para las cuatro apps. Las apps cambian su interfaz, así que conviene revisarla de vez en cuando.

---

## 6. Reglas de contenido

- **Nada inventado.** Ni clientes, ni cifras, ni resultados, ni demostraciones que parezcan reales. Las maquetas son ilustrativas y el aviso «Ejemplo ilustrativo» sale solo cuando aparecen.
- **Números con explicación.** Un contador o una comparativa necesita una `nota` que diga de dónde sale el número o que es un ejemplo.
- **Aviso de IA.** El asistente de las maquetas se presenta como «asistente virtual». Al publicar, activa la etiqueta de contenido generado con IA en cada red: el avatar es sintético.
- **Pocos efectos.** Un efecto por idea. Si algo distrae de lo que dice la voz, se quita.

---

## 7. Comandos

| Comando | Qué hace |
|---|---|
| `npm run lf:preparar` | Copia marca y genera los sonidos en `publico/` |
| `npm run lf:estudio` | Previsualización en el navegador |
| `npm run lf:piloto` | Exporta el piloto a `out/lf-piloto-doble-clientes.mp4` |
| `npm run lf:plantilla` | Exporta la plantilla maestra (con placeholders) |
| `npm run lf:fotograma` | Saca un fotograma suelto del piloto |
| `npm run lf:tipos` | Revisa los tipos de TypeScript |
| `node herramientas/revisar.mjs ID s1 s2…` | Fotogramas sueltos para revisar |
| `python herramientas/transcribir.py video.mp4 salida.json` | Subtítulos con tiempos por palabra |
| `node herramientas/generar-musica.mjs salida.wav --duracion 45 --cambio 13.4` | Música propia (100 BPM) que sube de ritmo en el segundo indicado |

---

## 8. Licencias

- **Remotion** es gratis para personas y empresas de hasta tres empleados. Si eso cambia, hay que revisar [remotion.dev/license](https://remotion.dev/license).
- **Efectos de sonido y música de fondo:** los generan `herramientas/preparar.mjs` y `herramientas/generar-musica.mjs` con síntesis propia, así que no tienen licencia de terceros. Es una base sencilla; una pista comercial con licencia sonará mejor.
- **Música y efectos externos:** tienen que tener licencia para redes sociales. Guárdala junto al archivo.
- **faster-whisper:** licencia MIT. El modelo se descarga la primera vez.

---

## 9. Pendientes (13/11/2026)

Lo que falta para publicar el piloto y producir en serie:

- [ ] **Recurso de la palabra GUÍA.** El CTA promete «7 formas prácticas de aplicar IA en tu negocio». Ese recurso tiene que existir y entregarse solo (ManyChat) antes de publicar. `[COMPLETAR]`
- [x] **Usuario de Instagram:** `@soyluisfloresoficial` (13/11/2026). `[VERIFICAR: que sea el mismo en TikTok, YouTube y LinkedIn]`
- [ ] **Música con licencia.** El piloto sale sin música (`musica: null`). Pon un archivo en `publico/medios/` y añádelo a la configuración.
- [ ] **Grabaciones reales.** Todas las pantallas del piloto son maquetas de ejemplo. Para demostraciones de tus sistemas, graba la pantalla y úsala con `{ tipo: "archivo", archivo: "medios/grabacion.mp4" }`, sin datos de clientes.
- [ ] **Paleta.** Los colores del sistema (cian `#00C2FF`, CTA `#00FFB3`) no son los de la web (azul `#007bff`). Decide si la web adopta los nuevos o el sistema usa los de la web, para no tener dos identidades.
- [ ] **Gancho.** El titular «¿Podrías atender el doble de clientes?» es una pregunta y la voz no habla del «doble». Si prefieres que coincidan, cambia el texto en `videos/piloto-doble-clientes.ts`.
- [ ] **Revisión humana.** Mira el MP4 entero con sonido antes de publicar. La transcripción es automática.

---

## 10. Anuncio «¿Estás perdiendo clientes?» · Escríbeme NEGOCIO (13/11/2026)

Configuración: `src/lf/videos/escribeme-negocio.ts`. Composiciones: `LF-EscribemeNegocio` (video) y `LF-EscribemeNegocio-Portada` (sin subtítulos, para la portada).

Exportación (desde `video/`):

```bash
npx remotion render src/index.ts LF-EscribemeNegocio out/escribeme-negocio_master.mp4 --public-dir=publico --codec=h264 --crf=16 --audio-bitrate=256k
```

```bash
npx remotion still src/index.ts LF-EscribemeNegocio-Portada out/escribeme-negocio_portada.png --frame=78 --public-dir=publico
```

Versiones derivadas (FFmpeg, volumen normalizado a −14 LUFS en dos pasadas):

- **Reels y TikTok:** 1080 × 1920, H.264 High, AAC 192 kbps.
- **WhatsApp:** 720 × 1280, H.264 Main, AAC 128 kbps, unos 7,5 MB (por debajo de 16 MB).

Formato (13/11/2026, a petición del titular): pantalla dividida con el avatar al 65 % abajo y los gráficos al 35 % arriba en todas las escenas de contenido. Sin burbuja.

Versión del 13/11/2026 con las reglas 11 y 12: imágenes reales generadas con IA en Higgsfield (GPT Image 2.6, 0,25 créditos por imagen) para el local (`medios/ia-local-atendiendo.jpg`) y la portada de la web (`medios/ia-comida-casera.jpg`). Avatar solo en el gancho, las preguntas, «No necesitas ser experto», la presentación y la pregunta final. Portada: fotograma 80 del gancho, sin subtítulos.

Pendientes de este anuncio:

- [ ] La foto real del local (opcional): ahora se dibuja con código. Pon una foto propia en `publico/medios/` y añádela en `izquierda.imagen`.
- [ ] Los mensajes de ejemplo usan «vosotros» («¿Estáis abiertos?», «¿Tenéis…?»), como pediste. Para Latinoamérica conviene una versión con «¿Están abiertos?».
- [ ] La respuesta a «NEGOCIO» por privado (ManyChat o a mano) tiene que estar lista antes de difundirlo.

---

## 11. Regla del titular: imágenes reales acordes con la voz (13/11/2026)

En todos los videos, los gráficos y las imágenes tienen que ser **reales** y corresponder a lo que dice la voz en ese momento: fotos propias, de banco (Pexels, Pixabay, Unsplash) o generadas con IA (Higgsfield). Las maquetas dibujadas con código se usan para interfaces (chat, web, flujo, calendario), no para sustituir una imagen de personas, locales o productos.

Cómo se hace:

1. Por cada escena, la frase de la voz decide la imagen (por ejemplo, «estás atendiendo clientes» → foto de un dueño atendiendo en su local).
2. Se descarga o genera, se guarda en `publico/medios/` y se usa con `contenido: { tipo: "imagen", archivo, credito, movimiento, etiqueta }`, o en `izquierda.imagen` de la pantalla dividida.
3. Fotos de banco: se respeta su licencia y se pone el autor en `credito`. Generadas con IA: personas genéricas, nunca una persona real ni una marca, y el video mantiene la etiqueta de contenido IA al publicarse.
4. Si una fuente falla, se avisa al titular antes de sustituir la imagen por un dibujo.

Lo que hoy bloquea esta regla (13/11/2026):

- **Unsplash:** el conector responde «Your email address has not been confirmed». Hay que confirmar el correo de la cuenta de Unsplash.
- **Pexels y Pixabay:** se puede llegar a sus API, pero hace falta una clave gratuita de cada uno. Se guarda como secreto del entorno, nunca en el repositorio.
- **Higgsfield:** quedan 2,1 créditos (una imagen cuesta 1 con el modelo Nano Banana). El 13/11/2026 una generación falló y cobró el crédito igualmente.

---

## 12. Regla del titular: momentos y espacios del avatar (13/11/2026)

Las imágenes y los gráficos acompañan a la voz; no la tapan ni la adelantan. Cada escena se decide con este criterio:

| Momento de la voz | Qué se ve | Disposición |
|---|---|---|
| Gancho de apertura, preguntas al espectador, frases de emoción o de opinión | **El avatar solo**, con zoom de impacto y, como mucho, un titular corto | `completo` |
| La voz nombra algo concreto que se puede enseñar (un mensaje, una web, un local, un producto, un proceso, una herramienta) | **El avatar hablando y la imagen o gráfica a la vez**: avatar abajo al 65 %, imagen arriba al 35 % | `dividida` |
| Cambio de idea o revelación breve | **Solo la gráfica**, como mucho 2 s, y la voz sigue sonando | `oculto` |
| «Soy Luis Flores…» (presentación) | **El avatar** con el rótulo discreto | `completo` o `tarjeta` |
| Cierre (CTA) | **El avatar** y el CTA, sin más elementos | `dividida` o `superior` |

Reglas de tiempo:

- **Entrada:** cada imagen entra cuando la voz dice su palabra clave (ancla en los subtítulos), nunca antes, y se va cuando la voz cambia de idea.
- **Cortes:** se hacen al inicio de una frase o en una pausa, nunca a mitad de palabra.
- **Duración:** ninguna escena dura menos de 1,5 s. Si la voz enumera cosas seguidas, se agrupan en una sola escena.
- **Ritmo:** no pasan más de 3–4 s sin un cambio visual (un zoom, un mensaje nuevo, un paso del flujo).
- **Avatar solo:** se deja al avatar solo al menos una vez cada 15–20 s, para que se le vea la cara y el gesto completos.

---

## 13. Video «¿Te faltan horas al día?» · CTA «Sígueme» (13/11/2026)

Configuración: `src/lf/videos/organiza-tu-negocio.ts` (composiciones `LF-OrganizaTuNegocio` y `LF-OrganizaTuNegocio-Portada`, fotograma 98). Avatar de 57,2 s. Imágenes generadas con IA: `ia-panaderia-atendiendo.jpg`, `ia-tareas-noche.jpg` e `ia-negocio-organizado.jpg`.

Componentes nuevos:

- `ListaPuntos` (contenido `lista`): puntos que entran cuando la voz los dice.
- `CTASeguir` (`cta.estilo: "seguir"`): «SÍGUEME», el perfil con Seguir → Siguiendo ✓ y la web.
- Halo oscuro detrás de los titulares a pantalla completa y placa oscura en el rótulo de presentación, para leerse sobre fondos claros del avatar.

**v2 (13/11/2026), mejoras del sistema:**

- **Titulares sincronizados tipo karaoke:** la frase sale entera y centrada, tenue, y cada palabra se enciende cuando la voz la dice.
- **Encuadre del avatar a pantalla completa:** alterna plano abierto y cerrado (zoom 1,17) en cada corte entre escenas completas, con corte seco y un acercamiento lento del 4 % dentro de cada escena.
- **Entrada del contenido:** espera 10 fotogramas cuando el avatar cambia de disposición, para que el gráfico no aparezca encima de la cara. La sincronía (titulares, lista, zoom de mensajes y sonidos) se compensa.
- **Transiciones:** más cortas (salida en 5 fotogramas, entrada de pantallas en 13).
