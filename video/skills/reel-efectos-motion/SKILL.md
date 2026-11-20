---
name: "reel-efectos-motion"
description: "Edita un vídeo vertical grabado por Luis (talking head) y le añade efectos motion tipo 'headline wall', orbit, vertigo, paper cut, glass type, UI world, etc. Úsala siempre que pida editar un reel con efectos, motion graphics o 'como el vídeo de referencia'."
---

# Reel con efectos motion (talking head 9:16)

Convierte un clip vertical de Luis hablando a cámara en un reel con un efecto visual distinto cada 2-4 s, subtítulos palabra a palabra y CTA final. El estilo de referencia: el presentador siempre en el centro, los efectos ocurren alrededor, detrás o delante de él, y cada efecto refuerza lo que dice en ese momento.

Esta skill es de edición. El guion lo escribe `ig-reel`; el caption, `ig-caption`. Si Luis aún no ha grabado, manda primero a `ig-reel`.

## Motor de render

1. **HyperFrames (HeyGen)** — recomendado. HTML/CSS/GSAP renderizado a MP4. Local: `npx hyperframes init`, `npx hyperframes preview`, `npx hyperframes render`. Si el conector HyperFrames está disponible en la sesión, se puede componer/renderizar en su cuenta HeyGen.
2. **Fallback**: Python + ffmpeg (capas PNG/WebM con alfa compuestas con `overlay`). Solo si HyperFrames no instala.

Antes de usar comandos o APIs de HyperFrames, revisa su documentación actual (cambia rápido) y no inventes flags.

## Flujo

### 1. Ingesta y análisis
- `ffprobe` del clip: resolución, fps, duración. Normaliza a 1080x1920, 30 fps.
- Transcribe con `faster-whisper` (`word_timestamps=True`) → `transcript.json` con palabras y tiempos.
- Detecta pausas y muletillas; propone cortes (jump cuts) si Luis lo pide o si hay silencios > 0,6 s.

### 2. Recorte del presentador (matte)
La mitad de los efectos necesitan al presentador separado del fondo (texto detrás de la cabeza, muro detrás, salir del marco).
- Genera una secuencia de máscara alfa del sujeto: Robust Video Matting, MediaPipe Selfie Segmentation o `rembg` por fotograma (el que instale en el entorno).
- Exporta `subject.webm` (VP9 con alfa) o secuencia PNG. Comprueba bordes en 3 fotogramas antes de seguir.
- Capas resultantes: `bg` (vídeo original), `subject` (recorte), y entre ambas van los efectos “detrás”.

### 3. Plan de efectos (beat sheet)
Antes de construir, entrega a Luis una tabla corta en texto: tiempo → frase dicha → efecto → por qué. Reglas:
- Gancho visual fuerte en los primeros 1,5 s (Frame break, Headline wall o Glass type).
- Un efecto por idea, cambio cada 2-4 s. Nunca dos efectos pesados solapados.
- El efecto ilustra la frase (si dice “miles de vídeos” → Couch wall; si dice “abro la app” → UI world).
- Último beat: CTA de comentario (Comment bubble o “Comenta ‘PALABRA’”).
- Pide OK al plan solo si Luis está presente; si no, sigue y avisa qué asumiste.

### 4. Construcción
Una escena/capa por efecto en la composición, con entrada y salida de 6-10 fotogramas (ease out). Ver catálogo abajo.

### 5. Capas persistentes
- **Subtítulos**: 2-4 palabras por bloque, palabra activa resaltada (color acento de marca), tipografía sans bold, sombra suave. Centrados en el tercio inferior-medio.
- **Etiqueta de efecto** (opcional, estilo referencia): chip tipo LED retro con el nombre del efecto. Úsalo solo en reels que enseñan los efectos; en reels normales no.
- **Audio**: voz original normalizada a -14 LUFS. SFX cortos (whoosh, pop, click, shutter) en cada entrada de efecto, a -18/-22 dB bajo la voz. Música opcional a -28 dB.

### 6. Render y QA
- Exporta MP4 H.264 1080x1920 30 fps, AAC 48 kHz, `-preset veryfast -crf 20` salvo que pida máxima calidad.
- QA obligatorio: hoja de contacto (1 fotograma/s) y revísala. Comprueba: subtítulos sincronizados, bordes del recorte, nada importante en zonas seguras, sin parpadeos entre escenas.
- Zonas seguras IG/TikTok (aprox., verifica si cambian): deja libre ~250 px arriba y ~420 px abajo, y ~120 px a la derecha (botones).

## Catálogo de efectos

`[M]` = necesita el recorte del presentador.

**Texto y tipografía**
- **Glass type** `[M]`: palabra gigante 3D/cristal (gradiente, bisel, reflejo) que entra detrás de la cabeza, a la altura de los ojos. Para nombres, marcas o la palabra clave del gancho.
- **Depth scatter**: letras que llegan desde profundidad con desenfoque y se ensamblan; o se dispersan al salir.
- **Sticky text**: etiqueta tipo post-it amarillo con número (“12”) que hace pop con leve rotación. Para listas y datos.
- **Comment CTA**: “Comenta” + palabra en grande, color acento, con rebote. Siempre al final.

**Objetos alrededor del presentador**
- **Headline wall**: recortes de papel/periódico con frases que caen y se apilan alrededor, con sombra y rotación. Usa frases propias de Luis o titulares reales citados con fuente; nunca titulares inventados con logos de medios reales.
- **Orbit** `[M]`: 5-7 tarjetas/teléfonos con capturas que giran en 3D alrededor del sujeto; las que pasan por detrás quedan tapadas por él.
- **Phone mockup**: teléfono flotando con pantalla de la app/landing, entra en diagonal.
- **Doodle boil** `[M]`: trazos a mano (contorno, flechas, burbujas) alrededor de la silueta, redibujados cada 3-4 fotogramas para el efecto “boil”.
- **Comment bubble**: barra “Añade un comentario…”, se escribe la palabra, se envía y aparece respuesta “Te mandé el link”.

**Fondo y espacio**
- **Couch wall / video wall** `[M]`: muro de miniaturas o clips en cuadrícula detrás del presentador, con leve parallax.
- **Green screen** `[M]`: sustituye el fondo por un plano propio (B-roll de Luis, captura de su web). Nada de clips de terceros con copyright.
- **Paper cut** `[M]`: el sujeto se convierte en recorte de papel con borde blanco grueso, fondo papel crema, círculo de color detrás, props recortados (claqueta, móvil, tijeras) y titular tipo scrapbook.
- **Vertigo** `[M]`: dolly zoom: el fondo escala 1,0→1,25 mientras el sujeto se mantiene (o al revés). 1-1,5 s, para un momento de tensión.

**Cámara y transiciones**
- **Digital zoom**: punch-in a 1,3x con overlay de cámara (esquinas de visor, punto REC, batería, “1.30x”).
- **Zoom-through cut**: zoom rápido hacia la boca/ojo con motion blur que corta al siguiente plano.
- **Light flash**: destello blanco/fuga de luz de 6-8 fotogramas como transición.
- **Before / after**: barra de luz vertical que barre el plano; etiquetas “antes” / “después”.

**Interfaz y meta**
- **Frame break** `[M]`: el vídeo aparece dentro de un marco de post/Reel (iconos de like, comentario); el sujeto sale por encima del marco.
- **UI world**: el plano se encoge dentro de una interfaz (chat/app clara), se escribe un prompt y aparecen miniaturas. Interfaces genéricas o de las propias marcas de Luis; no clones de apps de terceros.
- **Pull-back reveal**: al final, el vídeo se aleja y se revela dentro de un editor/pantalla de exportación (“reel_final.mp4”, botón Descargar).
- **Timeline reveal**: línea de tiempo 3D inclinada con clips y forma de onda que pasa por la parte baja.

**Estilos de la referencia «comandos de estilo» (20/11/2026)**
Cada uno sirve como escena de 2-3 s o como miniatura de muestra. Adapta los colores a la marca del reel.
- **UI depth** `[M]`: ventanas de app de cristal flotando en capas alrededor del presentador (por ejemplo «Palabras clave» con chips de colores y una ventana «Vista previa» con el propio plano dentro), luz cálida y desenfoque de profundidad en las de atrás.
- **Swiss grid**: papel crema con retícula visible, contador gigante tipo marcador (03) en cajas negras que cambia de número, barra roja, una palabra enorme en grotesca negra muy apretada, foto del presentador en blanco y negro y pie en rojo. Estilo editorial, para listas numeradas.
- **Cutout grid** `[M]`: cuadrícula 3×3 de recortes del presentador en duotono (cian, azul, violeta, amarillo, rosa) con la casilla central de texto. Para «varias opciones» o «muchos usos».
- **Scrapbook collage** `[M]`: papel kraft, tiras de papel rasgado, titular con letras recortadas de distintas tipografías (tipo nota de rescate), recorte del presentador con borde blanco grueso, sello rojo con texto y garabatos amarillos (estrella, flecha) que se dibujan.
- **News broadcast**: fondo navy, globo de alambre que gira, etiqueta superior en mono y faldón rojo «ÚLTIMA HORA» con titular y ticker en movimiento. Solo con titulares propios; nunca logos ni nombres de medios reales.
- **Cinematic trailer**: barras negras de cine, destello de lente cálido que barre el plano y etalonaje teal & orange. Para la frase de impacto.
- **Explainer panel**: barra de progreso «PASO 04/04», orbes de cristal numerados 01-04 con título y subtítulo en versalitas, conectados por un arco de luz que avanza con cada paso. Para procesos.
- **Glitch HUD** `[M]`: esquinas de rastreo cian alrededor de la cara (enmarcan, nunca tapan), etiqueta «VISIÓN IA», datos en mono que se escriben («OBJETIVO FIJADO», coordenadas, «COINCIDENCIA 100 %») y una columna de datos al lado. Datos claramente ficticios y decorativos.
- **Neon outline** `[M]`: contorno de neón (rosa o cian) que traza la silueta del presentador y un titular de neón con parpadeo de letras al encenderse.

**Estructuras de la misma referencia**
- **Demo de herramienta en pantalla dividida**: arriba (50 %) una interfaz de chat genérica o propia donde se escribe un comando y aparece el resultado como miniatura 9:16 con esquinas redondeadas al lado del original; abajo, el presentador. Cada resultado aparece justo cuando la voz lo nombra y dura 2-3 s. Sirve para enseñar «antes y después» o un catálogo.
- **Cuenta atrás de retención**: contador pequeño arriba a la derecha (0:33 → 0:00) que marca lo que queda; por debajo de la franja de la interfaz de Instagram (y > 250 px).
- **Transición por desenfoque**: toda la imagen se desenfoca 6-8 fotogramas para pasar de la pantalla dividida al plano completo del cierre.
- **Cierre a plano completo con palabras sueltas**: subtítulos de una o dos palabras, grandes y en blanco a la altura del pecho; cuando la voz nombra una herramienta o marca propia, su icono hace pop junto a la palabra (de terceros solo con permiso).
- **CTA de comentario con brillo**: «Comenta» pequeño en blanco y debajo la palabra clave entre comillas, grande, en el color de acento con resplandor, entrando con escala y quedándose fija hasta el final.

## Auditoría obligatoria antes de entregar (20/11/2026)
- Hoja de contacto cada 0,5 s y revisión a resolución completa de cada escena: ninguna palabra tapada (por la cabeza, una mano o un sello), montada sobre otra, cortada con «…» o que se salga del cuadro.
- Márgenes: tarjetas y textos al menos a 60 px de los bordes y a 120 px del borde derecho (botones de la app).
- Subtítulos cortados por frases: un bloque nunca mezcla dos frases, nunca termina en «a», «de», «que», «te»… y la última palabra de una frase no se queda sola.
- Texto que pasa por delante de las manos: con fondo propio (píldora oscura) para que se lea.
- Pasada como cliente potencial: ¿el gancho detiene?, ¿se entiende qué gana?, ¿dan ganas de pedir el recurso o escribir?, ¿está claro cómo hacerlo?
- Audio a −14 LUFS, voz sin desfase frente al original y 0 errores de decodificación.

## Reglas de composición (aprendidas en pruebas)
- **La cara es zona prohibida**: ningún elemento (móvil, tarjeta, sticker) tapa la cara del presentador, ni siquiera en parte. Antes de colocar algo, mide la caja de la cara en un fotograma (x/y aprox.) y deja los objetos en hombros, laterales o bajo el mentón.
- **Objetos grandes (móvil, panel)**: abajo a un lado, a escala ~0,8 e inclinados, y durante ese tramo los subtítulos se alinean al lado contrario.
- **El gancho tiene que ser una escena, no solo un texto**: cambia el fondo por un set de marca (degradado navy, halo, haz de luz, suelo en perspectiva, partículas), reduce el recorte del presentador a ~0,8 anclado abajo con un brillo cian en el borde, y pon la palabra clave en 3D (extrusión de 10-12 capas, cara frontal con degradado de cristal y un barrido de brillo) entrando letra a letra. La palabra queda entera por encima de la cabeza: mide la parte de arriba de la cabeza en un fotograma y deja la base de las letras como mucho rozándola. Ninguna letra puede quedar tapada (en una prueba la cabeza tapó la «E» de «IDEAS» y hubo que rehacerlo).
- Cuando el recorte se reduce, sus cortes laterales se notan: tápalos con una viñeta lateral en una capa por encima del sujeto (la máscara CSS sobre el vídeo no funciona en el render).
- Haz un snapshot de cada escena nueva y revísalo antes del render completo (~9 min por cada 45 s en este entorno).

## Marca
- Antes de diseñar, carga los tokens de la marca correspondiente (soyluisflores o Smilbot): color acento, tipografías, voz. Si no existen, pregunta o usa: fondo oscuro cálido, acento amarillo, sans bold, y dilo.
- Una marca por reel. No mezclar identidades.
- Texto en pantalla en el español del mercado del reel (España o LATAM).

## Entrega
- `reel_final.mp4` + `plan_efectos.md` (tabla del paso 3) + carpeta del proyecto HyperFrames para retoques.
- Si pide cambios, edita solo la escena afectada y re-renderiza; no rehagas todo.

## Límites
- Solo material propio de Luis o con licencia: nada de famosos, clips de películas, música comercial ni logos de terceros.
- No inventar datos ni testimonios en los textos del vídeo.
- Si el clip es menor de 720p o con el sujeto muy pegado a bordes, avisa: el recorte saldrá con artefactos.