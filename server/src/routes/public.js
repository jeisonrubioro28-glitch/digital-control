import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { addMessage, getDb, publicCatalog } from '../store.js'
import { notify } from '../mail.js'

const router = Router()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 15, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.' },
})
const cop = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
const str = (v, max) => String(v ?? '').trim().slice(0, max)
const validPhone = (p) => /^[0-9+()\s-]{7,25}$/.test(p)

router.get('/catalog', (_req, res) => res.json(publicCatalog()))

// Contacto general y solicitudes de reparación
router.post('/contact', limiter, async (req, res, next) => {
  try {
    const type = req.body.type === 'reparacion' ? 'reparacion' : 'contacto'
    const name = str(req.body.name, 80)
    const phone = str(req.body.phone, 25)
    const message = str(req.body.message, 1000)
    const brand = str(req.body.brand, 60)
    const model = str(req.body.model, 80)
    if (name.length < 2) return res.status(400).json({ error: 'Escribe tu nombre.' })
    if (!validPhone(phone)) return res.status(400).json({ error: 'Escribe un celular válido.' })
    if (message.length < 3) return res.status(400).json({ error: 'Escribe tu mensaje.' })
    const msg = await addMessage({ type, name, phone, message, brand, model })
    notify(
      type === 'reparacion' ? `Solicitud de reparación de ${name}` : `Mensaje de ${name}`,
      `Nombre: ${name}\nCelular: ${phone}\n${brand ? `Marca: ${brand}\n` : ''}${model ? `Modelo: ${model}\n` : ''}\n${message}`
    )
    res.status(201).json({ ok: true, id: msg.id })
  } catch (e) { next(e) }
})

// Pedidos del carrito (el total se calcula en el servidor con los precios reales)
router.post('/orders', limiter, async (req, res, next) => {
  try {
    const name = str(req.body.name, 80)
    const phone = str(req.body.phone, 25)
    const items = Array.isArray(req.body.items) ? req.body.items.slice(0, 50) : []
    if (name.length < 2) return res.status(400).json({ error: 'Escribe tu nombre.' })
    if (!validPhone(phone)) return res.status(400).json({ error: 'Escribe un celular válido.' })
    const { products, brands } = getDb()
    const brandName = Object.fromEntries(brands.map((b) => [b.id, b.name]))
    const lines = []
    let total = 0
    for (const it of items) {
      const p = products.find((x) => x.id === Number(it.id) && x.active !== false)
      const qty = Math.min(Math.max(parseInt(it.qty, 10) || 0, 1), 99)
      if (!p) continue
      total += p.price * qty
      lines.push(`${qty} x ${brandName[p.brand] || ''} ${p.name}${p.ref ? ` (${p.ref})` : ''} — ${cop(p.price * qty)}`)
    }
    if (!lines.length) return res.status(400).json({ error: 'El pedido está vacío.' })
    const message = `${lines.join('\n')}\nTOTAL: ${cop(total)}`
    const msg = await addMessage({ type: 'pedido', name, phone, message })
    notify(`Nuevo pedido de ${name}`, `Nombre: ${name}\nCelular: ${phone}\n\n${message}`)
    res.status(201).json({ ok: true, id: msg.id, total })
  } catch (e) { next(e) }
})

export default router
