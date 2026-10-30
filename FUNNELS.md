# Funnels de captación para anuncios

Desde el 28/10/2026 hay una landing por servicio para usar como destino de
anuncios en Meta Ads y Google Ads, más la general `/diagnostico`. Todas
tienen un único objetivo: agendar la llamada de diagnóstico gratis de 30
minutos, con la agenda propia (ver `AGENDA.md`).

Desde el 29/10/2026 usan los colores de la web (navy y degradado azul →
violeta), cada una con el color de su servicio, y llevan un gráfico animado
propio en el hero (`src/components/EscenaFunnel.astro`): un chat que agenda
una cita, un flujo que se completa, una tarjeta que avanza en el CRM, una
gráfica que se dibuja… Se reproduce una vez al aparecer y queda quieto.

## Enlaces de cada funnel

| Servicio | Enlace del anuncio | `form_id` en la medición |
|---|---|---|
| General (todos los servicios) | https://soyluisflores.es/diagnostico | `agenda-diagnostico` |
| Agentes de IA | https://soyluisflores.es/diagnostico/agentes-ia | `funnel-agentes-ia` |
| Funnels de conversión | https://soyluisflores.es/diagnostico/funnels-conversion | `funnel-funnels-conversion` |
| Automatización de procesos | https://soyluisflores.es/diagnostico/automatizacion | `funnel-automatizacion` |
| CRM y seguimiento de leads | https://soyluisflores.es/diagnostico/crm-seguimiento-leads | `funnel-crm-seguimiento-leads` |
| Email marketing | https://soyluisflores.es/diagnostico/email-marketing | `funnel-email-marketing` |
| Paneles de métricas | https://soyluisflores.es/diagnostico/paneles-de-metricas | `funnel-paneles-de-metricas` |
| Páginas web con IA | https://soyluisflores.es/diagnostico/webs-ia | `funnel-webs-ia` |
| Meta Ads y Google Ads | https://soyluisflores.es/diagnostico/trafico-de-pago | `funnel-trafico-de-pago` |
| Consultoría de IA | https://soyluisflores.es/diagnostico/consultoria-ia | `funnel-consultoria-ia` |

Cada página sigue este orden: gancho con gráfico animado → herramientas con
las que trabajo → «¿Te suena?» (tres problemas) → qué implemento y qué cambia
→ qué te llevas de la llamada → cómo funciona → para quién es → agenda → quién
te atiende → preguntas → cierre. En celular, el botón «Elegir día y hora»
aparece fijo abajo al pasar el del hero y se esconde al llegar a la agenda.

Van con «noindex, follow», canónica hacia la página del servicio y fuera del
sitemap: son para anuncios y no compiten con `/servicios/...` en Google. Eso
no afecta a los anuncios.

| Qué | Dónde |
|---|---|
| Textos propios de cada funnel (gancho, frase destacada, problemas, qué te llevas, herramientas) | `src/data/funnels.ts` |
| Gráfico animado de cada funnel | `src/components/EscenaFunnel.astro` |
| Qué incluye, qué cambia, para quién y preguntas | `src/data/servicios-detalle.ts` (los mismos de la web) |
| Diseño de todas las landings | `src/components/LandingDiagnostico.astro` |
| Página de cada funnel | `src/pages/diagnostico/[servicio].astro` |

## Saber de qué anuncio llega cada cita

Añade estos parámetros al enlace del anuncio. Cuando alguien reserva, la cita
de tu Google Calendar dice en la descripción «Llegó desde:» con el funnel y la
campaña.

**Meta Ads** (en el anuncio → **Seguimiento** → **Parámetros de URL**, pega esto
tal cual):

```text
utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}
```

**Google Ads** (en la campaña → **Configuración** → **Opciones de URL de la
campaña** → **Sufijo de URL final**, pega esto tal cual):

```text
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}
```

## Conversiones de los anuncios en Tag Manager

La reserva confirmada envía el evento `generate_lead` con su `form_id`. Ese
evento es la conversión de los anuncios. Tag Manager solo se carga si la
persona acepta las cookies de marketing, como manda la ley.

**La forma rápida (30/10/2026):** importa `gtm/contenedor-anuncios.json`, que
ya trae el píxel de Meta, las conversiones de Google Ads y la de la guía
gratis. Solo tienes que pegar tus números. Pasos en `gtm/LEEME.md`, «Segundo
contenedor». Lo de abajo es la forma manual, por si prefieres crearlas a mano.

Antes, importa el contenedor de `gtm/` si no lo hiciste (ver `gtm/LEEME.md`):
crea el activador **Evento - generate_lead**.

### Meta Ads (píxel)

1. En https://business.facebook.com → **Administrador de eventos** → **Conectar
   orígenes de datos** → **Web** → crea el píxel y copia su **ID** (solo
   números).
2. En https://tagmanager.google.com abre el contenedor `GTM-NHS23ZRB` →
   **Plantillas** → **Buscar en la galería** → busca **Facebook Pixel** (de
   *facebookarchive*) → **Añadir al espacio de trabajo**.
3. **Etiquetas** → **Nueva**:
   - Nombre: `Meta - PageView`
   - Tipo: **Facebook Pixel**. En **Pixel ID** pega el ID. Evento estándar:
     **PageView**.
   - **Configuración avanzada** → **Configuración de consentimiento** →
     **Requiere consentimiento adicional** → añade `ad_storage`.
   - Activador: **All Pages**. Guarda.
4. **Etiquetas** → **Nueva**:
   - Nombre: `Meta - Lead`
   - Tipo: **Facebook Pixel**, mismo ID, evento estándar **Lead**.
   - Mismo consentimiento (`ad_storage`).
   - Activador: **Evento - generate_lead**. Guarda.

### Google Ads

1. En https://ads.google.com → **Objetivos** → **Conversiones** → **Nueva acción
   de conversión** → **Sitio web** → escribe `soyluisflores.es` → **Añadir una
   acción de conversión manualmente**:
   - Categoría: **Reservar cita**
   - Nombre: `Llamada de diagnóstico`
   - Valor: **No usar un valor** · Recuento: **Una**
   - Guarda y elige **Usar Google Tag Manager**. Copia el **ID de conversión** y
     la **Etiqueta de conversión**.
2. En Tag Manager → **Etiquetas** → **Nueva**:
   - Nombre: `Google Ads - Vinculador de conversiones`
   - Tipo: **Vinculador de conversiones** · Activador: **All Pages**. Guarda.
3. **Etiquetas** → **Nueva**:
   - Nombre: `Google Ads - Llamada de diagnóstico`
   - Tipo: **Seguimiento de conversiones de Google Ads**. Pega el ID y la
     etiqueta del paso 1.
   - Activador: **Evento - generate_lead**. Guarda.

### Probar y publicar

1. En Tag Manager toca **Vista previa** y abre un funnel, por ejemplo
   `https://soyluisflores.es/diagnostico/agentes-ia?utm_source=prueba`.
2. Acepta las cookies y haz una reserva de prueba con otro correo tuyo.
3. En Tag Assistant, en el evento `generate_lead` tienen que salir
   **Meta - Lead** y **Google Ads - Llamada de diagnóstico** en «Tags Fired».
4. Toca **Enviar** → **Publicar**. Borra la cita de prueba de tu calendario.

## Recomendaciones para las campañas

- Un conjunto de anuncios (Meta) o una campaña (Google) por funnel, con el
  enlace de su servicio. Así el anuncio y la página dicen lo mismo, y cada
  uno se mide por separado.
- En Meta, optimiza la campaña para el evento **Lead** cuando ya tenga
  reservas; al principio puede hacer falta optimizar para clics en el enlace.
- El texto del anuncio debe prometer lo mismo que el titular de la página:
  una llamada gratis de 30 minutos para ver qué hacer primero.

## Pendiente

- El horario de la agenda se edita desde el panel (`AGENDA.md`). Hasta
  entonces está abierto todos los días a todas las horas.
- La agenda propia funciona cuando estén las claves de Google en Cloudflare
  (`AGENDA.md`). Hasta entonces, en lugar de la agenda sale «Agenda tu
  llamada por WhatsApp o por correo». Antes de lanzar anuncios, conecta Google
  y Resend para que se pueda reservar directamente.
- Las imágenes para compartir de cada funnel: `node tools/generar-og.mjs`
  (necesita Edge o Chrome).
