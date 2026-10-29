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

Opcional, en **Variables** (no secretas) del Worker: `CORREO_AVISOS` para
recibir los avisos en otra dirección y `CORREO_REMITENTE` para otro
remitente, por ejemplo `Luis Flores <agenda@soyluisflores.es>`.

## Editar el horario desde el panel

Desde el 28/10/2026 el horario se cambia desde el panel, sin tocar el código.
Lo que guarda el panel queda en Cloudflare (KV `web-agenda`, enlazado como
`AGENDA_CONFIG` en `wrangler.jsonc`) y manda sobre `src/data/agenda.ts`.

Mientras el panel no guarde nada, la agenda está **abierta todos los días a
todas las horas** (hora de Madrid), con 12 horas de antelación mínima. Lo
pidió el titular. Si un día te bloqueas en Google Calendar, esas horas
desaparecen solas de la web.

### La clave del panel (una sola vez)

1. Genera una clave larga. En la terminal del proyecto:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

2. Cloudflare → Worker **web** → **Configuración** → **Variables y secretos** →
   **Añadir** → tipo **Secreto**, nombre `AGENDA_ADMIN_TOKEN`, valor: la clave.
   **Implementar**.
3. Pon la misma clave en la configuración secreta del panel (su `.env` o sus
   secretos). Nunca en el código del panel que llega al navegador.
4. Si el panel llama desde el navegador, añade en Cloudflare la variable
   `PANEL_ORIGENES` con su dirección, por ejemplo
   `https://panel-soyluisflores.web.app` (varias, separadas por comas). Si
   llama desde su servidor, no hace falta.

### Cómo lo usa el panel

Dirección: `https://soyluisflores.es/api/agenda/config`, siempre con la
cabecera `Authorization: Bearer <AGENDA_ADMIN_TOKEN>`.

| Método | Qué hace |
|---|---|
| `GET` | Devuelve `{ config, desdePanel }`: el horario que se usa ahora |
| `PUT` | Cambia lo que venga en el cuerpo (JSON). Lo que no venga se queda igual |
| `DELETE` | Borra lo guardado y vuelve al horario abierto de `src/data/agenda.ts` |

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
