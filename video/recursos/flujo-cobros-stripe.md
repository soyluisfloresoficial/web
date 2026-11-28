# Cobros y facturas automáticas con Stripe

Recurso gratuito de soyluisflores.es · Reel 08 «¿Te llegó la factura?». Factura, enlace de pago y recordatorios sin escribir a nadie.

## El flujo completo

### 1. Disparador
Marcas el trabajo como terminado en tu CRM o tablero.

### 2. Factura
Se genera la factura (Stripe Invoicing o tu programa de facturación) con los datos del cliente.

### 3. Envío
Se envía por correo con enlace de pago de Stripe.

### 4. Recordatorio 1
Si no paga en la fecha de vencimiento: correo amable con el enlace.

### 5. Recordatorio 2
A los 3 días: segundo aviso. A los 7: aviso para ti para llamar.

### 6. Pago recibido
Stripe avisa (webhook): se marca como cobrada y te llega una notificación.

## Herramientas

- [ ] Stripe (Invoicing o Payment Links)
- [ ] Make o n8n para conectar CRM, Stripe y correo
- [ ] Tu CRM o Airtable como fuente de la verdad

## Plantilla de recordatorio

> Asunto: Factura [Nº] · vence hoy
> Hola [Nombre], te recuerdo la factura [Nº] de [importe].
> Puedes pagarla aquí: [enlace]
> Si ya la pagaste, ignora este mensaje. Gracias.

## Para España

- [ ] Revisa con tu gestoría los requisitos de facturación vigentes (Verifactu y factura electrónica) antes de automatizar la emisión
- [ ] Numeración correlativa y datos fiscales completos
- [ ] Los métodos de pago disponibles dependen de tu cuenta de Stripe

Consejo: Automatiza los recordatorios aunque emitas la factura a mano: es donde más horas se pierden.

## Hazlo hoy en 30 minutos

- [ ] Crea tu cuenta de Stripe (o revisa que esté verificada) y activa los enlaces de pago.
- [ ] Crea un enlace de pago para tu servicio más vendido y pruébalo en modo de prueba.
- [ ] Escribe los dos recordatorios con las plantillas de esta guía.
- [ ] Decide dónde se marca la factura como cobrada: tu hoja de facturación, tu CRM o tu programa de facturación.

## Segundo recordatorio listo para copiar

> Hola [NOMBRE], te escribo por la factura [NÚMERO] de [IMPORTE], que venció el [FECHA]. Puede que se te haya pasado: aquí tienes el enlace para pagar en un clic: [ENLACE]. Si ya la pagaste, ignora este mensaje y disculpa la molestia.

## Ejemplo resuelto (ficticio)

Diseñadora freelance. Al cerrar el proyecto, su CRM genera la factura con un enlace de pago de Stripe y la envía por correo. Si no se paga en la fecha, sale el primer recordatorio; a los 3 días, el segundo. Cuando el cliente paga, Stripe avisa y la factura pasa a «Cobrada» en su hoja. Ella ya no tiene que revisar el banco para saber quién pagó.

## Cómo decidir

- Cobros puntuales por proyecto: enlace de pago por factura.
- Cobros que se repiten cada mes: suscripción en Stripe, con recordatorios automáticos.
- En España, la factura debe cumplir las normas de facturación vigentes: confirma con tu asesor que tu programa las cumple antes de automatizar.

## Errores que debes evitar

- Recordatorios agresivos o en mayúsculas
- No reconciliar pagos con facturas
- Automatizar la facturación sin validar con tu gestoría

## Cómo saber si funcionó

- Días promedio desde la factura hasta el cobro.
- Facturas vencidas a fin de mes.
- Horas al mes que dedicas a reclamar pagos: el objetivo es cero.

Los ejemplos de este recurso son ficticios y orientativos. Prueba cada herramienta con datos de prueba antes de usarla con clientes reales.
