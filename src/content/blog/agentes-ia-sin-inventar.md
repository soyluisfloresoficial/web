---
# TODO (titular): falta una fuente externa sobre tasas de alucinación o buenas prácticas de agentes con base de conocimiento. No la elijo yo para no inventar una fuente.
title: "Agentes de IA que no inventan información: cómo se logra"
description: "Lo que más preocupa de un agente de IA es que invente precios u horarios. Te explico cómo se configura para que responda solo con lo que tú apruebas."
metaTitle: "Agentes de IA que no inventan información | Luis Flores"
datePublished: 2026-09-24
dateModified: 2026-10-21
servicio: "agentes-ia"
---
Cada vez que propongo un agente de IA para atender clientes, me hacen la misma pregunta: *«¿Y si inventa un precio o le da a alguien una hora que no tengo libre?»*. Es una duda muy válida. La respuesta corta es que un agente bien configurado no debería inventar nada, y que eso depende mucho más de la configuración que del modelo de IA que uses.

## Un chatbot genérico sí inventa

Si abres un chatbot cualquiera y le preguntas por tus precios, te va a contestar *algo* aunque no tenga idea. A eso se le llama «alucinación»: completa lo que no sabe con lo que le suena. En un negocio no te lo puedes permitir, porque un precio inventado termina en un reclamo o en una venta perdida.

## Cómo se evita en la práctica

Un agente bien hecho no responde de memoria. Lo configuro en tres capas:

1. **Una sola fuente de información.** El agente solo usa lo que tú le das: tus servicios, tus horarios y tus condiciones. Fuera de eso no improvisa.
2. **Datos en tiempo real.** Los precios, la disponibilidad y las citas salen en el momento de tus herramientas (tu calendario, tu CRM), no de una respuesta guardada.
3. **Una regla para cuando no sabe.** Si le preguntan algo que no está en su información, lo dice y pasa la conversación a una persona.

> Un buen agente sabe decir «eso no lo sé, te comunico con alguien del equipo». Esa respuesta, en el momento justo, genera mucha confianza.

## Pasar la conversación a una persona también se diseña

Que el agente sepa cuándo hacerse a un lado está planeado desde el principio. Cuando una consulta es delicada o el cliente pide hablar con alguien, el agente le pasa la conversación a tu equipo con todo lo que se habló, para que el cliente no tenga que repetir nada.

## Lo que le puedes encargar con tranquilidad

- Contestar las preguntas de siempre, a cualquier hora.
- Agendar y confirmar citas con tu calendario real.
- Tomar los datos básicos de un cliente potencial y registrarlos donde trabajas.
- Filtrar lo repetitivo para que tu equipo solo atienda lo que necesita una persona.

## Errores comunes al poner un agente de IA

- **Darle información desordenada.** Si los precios están en un PDF viejo y los horarios en otro lado, el agente va a dudar igual que dudaría una persona nueva. Antes de configurarlo conviene ordenar la información en un solo lugar.
- **No definir cuándo pasa a una persona.** Sin esa regla, el agente intenta resolver todo y frustra al cliente en las consultas delicadas.
- **Activarlo sin probar.** Siempre hay preguntas que nadie anticipó. Probarlo con casos reales antes de publicarlo evita sorpresas.
- **Olvidarse de actualizarlo.** Si cambian los precios o los horarios, el agente tiene que saberlo el mismo día.

## Preguntas que me hacen seguido

**¿El cliente sabe que está hablando con una IA?** Debería. Indicarlo con claridad genera confianza y es lo que piden cada vez más leyes. Además, la persona siempre puede pedir hablar con alguien del equipo.

**¿Qué pasa con las preguntas que no estaban previstas?** El agente reconoce que no tiene la respuesta y pasa la conversación a tu equipo. Con esas preguntas, después, se completa la información del agente.

**¿Sirve para cualquier negocio?** Sirve sobre todo en negocios que reciben muchas preguntas repetidas o que trabajan con citas. Si cada consulta es única y compleja, conviene empezar por otra automatización.


Un agente sirve de poco si los contactos que recoge se pierden después, así que conviene tener antes [un CRM donde caigan](/blog/crm-para-pymes-por-donde-empezar). Y si todavía no sabes por dónde arrancar, en [qué automatizar primero](/blog/que-automatizar-primero) está el criterio. Montar el agente completo es lo que hago en [agentes de IA](/servicios/agentes-ia).

Todo lo que configuro lo probamos juntos con casos reales antes de activarlo, y queda documentado. Así ves con tus propios ojos qué contesta y qué hace cuando no sabe algo. Si quieres, lo revisamos para tu caso en una llamada de 30 minutos.
