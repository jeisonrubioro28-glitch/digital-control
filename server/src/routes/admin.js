import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { checkAdmin, requireAuth, signToken } from '../auth.js'
import { getDb, getMessages, getStatus, mutate, nextProductId, removeMessage, replaceAll } from '../store.js'

const router = Router()
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera unos minutos.' },
})
const VARIANTS = ['classic', 'smart', 'ac', 'slim', 'deco', 'voice']
const str = (v, max) => String(v ?? '').trim().slice(0, max)

router.post('/auth/login', loginLimiter, (req, res) => {
  if (!checkAdmin(str(req.body.username, 60), String(req.body.password ?? '').slice(0, 200)))
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' })
  res.json({ token: signToken(str(req.body.username, 60)) })
})

router.use('/admin', requireAuth)

router.get('/admin/status', (_req, res) => res.json(getStatus()))
router.get('/admin/catalog', (_req, res) => res.json(getDb()))

// ---------- productos ----------
function parseProduct(body, db) {
  const errors = []
  const name = str(body.name, 160)
  const price = Number(body.price)
  const img = str(body.img, 300)
  if (!name) errors.push('El nombre es obligatorio.')
  if (!Number.isInteger(price) || price < 0) errors.push('El precio debe ser un número entero (COP).')
  if (!db.brands.some((b) => b.id === body.brand)) errors.push('Marca no válida.')
  if (!db.categories.some((c) => c.name === body.category)) errors.push('Categoría no válida.')
  if (!VARIANTS.includes(body.variant)) errors.push('Tipo de dibujo no válido.')
  if (img && !/^(https?:\/\/|\/|img\/)/.test(img)) errors.push('La foto debe ser una dirección https://… o una ruta como img/archivo.jpg')
  return {
    errors,
    data: {
      brand: body.brand, name, category: body.category, price, ref: str(body.ref, 80), stock: !!body.stock,
      variant: body.variant, tag: str(body.tag, 40), img, bestseller: !!body.bestseller,
      description: str(body.description, 500), active: true,
    },
  }
}

router.post('/admin/products', async (req, res, next) => {
  try {
    const { errors, data } = parseProduct(req.body, getDb())
    if (errors.length) return res.status(400).json({ error: errors.join(' ') })
    const product = await mutate((db) => {
      const p = { id: nextProductId(), ...data }
      db.products.push(p)
      return p
    })
    res.status(201).json(product)
  } catch (e) { next(e) }
})

router.put('/admin/products/:id', async (req, res, next) => {
  try {
    const { errors, data } = parseProduct(req.body, getDb())
    if (errors.length) return res.status(400).json({ error: errors.join(' ') })
    const id = Number(req.params.id)
    const found = await mutate((db) => {
      const i = db.products.findIndex((p) => p.id === id)
      if (i < 0) return null
      db.products[i] = { id, ...data }
      return db.products[i]
    })
    if (!found) return res.status(404).json({ error: 'Producto no encontrado.' })
    res.json(found)
  } catch (e) { next(e) }
})

router.delete('/admin/products/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const ok = await mutate((db) => {
      const before = db.products.length
      db.products = db.products.filter((p) => p.id !== id)
      return db.products.length < before
    })
    if (!ok) return res.status(404).json({ error: 'Producto no encontrado.' })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

// ---------- marcas ----------
router.post('/admin/brands', async (req, res, next) => {
  try {
    const name = str(req.body.name, 60)
    const color = str(req.body.color, 9) || '#15171C'
    const id = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!name || !id) return res.status(400).json({ error: 'Escribe el nombre de la marca.' })
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return res.status(400).json({ error: 'El color debe ser como #E5382B.' })
    const created = await mutate((db) => {
      if (db.brands.some((b) => b.id === id)) return null
      const b = { id, name, color }
      db.brands.push(b)
      return b
    })
    if (!created) return res.status(409).json({ error: 'Esa marca ya existe.' })
    res.status(201).json(created)
  } catch (e) { next(e) }
})

router.delete('/admin/brands/:id', async (req, res, next) => {
  try {
    const result = await mutate((db) => {
      if (db.products.some((p) => p.brand === req.params.id)) return 'in-use'
      db.brands = db.brands.filter((b) => b.id !== req.params.id)
      return 'ok'
    })
    if (result === 'in-use') return res.status(409).json({ error: 'Esa marca tiene productos. Elimínalos o cámbialos primero.' })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

// ---------- mensajes y pedidos ----------
router.get('/admin/messages', (_req, res) => res.json(getMessages()))
router.delete('/admin/messages/:id', async (req, res, next) => {
  try { await removeMessage(req.params.id); res.json({ ok: true }) } catch (e) { next(e) }
})

// ---------- copia de seguridad ----------
router.get('/admin/export', (_req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="catalogo-digital-control.json"')
  res.json(getDb())
})
router.post('/admin/import', async (req, res, next) => {
  try {
    const { brands, categories, products } = req.body || {}
    if (!Array.isArray(brands) || !Array.isArray(categories) || !Array.isArray(products))
      return res.status(400).json({ error: 'El archivo no es una copia válida del catálogo.' })
    await replaceAll({ brands, categories, products })
    res.json({ ok: true, products: products.length })
  } catch (e) { next(e) }
})

export default router
