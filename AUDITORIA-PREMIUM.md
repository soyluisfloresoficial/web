# Auditoría completa y plan premium

Fecha: 20/10/2026. Rama `reconstruccion-oct-2026`. Revisado en 1440 px y 375 px, sección a sección, y con `tools/auditar-dist.mjs` sobre las 22 páginas generadas.

## 1. Auditoría automática (`node tools/auditar-dist.mjs`)

| Comprobación | Resultado |
|---|---|
| Un único H1 por página y sin saltos de nivel | ✅ 22/22 |
| Imágenes sin `alt` | ✅ 0 |
| IDs duplicados | ✅ 0 |
| Anclas que apuntan a IDs inexistentes | ✅ 0 |
| `title`, meta description (70–160 caracteres) y canonical | ✅ 22/22 |
| NIF o calle fuera de /aviso-legal | ✅ 0 |
| Enlaces internos rotos | ❌ **4, corregidos** |

**El fallo:** en el aviso legal, la política de privacidad y la de cookies, el correo de contacto aparecía como «[email protected]» y enlazaba a `/cdn-cgi/l/email-protection`. Era un resto de la ofuscación de Cloudflare que se copió con el texto de producción. Fuera de Cloudflare, ese enlace no lleva a ninguna parte, y el aviso legal se quedaba sin un correo legible, que es uno de los datos que exige la LSSI. He descodificado las cuatro direcciones (todas eran `hola@soyluisflores.es`) y las he puesto en claro. **No he cambiado ni una palabra del texto legal**; aun así, que lo revise un abogado.

## 2. Revisión visual, sección a sección

| Sección | Qué falla | Qué le falta para ser premium |
|---|---|---|
| **Hero** | Correcto pero genérico: titular, párrafo y un botón, como cualquier plantilla. No tiene segundo botón ni nada que dé confianza junto al botón | Más aire y más tamaño en el titular. Un botón secundario («Ver servicios»). Una línea de garantías justo debajo del botón, con datos que ya están en la web. La foto con marco, luz y una etiqueta con nombre y oficio. Fondo con una retícula fina y luz quieta, sin animaciones continuas |
| **Problema** | Tres tarjetas solo de texto; no se leen de un vistazo | Número de índice por tarjeta (01, 02, 03) y un filete de acento |
| **Público** | El H2 va pegado a la lista; en móvil no hay ningún espacio entre los dos. Los títulos se parten en dos líneas desiguales | Separación correcta y cada perfil en una columna con filete superior |
| **Herramientas** | La marquesina se corta en seco en los bordes | Degradado de entrada y salida en los dos lados |
| **Servicios** | «Más información» queda a alturas distintas en cada tarjeta. Las fotos tienen tonos muy distintos entre sí | Enlace pegado abajo, tratamiento de imagen común (velo inferior y saturación unificada), número de servicio y cabecera en dos columnas |
| **Por dentro** | Bien resuelta | Afinar espacios |
| **Métricas** | Cifras pequeñas para lo que son; el H2 se parte en dos líneas por la rejilla | Cifras mucho más grandes, filetes en lugar de cajas y nota de cómo se midió |
| **Calculadora** | Correcta | Retícula de fondo como en el hero, para dar profundidad |
| **Estándares** | Seis bloques de texto iguales; cuesta leerlos | Número e icono de acento, y texto con más contraste de jerarquía |
| **Método** | Las tres fotos de banco de imágenes pesan más que el contenido | Mismo tratamiento de imagen y una línea que une los pasos |
| **Sobre mí** | Párrafo largo sin puntos de apoyo | Datos sueltos (Manresa, unos tres años con IA, primero en mi negocio), sacados del texto que ya existe, y la frase del lema como cita |
| **Blog** | Las tarjetas no indican que se pueden pulsar | Flecha y «Leer» al pie |
| **FAQ** | Una sola columna de 1.400 px de alto | Dos columnas: título fijo a la izquierda y preguntas a la derecha |
| **Cierre** | La caja es **más ancha que el resto** de las secciones (la clase `card` está en el contenedor) | Mismo ancho que lo demás, más presencia y el correo como segunda vía |
| **Pie** | Correcto pero apretado | Más aire y la línea inferior en una sola fila |

### En todo el sitio

- **Ritmo vertical irregular**: hay secciones de 270 px seguidas de otras de 1.400 px, todas con el mismo margen. Hace falta una sola escala de espaciado y bandas de fondo alternas para separar los bloques.
- **Las tarjetas son planas**: no tienen brillo en el borde superior y el texto tiene poco margen interior.
- **El tratamiento de las fotos no es uniforme.**
- **Micro movimiento que falta:** respuesta al pulsar los botones, filete animado en los antetítulos, entrada de la foto del hero y realce de las tarjetas al pasar el ratón.

## 3. Criterio para «premium»

Premium no es añadir cosas, es **quitar ruido y cuidar los detalles**: espaciado generoso y constante, tipografía grande con jerarquía clara, un solo tratamiento de imagen, bordes y luces sutiles, y movimiento corto y con intención. Nada de lujo fingido: ni testimonios, ni logos de clientes, ni cifras que no existan, ni urgencia artificial. Todo lo que se añade sale del contenido que ya está en la web.

## 4. Pendiente que no se resuelve con código

- **[COMPLETAR]** Dos o tres testimonios reales con nombre y un caso con fecha y método. Es la mayor palanca de conversión que queda.
- **[COMPLETAR]** Fotos propias de proyectos para sustituir las de banco de imágenes en Servicios y Método.
- **[COMPLETAR]** Respaldo de las cifras 73 %, 12 h y 40 %.

## 5. Estado tras los cambios

Aplicado y verificado en 1440 px y 375 px. Auditoría automática: **0 problemas en 22 páginas**. Sin desbordamiento horizontal en móvil.

| Sección | Cambio |
|---|---|
| Hero | Retícula y dos luces quietas de fondo; titular, entradilla, botón principal y «Ver servicios»; tres garantías con marca de verificación; foto con halo, borde y etiqueta «Luis Carlos Flores · Implementador de IA · Manresa»; entrada encadenada |
| Problema | Cabecera en dos columnas y tarjetas numeradas |
| Público | Cuatro columnas con filete superior e índice |
| Herramientas | Cabecera en una línea y realce al pasar el ratón |
| Servicios | Cabecera con entradilla, número por servicio en su color, tratamiento de imagen común y enlace al pie |
| Métricas | Cifras grandes separadas por filetes, sin cajas |
| Calculadora | Retícula de fondo |
| Estándares | Lista editorial en tres columnas con índice |
| Método | Tratamiento de imagen común |
| Sobre mí | Retrato con halo; datos en tabla (base, años con IA, lo que propongo) y el lema como cita |
| Blog | Tarjeta entera pulsable con «Leer el artículo» |
| FAQ | Dos columnas, con la izquierda fija al hacer scroll |
| Cierre | Mismo ancho que el resto, con retícula y luces, y el correo como segunda vía |
| Interiores | Las cajas de cierre ya no son más anchas que la página; enlaces de tarjeta alineados al pie |
