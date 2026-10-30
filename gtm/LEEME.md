# Contenedor de Google Tag Manager

`contenedor-ga4.json` deja GTM (`GTM-NHS23ZRB`) listo para medir la web con Google Analytics 4. Trae una etiqueta y un activador por evento:

| Evento (`dataLayer`) | Etiqueta | Activador | Parámetros | Lo envía |
|---|---|---|---|---|
| — | **GA4 - Etiqueta de Google** | All Pages | — | GTM, en todas las páginas |
| `cta_click` | **GA4 - Evento cta_click** | **Evento - cta_click** | `cta_location`, `cta_text`, `page_path` | `src/components/Medicion.astro` |
| `whatsapp_click` | **GA4 - Evento whatsapp_click** | **Evento - whatsapp_click** | `cta_location`, `cta_text`, `page_path` | `Medicion.astro` |
| `email_click` | **GA4 - Evento email_click** | **Evento - email_click** | `cta_location`, `cta_text`, `page_path` | `Medicion.astro` |
| `roi_calculator_use` | **GA4 - Evento roi_calculator_use** | **Evento - roi_calculator_use** | `page_path` | `src/pages/roi.astro` |
| `form_start` | **GA4 - Evento form_start** | **Evento - form_start** | `form_id`, `page_path` | `src/components/Agenda.astro` (al elegir hora en la agenda) |
| `generate_lead` | **GA4 - Evento generate_lead** | **Evento - generate_lead** | `form_id`, `method`, `page_path` | `Agenda.astro` (al confirmar la reserva) |

Desde el 30/10/2026 la web también envía `sign_up` (`method: "guia-automatizar"`, `page_path`) cuando alguien pide la guía gratis (`src/components/CapturaGuia.astro`). Este contenedor todavía no trae su etiqueta: créala igual que la de `generate_lead` (ver `EMAIL-MARKETING.md`).

Variables: **GA4 - ID de medición** (**[COMPLETAR: viene con `G-XXXXXXXXXX`]**) y **DLV - cta_location**, **DLV - cta_text**, **DLV - page_path**, **DLV - form_id**, **DLV - method** (variables de capa de datos, versión 2).

Valores de `cta_location`: `hero`, `header`, `servicios`, `faq`, `footer`, `cierre`, `barra-movil`, `contacto-tarjeta`, o el id de la sección si es otra. `form_id` dice de qué página llega la reserva: `agenda-contacto` (/contacto), `agenda-diagnostico` (/diagnostico) o `funnel-<servicio>` (los funnels de anuncios, ver `FUNNELS.md`). Hasta el 29/10/2026 los dos primeros se llamaban `calendly-diagnostico` y `calendly-diagnostico-landing`. `method` es siempre `agenda-propia`. Las conversiones de Meta Ads y Google Ads están en `FUNNELS.md`.

GTM solo se carga si la persona acepta las cookies de analítica o de marketing en el banner. Antes de cargarlo, Consent Mode v2 queda en `denied` para todo (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`).

## Cómo importarlo

1. En https://analytics.google.com crea una propiedad GA4 (Administrar → Crear → Propiedad) y un flujo de datos web para `https://soyluisflores.es`. Copia el **ID de medición**, que empieza por `G-`.
2. En https://tagmanager.google.com abre el contenedor `GTM-NHS23ZRB` → **Administrar** → **Importar contenedor**.
3. Elige `gtm/contenedor-ga4.json`.
4. Espacio de trabajo: **Existente** → *Default Workspace*.
5. Opción de importación: **Sobrescribir** si el contenedor solo tiene lo que venía en este fichero. Si tienes etiquetas tuyas, elige **Combinar** → **Cambiar el nombre de las etiquetas, activadores y variables en conflicto**, y después borra a mano las piezas antiguas (`cta_diagnostico_click`, `Eventos de contacto`, `Evento - contacto…`).
6. Pulsa **Confirmar**.
7. Ve a **Variables** → **GA4 - ID de medición** y cambia `G-XXXXXXXXXX` por tu ID.

## Cómo probarlo

**En la vista previa de GTM**

1. En GTM pulsa **Vista previa**, escribe `https://soyluisflores.es` y pulsa **Connect**.
2. En la pestaña de la web que se abre, acepta las cookies.
3. Pulsa «Agenda tu llamada gratis» en la portada, el botón de WhatsApp del cierre y tu correo del pie.
4. Ve a `/roi`, completa los números y pulsa «Calcular mi estimación».
5. Ve a `/contacto` y elige un día y una hora. Si quieres probar `generate_lead`, confirma una reserva de prueba con otro correo tuyo y cancélala después con el enlace «cambiar mi llamada» del correo.
6. En la ventana de Tag Assistant, cada acción aparece a la izquierda con su nombre (`cta_click`, `whatsapp_click`…). Haz clic en ella: en **Tags Fired** debe salir su etiqueta «GA4 - Evento …», y en **Variables** los valores de `cta_location`, `page_path`, etc.

**En DebugView de GA4**

1. Con la vista previa de GTM abierta, entra en GA4 → **Administrar** → **DebugView**.
2. Repite las acciones. Cada evento aparece en la línea de tiempo en pocos segundos; haz clic en él para ver sus parámetros.
3. Si todo va bien, vuelve a GTM y pulsa **Enviar** → **Publicar**.

## Eventos clave en GA4

En GA4 → **Administrar** → **Eventos** (o **Eventos clave**), marca como evento clave:

- `generate_lead` (reserva confirmada: la conversión principal)
- `whatsapp_click`
- `cta_click`

`email_click`, `form_start` y `roi_calculator_use` conviene dejarlos como eventos normales para analizar el recorrido. Los eventos aparecen en esa lista después de que llegue el primero.

Para ver `cta_location` y `form_id` en los informes, créalos como **dimensiones personalizadas** (Administrar → Definiciones personalizadas → Crear dimensión personalizada, ámbito «Evento», con el mismo nombre del parámetro).

## Segundo contenedor: conversiones de los anuncios (30/10/2026)

`contenedor-anuncios.json` añade lo necesario para medir los anuncios. Se
genera con `node tools/generar-contenedor-anuncios.mjs`.

| Etiqueta | Cuándo se dispara |
|---|---|
| **Meta - Píxel base** | En todas las páginas |
| **Meta - Lead (llamada agendada)** | `generate_lead`: alguien agendó la llamada |
| **Meta - CompleteRegistration (guía gratis)** | `sign_up`: alguien pidió la guía |
| **Google Ads - Vinculador de conversiones** | En todas las páginas |
| **Google Ads - Llamada de diagnóstico** | `generate_lead` |
| **Google Ads - Guía gratis** | `sign_up` |
| **GA4 - Evento sign_up** | `sign_up` |

Todas las de Meta y Google Ads piden el consentimiento `ad_storage`: solo
funcionan si la persona acepta las cookies de marketing.

### Cómo importarlo (después del de GA4)

1. Consigue tus números:
   - **Meta:** https://business.facebook.com → **Administrador de eventos** →
     **Conectar orígenes de datos** → **Web** → crea el píxel y copia su **ID**
     (solo números).
   - **Google Ads:** https://ads.google.com → **Objetivos** → **Conversiones** →
     **Nueva acción de conversión** → **Sitio web** → escribe `soyluisflores.es`
     → **Añadir una acción de conversión manualmente**. Crea dos:
     «Llamada de diagnóstico» (categoría **Reservar cita**) y «Guía gratis»
     (categoría **Registro**). Al guardar cada una, elige **Usar Google Tag
     Manager** y apunta el **ID de conversión** (el mismo en las dos) y la
     **Etiqueta de conversión** de cada una.
2. En https://tagmanager.google.com abre el contenedor `GTM-NHS23ZRB` →
   **Administrar** → **Importar contenedor** → elige
   `gtm/contenedor-anuncios.json`.
3. Espacio de trabajo: **Existente** → *Default Workspace*. Opción:
   **Combinar** → **Sobrescribir las etiquetas, activadores y variables en
   conflicto**. Solo coinciden tres variables (`DLV - form_id`,
   `DLV - method`, `DLV - page_path`) y el activador **Evento -
   generate_lead**, que son iguales, así que no se pierde nada.
4. Toca **Confirmar**.
5. Ve a **Variables** y rellena las cuatro que dicen «(pegar aquí)»:
   - **Meta - ID del píxel**: el ID del píxel.
   - **Google Ads - ID de conversión**: solo los números (sin «AW-»).
   - **Google Ads - Etiqueta llamada** y **Google Ads - Etiqueta guía**: la
     etiqueta de cada conversión.
6. **Vista previa** → abre `https://soyluisflores.es/guia`, acepta las cookies
   y pide la guía con otro correo tuyo: en Tag Assistant, en el evento
   `sign_up`, deben salir **Meta - CompleteRegistration**, **Google Ads - Guía
   gratis** y **GA4 - Evento sign_up**. Con una reserva de prueba, en
   `generate_lead`, las dos de la llamada.
7. **Enviar** → **Publicar**.

Las cookies que ponen (`_fbp` y `_gcl_au`) ya están en la política de
cookies, y sus dominios, en la CSP de `public/_headers`.

## Aviso

Estos ficheros siguen el formato de exportación de GTM, pero **no he podido probar la importación**: no tengo acceso a tu cuenta. Si GTM da un error al importarlos, crea las mismas piezas a mano con los nombres de las tablas de arriba.
