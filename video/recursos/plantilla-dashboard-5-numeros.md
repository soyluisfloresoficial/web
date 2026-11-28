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

## Hazlo hoy en 30 minutos

- [ ] Crea una hoja con 5 filas: ventas de la semana, contactos nuevos por canal, presupuestos abiertos, tasa de cierre y cobrado frente a pendiente.
- [ ] Rellena los números de la semana pasada a mano, aunque tardes: así sabes de dónde sale cada dato.
- [ ] Apunta al lado de cada número de qué herramienta sale (CRM, Stripe, banco).
- [ ] Agenda 5 minutos cada lunes a primera hora para revisarlo.

## Prompt para leer tu panel

> Estos son los 5 números de mi negocio de las últimas 4 semanas: [PEGA LA TABLA].
> 1. Dime qué número empeoró y cuál mejoró, con el porcentaje.
> 2. Dame una sola acción concreta para esta semana, la que más impacto tendría.
> 3. Dime qué dato me falta para tomar mejores decisiones.

## Ejemplo resuelto (ficticio)

Estudio de yoga, lunes 8:00. Ventas: 2.150 € (semana anterior 1.900 €). Contactos: 11, 7 de Instagram. Presupuestos abiertos: 4 bonos de empresa por 3.200 €. Cierre: 3 de cada 10. Pendiente de cobro: 450 €. Decisión de la semana: llamar a las 4 empresas y reclamar los 450 €.

## Cómo decidir la herramienta

- Para empezar: una hoja de cálculo que rellenas el lunes.
- Cuando el lunes te lleve más de 15 minutos: conecta CRM y Stripe a un panel que se actualice solo y te llegue por correo.

## Errores que debes evitar

- Paneles con 30 métricas que nadie mira
- Actualizar a mano
- Mirar números sin decidir una acción

## Cómo saber si funcionó

- ¿Lo miras cada lunes? Si no, el panel tiene demasiados datos.
- Una decisión por semana tomada a partir del panel.
- Datos actualizados solos, sin copiar a mano.

Los ejemplos de este recurso son ficticios y orientativos. Prueba cada herramienta con datos de prueba antes de usarla con clientes reales.
