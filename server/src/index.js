import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import publicRoutes from './routes/public.js'
import adminRoutes from './routes/admin.js'
import { init } from './store.js'

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Falta JWT_SECRET en las variables de entorno (mínimo 32 caracteres).')
  process.exit(1)
}
if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 8) {
  console.error('Define ADMIN_USER y ADMIN_PASSWORD (mínimo 8 caracteres).')
  process.exit(1)
}

await init()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.set('trust proxy', 1)

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // JSON-LD y script de inicio
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      frameSrc: ["'self'", 'https://www.google.com'], // mapas de las sedes
      connectSrc: ["'self'"],
    },
  },
}))
if (process.env.CORS_ORIGIN) app.use(cors({ origin: process.env.CORS_ORIGIN.split(',') }))
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', publicRoutes)
app.use('/api', adminRoutes)
app.use('/api', (_req, res) => res.status(404).json({ error: 'No encontrado' }))

// En producción Express también sirve la página compilada (client/dist).
const dist = path.resolve(__dirname, '../../client/dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => console.log(`Digital Control listo en http://localhost:${port}`))
