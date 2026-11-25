# Dashboard con los 5 números de tu negocio

Recurso gratuito de soyluisflores.es · Reel 10 «Cinco números, un panel». Una vista, actualizada sola, que te llega cada lunes.

- 1 · Ventas de la semana: Cómo se calcula: Suma de cobros o pedidos (lun-dom) vs semana anterior · De dónde sale: Stripe, tienda o facturación
- 2 · Nuevos contactos: Cómo se calcula: Contactos creados, agrupados por origen · De dónde sale: CRM
- 3 · Presupuestos abiertos: Cómo se calcula: Número y suma de valor en etapa «Propuesta» · De dónde sale: Tablero de ventas
- 4 · Tasa de cierre: Cómo se calcula: Ganados ÷ (ganados + perdidos) del último mes · De dónde sale: Tablero de ventas
- 5 · Cobrado vs pendiente: Cómo se calcula: Facturas pagadas vs vencidas sin pagar · De dónde sale: Facturación / Stripe

## Cómo montarlo

### 1. Fuente única
Lleva los datos a Airtable o Google Sheets con Make o n8n (cada noche).

### 2. Vista o panel
Interfaz de Airtable, Looker Studio o un panel propio.

### 3. Informe del lunes
Automatización que envía un correo a las 8:00 con los 5 números y su variación.

### 4. Revisión de 15 minutos
Cada lunes: ¿qué número empeoró y qué acción tomo esta semana?

Consejo: No mezcles ventanas de tiempo distintas en el mismo panel (semana vs mes) sin indicarlo.

## Errores que debes evitar

- Paneles con 30 métricas que nadie mira
- Actualizar a mano
- Mirar números sin decidir una acción

## Cómo saber si funcionó

- ¿Lo miras cada lunes? Si no, el panel tiene demasiados datos.
- Una decisión por semana tomada a partir del panel.
- Datos actualizados solos, sin copiar a mano.

Los ejemplos de este recurso son ficticios y orientativos. Prueba cada herramienta con datos de prueba antes de usarla con clientes reales.
