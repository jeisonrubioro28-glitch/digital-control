import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

const digest = (s) => crypto.createHash('sha256').update(String(s)).digest()

export function checkAdmin(username, password) {
  const u = process.env.ADMIN_USER
  const p = process.env.ADMIN_PASSWORD
  if (!u || !p) return false
  // comparación en tiempo constante
  const okUser = crypto.timingSafeEqual(digest(username), digest(u))
  const okPass = crypto.timingSafeEqual(digest(password), digest(p))
  return okUser && okPass
}

export const signToken = (username) => jwt.sign({ u: username }, process.env.JWT_SECRET, { expiresIn: '8h' })

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || ''
  try {
    req.admin = jwt.verify(h.startsWith('Bearer ') ? h.slice(7) : '', process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'No autorizado' })
  }
}
