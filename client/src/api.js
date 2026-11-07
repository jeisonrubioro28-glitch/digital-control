// Dirección del backend. Vacío = el mismo sitio (lo normal). Si publicas la página
// en otro hosting, define VITE_API_URL=https://tu-api.onrender.com al compilar.
export const API = import.meta.env.VITE_API_URL || ''

export async function api(path, { method = 'GET', body, token, timeout = 15000 } = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeout)
  try {
    const r = await fetch(`${API}/api${path}`, {
      method,
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok) {
      const err = new Error(data.error || 'Ocurrió un error. Intenta de nuevo.')
      err.status = r.status
      throw err
    }
    return data
  } finally {
    clearTimeout(timer)
  }
}
