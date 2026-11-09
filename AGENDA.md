# Agenda propia con Google Calendar

Desde el 28/10/2026, la llamada de diagnóstico se reserva en la propia web
(`/contacto`, `/diagnostico` y los funnels) con el diseño de la web. Desde
el 29/10/2026 envía sola los correos de la cita y Calendly ya no existe en la
web.

## Cómo funciona

1. La web pide las horas libres al servidor de la web (`/api/agenda`).
2. El servidor cruza el horario de `src/data/agenda.ts` con tu Google
   Calendar: si tienes algo en el calendario, esa hora no aparece.
3. El cliente elige día y hora (en su zona horaria), escribe su nombre y su
   correo, y confirma.
4. El servidor vuelve a comprobar que la hora sigue libre y crea el evento en
   tu calendario, con enlace de Google Meet. Google le manda la invitación al
   cliente, que puede añadirla a su calendario o rechazarla.
5. Salen los correos con tu marca (ver «Correos automáticos»): la
   confirmación al cliente y el aviso para ti. Después, los recordatorios un
   día antes y una hora antes.
6. Cada correo lleva un enlace personal para cambiar la cita
   (`/agenda/cambiar`). Ahí el cliente la cancela con un botón y elige otra
   hora; el hueco queda libre al momento y a ti te llega el aviso.

Mientras Google no esté conectado (o si falla), en el lugar de la agenda sale
«Agenda tu llamada por WhatsApp o por correo», con los dos botones. La web
nunca se queda sin forma de pedir la llamada.

| Qué | Dónde |
|---|---|
| Horario, duración, margen, antelación, días visibles | Desde el panel (KV `web-agenda`). Valores por defecto en `src/data/agenda.ts` |
| Validación de lo que guarda el panel | `src/worker/agenda-config.ts` |
| Cálculo de horas libres | `src/worker/agenda-huecos.ts` (pruebas: `node tools/probar-agenda.mjs`) |
| Conexión con Google | `src/worker/agenda.ts` |
| La agenda que ve el cliente | `src/components/Agenda.astro` |
| Página para cambiar o cancelar | `src/pages/agenda/cambiar.astro` |
| Textos y diseño de los correos | `src/worker/correo-plantillas.ts` (salen de `correos/PLANTILLAS.md`) |
| Envío de los correos | `src/worker/correo.ts` (Resend) |
| Cuándo toca cada recordatorio | `src/worker/agenda-recordatorios.ts`, con el cron de `wrangler.jsonc` |
| Claves de Google y de Resend | Panel de Cloudflare, como **Secreto**. Nunca en el repositorio |

Medición: `form_start` al elegir hora y `generate_lead` al confirmar, con
`method: "agenda-propia"` y el `form_id` de cada página: `agenda-contacto`
(/contacto), `agenda-diagnostico` (/diagnostico) o `funnel-<servicio>`.

## Conectar tu Google Calendar (una sola vez)

Necesitas unos 15 minutos. Hazlo con la cuenta de Google del calendario donde
quieres recibir las citas.

### Paso 1. Crear el acceso en Google Cloud

1. Entra en https://console.cloud.google.com con tu cuenta de Google.
2. Arriba a la izquierda, junto al logo, toca el selector de proyecto →
   **Proyecto nuevo**. Nombre: `Agenda soyluisflores`. Toca **Crear** y, cuando
   termine, selecciónalo en ese mismo selector.
3. En el buscador de arriba escribe **Google Calendar API**, ábrela y toca
   **Habilitar**.
4. En el buscador escribe **Google Auth Platform** (o «Pantalla de
   consentimiento de OAuth») y ábrelo. Toca **Comenzar** y rellena:
   - Nombre de la aplicación: `Agenda soyluisflores`
   - Correo de asistencia: tu correo
   - Público: **Externo**
   - Información de contacto: tu correo
   - Acepta la política y toca **Crear**.
5. En el menú de la izquierda, entra en **Público** (Audience) y toca
   **Publicar app** → **Confirmar**. Así el estado queda en «En producción».
   **Importante:** si se queda en «Prueba», Google corta la conexión a los
   7 días y la agenda deja de funcionar (la web ofrece WhatsApp y correo).
6. En el menú de la izquierda, entra en **Clientes** → **Crear cliente**:
   - Tipo de aplicación: **App de escritorio**
   - Nombre: `Agenda web`
   - Toca **Crear**.
7. Aparece una ventana con el **ID de cliente** y el **Secreto de cliente**.
   Déjala abierta: los vas a copiar en el paso 2.

### Paso 2. Dar permiso a la agenda (en tu ordenador)

1. Abre una terminal en la carpeta del proyecto (`soyluisflores-web`).
2. Escribe este comando y pulsa Enter:

   ```bash
   node tools/autorizar-google.mjs
   ```

3. Te pide el **ID de cliente**: cópialo de Google Cloud, pégalo y pulsa Enter.
4. Te pide el **secreto de cliente**: cópialo, pégalo y pulsa Enter.
5. Se abre el navegador. Entra con tu cuenta de Google.
6. Google avisa «Google no verificó esta app». Es normal: la app es tuya y
   solo la usas tú. Toca **Configuración avanzada** → **Ir a Agenda
   soyluisflores (no seguro)**.
7. Marca **todas** las casillas de permisos y toca **Continuar**.
8. La pestaña dice «Listo». Vuelve a la terminal: ahí aparece un texto largo
   (el refresh token). Déjala abierta para el paso 3.

### Paso 3. Guardar las claves en Cloudflare

1. Entra en https://dash.cloudflare.com → **Workers y Pages** → Worker **web**
   → **Configuración** → **Variables y secretos** → **Añadir**.
2. Añade estas tres, cada una con tipo **Secreto**:

   | Nombre (cópialo tal cual) | Valor |
   |---|---|
   | `GOOGLE_CLIENT_ID` | El ID de cliente de Google Cloud |
   | `GOOGLE_CLIENT_SECRET` | El secreto de cliente de Google Cloud |
   | `GOOGLE_REFRESH_TOKEN` | El texto largo que salió en la terminal |

3. Toca **Implementar** (o **Guardar e implementar**).
4. Cierra la terminal del paso 2.

### Paso 4. Comprobar que funciona

1. Abre https://soyluisflores.es/api/agenda. Tiene que salir una lista de
   horas (`"huecos": [...]`). Si sale `sin-google`, revisa los nombres de los
   tres secretos.
2. Abre https://soyluisflores.es/contacto: sale la agenda con días y horas,
   en lugar del aviso de WhatsApp y correo.
3. Haz una reserva de prueba con **otro** correo tuyo. Mira que aparezca en
   tu Google Calendar con el enlace de Meet y que llegue la invitación a ese
   correo. Si ya hiciste el paso 5, también la confirmación y el aviso.
4. Abre el enlace «cambiar mi llamada» del correo y cancélala: tiene que
   desaparecer de tu calendario.

## Correos automáticos

Salen solos desde la web, con tu marca (cabecera «LUIS FLORES», degradado
azul a violeta) y tus textos de `correos/PLANTILLAS.md`. Llegan desde
`hola@soyluisflores.es` y, si alguien responde, te llega a ti.

| Correo | A quién | Cuándo |
|---|---|---|
| Confirmación (fecha en su hora, botón de Meet, qué tener a mano, enlace para cambiarla) | Cliente | Al reservar |
| Nueva llamada (sus datos, su mensaje, de qué anuncio llegó) | Tú, en `hola@` | Al reservar |
| «Mañana hablamos» | Cliente | Un día antes, si agendó con más de 26 horas |
| «En una hora» | Cliente | Una hora antes |
| Llamada cancelada | Cliente y tú | Al cancelar desde su enlace |

- Los recordatorios los revisa el servidor cada 10 minutos (`triggers` en
  `wrangler.jsonc`) y cada uno sale una sola vez. Si el cliente rechaza la
  invitación de Google, no se le insiste.
- «Después de la llamada» y «Si no se conectó» (plantillas 4 y 5) siguen
  siendo manuales: dependen de cómo fue cada llamada.
- Sin la clave de Resend no se envía nada de esto, pero la reserva funciona
  igual y Google manda su invitación con el enlace de Meet.

### Paso 5. Conectar el envío de correos (Resend, una sola vez)

Resend es gratis hasta 3.000 correos al mes. Necesitas unos 10 minutos.

1. Entra en https://resend.com y crea tu cuenta con tu correo.
2. Menú de la izquierda → **Domains** → **Add Domain**:
   - Domain: `soyluisflores.es`
   - Region: **Ireland (eu-west-1)**, la más cercana a España.
   - Toca **Add**.
3. Resend te enseña unos registros DNS. Si sale el botón **Sign in to
   Cloudflare** (o «Auto configure»), tócalo y acepta: los añade solo. Si no:
   1. Abre https://dash.cloudflare.com → `soyluisflores.es` → **DNS** →
      **Registros** → **Añadir registro**.
   2. Copia cada registro de Resend tal cual (tipo, nombre y valor). Son un
      `TXT` para `resend._domainkey` y un `MX` y un `TXT` para `send`.
   3. En los de tipo `TXT` y `MX` deja **Solo DNS** (nube gris).
   No toques tu SPF ni tu DMARC actuales: los de Resend van en el subdominio
   `send` y no chocan con ellos.
4. Vuelve a Resend y toca **Verify DNS Records**. Puede tardar unos minutos;
   cuando el dominio diga **Verified**, sigue.
5. Menú de la izquierda → **API Keys** → **Create API Key**:
   - Name: `Web soyluisflores`
   - Permission: **Sending access**
   - Domain: `soyluisflores.es`
   - Toca **Add** y copia la clave (empieza por `re_`). Solo se ve una vez.
6. En Cloudflare → Worker **web** → **Configuración** → **Variables y
   secretos** → **Añadir** → tipo **Secreto**, nombre `RESEND_API_KEY`,
   valor: la clave. **Implementar**.
7. Haz otra reserva de prueba con otro correo tuyo: tiene que llegar la
   confirmación y, a `hola@`, el aviso de nueva llamada.

Por qué el paso 3 es imprescindible: tu dominio tiene DMARC en `p=reject`, así
que los correos que digan venir de `@soyluisflores.es` sin la firma de Resend
(el registro `resend._domainkey`) los rechazan Gmail, Outlook y los demás.

Opcional, como **Secreto** del Worker (ver el aviso de abajo):
`CORREO_AVISOS` para recibir los avisos en otra dirección y
`CORREO_REMITENTE` para otro remitente, por ejemplo
`Luis Flores <agenda@soyluisflores.es>`.

> **Importante:** en Cloudflare, añade siempre estos valores como tipo
> **Secreto**, también los que no son secretos (direcciones, correos). Cada
> publicación desde GitHub borra las variables de tipo **Texto** que no estén
> en `wrangler.jsonc`; los secretos se conservan.

## Conectar con el panel (panel.soyluisflores.es)

La web y el panel se hablan en los dos sentidos:

| Sentido | Qué viaja | Cómo |
|---|---|---|
| Web → panel | Cada reserva entra como **lead** (marca soyluisflores, fuente web), con la fecha de la llamada, el negocio, lo que quiere resolver y de qué anuncio llegó | El servidor de la web llama al webhook `webhookFormulario` del panel (`src/worker/panel.ts`) |
| Panel → web | El horario de la agenda | El panel llama a `/api/agenda/config` (apartado siguiente) |

Si el mismo correo reserva varias veces, el panel no duplica la ficha: la
actualiza. Si el panel no responde, la reserva no se pierde (está en tu
Google Calendar y en el aviso por correo).

### Paso 6. Enviar las reservas al panel (un solo comando)

Antes tiene que estar publicado el panel en Firebase (`DESPLIEGUE.md` del
repositorio `panel`, apartados 1 a 6). Después:

1. Inicia sesión en las dos cuentas (cada una abre el navegador para que
   entres tú):

   ```bash
   cd ../panel && npx firebase login
   ```

   ```bash
   cd ../soyluisflores-web && npx wrangler login
   ```

2. En la carpeta de la web ejecuta:

   ```bash
   node tools/conectar-panel.mjs
   ```

   Hace todo solo: inventa la clave compartida, la guarda en Firebase
   (`SECRETO_FORMULARIO`) y en Cloudflare (`PANEL_SECRETO`) sin mostrarla,
   publica `webhookFormulario`, guarda la dirección (`PANEL_WEBHOOK_URL`) y
   manda un lead de prueba. Si algo falla, te dice qué y no deja nada a medias
   sin avisarte.
3. Comprueba en el panel, en **Leads**, que está «Prueba de conexión» y
   bórralo. Desde ahí, cada reserva entra sola con fuente «web». En
   Cloudflare → Worker web → Registros verás `panel: lead, estado: 200`.

## Editar el horario desde el panel

Desde el 28/10/2026 el horario se cambia desde el panel, sin tocar el código.
Lo que guarda el panel queda en Cloudflare (KV `web-agenda`, enlazado como
`AGENDA_CONFIG` en `wrangler.jsonc`) y manda sobre `src/data/agenda.ts`.

Mientras el panel no guarde nada, la agenda atiende **de lunes a viernes, de
9:30 a 12:00 y de 14:30 a 19:00, hora de Madrid** (decisión del titular,
04/11/2026), con llamadas de 30 minutos y 12 horas de antelación mínima. Las
horas se guardan siempre en hora de Madrid y la web las convierte a la zona de
quien reserva, mostrando también la hora de Madrid junto a cada una. Si un día
te bloqueas en Google Calendar, esas horas desaparecen solas de la web.

Si más adelante el panel guarda un horario propio, ese manda sobre este.

### Datos que pide el formulario (04/11/2026)

Obligatorios: nombre, correo y la casilla de privacidad. Opcionales: WhatsApp o
teléfono, negocio, página web, a qué se dedica, tamaño del equipo, servicio que
le interesa y qué quiere resolver. Todo llega a la descripción del evento de
Google Calendar, al correo «Nueva llamada» y al lead del panel. El servidor
rechaza la reserva si no llega `acepto: true`. La lista de servicios y de
tamaños de equipo está en `src/components/Agenda.astro` y en
`src/worker/agenda.ts`: si cambias una, cambia la otra. Los datos nuevos están
listados en el apartado 3.a) de la política de privacidad (pendiente de
revisión por un abogado).

### La pantalla del panel y su clave (una sola vez)

Desde el 02/11/2026 (conectado ese día) el panel tiene la pantalla **Ajustes → Horario de la
agenda** (solo para el titular). No llama a la web desde el navegador: lo hace
la Cloud Function `agendaHorario` del panel, que guarda la clave en Secret
Manager. Así la clave nunca llega al navegador y no hace falta `PANEL_ORIGENES`.

Para conectarlo, con sesión iniciada en las dos cuentas (`npx firebase login` en
la carpeta del panel y `npx wrangler login` en la de la web):

```bash
node tools/conectar-agenda.mjs
```

Inventa una clave al azar, la guarda en Firebase y en Cloudflare
(`AGENDA_ADMIN_TOKEN`) sin mostrarla, compila y publica el panel, y comprueba
que la web responde. Si falla, dice qué pasó. Repetirlo cambia la clave en los
dos sitios.

Problemas conocidos:

- **«La ejecución de scripts está deshabilitada»** al escribir `npx` en
  PowerShell: escribe `npx.cmd` (por ejemplo `npx.cmd firebase login`). No hace
  falta cambiar la configuración de Windows.
- **«User code failed to load… Timeout after 10000»** al publicar: Firebase no
  terminó de leer las funciones a tiempo. El script ya le da 120 s. Si la clave
  ya se guardó y solo falló la publicación, no repitas el script: en la carpeta
  del panel ejecuta `$env:FUNCTIONS_DISCOVERY_TIMEOUT="120"` y después
  `npx.cmd firebase deploy --only "functions:agendaHorario,functions:avisoLeadNuevo,hosting" --project prod --force`.
- **La campana no avisa de un lead nuevo** y en los registros de Firebase sale
  «Permission denied while using the Eventarc Service Agent»: pasa la primera
  vez que se publica un aviso automático en el proyecto (02/11/2026). Espera
  unos minutos y vuelve a publicar `functions:avisoLeadNuevo`.
- **El correo «Lead nuevo» del panel no sale** y en los registros pone «API key
  is invalid»: la clave de Resend guardada en Firebase no es válida. Es otra
  copia, distinta de la de Cloudflare. Pasos en el informe (`INFORME.html`).
- Para probar el aviso usa un correo nuevo (por ejemplo `nombre+prueba2@gmail.com`):
  un lead que ya existía se actualiza y no avisa.

### Cómo lo usa el panel (la function `agendaHorario`)

Dirección: `https://soyluisflores.es/api/agenda/config`, siempre con la
cabecera `Authorization: Bearer <AGENDA_ADMIN_TOKEN>`.

| Método | Qué hace |
|---|---|
| `GET` | Devuelve `{ config, desdePanel }`: el horario que se usa ahora |
| `PUT` | Cambia lo que venga en el cuerpo (JSON). Lo que no venga se queda igual |
| `DELETE` | Borra lo guardado y vuelve al horario de `src/data/agenda.ts` |

Ejemplo de cuerpo para `PUT` (todo opcional):

```json
{
  "zona": "Europe/Madrid",
  "duracion": 30,
  "paso": 30,
  "margen": 15,
  "antelacion": 12,
  "dias": 21,
  "titulo": "Llamada de diagnóstico",
  "horario": {
    "1": ["10:00-14:00", "16:00-20:00"],
    "2": ["10:00-14:00", "16:00-20:00"],
    "5": ["10:00-14:00"]
  }
}
```

- `horario`: días `0` (domingo) a `6` (sábado), con tramos `HH:MM-HH:MM` en la
  zona de `zona` (hasta `24:00`). Un día que no aparece, o con `[]`, queda
  cerrado. Si mandas `horario`, sustituye al anterior entero.
- Límites: `duracion` 15 a 180 minutos, `paso` 5 a 120, `margen` 0 a 120,
  `antelacion` 0 a 336 horas, `dias` 1 a 90.
- Si algo no vale, responde `400` con `detalle`, un texto en español que el
  panel puede enseñar tal cual (por ejemplo «Los tramos del día 1 se pisan»).
  No se guarda nada.
- Un cambio tarda como mucho un minuto en verse en la web.
- Respuestas: `401` clave incorrecta, `429` demasiados intentos, `503` falta
  el KV.

## Resumen semanal por correo (2/11/2026)

Cada lunes, a partir de las 8:00 de Madrid, llega a `hola@` (o a
`CORREO_AVISOS`) un correo con la semana anterior: conversaciones del chat,
cuántas llegaron a la tarjeta de la cita, citas confirmadas desde el chat y
desde el formulario. Solo se guardan esos números, en el KV `AGENDA_CONFIG`
con claves `stats:2026-W45`; nunca lo que escribe nadie. Código:
`src/worker/estadisticas.ts`. No necesita configurar nada.

## Recordatorio por WhatsApp (listo, apagado hasta que lo actives)

1 hora antes de la llamada, además del correo, sale un WhatsApp al cliente si
dejó su número con prefijo del país. Código: `src/worker/whatsapp.ts`. Usa
Twilio y cuesta unos céntimos por mensaje (Twilio más la tarifa de Meta según
el país: https://www.twilio.com/en-us/whatsapp/pricing). Se activa cuando
estén estos cuatro secretos en Cloudflare (Worker `web` → Configuración →
Variables y secretos, tipo **Secreto**):

| Secreto | Qué es |
|---|---|
| `TWILIO_ACCOUNT_SID` | En https://console.twilio.com, portada: «Account SID» (empieza por AC) |
| `TWILIO_AUTH_TOKEN` | En la misma portada: «Auth Token» |
| `TWILIO_WHATSAPP_FROM` | Tu número de WhatsApp Business conectado a Twilio, por ejemplo `whatsapp:+34600000000` |
| `TWILIO_PLANTILLA_1H` | El «Content SID» (empieza por HX) de la plantilla aprobada |

Pasos:

1. En Twilio: **Messaging** → **Senders** → **WhatsApp senders** → conecta
   tu número con tu cuenta de Meta Business (te guía paso a paso).
2. **Messaging** → **Content Template Builder** → **Create new** → tipo
   **Text**, categoría **Utility**, idioma español. Texto, con las tres
   variables en este orden:
   `Hola {{1}}, te recuerdo nuestra llamada de diagnóstico hoy a las {{2}}. Entra aquí: {{3}}. Si no puedes, avísame por aquí. Luis Flores`
3. Envíala a aprobación de WhatsApp y espera el «Approved».
4. Pon los cuatro secretos en Cloudflare. No hace falta publicar nada.
5. Antes de activarlo, pide que añadan Twilio (y Meta como proveedor de
   WhatsApp) a la política de privacidad y al aviso para Latinoamérica.

Solo funciona con las citas agendadas desde el 2/11/2026, que guardan el
número en el evento del calendario.

## Si algo falla

- **En lugar de la agenda sale «Agenda tu llamada por WhatsApp o por
  correo»:** Google rechazó las claves. Lo más común es que la app se quedara
  en «Prueba» (paso 1.5) o que alguien quitara el permiso en
  https://myaccount.google.com/permissions. Repite el paso 2 y cambia solo
  `GOOGLE_REFRESH_TOKEN` en Cloudflare.
- **No llegan los correos:** en Resend → **Emails** se ve cada envío y su
  estado. Si dice «bounced» o no aparece nada, revisa que el dominio siga
  **Verified** (paso 5.4) y el nombre del secreto `RESEND_API_KEY`.
- **Registros:** Cloudflare → Worker web → Registros. Solo guardan el
  resultado (`reserva-ok`, `correo: enviado`) y los códigos de error, nunca
  los datos del cliente.

## Pendiente

- La pantalla del panel para editar el horario (repositorio `panel`), con la
  dirección de arriba.
- Privacidad, aviso para Latinoamérica y cookies ya hablan de Google y de
  Resend (29/10/2026). Pendientes de revisión por un abogado: si la cuenta de
  Google es de Workspace o gratuita y el acuerdo de tratamiento de Resend.
- Si en tu cuenta de Calendly quedan citas o un enlace publicado en otro
  sitio (redes, firmas de correo), cámbialo por https://soyluisflores.es/contacto.

## Próximo hueco libre en los botones (9/11/2026)

`GET /api/agenda/proximo` devuelve solo el primer hueco libre (`{ proximo, duracion }`).
Lo usa `src/components/ProximoHueco.astro`, que muestra «Próximo hueco libre: mañana a
las 10:00» junto a los botones de agendar de la portada, del bloque final de las páginas
y del autodiagnóstico de `/servicios`, en la hora de quien visita. La respuesta se guarda
5 minutos en la caché de Cloudflare para no consultar Google en cada visita. Sin agenda
conectada o sin huecos, el aviso no aparece.

## Formulario corto de contacto (9/11/2026)

En `/contacto`, debajo de WhatsApp y correo: nombre, correo y mensaje para quien no quiere
agendar todavía (`src/components/FormularioMensaje.astro`). Lo recibe `POST /api/mensaje`
(`src/worker/mensaje.ts`, validación en `mensaje-validar.ts`): entra como lead en el panel
con el origen («Formulario de la página de contacto» y la campaña), llega el aviso «Mensaje
nuevo de …» a `CORREO_AVISOS` y la persona recibe el acuse «Recibí tu mensaje». Usa la misma
clave de Resend y el mismo límite por IP que la agenda (`LIMITE_AGENDA`, tipo «mensaje»).
Revisar con el abogado que la política de privacidad cubra este formulario.
