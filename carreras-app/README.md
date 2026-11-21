# Carreras: control de carreras, cobros y fiados

App web (PWA, móvil primero) con dos roles. **Administrador** (tú): clientes, carreras, pagos, recordatorios y CSV. **Cliente**: ve solo lo suyo (saldo, carreras con recogida y destino, pendientes/pagadas con fecha, historial de pagos, avisos).

Stack: Cloudflare Worker + D1 (SQLite) + Hono. Correo con Resend. WhatsApp con la API oficial de Meta. Importes en euros, guardados en céntimos.

## Reglas de negocio
- Un pago se aplica a las carreras más antiguas primero (o a una concreta). No se acepta un pago mayor que lo pendiente.
- Anular un pago deja sus carreras otra vez pendientes. Una carrera con pagos aplicados no se borra.
- Cada carrera y cada pago avisa al cliente en la app (y por correo/WhatsApp si lo tiene activo). Puedes desmarcar «Avisar».
- Recordatorio automático cada lunes a las 08:00 UTC (09:00 en invierno en España): avisa a quien tenga carreras sin pagar con más de `REMINDER_DAYS` días (7 por defecto), como mucho una vez por semana. Cámbialo en `wrangler.jsonc` (`triggers.crons` y `vars.REMINDER_DAYS`).
- Informe mensual por cliente en Inicio, estado de cuenta imprimible o en PDF (tú y el cliente), buscador de clientes y autocompletado de lugares frecuentes.
- Contraseñas con PBKDF2, sesión por cookie HttpOnly, bloqueo tras 8 intentos fallidos en 15 minutos.

## Puesta en marcha (una vez)
1. `cd carreras-app && npm install`
2. `npx wrangler login`
3. `npx wrangler d1 create carreras` y copia el `database_id` en `wrangler.jsonc`.
4. `npm run migrate:remote` (repítelo cada vez que haya una migración nueva en `migrations/`)
5. Secreto de alta: `npx wrangler secret put SETUP_TOKEN` (inventa uno largo).
6. `npm run deploy`. Te da una URL `*.workers.dev`; después puedes asignar un dominio (por ejemplo `carreras.soyluisflores.es`) en el panel de Cloudflare.
7. Crea tu cuenta de administrador, una sola vez (solo funciona si no hay usuarios):
```
curl -X POST https://TU-URL/api/setup -H "Content-Type: application/json" \
  -d '{"token":"TU_SETUP_TOKEN","name":"Luis","email":"tu@correo.es","password":"MINIMO10CARACTERES"}'
```
8. Entra, ve a Clientes → Nuevo cliente y entrégales su correo y contraseña inicial.
9. Cuando termines el alta, borra el secreto: `npx wrangler secret delete SETUP_TOKEN`.

## Avisos por correo (Resend)
`npx wrangler secret put RESEND_API_KEY` y cambia `EMAIL_FROM` en `wrangler.jsonc` por un remitente de un dominio verificado en Resend. Sin la clave, solo hay avisos dentro de la app.

## Avisos por WhatsApp (Meta Cloud API)
1. Número de WhatsApp Business en Meta, con plantilla de utilidad aprobada llamada `aviso_carreras` (idioma `es`) con **un solo parámetro** `{{1}}`. Texto sugerido: `Aviso de tu conductor: {{1}}`.
2. `npx wrangler secret put WHATSAPP_TOKEN` y `npx wrangler secret put WHATSAPP_PHONE_ID`.
3. El teléfono del cliente va con prefijo, sin signos (ej. `34600111222`).
- Los mensajes iniciados por ti fuera de la ventana de 24 h solo pueden ser plantillas aprobadas y Meta los cobra por mensaje: [VERIFICAR la tarifa vigente para España en la web de Meta].

## Pruebas en local
`echo "SETUP_TOKEN=prueba" > .dev.vars && npm run migrate && npm run dev` y abre `http://localhost:8787`.
Para probar el recordatorio: `npx wrangler dev --test-scheduled` y abre `http://localhost:8787/cdn-cgi/handler/scheduled?cron=0+8+*+*+1`.

## RGPD
- Marca «El cliente aceptó recibir avisos» al crearlo; queda la fecha de consentimiento.
- Los datos son personales (nombre, correo, teléfono, trayectos). Añade política de privacidad y deja claro que hay un tratamiento de datos. Si tienes clientes que son particulares, que lo revise un abogado.
- Los trayectos revelan ubicaciones: no los uses para nada que no sea el cobro.

## Pendiente para una v2
Panel de gastos del vehículo, recuperación de contraseña por correo, pagos con Stripe.
