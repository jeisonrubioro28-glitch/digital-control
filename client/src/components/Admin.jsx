import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import { useCatalog } from '../context/CatalogContext'
import { money } from '../utils/helpers'

const EMPTY = { brand: '', name: '', category: 'Smart TV', price: '', ref: '', variant: 'classic', tag: '', img: '', description: '', stock: true, bestseller: false }
const when = (iso) => new Date(iso).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
const TYPES = { pedido: 'Pedido', reparacion: 'Reparación', contacto: 'Contacto' }

// Panel de administración: /#/admin
export default function Admin() {
  const { refresh, source } = useCatalog()
  const [token, setToken] = useState(sessionStorage.getItem('dc_token') || '')
  const [login, setLogin] = useState({ username: '', password: '' })
  const [tab, setTab] = useState('products')
  const [data, setData] = useState({ brands: [], categories: [], products: [] })
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [brandForm, setBrandForm] = useState({ name: '', color: '#8B93A1' })
  const [note, setNote] = useState({ kind: 'info', text: '' })
  const [busy, setBusy] = useState(false)

  const say = (text, kind = 'info') => setNote({ kind, text })
  const logout = useCallback(() => { sessionStorage.removeItem('dc_token'); setToken('') }, [])

  const call = useCallback(async (path, opts = {}) => {
    try {
      return await api(path, { ...opts, token, timeout: 70000 })
    } catch (e) {
      if (e.status === 401 && token) { logout(); throw new Error('Tu sesión expiró. Ingresa de nuevo.') }
      throw e
    }
  }, [token, logout])

  const load = useCallback(async () => {
    try {
      const [c, m, s] = await Promise.all([call('/admin/catalog'), call('/admin/messages'), call('/admin/status')])
      setData(c); setMessages(m); setStatus(s)
    } catch (e) { say(e.message, 'danger') }
  }, [call])

  useEffect(() => { if (token) load() }, [token, load])

  const doLogin = async (e) => {
    e.preventDefault()
    setBusy(true); say('Conectando con el servidor… (si estaba dormido puede tardar hasta un minuto)')
    try {
      const r = await api('/auth/login', { method: 'POST', body: login, timeout: 70000 })
      sessionStorage.setItem('dc_token', r.token); setToken(r.token); say('')
    } catch (err) { say(err.message, 'danger') } finally { setBusy(false) }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const saveProduct = async (e) => {
    e.preventDefault()
    try {
      const body = { ...form, price: Number(form.price) }
      if (editing) await call(`/admin/products/${editing}`, { method: 'PUT', body })
      else await call('/admin/products', { method: 'POST', body })
      setForm(EMPTY); setEditing(null); await load(); refresh(); say('Producto guardado.', 'success')
    } catch (err) { say(err.message, 'danger') }
  }
  const editProduct = (p) => {
    setEditing(p.id)
    setForm({ ...EMPTY, ...p, price: p.price })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const delProduct = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.name}"?`)) return
    try { await call(`/admin/products/${p.id}`, { method: 'DELETE' }); await load(); refresh(); say('Producto eliminado.', 'success') } catch (err) { say(err.message, 'danger') }
  }

  const addBrand = async (e) => {
    e.preventDefault()
    try { await call('/admin/brands', { method: 'POST', body: brandForm }); setBrandForm({ name: '', color: '#8B93A1' }); await load(); refresh(); say('Marca agregada.', 'success') } catch (err) { say(err.message, 'danger') }
  }
  const delBrand = async (b) => {
    if (!window.confirm(`¿Eliminar la marca ${b.name}?`)) return
    try { await call(`/admin/brands/${b.id}`, { method: 'DELETE' }); await load(); refresh() } catch (err) { say(err.message, 'danger') }
  }
  const delMessage = async (m) => {
    try { await call(`/admin/messages/${m.id}`, { method: 'DELETE' }); setMessages((cur) => cur.filter((x) => x.id !== m.id)) } catch (err) { say(err.message, 'danger') }
  }

  const exportJson = async () => {
    try {
      const c = await call('/admin/catalog')
      const url = URL.createObjectURL(new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' }))
      const a = document.createElement('a'); a.href = url; a.download = 'catalogo-digital-control.json'; a.click(); URL.revokeObjectURL(url)
    } catch (err) { say(err.message, 'danger') }
  }
  const importJson = async (e) => {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !window.confirm('Esto reemplaza TODO el catálogo actual por el del archivo. ¿Continuar?')) return
    try {
      const body = JSON.parse(await file.text())
      await call('/admin/import', { method: 'POST', body }); await load(); refresh(); say('Catálogo restaurado.', 'success')
    } catch (err) { say(err.message || 'El archivo no es válido.', 'danger') }
  }

  const brandName = (id) => data.brands.find((b) => b.id === id)?.name || id

  return (
    <div className="admin container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Administración · Digital Control</h1>
        <div className="d-flex gap-2">
          <a className="btn btn-outline-dark btn-sm" href="#inicio">Volver al sitio</a>
          {token && <button className="btn btn-dark btn-sm" onClick={logout}>Salir</button>}
        </div>
      </div>

      {source === 'local' && !token && (
        <div className="alert alert-warning">No hay conexión con el servidor. Si lo estás probando solo con la página (sin backend), el panel no funciona.</div>
      )}
      {note.text && <div className={`alert alert-${note.kind}`}>{note.text}</div>}

      {!token ? (
        <form className="panel mx-auto" style={{ maxWidth: 380 }} onSubmit={doLogin}>
          <h2 className="h5 mb-3">Ingresar</h2>
          <input className="form-control mb-3" placeholder="Usuario" autoComplete="username" required value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} />
          <input className="form-control mb-3" type="password" placeholder="Contraseña" autoComplete="current-password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
          <button className="btn btn-ink w-100" type="submit" disabled={busy}>{busy ? 'Conectando…' : 'Entrar'}</button>
        </form>
      ) : (
        <>
          {status && (
            <div className={`alert ${status.persist === 'github' ? 'alert-success' : 'alert-warning'} small`}>
              {status.persist === 'github'
                ? <>Guardado permanente <strong>activo</strong>: tus cambios se envían a GitHub y no se pierden. {status.github?.lastError && <em>Último error: {status.github.lastError}</em>}</>
                : <>Guardado permanente <strong>no configurado</strong>: en un hosting gratuito los cambios se pierden cuando el servidor se reinicia. Configura GITHUB_TOKEN (ver README) o usa la pestaña “Copia de seguridad”.</>}
            </div>
          )}

          <ul className="nav nav-pills mb-3">
            {[['products', 'Productos'], ['brands', 'Marcas'], ['messages', `Mensajes y pedidos (${messages.length})`], ['backup', 'Copia de seguridad']].map(([id, label]) => (
              <li className="nav-item" key={id}><button className={`nav-link ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button></li>
            ))}
          </ul>

          {tab === 'products' && (
            <>
              <form className="panel mb-4" onSubmit={saveProduct}>
                <h2 className="h5 mb-3">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
                <div className="row g-2">
                  <div className="col-md-3">
                    <select className="form-select" required value={form.brand} onChange={set('brand')} aria-label="Marca">
                      <option value="">Marca…</option>
                      {data.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-5"><input className="form-control" placeholder="Nombre (ej: Control Smart TV)" required value={form.name} onChange={set('name')} /></div>
                  <div className="col-md-4">
                    <select className="form-select" value={form.category} onChange={set('category')} aria-label="Tipo">
                      {data.categories.map((c) => <option key={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3"><input className="form-control" type="number" min="0" step="1" placeholder="Precio (COP)" required value={form.price} onChange={set('price')} /></div>
                  <div className="col-md-3"><input className="form-control" placeholder="Referencia (opcional)" value={form.ref} onChange={set('ref')} /></div>
                  <div className="col-md-3">
                    <select className="form-select" value={form.variant} onChange={set('variant')} aria-label="Dibujo">
                      <option value="classic">Dibujo: clásico</option><option value="smart">Dibujo: smart</option><option value="slim">Dibujo: delgado plateado</option><option value="voice">Dibujo: con voz</option><option value="deco">Dibujo: decodificador</option><option value="ac">Dibujo: aire</option>
                    </select>
                  </div>
                  <div className="col-md-3"><input className="form-control" placeholder="Etiqueta (ej: Nuevo)" value={form.tag} onChange={set('tag')} /></div>
                  <div className="col-12"><input className="form-control" placeholder="Foto (opcional): img/lg-magic.jpg o https://…" value={form.img} onChange={set('img')} /></div>
                  <div className="col-12"><textarea className="form-control" rows="2" placeholder="Descripción (se ve en la vista rápida)" value={form.description} onChange={set('description')} /></div>
                  <div className="col-12 d-flex flex-wrap gap-4">
                    <div className="form-check"><input id="stk" className="form-check-input" type="checkbox" checked={form.stock} onChange={set('stock')} /><label htmlFor="stk" className="form-check-label">Disponible</label></div>
                    <div className="form-check"><input id="bs" className="form-check-input" type="checkbox" checked={form.bestseller} onChange={set('bestseller')} /><label htmlFor="bs" className="form-check-label">Mostrar en “Los más vendidos”</label></div>
                  </div>
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-ink" type="submit">{editing ? 'Guardar cambios' : 'Agregar producto'}</button>
                  {editing && <button type="button" className="btn btn-outline-dark" onClick={() => { setEditing(null); setForm(EMPTY) }}>Cancelar</button>}
                </div>
              </form>
              <div className="table-responsive panel p-0">
                <table className="table align-middle mb-0">
                  <thead><tr><th>ID</th><th>Marca</th><th>Producto</th><th>Tipo</th><th>Precio</th><th>Estado</th><th /></tr></thead>
                  <tbody>
                    {data.products.map((p) => (
                      <tr key={p.id}>
                        <td className="text-muted">{p.id}</td>
                        <td>{brandName(p.brand)}</td>
                        <td>{p.name}{p.bestseller && <i className="bi bi-star-fill ms-1 text-warning" title="Más vendido" />}{p.ref && <small className="text-muted d-block">{p.ref}</small>}</td>
                        <td>{p.category}</td><td>{money(p.price)}</td><td>{p.stock ? 'Disponible' : 'Por encargo'}</td>
                        <td className="text-end text-nowrap">
                          <button className="btn btn-sm btn-outline-dark me-1" onClick={() => editProduct(p)} aria-label="Editar"><i className="bi bi-pencil" /></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => delProduct(p)} aria-label="Eliminar"><i className="bi bi-trash" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'brands' && (
            <div className="row g-4">
              <div className="col-lg-4">
                <form className="panel" onSubmit={addBrand}>
                  <h2 className="h5 mb-3">Nueva marca</h2>
                  <input className="form-control mb-2" placeholder="Nombre de la marca" required value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })} />
                  <label className="form-label small">Color de la marca</label>
                  <input className="form-control form-control-color mb-3" type="color" value={brandForm.color} onChange={(e) => setBrandForm({ ...brandForm, color: e.target.value })} />
                  <button className="btn btn-ink w-100" type="submit">Agregar marca</button>
                </form>
              </div>
              <div className="col-lg-8">
                <div className="panel">
                  <div className="d-flex flex-wrap gap-2">
                    {data.brands.map((b) => (
                      <span key={b.id} className="brand-pill" style={{ '--c': b.color }}>
                        {b.name}
                        <button onClick={() => delBrand(b)} aria-label={`Eliminar ${b.name}`}><i className="bi bi-x" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'messages' && (
            <div className="table-responsive panel p-0">
              <table className="table align-middle mb-0">
                <thead><tr><th>Fecha</th><th>Tipo</th><th>Cliente</th><th>Detalle</th><th /></tr></thead>
                <tbody>
                  {messages.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">Aún no hay mensajes ni pedidos.</td></tr>}
                  {messages.map((m) => (
                    <tr key={m.id}>
                      <td className="text-nowrap">{when(m.createdAt)}</td>
                      <td><span className={`badge text-bg-${m.type === 'pedido' ? 'success' : m.type === 'reparacion' ? 'warning' : 'secondary'}`}>{TYPES[m.type] || m.type}</span></td>
                      <td className="text-nowrap">{m.name}<small className="d-block text-muted">{m.phone}</small></td>
                      <td style={{ whiteSpace: 'pre-line' }}>{m.brand && <strong>{m.brand} {m.model} · </strong>}{m.message}</td>
                      <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => delMessage(m)} aria-label="Eliminar"><i className="bi bi-trash" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'backup' && (
            <div className="panel">
              <h2 className="h5">Copia de seguridad del catálogo</h2>
              <p className="text-muted">Descarga todo tu catálogo en un archivo. Si el servidor se reinicia y pierde los cambios, restáuralo aquí en un clic.</p>
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-ink" onClick={exportJson}><i className="bi bi-download me-1" /> Descargar copia</button>
                <label className="btn btn-outline-dark mb-0"><i className="bi bi-upload me-1" /> Restaurar copia<input type="file" accept="application/json" hidden onChange={importJson} /></label>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
