# Email marketing: guía gratis y secuencia

Desde el 30/10/2026 la web capta contactos con una guía gratis y les escribe
sola una serie corta de correos con tu marca, hasta invitarlos a la llamada
de diagnóstico.

## Cómo funciona

1. **El gancho:** una guía gratis por servicio (ver la tabla de abajo). La
   general, «Qué automatizar primero en tu negocio», está en el índice del
   blog y en https://soyluisflores.es/guia (página para redes y anuncios).
   Cada página de servicio ofrece la suya, y cada artículo del blog, la de
   su servicio.
2. **Consentimiento:** la persona escribe su correo (el nombre es opcional)
   y marca la casilla. Sin casilla no se envía nada.
3. **Doble confirmación:** le llega un correo con el botón «Confirmar y
   recibir la guía». Hasta que confirma no entra en la lista, y si no lo hace
   sus datos se borran solos a los 7 días.
4. **La serie:** al confirmar recibe la guía y, después, un correo cada pocos
   días. Al terminar, no recibe nada más.
5. **Al panel:** cada suscripción confirmada entra en el panel como lead
   (cuando esté conectado, ver «Conectar con el panel» en `AGENDA.md`).

## Los correos

| Día | Asunto | Qué dice | A dónde lleva |
|---|---|---|---|
| 0 | Confirma tu correo y te mando la guía | Botón para confirmar | `/correo/confirmar` |
| 0 | Tu guía: (la que pidió) | La guía y cómo usarla esta semana | `/guia/<guía>` |
| 2 | Lo que pasa cuando respondes tarde | Atención y agentes de IA que no inventan | Artículo de agentes de IA |
| 4 | Herramientas que no se hablan | Automatizar sin que nada se rompa | Artículo de conectar herramientas |
| 7 | Dónde se te escapan los contactos | Ordenarlos en un CRM | Artículo de CRM |
| 10 | Qué mirar para decidir | Las pocas cifras que importan | Artículo de métricas |
| 14 | ¿Lo vemos en tu negocio? | Invitación a la llamada; es el último | `/diagnostico/<servicio de la guía>` |

Los correos de los días 2 a 10 son los mismos para todas las guías. Si
alguien que ya está en la lista pide otra guía, le llega directamente, sin
volver a empezar la serie.

## Las guías

| Servicio | Guía | Dirección |
|---|---|---|
| Automatización (la general) | Qué automatizar primero en tu negocio | `/guia/que-automatizar-primero` |
| Agentes de IA | Prepara tu negocio para un agente de IA | `/guia/preparar-un-agente-de-ia` |
| Funnels de conversión | Tu embudo de ventas, paso a paso | `/guia/embudo-de-ventas-paso-a-paso` |
| CRM y seguimiento | Ordena tus contactos en un CRM | `/guia/ordenar-tus-contactos-en-un-crm` |
| Email marketing | Tu primera secuencia de correos | `/guia/tu-primera-secuencia-de-correos` |
| Paneles de métricas | Las cifras de tu negocio en una sola pantalla | `/guia/las-cifras-de-tu-negocio` |
| Páginas web | Una web que te trae clientes | `/guia/una-web-que-trae-clientes` |
| Meta Ads y Google Ads | Antes de invertir en anuncios | `/guia/antes-de-invertir-en-anuncios` |
| Consultoría de IA | Por dónde empezar con la IA en tu negocio | `/guia/por-donde-empezar-con-ia` |
| Regalo de Instagram (12/11/2026) | El negocio inteligente: 7 formas de aplicar IA en tu negocio | `/guia/negocio-inteligente` |

### La guía de regalo de Instagram

«El negocio inteligente» se pide en **/negocio-inteligente**, no en una página
de servicio. Es el destino del mensaje automático de ManyChat cuando alguien
comenta una publicación. Enlace para pegar en ManyChat:

```
https://soyluisflores.es/negocio-inteligente?utm_source=ig&utm_medium=manychat&utm_campaign=negocio-inteligente
```

En el paso 3 trae las siete formas en lugar de cuatro áreas. Su último correo
lleva a `/diagnostico/consultoria-ia`. Va la última de la lista en
`src/data/guias.ts` para que la página de Consultoría de IA siga ofreciendo
su propia guía. En el panel, el lead llega con «Llegó por: Instagram» y con el
origen corto «Instagram · Guía negocio-inteligente» (`origenCorto()` en
`src/worker/origen.ts`).

Todas tienen las mismas partes (rediseño del 2/11/2026, para que cualquiera
las entienda a la primera):

1. **Ficha de arriba:** para quién es, qué te llevas y cuánto tiempo te pide,
   con la foto de Luis y los cuatro pasos como índice.
2. **Palabras que vas a leer:** los términos técnicos de esa guía, en simple.
3. **Paso 1 · Mira si te conviene:** tres puntos, cada uno con «Pregúntate».
4. **Paso 2 · Anótalo:** la hoja, con una fila de ejemplo. En el celular se
   ve el ejemplo en tarjeta; la tabla completa sale al guardar en PDF.
5. **Paso 3 · Elige ideas** y **Paso 4 · Sigue el plan**, con lo que conviene
   revisar antes de empezar.
6. **Cierre con la foto de Luis**, la llamada y WhatsApp.

El contenido está en `src/data/guias.ts` (campos `paraQuien`, `teLlevas`,
`tiempo`, `glosario` y `ejemplo` incluidos) y sale de las fichas de cada
servicio y del blog. Las pruebas comprueban que ninguna guía se quede sin
ficha, glosario o ejemplo.

El formulario dice cuánto se tarda en leerla, para quién es, lo que trae y
qué llega después («la guía y cinco correos cortos en dos semanas»), con la
foto de Luis. Al enviarlo explica los tres pasos: abrir el correo de Luis
Flores, tocar «Confirmar» y recibir la guía.

- Mismo diseño que los correos de la agenda: cabecera «LUIS FLORES»,
  degradado azul a violeta, un solo botón o enlace por correo.
- Todos los enlaces llevan `utm_source=email`, `utm_medium=secuencia`,
  `utm_campaign=guia-<guía pedida>` (desde el 2/11/2026; antes todas decían
  `guia-automatizar`) y `utm_content` con el paso. Así en Analytics ves qué
  guía trae más llamadas. Si alguien
  agenda desde un correo, la cita y el aviso dicen de cuál llegó.
- Cada correo tiene **Darte de baja** en el pie y la cabecera de baja en un
  clic que piden Gmail y Outlook.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Textos de la serie y del correo de confirmación | `src/worker/secuencia.ts` |
| Diseño de los correos | `maquetar()` en `src/worker/correo-plantillas.ts` |
| Alta, confirmación, baja y envío programado | `src/worker/suscripciones.ts` (cron de `wrangler.jsonc`, cada 10 minutos) |
| Formulario | `src/components/CapturaGuia.astro` |
| Las guías | Contenido en `src/data/guias.ts`; diseño en `src/pages/guia/[slug].astro` |
| Página para pedirla | `src/pages/guia/index.astro` |
| Confirmar y darse de baja | `src/pages/correo/[accion].astro` |
| Lista de suscriptores | KV de Cloudflare `web-suscriptores` (enlace `SUSCRIPTORES`) |
| Pruebas | `node tools/probar-agenda.mjs` |

**Si cambias el texto de la casilla** del formulario, cambia también
`TEXTO_CONSENTIMIENTO` en `src/worker/secuencia.ts`: es la prueba de lo que
aceptó cada persona. Las pruebas avisan si no coinciden.

## Qué hace falta para que funcione

Solo la clave de Resend, la misma de la agenda (`AGENDA.md`, paso 5). Sin
ella, el formulario dice «Ahora mismo no puedo enviarte la guía» y ofrece
WhatsApp.

La clave de Resend también firma los enlaces de confirmar y de baja: si un
día la cambias, los enlaces de correos ya enviados dejan de valer. Quien
quiera darse de baja puede escribir a hola@ o usar el enlace de un correo
nuevo.

## De dónde llega cada lead (2/11/2026)

Cada lead que entra al panel (guía confirmada o llamada agendada) empieza
con tres líneas, que se ven en la campana, en el correo «Lead nuevo» y en la
ficha:

- **Origen:** pidió la guía «…», agendó en la agenda de la web o con Flora.
- **Sección:** artículo del blog /blog/…, página del servicio …, landing de
  anuncios de …, chat de Flora en /…
- **Llegó por:** anuncio en Meta o Google, Instagram, un correo de la serie,
  con el nombre de la campaña, o «visita directa o búsqueda».

La traducción está en `src/worker/origen.ts`. El resumen semanal de los
lunes trae además **de qué sección llegaron** los correos y las citas de la
semana, ordenadas de más a menos.

## Medición

Al pedir la guía, la web envía a Tag Manager el evento `sign_up` con
`method: "guia-<guía>"` (por ejemplo `guia-preparar-un-agente-de-ia`), así
ves qué guía capta más. En GA4 márcalo como evento clave. Para
anuncios de captación (por ejemplo en Meta, objetivo «clientes potenciales»)
crea con ese evento la conversión, igual que `generate_lead` en
`FUNNELS.md`.

En Resend → **Emails** ves cada envío, si se abrió y si rebotó.

## Para anunciar la guía

- Enlace: https://soyluisflores.es/guia, con los mismos parámetros de
  campaña de `FUNNELS.md`.
- Funciona mejor para gente que todavía no está lista para una llamada: la
  serie los lleva hasta ella en dos semanas.

## Pendiente

- [VERIFICAR con un abogado] Los textos legales ya explican la lista
  (privacidad y aviso para Latinoamérica, 30/10/2026).
- Si quieres más guías (una por servicio, por ejemplo), se hacen con el
  mismo sistema: un formulario, una guía y su serie.
