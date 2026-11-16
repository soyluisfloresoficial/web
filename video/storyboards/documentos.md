# Storyboard y QA · «La IA puede consultar tus documentos» (16/11/2026)

Avatar HeyGen: `publico/medios/avatar-documentos.mp4` (720×1280, 25 fps, 43,5 s). Config: `src/lf/videos/documentos.ts`.

## Montaje (tiempos de la voz real)
| Tiempo | Voz | Disposición | Visual |
|---|---|---|---|
| 0,0–3,5 | ¿Y si pudieras hacerle preguntas a todos los documentos…? | Avatar solo | Titular karaoke «¿Y si pudieras hacerle preguntas a tus documentos?» + zoom |
| 3,5–7,7 | cientos de contratos, manuales y procedimientos… carpetas | 65/35 | Foto real de pilas de archivos (rawpixel, CC0) + Contratos / Manuales / Procedimientos |
| 7,7–10,5 | encontrar una condición específica | 65/35 | Foto real de persona agobiada buscando (rawpixel, CC0) |
| 10,5–12,7 | ¿Vas a abrir los archivos uno por uno? Mira esto | Avatar solo | Titular karaoke + zoom |
| 12,7–15,7 | sistema de IA conectado a tus documentos | 65/35 | Foto real de consulta en portátil (Direct Media, StockSnap, CC0) + flujo documentos → IA → pregunta |
| 15,7–25,8 | pregunta, busca fragmentos, respuesta, de qué documento | 65/35 | DEMO: documentos que se agrupan, pregunta escrita, barrido de búsqueda, respuesta con citas [1] [2] |
| 25,8–31,2 | búsqueda de información con inteligencia artificial | Avatar solo | Titular karaoke |
| 31,2–36,1 | documentos autorizados, respuestas verificadas | 65/35 | Foto real de revisión de documento (rawpixel, CC0) + autorizados / verificación |
| 36,1–39,3 | solo una de las aplicaciones | Avatar solo | Titular karaoke |
| 39,3–43,5 | Soy Luis Flores, sígueme… | 65/35 | CTA «SÍGUEME» con @soyluisfloresoficial |

## QA
- Archivos: master 1080×1920, 30 fps, H.264/AAC, 43,5 s, 0 errores de decodificación. Instagram/TikTok −14 LUFS; WhatsApp 720p, 4,4 MB, −14 LUFS.
- Voz: desfase 0 ms frente al audio original de HeyGen (correlación de envolvente). La sincronía labial es la de HeyGen: el montaje no retoca el video del avatar.
- Gestos y dirección del avatar: dependen de HeyGen; revisados en fotogramas sueltos, no en reproducción completa.
- Subtítulos: transcripción automática (faster-whisper) alineada a la voz; 2 palabras de baja confianza revisadas («¿Y», «¿qué»).
- Textos: demo con nombres de archivo genéricos y respuesta ilustrativa, marcada «DEMO» y «Ejemplo ilustrativo». Sin clientes, cifras ni resultados.
- Derechos: fotos CC0 de Openverse; música y efectos de síntesis propia (sin licencias de terceros).
- Zonas seguras: textos dentro de 72/150/230/440 px; la cara queda libre.

## Diferencias con el brief
- La locución real no coincide con el brief: el gancho no es «Tienes cien documentos…» y el cierre pide «sígueme», sin la palabra DOCUMENTOS. El montaje sigue la voz real.
- Tarjeta de recurso DOCUMENTOS: no se incluye. La voz no la nombra y `01_guia_agente.md` no existe en el proyecto ni hay mecanismo de entrega. Para incluirla hay que regenerar el cierre en HeyGen y tener el recurso y la entrega operativos.
