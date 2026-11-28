# Tu agente IA de WhatsApp, paso a paso

Recurso gratuito de soyluisflores.es · Reel 01 «Vende por WhatsApp mientras duermes». Responde en segundos a cualquier hora, sin inventar nada y pasándote lo importante.

## Antes de empezar

- [ ] Número exclusivo con WhatsApp Business API (no el personal)
- [ ] Lista de servicios, horarios, zona y condiciones
- [ ] Las 20 preguntas que más te hacen, con su respuesta
- [ ] Quién recibe las conversaciones que el agente deriva

## Pasos

### 1. Define el objetivo
Una frase: «Resolver dudas frecuentes y agendar citas». Todo lo demás se deriva a una persona.

### 2. Escribe la base de conocimiento
Un documento con tu información real. El agente solo responde con lo que hay ahí.

### 3. Redacta las instrucciones (system prompt)
Rol, tono, qué puede y qué no puede hacer, cuándo derivar.

### 4. Conecta las herramientas
Calendario para citas y CRM para guardar el contacto.

### 5. Prueba con casos difíciles
Preguntas de precio, quejas, temas legales o médicos, mensajes ambiguos.

### 6. Lanza y revisa
Revisa conversaciones a diario la primera semana y ajusta la base.

## Reglas que no se negocian

- [ ] Nunca inventa precios, horarios ni disponibilidad
- [ ] Avisa de que es una IA (art. 50 del Reglamento Europeo de IA, aplicable desde agosto de 2026)
- [ ] Deriva a una persona ante quejas, pagos o dudas delicadas
- [ ] No pide datos sensibles que no necesita

## Fragmento de instrucciones

> Eres el asistente virtual de [NEGOCIO]. Respondes en español, frases cortas.
> Solo usas la información de la BASE. Si no está, dices: «Lo consulto con el equipo y te escribimos».
> Nunca das precios que no estén en la BASE.
> Si el cliente quiere comprar, se queja o pide hablar con alguien: avisa a [RESPONSABLE] y dilo al cliente.
> Al inicio, indica que eres un asistente de IA.

## Hazlo hoy en 30 minutos

- [ ] Escribe en un documento tus 10 preguntas más frecuentes con su respuesta exacta.
- [ ] Anota horarios, servicios y qué NO haces, para que el agente pueda decir que no.
- [ ] Define cuándo te pasa la conversación: precio a medida, queja, pago o cualquier duda que no esté en tu documento.
- [ ] Pega el prompt de abajo en tu herramienta y pruébalo con 5 preguntas difíciles antes de conectarlo a WhatsApp.

## Prompt listo para copiar

> Eres el asistente virtual de [NOMBRE DEL NEGOCIO], en [CIUDAD]. Atiendes por WhatsApp a clientes que escriben fuera de horario.
> Reglas:
> 1. Preséntate siempre como asistente virtual.
> 2. Responde solo con la información de este documento: [PEGA TUS PREGUNTAS FRECUENTES, HORARIOS Y SERVICIOS].
> 3. Si te preguntan algo que no está aquí, un precio a medida o una queja, di: «Te paso con [NOMBRE], que te responde en horario hábil» y no inventes nada.
> 4. Si el cliente quiere agendar, ofrece solo los huecos libres de este calendario: [ENLACE O HORARIOS].
> 5. Frases cortas, tono cercano, sin emojis en exceso. Nunca pidas datos de tarjeta.
> Al final de cada conversación, resume en una línea qué quería el cliente y qué quedó pendiente.

## Ejemplo resuelto (ficticio)

Clínica de fisioterapia, 23:40. Cliente: «¿Tienen hueco mañana para una contractura?». Agente: «Hola, soy el asistente virtual de Fisio Centro. Mañana hay hueco a las 10:00 y a las 17:30. ¿Te agendo alguno?». El cliente elige las 17:30, el agente lo agenda y la recepcionista ve el resumen a las 9:00: «Contractura cervical · cita mañana 17:30 · primera visita».

## Cómo decidir si te conviene

- Sí: recibes mensajes fuera de horario, repites las mismas respuestas o pierdes citas por contestar tarde.
- Todavía no: si casi todas tus consultas son presupuestos a medida; empieza por ordenar esas preguntas en un CRM.
- Usa WhatsApp Business API a través de un proveedor oficial: la app normal de WhatsApp Business no permite este tipo de agentes.

## Errores que debes evitar

- Lanzar sin probar casos difíciles
- Dejar que el agente improvise precios
- No revisar conversaciones la primera semana

## Cómo saber si funcionó

- Tiempo de primera respuesta: debe bajar a segundos fuera de horario.
- Porcentaje de conversaciones que acaban en cita agendada o en derivación a ti.
- Revisa cada semana 10 conversaciones al azar: ¿alguna respuesta inventada? Corrige la información.

Los ejemplos de este recurso son ficticios y orientativos. Prueba cada herramienta con datos de prueba antes de usarla con clientes reales.
