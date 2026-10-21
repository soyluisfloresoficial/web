# Contenedor de Google Tag Manager

`contenedor-ga4.json` deja GTM listo para medir la web con Google Analytics 4. Trae:

| Pieza | Qué hace |
|---|---|
| **GA4 - Etiqueta de Google** | Carga GA4 en todas las páginas |
| **GA4 - Evento cta_diagnostico_click** | Envía a GA4 cada clic en «Agenda tu llamada gratis» (o «Agenda una llamada»), con la sección (`cta_location`), el texto del botón (`cta_text`) y la página (`page_path`) |
| **GA4 - Eventos de contacto** | Envía `whatsapp_click`, `email_click` y `calculadora_roi_calculo` con los mismos datos |
| **Evento - contacto (WhatsApp, correo, calculadora)** | Su activador |
| **Evento - cta_diagnostico_click** | El activador: salta cuando la web envía ese evento al `dataLayer` (lo hace `src/components/CookieBanner.astro`) |
| **DLV - cta_location, cta_text, page_path** | Variables que leen esos datos del `dataLayer` |
| **GA4 - ID de medición** | Variable con tu ID de GA4. **[COMPLETAR: viene con `G-XXXXXXXXXX`]** |

GTM solo se carga si la persona acepta las cookies de analítica o de marketing en el banner. El consentimiento llega a GA4 por Consent Mode v2.

## Cómo importarlo

1. En https://analytics.google.com crea una propiedad GA4 (Administrar → Crear → Propiedad) y un flujo de datos web para `https://soyluisflores.es`. Copia el **ID de medición**, que empieza por `G-`.
2. En https://tagmanager.google.com abre tu contenedor → **Administrar** → **Importar contenedor**.
3. Elige `gtm/contenedor-ga4.json`.
4. Espacio de trabajo: **Existente** → *Default Workspace*.
5. Opción de importación: **Combinar** → **Cambiar el nombre de las etiquetas, activadores y variables en conflicto**. No elijas «Sobrescribir» si ya tienes etiquetas.
6. Pulsa **Confirmar**.
7. Ve a **Variables** → **GA4 - ID de medición** y cambia `G-XXXXXXXXXX` por tu ID.
8. Pulsa **Vista previa**, abre la web, acepta las cookies y pulsa «Agenda tu llamada gratis» y el botón de WhatsApp. En Tag Assistant tienen que dispararse la etiqueta de Google y la del evento de cada clic.
9. Si todo va bien, pulsa **Enviar** → **Publicar**.

## Aviso

Este fichero lo he escrito siguiendo el formato de exportación de GTM, pero **no he podido probar la importación**: no tengo acceso a tu cuenta. Si GTM da un error al importarlo, crea las mismas piezas a mano con los nombres y valores de la tabla de arriba. Se tarda unos diez minutos.

En GA4, marca `cta_diagnostico_click` y `whatsapp_click` como **eventos clave** (Administrar → Eventos) para que cuenten como conversiones. `email_click` también puede serlo.

Si ya habías importado una versión anterior de este fichero, vuelve a importarlo con **Combinar**: solo añade lo nuevo.
