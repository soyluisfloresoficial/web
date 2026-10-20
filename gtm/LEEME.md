# Contenedor de Google Tag Manager

`contenedor-ga4.json` deja GTM listo para medir la web con Google Analytics 4. Trae:

| Pieza | Qué hace |
|---|---|
| **GA4 - Etiqueta de Google** | Carga GA4 en todas las páginas |
| **GA4 - Evento cta_diagnostico_click** | Envía a GA4 cada clic en «Reservar diagnóstico», con la sección (`cta_location`) y la página (`page_path`) |
| **Evento - cta_diagnostico_click** | El activador: salta cuando la web envía ese evento al `dataLayer` (lo hace `src/components/CookieBanner.astro`) |
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
8. Pulsa **Vista previa**, abre la web, acepta las cookies y pulsa un botón «Reservar diagnóstico». En Tag Assistant tienen que dispararse las dos etiquetas.
9. Si todo va bien, pulsa **Enviar** → **Publicar**.

## Aviso

Este fichero lo he escrito siguiendo el formato de exportación de GTM, pero **no he podido probar la importación**: no tengo acceso a tu cuenta. Si GTM da un error al importarlo, crea las mismas cuatro piezas a mano con los nombres y valores de la tabla de arriba. Se tarda unos diez minutos.

En GA4, marca `cta_diagnostico_click` como **evento clave** (Administrar → Eventos) para que cuente como conversión.
