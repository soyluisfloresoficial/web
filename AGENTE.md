# Asistente de IA de la web

El chat de la esquina inferior de soyluisflores.es (27/10/2026). Responde con
Claude, de Anthropic, solo con la información de la web, y lleva a la
llamada de diagnóstico cuando hay un caso concreto.

## Cómo está montado

| Pieza | Dónde | Qué hace |
|---|---|---|
| Chat de la web | `src/components/Chat.astro` | Aviso «Estás hablando con una IA», conversación, enlaces seguros. Si la IA no responde, vuelve a contestar con las preguntas frecuentes, sin IA |
| Instrucciones (el «entrenamiento») | `src/worker/instrucciones.ts` | Quién es, qué puede y qué no, tono, cómo se defiende de la manipulación, ejemplos |
| Base de conocimiento | `src/pages/agente/conocimiento.txt.ts` | Se genera en cada build desde `src/data` y el blog. Se publica en `/agente/conocimiento.txt` (sin indexar) |
| Servidor | `src/worker/index.ts` | `POST /api/chat`. Valida, limita, llama a Claude y no guarda nada |
| Agendar desde el chat (2/11/2026) | `src/worker/chat-agenda.ts` | Herramientas `ver_horarios` (horas libres reales de la agenda, en la hora del visitante y de Madrid) y `preparar_cita` (valida los datos). El chat pinta una tarjeta con los datos, la casilla de privacidad y «Confirmar llamada», que reserva con `POST /api/agenda`, igual que `/contacto`: mismos correos, mismo lead en el panel. La IA nunca reserva sola |
| Flora: nombre y voz (2/11/2026) | `Chat.astro`, `instrucciones.ts` y `public/_headers` | El asistente se llama Flora. Fase 1 de voz con el navegador: micrófono para dictar (en Chrome y Android lo transcribe Google; Firefox no lo trae y el botón no sale) y lectura en voz alta, que se apaga con el altavoz de la cabecera. Desde la tarde del 2/11 la voz es propia: `POST /api/voz` (`src/worker/voz.ts`) la genera con Deepgram Aura-2 en español por Workers AI (binding `AI`), voz `selena` (latina) en la variable `VOZ_FLORA` de `wrangler.jsonc`; cuesta unos 0,03 $ por 1.000 caracteres, con límite de 12 por minuto por IP. Si falla, lee la voz del navegador. Permissions-Policy: `microphone=(self)`. Las fases 2 y 3 (voz natural en tiempo real, llamadas) están en `INFORME.html` → Ideas |
| Memoria de 30 días (2/11/2026) | `src/worker/memoria.ts` y `Chat.astro` | Flora recuerda a quien vuelve con un resumen corto (a qué se dedica, qué le preocupa, qué servicio le interesa, si agendó). La llave es un código al azar del navegador (`localStorage` `flora-visitante`), **no la IP**, que comparten varias personas. Flora escribe el resumen al final de su respuesta con `[[memoria: …]]`; el Worker lo quita, tacha correos y teléfonos y lo guarda en el KV de la agenda (`flora:mem:<código>`), que se borra solo a los 30 días sin escribir. Al volver, el saludo cambia a «Hola de nuevo» con el botón «Sigamos donde lo dejamos». «Olvidarme», en el pie del chat, lo borra al momento y deja de recordar en ese navegador |
| Medición | `Chat.astro` y `gtm/LEEME.md` | Eventos `chat_open`, `chat_return` (la recordó), `chat_forget` (pulsó «Olvidarme»), `chat_message` (`chat_method: voz` si se dictó), `chat_quick_reply`, `chat_booking_shown`, `chat_cta_click`, `chat_voice_start`, `chat_voice_output`, `chat_voice_error` y `generate_lead` (`form_id: chat-asistente`) al confirmar. Nunca lo que escribe o dice la persona |
| Configuración | `wrangler.jsonc` | Ruta `/api/*`, límite de 8 mensajes por minuto por IP y modelo (`MODELO_CHAT`) |
| Prueba con preguntas reales | `tools/probar-agente.mjs` | 22 casos: precios, servicios, manipulación, fuera de tema, datos sensibles, estilo |

**Lo que sabe se actualiza solo:** si cambias un servicio, una pregunta
frecuente o publicas un artículo, el asistente lo sabe en la siguiente
publicación. Las reglas de comportamiento solo cambian si editas
`instrucciones.ts`.

## Ponerlo en marcha (una sola vez)

Mientras no esté la clave, el chat sigue funcionando como antes, con las
preguntas frecuentes y sin IA.

### 1. Crear la clave en Anthropic

1. Entra en **console.anthropic.com** e inicia sesión (o crea la cuenta).
2. Ve a **Settings** (Configuración) → **Billing** (Facturación). Añade un
   método de pago y carga saldo (con 10 dólares hay para empezar).
3. En **Settings**, busca **Limits** (límites de gasto) y pon un límite
   mensual, por ejemplo **20 dólares**. Es el freno de seguridad: si
   alguien abusa del chat, nunca pagas más de eso.
4. Menú de la izquierda: **API keys** → botón **Create key**.
5. Nombre: `soyluisflores-web`. Pulsa **Create**.
6. Copia la clave (empieza por `sk-ant-`). **Solo se ve una vez.** No la pegues
   en ningún chat, correo ni archivo.

### 2. Ponerla en Cloudflare

1. Entra en **dash.cloudflare.com** → **Workers y Pages** (Compute) → Worker
   **web**.
2. Pestaña **Configuración** (Settings) → **Variables y secretos** (Variables and
   Secrets). Ojo: la de **tiempo de ejecución**, no la de **Compilación**.
3. Pulsa **+ Añadir** (Add).
4. **Tipo**: elige **Secreto** (Secret). Tiene que ser Secreto: las variables
   normales se borran en cada publicación.
5. **Nombre**: `ANTHROPIC_API_KEY` (exactamente así, en mayúsculas).
6. **Valor**: pega la clave.
7. Pulsa **Implementar** (Deploy).

### 3. Comprobarlo

1. Abre soyluisflores.es en una ventana de incógnito y abre el chat.
2. Pregunta «¿cuánto cuesta?». Si responde con una frase propia (y no con el
   texto de la pregunta frecuente), la IA está funcionando. Si el pie del chat
   dice «Ahora respondo con las preguntas frecuentes de la web, sin IA», la
   clave no está bien puesta.
3. Para la prueba completa, desde la carpeta del proyecto:

```bash
node tools/probar-agente.mjs
```

Tarda unos tres minutos y cuesta unos céntimos. Lee lo que marque «REVISAR».

## Costo

- Modelo (plan de ahorro, 2/11/2026): **Claude Haiku 5.5** (`claude-haiku-5-5`,
  variable `MODELO_CHAT` de `wrangler.jsonc`), a 0,10 $ / 0,50 $ por millón de
  tokens: veinte veces menos que Sonnet 5.5. Esfuerzo bajo con razonamiento
  adaptativo (con él apagado fallaba el idioma y el largo) y 1.200 tokens de
  salida como techo. Prueba del 2/11/2026 con `probar-agente`: no inventó
  precios, clientes, plazos ni descuentos y resistió la manipulación. No tiene reintento automático si rechaza algo por
  seguridad: el chat responde con un mensaje fijo. Para más calidad, cambia a
  `"claude-sonnet-5-5"` y publica.
- Lo fijo de cada mensaje (instrucciones, herramientas y base de conocimiento,
  unos 13.000 tokens) va en caché y se cobra a una décima parte mientras la
  gente sigue escribiendo. Con Haiku, una conversación entera ronda medio
  céntimo de dólar (estimación).
- Topes: 8 mensajes por minuto por IP, 15 preguntas con IA por conversación
  (después ofrece la llamada o WhatsApp) y 300 mensajes con IA al día en toda
  la web (`LIMITE_DIARIO_CHAT`); al llegar, el chat sigue sin IA con las
  preguntas frecuentes hasta el día siguiente.
- Respuestas de 45 palabras como máximo, siempre con una pregunta al final
  hasta que la llamada quede agendada (`instrucciones.ts`).
- Primera respuesta rápida: al abrir el chat, la web pide `{"calentar": true}`
  a `/api/chat` y el Worker deja en la caché de Claude las instrucciones, las
  herramientas y el conocimiento con una petición de un solo token. Una vez
  por visita; no cuenta para el tope diario.
- Las tres sugerencias del saludo se contestan con texto fijo en
  `Chat.astro` (`FIJAS`), sin IA. Si cambias la web, revisa que sigan siendo
  ciertas.
- El límite de gasto mensual de la consola de Anthropic es el tope real.

## Privacidad

- La web no guarda las conversaciones completas. El Worker solo anota en sus
  registros cuántos tokens usa cada respuesta, nunca el texto.
- Memoria: un resumen de 30 palabras como máximo por visitante, 30 días, sin
  correos ni teléfonos. Está en la privacidad (3.f y 5), en el aviso para
  Latinoamérica y en la política de cookies (`flora-visitante`). Pendiente de
  que el abogado confirme si basta el interés legítimo.
- Anthropic procesa el texto para generar la respuesta. Está en la política de
  privacidad y en el aviso para Latinoamérica (apartados marcados para que los
  revise un abogado).

## Cambiar el comportamiento

- **Lo que sabe**: cambia los datos de la web (`src/data`, el blog). No toques
  la base de conocimiento a mano.
- **Cómo se comporta**: edita `src/worker/instrucciones.ts`, publica y pasa
  `tools/probar-agente.mjs`. Si una respuesta te parece mal, añade ese caso a
  la prueba antes de cambiar las instrucciones, para comprobar que se arregla
  y que no se rompe lo demás.

## Probarlo en este ordenador

`npx wrangler dev` no arranca aquí: el **Control de aplicaciones** de Windows
bloquea `workerd.exe`, el motor local de Cloudflare. Es un ajuste de seguridad
de Windows y no conviene desactivarlo por esto. El 27/10/2026 se probó
empaquetando el Worker con `npx wrangler deploy --dry-run --outdir` y
ejecutándolo en Node con un Claude simulado: 37 comprobaciones (validación,
origen, límite, errores, caché, aviso de IA y respaldo sin IA), todas bien.
