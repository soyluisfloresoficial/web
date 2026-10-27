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

- Modelo: **Claude Opus 5.5** (`claude-opus-5-5`), con esfuerzo bajo para que
  responda rápido y corto.
- La base de conocimiento (unos 8.000 tokens) va en caché: mientras la gente
  sigue escribiendo, se cobra a una décima parte. Una conversación nueva tras
  más de 5 minutos sin uso cuesta unos 5 céntimos de dólar; los mensajes
  siguientes, alrededor de 1 céntimo.
- Para gastar mucho menos, cambia en `wrangler.jsonc` el modelo a
  `"claude-haiku-5-5"` (unas 40 veces más barato, algo menos fino) y publica.
- El límite de gasto mensual de la consola de Anthropic es el tope real.

## Privacidad

- La web no guarda las conversaciones. El Worker solo anota en sus registros
  cuántos tokens usa cada respuesta, nunca el texto.
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
