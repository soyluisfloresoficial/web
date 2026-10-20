# Guía para conectar la web a GitHub en Cloudflare

> **21/10/2026:** Cloudflare creó un **Worker** llamado `web`, no un proyecto de Pages. Funciona igual y se actualiza solo. Las partes 1 y 2 ya están hechas. Para las partes 3 y 4, mira la nota de arriba de `DESPLIEGUE.md`, que tiene los nombres exactos de los botones del Worker.

Tiempo: unos 20 minutos. Necesitas poder entrar en tu cuenta de **Cloudflare** y en tu cuenta de **GitHub**.

Cuando termines, cada cambio que se suba a GitHub aparecerá solo en soyluisflores.es en uno o dos minutos.

> Los nombres de los botones pueden salir en inglés o en español, según cómo tengas Cloudflare. Pongo los dos. Si algo no coincide con lo que ves, haz una captura de pantalla y pásamela.

---

## Parte 1. Crear el proyecto nuevo

1. Abre **https://dash.cloudflare.com** e inicia sesión.
2. En el menú de la **izquierda**, toca **Workers & Pages**. Puede estar dentro de **Compute (Workers)**. Si no lo encuentras, toca la **lupa** de arriba, escribe `Pages` y entra.
3. Arriba a la derecha, toca el botón azul **Create** (o **Crear**, o **Create application**).
4. Verás dos pestañas: **Workers** y **Pages**. Toca **Pages**. Que no sea Workers.
5. Toca **Connect to Git** (o **Conectar a Git**, o **Import an existing Git repository** → **Get started**).
6. Elige **GitHub**. Se abre una ventana de GitHub:
   - Si te pide entrar, entra con tu cuenta de GitHub.
   - Elige la cuenta **soyluisfloresoficial**.
   - Marca **Only select repositories** (Solo los repositorios que elija) y elige **web**.
   - Toca **Install & Authorize** (Instalar y autorizar). Si te pide la contraseña o un código, ponlo tú.
7. Vuelves a Cloudflare. En la lista, toca **web** y luego **Begin setup** (Comenzar configuración).
8. Rellena el formulario así:

   | Lo que pone | Lo que tienes que poner |
   |---|---|
   | **Project name** | `soyluisflores-web` |
   | **Production branch** | `main` |
   | **Framework preset** | Abre el desplegable y elige **Astro** |
   | **Build command** | Se rellena solo: `npm run build` (compruébalo) |
   | **Build output directory** | Se rellena solo: `dist` (compruébalo) |
   | **Root directory** | Déjalo **vacío** |

9. Más abajo, abre **Environment variables (advanced)** (Variables de entorno) y toca **+ Add variable**:
   - **Variable name:** `PUBLIC_GTM_ID`
   - **Value:** `GTM-NHS23ZRB`
10. Toca **Save and Deploy** (Guardar e implementar).
11. Espera entre 1 y 3 minutos. Tiene que salir **Success** con un tick verde. Si sale algo en rojo, copia el texto rojo y pásamelo.

## Parte 2. Revisar la web nueva antes de publicarla

1. Toca **Continue to project** (Ir al proyecto).
2. Arriba verás un enlace parecido a **`https://soyluisflores-web.pages.dev`**. Ábrelo.
3. Revisa:
   - La home se ve con el diseño nuevo.
   - Sale el aviso de cookies.
   - En el pie **no** está tu NIE.
   - En **Aviso legal**, el domicilio dice solo «Manresa, Barcelona, España».
   - Desde el móvil: abre el mismo enlace, toca el menú (las dos rayas) y navega.

Si algo no te gusta, para aquí y dímelo. La web de verdad todavía no ha cambiado.

## Parte 3. Apagar la pasarela de Google (para que GTM no se cargue dos veces)

1. Toca el **logo de Cloudflare** (arriba a la izquierda) para volver al inicio.
2. Toca tu dominio **soyluisflores.es**.
3. Toca la **lupa** de arriba y escribe `Google tag gateway`. Entra en lo que aparezca.
4. Si ves **GTM-NHS23ZRB** activado, **desactívalo** (interruptor en **Off**, o **Disable** / **Desactivar**) y guarda.

Si no encuentras esta opción, haz una captura de pantalla y pásamela **antes de seguir con la parte 4**.

## Parte 4. Pasar el dominio al proyecto nuevo

Haz los dos pasos seguidos: entre uno y otro, la web puede no verse durante unos minutos.

**A. Quitar el dominio del proyecto antiguo**

1. Vuelve a **Workers & Pages**.
2. Entra en el proyecto **antiguo**: el que **no** se llama `soyluisflores-web`.
3. Toca la pestaña **Custom domains** (Dominios personalizados).
4. Al lado de `soyluisflores.es`, toca los **tres puntos ⋯** → **Remove domain** (Eliminar) → confirma.
5. Si también está `www.soyluisflores.es`, haz lo mismo.
6. **No borres el proyecto antiguo**: sirve para volver atrás.

**B. Ponerlo en el proyecto nuevo**

1. Vuelve a **Workers & Pages** y entra en **soyluisflores-web**.
2. Pestaña **Custom domains** → **Set up a custom domain** (Configurar un dominio personalizado).
3. Escribe `soyluisflores.es` → **Continue** → **Activate domain** (Activar dominio).
4. Espera a que ponga **Active** (unos minutos).
5. Repite con `www.soyluisflores.es`.

**C. Comprobarlo**

1. Abre una ventana de incógnito: **Ctrl + Mayús + N** en Chrome.
2. Ve a **soyluisflores.es**. Tienes que ver el diseño nuevo, el aviso de cookies y ningún NIE en el pie.

## Parte 5. Cómo saber que se actualiza sola

En el proyecto **soyluisflores-web** → pestaña **Deployments**. Cada vez que se suba un cambio a GitHub aparece una línea nueva:

- **Verde (Success):** ya está publicado.
- **Rojo (Failed):** no se ha publicado; la web sigue como estaba. Pásame el error.

## Si algo sale mal: volver atrás

- **Volver a una versión anterior de la web nueva:** **Deployments** → en la versión buena, los **tres puntos ⋯** → **Rollback to this deployment**.
- **Volver a la web antigua del todo:** quita el dominio del proyecto nuevo (Custom domains → ⋯ → Remove) y vuelve a añadirlo en el proyecto antiguo.
