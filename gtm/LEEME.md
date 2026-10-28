# Contenedor de Google Tag Manager

`contenedor-ga4.json` deja GTM (`GTM-NHS23ZRB`) listo para medir la web con Google Analytics 4. Trae una etiqueta y un activador por evento:

| Evento (`dataLayer`) | Etiqueta | Activador | Parámetros | Lo envía |
|---|---|---|---|---|
| — | **GA4 - Etiqueta de Google** | All Pages | — | GTM, en todas las páginas |
| `cta_click` | **GA4 - Evento cta_click** | **Evento - cta_click** | `cta_location`, `cta_text`, `page_path` | `src/components/Medicion.astro` |
| `whatsapp_click` | **GA4 - Evento whatsapp_click** | **Evento - whatsapp_click** | `cta_location`, `cta_text`, `page_path` | `Medicion.astro` |
| `email_click` | **GA4 - Evento email_click** | **Evento - email_click** | `cta_location`, `cta_text`, `page_path` | `Medicion.astro` |
| `roi_calculator_use` | **GA4 - Evento roi_calculator_use** | **Evento - roi_calculator_use** | `page_path` | `src/pages/roi.astro` |
| `form_start` | **GA4 - Evento form_start** | **Evento - form_start** | `form_id`, `page_path` | `src/pages/contacto.astro` (al elegir hora en Calendly) |
| `generate_lead` | **GA4 - Evento generate_lead** | **Evento - generate_lead** | `form_id`, `method`, `page_path` | `contacto.astro` (al confirmar la reserva en Calendly) |

Variables: **GA4 - ID de medición** (**[COMPLETAR: viene con `G-XXXXXXXXXX`]**) y **DLV - cta_location**, **DLV - cta_text**, **DLV - page_path**, **DLV - form_id**, **DLV - method** (variables de capa de datos, versión 2).

Valores de `cta_location`: `hero`, `header`, `servicios`, `faq`, `footer`, `cierre`, `barra-movil`, `contacto-tarjeta`, o el id de la sección si es otra. `form_id` dice de qué página llega la reserva: `calendly-diagnostico` (/contacto), `calendly-diagnostico-landing` (/diagnostico) o `funnel-<servicio>` (los funnels de anuncios, ver `FUNNELS.md`). `method` es `agenda-propia` con la agenda conectada a Google Calendar y `calendly` con la de respaldo. Las conversiones de Meta Ads y Google Ads están en `FUNNELS.md`.

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
5. Ve a `/contacto`, pulsa «Ver horarios disponibles» y elige una hora. Si quieres probar `generate_lead`, confirma una reserva de prueba y cancélala después desde Calendly.
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

## Aviso

Este fichero sigue el formato de exportación de GTM, pero **no he podido probar la importación**: no tengo acceso a tu cuenta. Si GTM da un error al importarlo, crea las mismas piezas a mano con los nombres de la tabla de arriba.
