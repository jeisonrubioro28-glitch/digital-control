# Digital Control — venta y reparación de controles remotos

**React + Bootstrap** (página) · **Node.js + Express** (servidor) · **sin MySQL** (los datos viven en un archivo JSON).
Contacto con clientes por **WhatsApp**. Incluye carrito de pedidos, panel de administración y envío de pedidos a tu correo.

```
digital-control/
├─ client/                 → la página (React + Vite + Bootstrap)
│  └─ src/config.js        ← AQUÍ editas WhatsApp, teléfonos, sedes, redes y textos
├─ server/                 → el servidor (Node.js + Express)
│  └─ .env.example         ← variables de entorno (se copia a .env)
├─ shared/catalog.seed.json ← catálogo: marcas, controles y precios (también editable desde el panel)
├─ client/src/assets/productos/ ← aquí van las fotos reales (ver sección 7)
├─ render.yaml             → plantilla para publicar en Render (gratis)
└─ package.json            → comandos para correr todo
```

## 1) Qué trae
- Barra superior con teléfonos y varias líneas de WhatsApp, menú con categorías, carrito.
- Hero con control remoto interactivo, **más vendidos**, catálogo con buscador, filtros por marca y tipo, 6 formas de ordenar, **vista rápida** de cada producto.
- **29 marcas** (LG, Samsung, Sony, Panasonic, Challenger, Hyundai, Kalley, Kaizen, Olimpo, Exclusive, Vinci, TCL, Hisense, Philips, AOC, Toshiba, Sharp, Aiwa, JVC, Daewoo, Noblex, RCA, Xiaomi, Roku, Claro, DirecTV, Movistar, Tigo y Universal).
- Servicio técnico con formulario de reparación, ¿Por qué elegirnos?, Quiénes somos, ¿Cómo comprar? (pasos, pagos, garantía, entrega), preguntas frecuentes.
- 4 sedes (2 sucursales + 2 puntos de venta) con **mapa** y "Cómo llegar", Contáctenos y Síguenos (Facebook, Instagram, TikTok, WhatsApp), botón flotante de WhatsApp con varias líneas.
- Panel de administración en `/#/admin`: productos, marcas, mensajes y pedidos, copia de seguridad.

## 2) Primera vez en tu computador (VS Code)
Necesitas **Node.js 18 o superior**. Abre la carpeta en VS Code y, en la terminal:

```bash
npm run install:all
cp server/.env.example server/.env        # en Windows: copy server\.env.example server\.env
```
Abre `server/.env` y cambia como mínimo `ADMIN_USER`, `ADMIN_PASSWORD` y `JWT_SECRET`. Luego:

```bash
npm run dev
```
Abre **http://localhost:5173** (la página) y **http://localhost:5173/#/admin** (el panel).

## 3) Qué editar primero
| Qué | Dónde |
|---|---|
| WhatsApp (3 líneas), teléfonos, correo, horario, 4 sedes, redes | `client/src/config.js` |
| Textos de "¿Cómo comprar?", garantía, entrega, preguntas frecuentes | `client/src/config.js` |
| Productos, precios, marcas | Panel `/#/admin` (o `shared/catalog.seed.json`) |
| Texto de "Quiénes somos" | `client/src/components/About.jsx` |
| Colores y tipografías | `client/src/styles.css` (variables en `:root`) |

El número de WhatsApp va con código de país y sin `+` ni espacios: `573001234567`.
**Fotos reales:** guárdalas en `client/public/img/` y en el panel escribe `img/nombre.jpg` en el campo Foto.

## 4) Publicarla GRATIS y que siempre esté activa

Como la página tiene servidor (Node), usamos **Render** (plan gratuito, sin tarjeta). Pasos:

**A. Subir el proyecto a GitHub**
1. Crea una cuenta en https://github.com y un repositorio nuevo llamado `digital-control` (**Privado** está bien).
2. En la terminal de VS Code, dentro de la carpeta del proyecto:
```bash
git init
git add .
git commit -m "Digital Control"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/digital-control.git
git push -u origin main
```
(El archivo `.env` NO se sube: ya está en `.gitignore`.)

**B. Crear el servicio en Render**
1. Entra a https://render.com, crea cuenta con tu GitHub.
2. *New → Blueprint* (o *Web Service*), elige tu repositorio. Render lee `render.yaml`.
   Si prefieres hacerlo a mano: *Build Command* = `npm run render-build`, *Start Command* = `npm start`, plan **Free**.
3. Te pedirá variables de entorno. Llena como mínimo:
   - `ADMIN_USER` y `ADMIN_PASSWORD` (los de tu panel, clave larga)
   - `JWT_SECRET` (si no se generó solo: un texto largo cualquiera de 32+ letras)
4. Cuando termine, tu página queda en `https://digital-control-XXXX.onrender.com` (gratis, con HTTPS).

**C. Que no se "duerma"** — en el plan gratis, Render apaga el servicio tras 15 minutos sin visitas y la primera visita siguiente tarda ~30-60 s en despertar. Para evitarlo usa un monitor gratuito (por ejemplo UptimeRobot o cron-job.org) que visite `https://TU-SITIO.onrender.com/api/health` cada 10 minutos. Revisa en tu panel de Render que las horas gratuitas del mes alcancen para tenerlo encendido todo el mes.

**D. Que los cambios del panel NO se pierdan** (muy importante en hosting gratis)
El disco de Render gratis se borra cada vez que el servicio se reinicia. Para que lo que edites en el panel sea permanente, el servidor puede guardarlo en tu repositorio de GitHub:
1. GitHub → tu foto → *Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token*.
2. *Repository access*: **Only select repositories** → `digital-control`. *Permissions → Contents*: **Read and write**. Genera y copia el token.
3. En Render → tu servicio → *Environment*, agrega:
   - `GITHUB_TOKEN` = el token
   - `GITHUB_REPO` = `TU-USUARIO/digital-control`
4. Listo: cada cambio en el panel se guarda como un commit (unos segundos después) y Render se actualiza solo. En el panel verás "Guardado permanente activo".
Además, en la pestaña **Copia de seguridad** del panel puedes descargar tu catálogo cuando quieras.

**E. Recibir los pedidos en tu correo** (opcional pero recomendado)
Los pedidos y mensajes también se guardan en el panel, pero esa lista se borra al reiniciar el servidor gratis; por eso conviene que lleguen a tu correo:
1. En tu cuenta de Google activa la *verificación en 2 pasos* y crea una **contraseña de aplicación**.
2. En Render agrega `SMTP_HOST=smtp.gmail.com`, `SMTP_USER=tucorreo@gmail.com`, `SMTP_PASS=` (la contraseña de aplicación) y `MAIL_TO=tucorreo@gmail.com`.

**Plan B (sin servidor):** `npm run build` genera `client/dist`. Esa carpeta se puede subir gratis a Cloudflare Pages, Netlify o GitHub Pages. La página funciona igual (catálogo, carrito, WhatsApp), pero sin panel de administración ni correos; el catálogo se edita en `shared/catalog.seed.json` y se vuelve a compilar.

**Más adelante:** si quieres un nombre propio (`digitalcontrol.com.co`) lo compras y lo conectas desde Render (*Settings → Custom Domains*). Mientras tanto la dirección gratuita funciona perfecto.

## 5) Seguridad (ya incluida)
Sesión del administrador con JWT de 8 horas, comparación de claves en tiempo constante, límite de intentos en login y formularios, validación de todos los datos, cabeceras de seguridad (Helmet) y sin SQL (no hay inyección SQL posible). Pendiente para ti: una contraseña de administrador larga y no compartir tu `.env` ni tu token de GitHub.

## 6) Ideas para seguir mejorando (proyecto de grado)
- Subida de fotos desde el panel (con almacenamiento tipo Cloudinary, que tiene plan gratis).
- Pasarela de pagos (Wompi / MercadoPago) o WhatsApp Business Cloud API.
- Estadísticas de búsquedas y productos más pedidos.
- Pruebas automáticas (Vitest + Supertest) y despliegue continuo.

## 7) Fotos reales de los controles
La página detecta las fotos **solas**: guárdalas en `client/src/assets/productos/` con estos nombres (jpg, png o webp):

| Archivo | Para qué sirve |
|---|---|
| `marca-lg.jpg`, `marca-samsung.jpg`, `marca-sony.jpg`… | Una foto por marca: se usa en todos los controles de esa marca que no tengan foto propia |
| `1.jpg`, `2.jpg`, `15.jpg`… | Foto de un producto específico (el número es su ID, se ve en el panel y con `npm run fotos`) |

- `npm run fotos` te muestra qué fotos ya tienes y cuáles faltan (y guarda `LISTA-DE-FOTOS.txt`).
- Mientras un control no tenga foto, se muestra un dibujo del control con los colores de su marca.
- Usa fotos **tuyas** (el negocio vende los controles: toma cada uno con fondo blanco y buena luz) o fotos que te dé tu distribuidor con permiso. No copies imágenes de otras páginas: tienen derechos de autor y pueden desaparecer.
- Tamaño recomendado: ~800 px de alto y menos de 150 KB cada una.
- Después de agregar fotos, si ya publicaste la página, vuelve a subir los cambios a GitHub y Render la actualiza sola.

## 8) La dirección de la página (por qué sale "localhost")
`localhost` es la dirección de **tu propio computador** mientras programas: solo tú la ves. Al publicarla en Render tendrá una dirección pública con HTTPS, por ejemplo `https://digitalcontrol.onrender.com` (el nombre sale de `name:` en `render.yaml`; si ya está ocupado, Render le agrega letras).
Un nombre propio como `www.digitalcontrol.com` requiere comprar el dominio (es un pago anual pequeño, cotízalo en un registrador). Cuando lo tengas: Render → tu servicio → *Settings → Custom Domains*, y Render te dice qué registros DNS crear. Sin dominio propio, la dirección gratuita funciona igual.
