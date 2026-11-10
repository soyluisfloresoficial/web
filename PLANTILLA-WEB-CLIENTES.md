# Plantilla web para clientes: prompts por fase

Creada el 10/11/2026. Sirve para montarle a un cliente la misma web que tiene
soyluisflores.es, con los mismos proveedores: web rápida, agenda propia,
correos automáticos, guía gratis con secuencia, asistente de IA, conexión con
su CRM y landings para anuncios.

Cada fase es un prompt para pegar en **Claude Code** dentro del repositorio
del cliente. En cada fase Claude te hace primero las preguntas que le faltan,
espera tus respuestas y solo después construye. Al terminar, publica y te
deja el paso a paso de lo que te toca hacer en los paneles.

---

## 1. Cómo usarla

1. Rellena la **ficha del cliente** (sección 3) con lo que ya sepas. Lo que no
   sepas, déjalo vacío: Claude te lo preguntará.
2. Crea el repositorio del cliente en GitHub (fase 0) y abre Claude Code en él.
3. Pega el **prompt maestro** (sección 4) una sola vez: crea el `CLAUDE.md`
   con las reglas del proyecto.
4. Pega las fases en orden, una por conversación. No pases a la siguiente
   hasta que la anterior esté publicada y probada.
5. Las fases 6 a 10 son módulos: si el cliente no los contrata, sáltalos.

Tiempo orientativo: fases 0 a 5, una web publicada en 2 o 3 días de trabajo.
Cada módulo, medio día a un día más pruebas. [VERIFICAR con tus primeros
proyectos y ajusta tu precio a ello.]

---

## 2. Proveedores: qué hace cada uno y quién lo paga

Regla: **las cuentas son del cliente** (con su correo y su tarjeta). Tú entras
como invitado o colaborador. Así, si deja de trabajar contigo, no hay que
migrar nada y tú no pagas su consumo.

**Imprescindibles**
- [GitHub](https://github.com/): guarda el código. Cada cambio en `main` se publica solo.
- [Cloudflare](https://dash.cloudflare.com/): dominio (Registrar), DNS, el Worker que sirve la web, claves secretas, KV (pequeña base de datos) y Workers AI (voz del asistente).
- [Astro](https://astro.build/): el sistema con el que se construye la web. Gratis.
- [Google Tag Manager](https://tagmanager.google.com/) y [Google Analytics 4](https://analytics.google.com/): medición y conversiones.
- [Search Console](https://search.google.com/search-console) y [Bing Webmaster](https://www.bing.com/webmasters): que Google, Bing, ChatGPT y Copilot encuentren la web.
- [UptimeRobot](https://uptimerobot.com/): aviso si la web se cae.

**Módulos**
- Agenda: [Google Cloud](https://console.cloud.google.com/) (credenciales) + [Google Calendar](https://calendar.google.com/) del cliente.
- Correos automáticos y guía gratis: [Resend](https://resend.com/) con el dominio del cliente verificado.
- Asistente de IA: [Anthropic](https://console.anthropic.com/) (Claude Haiku), con límite mensual de gasto.
- CRM: [GoHighLevel](https://app.gohighlevel.com/), [ActiveCampaign](https://www.activecampaign.com/) o un panel propio en [Firebase](https://console.firebase.google.com/).
- WhatsApp de recordatorio: [Twilio](https://console.twilio.com/).
- Redes y anuncios: [ManyChat](https://manychat.com/), [Metricool](https://metricool.com/), [Meta Business Suite](https://business.facebook.com/), [Google Ads](https://ads.google.com/).
- Ficha local: [Perfil de Empresa de Google](https://business.google.com/).

Precios: cambian con frecuencia. Revísalos en la web de cada proveedor el día
que hagas el presupuesto y ponlos por escrito en la propuesta. [VERIFICAR]

---

## 3. Ficha del cliente (rellénala y pégala en la fase 1)

```
FICHA DEL CLIENTE
Nombre comercial:
Razón social y NIF (solo para el aviso legal):
Ciudad y país que se muestran en la web:
Dominio (o el que quiere comprar):
Mercado: España / Latinoamérica / ambos
Sector y a quién vende:
Servicios o productos (nombre + una frase de cada uno):
Qué tiene que hacer el visitante (un solo objetivo: agendar, comprar, escribir por WhatsApp...):
WhatsApp y correo de contacto:
Horario de atención y zona horaria:
Logo, colores y tipografías (o "no tiene"):
Fotos propias disponibles (sí/no):
Casos, cifras o testimonios reales con permiso (o "ninguno"):
Redes sociales (enlaces):
Módulos contratados: agenda / correos / guía gratis / asistente IA / CRM (cuál) / WhatsApp / landings de anuncios
¿Trata datos de salud u otros sensibles? (sí/no, cuáles):
Quién revisa los textos legales (abogado del cliente o pendiente):
```

---

## 4. Prompt maestro (una vez, al empezar el repositorio)

```
Vas a construir la web de un cliente de Nova Funnels con la misma arquitectura que soyluisflores.es: Astro, un Worker de Cloudflare con assets estáticos, publicación automática desde la rama main de GitHub con Workers Builds, y módulos opcionales (agenda con Google Calendar, correos con Resend, guía gratis con doble confirmación, asistente con Claude Haiku, webhook al CRM, landings de campaña).

Antes de nada, crea un CLAUDE.md en la raíz con estas reglas y respétalas en todas las fases:
1. Hablas conmigo en español. Al empezar cada fase me haces las preguntas que te falten en un solo bloque numerado y esperas mis respuestas. No construyas nada con datos supuestos.
2. Textos al público en el español del mercado del cliente (España o Latinoamérica neutro). Sin cifras, clientes, casos, reseñas ni fechas inventadas: si falta un dato, escribe [COMPLETAR: qué falta].
3. Mobile-first, accesible (AA), rápida, un objetivo y un CTA por página.
4. Ninguna clave en el repositorio. Las claves van en Cloudflare como Secreto; en el repositorio solo sus nombres.
5. Cada fase termina así: npm run build sin errores, auditoría de dist con 0 problemas, commit en español, push a main (nunca --force) y un resumen con lo publicado y mi paso a paso en los paneles (qué botón tocar, qué copiar y dónde pegarlo).
6. Mantén un INFORME.html en la raíz (no se publica) con el estado, los enlaces, las claves (solo nombres), los costos y lo pendiente. Actualízalo en cada fase.
7. El NIF del cliente solo aparece en /aviso-legal. Los textos legales los marcas como pendientes de revisión por un abogado.

Cuando lo tengas, enséñame el CLAUDE.md y espera a que te pase la fase 1.
```

---

## 5. Fase 0 · Cuentas y accesos (la haces tú, sin Claude)

- [ ] El cliente crea su cuenta de GitHub (o una organización) y te invita como colaborador.
- [ ] El cliente crea su cuenta de Cloudflare y te invita como administrador (Manage Account → Members).
- [ ] Dominio comprado en Cloudflare Registrar o con los DNS apuntando a Cloudflare.
- [ ] Cuenta de Google del negocio (para Calendar, Analytics, Tag Manager, Search Console y Perfil de Empresa) con acceso para ti.
- [ ] Según los módulos: Resend, Anthropic, CRM y Twilio a nombre del cliente.
- [ ] Contrato de encargado del tratamiento firmado (artículo 28 del RGPD): tú tratas datos de sus clientes en su nombre.

---

## 6. Fase 1 · Marca y estrategia

```
Fase 1: marca y estrategia. Te pego la ficha del cliente:
[PEGA LA FICHA]

Pregúntame primero lo que falte. Después:
- Define público, problema principal, oferta, objeciones y el objetivo único de la web.
- Propón la arquitectura de páginas (home, servicios con una página cada uno, sobre nosotros, contacto, blog si aplica, legales, 404) y qué CTA lleva cada una.
- Crea el sistema de diseño en tokens (colores con contraste AA, tipografías de Google Fonts, espaciado, radios, movimiento) en un SISTEMA-DISENO.md, con una dirección visual propia del sector, no una plantilla.
- Guarda los textos base en src/data (un archivo por bloque) para que todas las páginas lean de ahí.
No construyas páginas todavía. Enséñame la propuesta y espera mi visto bueno.
```

---

## 7. Fase 2 · Esqueleto y publicación automática

```
Fase 2: esqueleto y publicación.
Pregúntame: nombre del Worker, dominio, si la web lleva www, y la versión de Node que quieres fijar.
Después:
- Proyecto Astro con salida estática, sitemap y layout base con los tokens de la fase 1.
- wrangler.jsonc con el Worker (main en src/worker/index.ts, assets en ./dist, html_handling drop-trailing-slash, not_found_handling 404-page) y cabeceras de seguridad (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- tools/auditar-dist.mjs que revise en dist: un h1 por página, title y description únicos, alt en imágenes, enlaces rotos, canónicas y que el NIF solo esté en /aviso-legal.
- DESPLIEGUE.md con mi paso a paso: conectar el repositorio en Cloudflare → Workers y Pages → Crear → Importar repositorio, comando de build, y añadir el dominio en Configuración → Dominios y rutas.
Publica y dame la dirección de prueba workers.dev para comprobarla.
```

---

## 8. Fase 3 · Páginas y textos

```
Fase 3: páginas y textos.
Pregúntame lo que falte de cada servicio (para quién es, qué incluye, cómo se trabaja, preguntas frecuentes) y si hay fotos propias.
Después:
- Construye todas las páginas de la arquitectura aprobada leyendo de src/data.
- Copy en la voz del cliente: beneficios concretos, sin promesas garantizadas ni urgencia artificial. Preguntas frecuentes reales en cada servicio.
- Contacto con WhatsApp y correo visibles. Si el módulo de agenda está contratado, deja el hueco preparado para la fase 6.
- Legales: aviso legal, privacidad y cookies con los datos de la ficha, marcados como pendientes de revisión por un abogado. Si el mercado incluye Latinoamérica, añade un aviso de privacidad para Latinoamérica.
- Prueba en 375, 768 y 1280 px y corrige lo que se rompa.
Publica.
```

---

## 9. Fase 4 · SEO y visibilidad en buscadores e IA

```
Fase 4: SEO y GEO. Usa la skill seo-geo-consultant.
Pregúntame: palabras clave principales, ciudades o países objetivo y competidores conocidos.
Después:
- Title, description y un h1 por página; canónicas; sitemap; robots.txt.
- JSON-LD: Organization o LocalBusiness (sin NIF ni calle si el cliente no quiere), Service por servicio, FAQPage, BreadcrumbList.
- llms.txt con el resumen de la web para las IA.
- Imagen para compartir (Open Graph) por página.
- Dame el paso a paso para dar de alta la web en Search Console y Bing Webmaster, enviar el sitemap y crear el Perfil de Empresa de Google si tiene local o zona de servicio.
Publica.
```

---

## 10. Fase 5 · Medición y cookies

```
Fase 5: medición. Usa la skill analytics.
Pregúntame: ID de Tag Manager (GTM-XXXX), ID de GA4 y si habrá anuncios en Meta o Google.
Después:
- Banner de cookies con Consent Mode v2: nada se carga hasta que la persona acepta. Tabla real de cookies en la política.
- PUBLIC_GTM_ID como variable de compilación (no en el repositorio). Dime dónde ponerla en Cloudflare.
- Plan de medición en MEDICION.md: eventos (clic en WhatsApp, envío de formulario, cita agendada, suscripción a la guía, uso del asistente), cuáles son conversiones y los UTM por canal.
- Los eventos en el dataLayer y el paso a paso para crear las etiquetas en Tag Manager y comprobarlo en el modo vista previa.
Publica.
```

---

## 11. Fase 6 · Agenda propia con Google Calendar (módulo)

```
Fase 6: agenda propia con Google Calendar y correos de Resend.
Pregúntame: duración de la cita, horario por día, días bloqueados, antelación mínima y máxima, zona horaria, qué datos pide el formulario, si la cita es por videollamada o presencial, y el remitente de los correos.
Después:
- Agendador en la web que muestra huecos reales del calendario y crea el evento (rutas /api del Worker, con límite de peticiones).
- Correos con Resend: confirmación, aviso al cliente, recordatorios y enlace para cancelar.
- Horario guardado en un KV de Cloudflare para poder cambiarlo sin publicar.
- Script tools/autorizar-google.mjs para obtener el refresh token, y AGENDA.md con mi paso a paso: crear el proyecto en Google Cloud, activar Calendar API, pantalla de consentimiento, credenciales OAuth, verificar el dominio en Resend (registros DNS en Cloudflare) y guardar GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN y RESEND_API_KEY como Secreto.
- Si no hay claves, la web ofrece WhatsApp y correo en su lugar.
Prueba una cita completa de principio a fin y publica.
```

---

## 12. Fase 7 · Guía gratis y secuencia de correos (módulo)

```
Fase 7: guía gratis con doble confirmación y secuencia. Usa la skill emails.
Pregúntame: tema de la guía (uno por servicio o una general), cuántos correos y cada cuántos días, y a dónde lleva el último (cita, WhatsApp o compra).
Después:
- Formulario con casilla de consentimiento obligatoria, doble confirmación y borrado automático a los 7 días si no confirma.
- Lista en un KV de Cloudflare, envío con Resend, baja con un clic en cada correo.
- La guía como página web de la propia web (no PDF suelto).
- Secuencia con un objetivo por correo; textos en src/worker/secuencia.ts y tabla en EMAIL-MARKETING.md con disparador, salida y métrica de cada correo.
Prueba una suscripción completa y publica.
```

---

## 13. Fase 8 · Asistente de IA en la web (módulo)

```
Fase 8: asistente de IA con Claude Haiku. Usa la skill claude-api.
Pregúntame: nombre y tono del asistente, qué puede responder, qué no, cuándo pasa a una persona, y el gasto máximo al mes.
Después:
- Chat en la web con la API de Anthropic desde el Worker (ANTHROPIC_API_KEY como Secreto), modelo en una variable.
- Lo que sabe se genera solo desde src/data y el blog. Nunca inventa precios, horarios ni disponibilidad: si no está en los datos, lo dice y ofrece contacto.
- Aviso visible de que se habla con una IA, enlace a privacidad y opción de hablar con una persona.
- Topes: límite por minuto, límite diario de conversaciones y respuestas fijas sin IA para las preguntas más comunes.
- Si el módulo de agenda está activo, puede proponer y agendar la cita.
- AGENTE.md con el system prompt, los límites y 10 casos de prueba difíciles (pide un precio que no existe, insulta, pide datos de otro cliente, habla de salud...). Pásalos todos antes de publicar.
Publica.
```

---

## 14. Fase 9 · CRM y WhatsApp (módulo)

```
Fase 9: conexión con el CRM y WhatsApp.
Pregúntame: qué CRM usa (GoHighLevel, ActiveCampaign o panel propio en Firebase), qué campos y etiquetas quiere, en qué etapa entra cada lead, y si quiere recordatorio por WhatsApp.
Después:
- Cada cita, suscripción y conversación con datos de contacto se envía al CRM por webhook firmado (URL y secreto como Secreto en Cloudflare), con reintento y sin duplicados (clave por correo o teléfono).
- Origen del lead (página, UTM, sección) en cada envío.
- Si hay WhatsApp: recordatorio con Twilio 1 hora antes, con plantilla aprobada por Meta y consentimiento en el formulario.
- Paso a paso para crear el webhook entrante en el CRM, mapear los campos y hacer una prueba.
Prueba un lead de principio a fin y publica.
```

---

## 15. Fase 10 · Landings de anuncios y redes (módulo)

```
Fase 10: landings de campaña. Usa las skills cro y web-funnel-builder.
Pregúntame: qué servicios se anuncian, en qué plataformas (Meta, Google, TikTok) y la oferta de cada landing.
Después:
- Una landing por servicio en /diagnostico/[servicio] con la identidad de la web, sin cabecera ni pie completos, barra fija de reserva en celular y pie legal.
- noindex, follow, canónica hacia la página del servicio y fuera del sitemap.
- Conversiones en Tag Manager para Meta y Google Ads, y FUNNELS.md con los enlaces con UTM de cada campaña.
- Enlace de la bio y respuesta de ManyChat apuntando a la guía o a la landing, con UTM propios.
Publica.
```

---

## 16. Fase 11 · Auditoría y entrega

```
Fase 11: auditoría completa y entrega.
Revisa y corrige: seguridad (cabeceras, claves, rutas que no deben publicarse), celular, tablet y computadora, accesibilidad, velocidad (Lighthouse), SEO y GEO, legales y cookies, y que cada módulo funcione de principio a fin.
Después:
- Deja el INFORME.html al día con estado, enlaces, claves (solo nombres), costos mensuales por proveedor y lo pendiente.
- Dame el paso a paso para crear el monitor en UptimeRobot y el límite de gasto en Anthropic.
- Escribe un correo de entrega para el cliente con qué tiene, dónde entra y cómo pedir cambios.
Publica.
```

---

## 17. Avisos antes de vender esta plantilla

- **Datos personales:** el cliente es el responsable y tú el encargado. Firma
  el contrato de encargo antes de recoger un solo lead.
- **Datos de salud** (clínicas, como Smilbot): el asistente y los formularios
  no deben pedir síntomas ni historial. Si hace falta, revisión previa de un
  abogado y evaluación de impacto.
- **Asistente de IA:** siempre con aviso de que es una IA y opción de hablar
  con una persona.
- **Textos legales:** las plantillas no sustituyen a un abogado. Déjalo por
  escrito en la propuesta.
- **Mantenimiento:** las claves caducan (el token de Google puede invalidarse)
  y las APIs cambian. Ofrece un plan mensual en lugar de entregar y desaparecer.
