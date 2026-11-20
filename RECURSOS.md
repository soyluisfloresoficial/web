# Recursos gratis de los CTA (videos y carruseles)

Desde el 17/11/2026, cada recurso que se ofrece en un CTA («Comenta FLUJO…») se descarga desde la web:

- **Página del recurso:** `https://soyluisflores.es/recursos/<slug>` → es el enlace que se manda por ManyChat o WhatsApp.
- **PDF directo:** `https://soyluisflores.es/recursos/<slug>.pdf`
- **Todos los recursos:** `https://soyluisflores.es/recursos` (enlazada en el pie, columna «Recursos»).

La página muestra el contenido para leerlo en el celular, el botón «Descargar PDF» (sin pedir correo), la guía gratis del servicio relacionado (con su formulario y la serie de correos de `EMAIL-MARKETING.md`) y la llamada de diagnóstico.

## Cómo se añade un recurso nuevo

1. **Contenido:** `video/recursos/<slug>.md` con este formato:
   - `# Título` (titular del PDF y de la página).
   - Una línea de subtítulo («Recurso gratuito de soyluisflores.es · Episodio NN …»).
   - `## Sección` y, dentro, en el orden que quieras: casillas `- [ ] …`, viñetas `- …`, subtítulos `### …`, párrafos y peticiones para copiar con `> …` (varias líneas `>` seguidas forman una sola petición; en la web llevan botón «Copiar» y en el PDF la caja «COPIA Y PEGA»).
   - Los párrafos sueltos al final de la última sección son la nota de cierre.
   - Nivel exigido (regla del 20/11/2026): aplicable el mismo día, con pasos concretos, prompts listos, un ejemplo resuelto (marcado como ficticio si lo es), criterios para decidir y cómo medir si funcionó.
2. **PDF:** `node tools/generar-recursos.mjs <slug>` → `public/recursos/<slug>.pdf` (marca SOYLUISFLORES, A4). Necesita Edge o Chrome; en la nube, `NAVEGADOR=<ruta>`.
3. **Ficha:** añade el recurso en `src/data/recursos.ts` (título, descripción de 70 a 160 caracteres, formato, origen, palabra clave, servicio relacionado y fecha).
4. **Publicar:** `npm run build`, `node tools/auditar-dist.mjs` con 0 problemas, commit y push a `main` (regla de `CLAUDE.md`).
5. **ManyChat:** la automatización de la palabra clave envía `https://soyluisflores.es/recursos/<slug>`. Probarla antes de publicar el video o el carrusel.

## Medición

Al descargar un PDF se envía el evento `file_download` con `file_name` (el slug) y `cta_location` (ver `src/components/Medicion.astro`). En GA4 se ve qué recurso se descarga y desde dónde.

Al pulsar «Copiar» en una petición se envía al `dataLayer` el evento `copiar_prompt` con `recurso` (el slug). Para verlo en GA4 hace falta una etiqueta de evento en Google Tag Manager con ese activador personalizado.

## Recursos publicados

| Recurso | Palabra | Origen | Página |
|---|---|---|---|
| Analiza las preguntas de tus clientes con IA | Enlace del perfil | Video · Episodio 04 | `/recursos/plantilla-preguntas-de-clientes` |
| Diseña tu primera automatización en 5 pasos | FLUJO | Video · Episodio 03 | `/recursos/plantilla-primera-automatizacion` |
| Organiza tus archivos antes de conectarlos a una IA | DOCUMENTOS | Video · Episodio 01 | `/recursos/checklist-organizar-archivos` |
