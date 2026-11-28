# Tablero de ventas en Airtable

Recurso gratuito de soyluisflores.es · Reel 12 «¿Cuánto cierras este mes?». Sabe cuánto dinero tienes en juego y qué toca hacer hoy con cada oportunidad.

## Estructura de la tabla «Oportunidades»

- Cliente: Tipo: Texto / vínculo a Contactos · Para qué: Quién
- Etapa: Tipo: Selección única · Para qué: Nuevo · Contactado · Propuesta · Ganado · Perdido
- Valor: Tipo: Moneda (€) · Para qué: Importe estimado
- Probabilidad: Tipo: Porcentaje · Para qué: Opcional, para previsión
- Próxima acción: Tipo: Texto · Para qué: Qué hay que hacer
- Fecha próxima acción: Tipo: Fecha · Para qué: Cuándo
- Origen: Tipo: Selección · Para qué: Instagram, web, recomendación…

## Vistas imprescindibles

- [ ] Kanban agrupado por Etapa (tu tablero)
- [ ] «Hoy»: Fecha próxima acción = hoy o antes
- [ ] Resumen: suma de Valor por Etapa

## Automatizaciones (Airtable o Make)

### 1. Pasa a «Propuesta»
Crea una tarea «Llamar en 3 días» y envía el correo con la propuesta.

### 2. Pasa a «Ganado»
Aviso al equipo, crea la ficha de proyecto y envía la factura.

### 3. Sin movimiento 7 días
Recordatorio para ti con el enlace a la oportunidad.

### 4. Pasa a «Perdido»
Pide el motivo (campo obligatorio) para aprender de cada venta perdida.

Consejo: Regla de oro: una tarjeta solo avanza cuando pasa algo verificable (reunión hecha, propuesta enviada, pago recibido).

## Alternativa

Si ya usas GoHighLevel, sus «Opportunities» y «Pipelines» cubren lo mismo, con automatizaciones nativas por etapa.

## Hazlo hoy en 30 minutos

- [ ] Crea la tabla «Oportunidades» con los campos de esta plantilla en Airtable (o en tu CRM).
- [ ] Mete todas las propuestas abiertas que tengas ahora, con su valor y fecha de envío.
- [ ] Crea la vista Kanban por etapa: Nuevo, Contactado, Propuesta y Ganado.
- [ ] Añade un campo que calcule los días sin respuesta y marca en rojo las de más de 3 días.

## Fórmula lista para copiar (Airtable)

> IF(AND({Etapa}="Propuesta", DATETIME_DIFF(TODAY(), {Fecha de envío}, 'days') > 3), "🔴 Llamar hoy", "")

## Ejemplo resuelto (ficticio)

Agencia de eventos. Al meter sus propuestas, ve 9.800 € en la columna Propuesta, de los que 5.200 € llevan más de una semana sin respuesta. El lunes llama primero a la propuesta más grande y más antigua, y mueve cada tarjeta solo cuando pasa algo real: una respuesta, una llamada o un pago.

## Cómo decidir la herramienta

- Trabajas solo y quieres algo flexible: Airtable.
- Ya usas GoHighLevel o necesitas que WhatsApp, correo y embudos estén en el mismo sitio: el pipeline de GoHighLevel.

## Errores que debes evitar

- Mover tarjetas por intuición
- No registrar el motivo de pérdida
- Tener oportunidades sin próxima acción

## Cómo saber si funcionó

- Valor total en la columna Propuesta al empezar cada mes.
- Días promedio que una tarjeta pasa en cada columna.
- Propuestas en rojo (sin respuesta) cada semana.

Los ejemplos de este recurso son ficticios y orientativos. Prueba cada herramienta con datos de prueba antes de usarla con clientes reales.
