# Informe de calidad · Episodio 03 (17/11/2026)

## Archivos
| Archivo | Resultado |
|---|---|
| ep03-preview.mp4 | 540×960, 30 fps, 40,5 s, 0 errores |
| ep03-final.mp4 (Instagram/TikTok, firma @soyluisfloresoficial) | 1080×1920, 30 fps, H.264 + AAC, 40,6 s, 0 errores, −14,1 LUFS, pico −1,5 dBFS (sin clipping) |
| ep03-web-final.mp4 (LinkedIn/Facebook, firma soyluisflores.es) | Mismas especificaciones |
| ep03-cover.png | 1080×1920; título y flujo dentro del recorte 3:4 de la cuadrícula |
| ep03-subtitles.srt | 34 subtítulos con los tiempos de la voz real |
| Recurso: plantilla-primera-automatizacion.pdf | 1 página A4 con la marca (`video/recursos/`) |

## Comprobaciones
- Gancho: «5 TAREAS SIN IA» y la vista previa del flujo desde el primer segundo, con el avatar a cámara. ✔
- Demostración visible desde 5,2 s; cada nodo se activa con su palabra («primero» … «quinto»). ✔
- Texto legible en móvil: títulos de nodo de 30 px y detalles de 20 px a pantalla completa. ✔
- Subtítulos alineados con la transcripción de la voz real; blanco con pocas palabras en cian; fuera de boca y ojos y de la zona de botones. ✔
- Sincronía labial y gestos: el video de HeyGen no se retoca (solo encuadre y acercamiento lento del 5 % en el gancho); voz con 0 ms de desfase frente al original. ✔
- Cortes secos al inicio de cada frase, sin fundidos a negro. ✔
- Datos ficticios identificados: etiqueta DEMO y «Ejemplo ilustrativo · datos ficticios». ✔
- Branding: #07090D, navy #0A2540, cian, violeta; menta solo en el CTA; Manrope e Inter. ✔
- CTA: PLANTILLA GRATIS · COMENTA FLUJO, sin «SÍGUEME» ni condiciones. ✔
- Exportación reproducible: `LF-EP03`, `LF-EP03-Web` y `LF-EP03-Portada` en `src/lf/Composiciones.tsx`; subtítulos con `herramientas/srt.py`. ✔

## Pendiente antes de aprobar la publicación
1. **Entrega del recurso:** en ManyChat (consultado por API el 17/11/2026) no aparece ningún flujo para FLUJO. Hay que crear la automatización «comentario FLUJO → enviar la plantilla» y probarla.
2. **Enlace del recurso:** el PDF está en un enlace de Higgsfield; mejor alojarlo en soyluisflores.es/recursos para que no dependa de un tercero.
3. **Revisión humana completa:** ver el video entero con sonido (este control se hizo con fotogramas, mediciones de audio y comparación de la voz).
4. **Música:** de síntesis propia, sin derechos de terceros; si prefieres una pista de biblioteca con licencia, se sustituye.
