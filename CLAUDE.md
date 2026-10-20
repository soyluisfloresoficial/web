# Instrucciones para trabajar en este repositorio

Este repositorio es la web **soyluisflores.es** de Luis Carlos Flores. Cloudflare Pages está conectado a GitHub y **publica sola cada subida a la rama `main`**.

## Idioma

Habla siempre en español con el titular: respuestas, avisos de progreso y resúmenes. Cuando pida pasos, dalos muy detallados (qué botón tocar, qué copiar y dónde pegarlo).

## Regla permanente del titular: cada cambio se publica

Autorización permanente (20/10/2026), para cualquier conversación: cuando hagas un cambio en la web, termina siempre publicándolo, sin volver a preguntar:

1. `npm run build` sin errores.
2. `node tools/auditar-dist.mjs` con **0 problemas**.
3. Commit con un mensaje claro en español.
4. `git push` a **`main`** de `https://github.com/soyluisfloresoficial/web`. Siempre en avance rápido; **nunca `--force`**.
5. Avisa de qué se ha publicado y con qué commit. Cloudflare tarda uno o dos minutos.

Si el build o la auditoría fallan, **no subas nada** y explica qué ha pasado.

## Reglas de contenido

- Español de España.
- No inventes cifras, clientes, casos, reseñas, testimonios, fechas ni fuentes. Si falta un dato: `[COMPLETAR: qué falta]` o `[VERIFICAR: dónde]`.
- El NIE/NIF solo puede aparecer en `/aviso-legal`, nunca en el pie, en el JSON-LD ni en `llms.txt`. El domicilio público es solo «Manresa, Barcelona, España», sin calle ni código postal.
- No cambies el texto legal salvo que el titular lo pida; si ves un hueco, avisa de que lo revise un abogado.
- Tono de quien implementa: directo, sin promesas garantizadas ni urgencia artificial. Nada que suene a principiante («unos tres años», «empecé como freelance») en los textos de presentación.

## Referencias

- `SISTEMA-DISENO.md`: tipografía, acentos de color y movimiento.
- `DESPLIEGUE.md` y `GUIA-CLOUDFLARE.md`: cómo está montada la publicación.
- `src/data/`: textos de la home, servicios, logos e ilustraciones.
