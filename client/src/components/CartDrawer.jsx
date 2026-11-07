import { useEffect, useState } from 'react'
import { api } from '../api'
import { useShop } from '../context/ShopContext'
import { useCatalog } from '../context/CatalogContext'
import { money, waLink } from '../utils/helpers'

export default function CartDrawer() {
  const { lines, total, count, drawer, setDrawer, setQty, remove, clear } = useShop()
  const { brandMap } = useCatalog()
  const [f, setF] = useState({ name: '', phone: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!drawer) return
    const onKey = (e) => e.key === 'Escape' && setDrawer(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawer, setDrawer])

  if (!drawer) return null

  const send = (e) => {
    e.preventDefault()
    const text =
      `Hola Digital Control 👋 Quiero hacer este pedido:\n\n` +
      lines.map((l) => `• ${l.qty} x ${brandMap[l.product.brand]?.name || ''} ${l.product.name}${l.product.ref ? ` (${l.product.ref})` : ''} — ${money(l.qty * l.product.price)}`).join('\n') +
      `\n\nTotal: ${money(total)}\nNombre: ${f.name}\nCelular: ${f.phone}`
    window.open(waLink(text), '_blank')
    // además queda registrado en el servidor y te llega por correo (si está configurado)
    api('/orders', { method: 'POST', body: { ...f, items: lines.map((l) => ({ id: l.product.id, qty: l.qty })) }, timeout: 20000 }).catch(() => {})
    clear()
    setSent(true)
  }

  return (
    <div className="overlay overlay-right" onClick={() => setDrawer(false)}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Carrito" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3 className="h5 mb-0">Tu pedido {count > 0 && <small className="text-muted">({count})</small>}</h3>
          <button className="qv-close position-static" onClick={() => setDrawer(false)} aria-label="Cerrar"><i className="bi bi-x-lg" /></button>
        </header>

        {sent && lines.length === 0 ? (
          <div className="drawer-empty">
            <i className="bi bi-check-circle display-4 text-success" />
            <p className="mt-2">Se abrió WhatsApp con tu pedido. Presiona <strong>enviar</strong> y un asesor lo confirma contigo.</p>
            <button className="btn btn-ink" onClick={() => { setSent(false); setDrawer(false) }}>Seguir viendo controles</button>
          </div>
        ) : lines.length === 0 ? (
          <div className="drawer-empty">
            <i className="bi bi-bag display-4" />
            <p className="mt-2">Tu carrito está vacío. Agrega los controles que necesitas.</p>
            <button className="btn btn-ink" onClick={() => setDrawer(false)}>Ver controles</button>
          </div>
        ) : (
          <form onSubmit={send} className="drawer-form">
            <ul className="drawer-list">
              {lines.map(({ product: p, qty }) => (
                <li key={p.id}>
                  <div className="flex-grow-1">
                    <strong>{brandMap[p.brand]?.name} {p.name}</strong>
                    {p.ref && <small className="d-block text-muted">Ref. {p.ref}</small>}
                    <div className="qty mt-2">
                      <button type="button" onClick={() => setQty(p.id, qty - 1)} aria-label="Menos">−</button>
                      <span>{qty}</span>
                      <button type="button" onClick={() => setQty(p.id, qty + 1)} aria-label="Más">+</button>
                    </div>
                  </div>
                  <div className="text-end">
                    <strong>{money(qty * p.price)}</strong>
                    <button type="button" className="btn btn-link btn-sm text-danger d-block p-0 mt-2" onClick={() => remove(p.id)}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
            <footer>
              <div className="d-flex justify-content-between mb-3"><span>Total</span><strong className="p-price">{money(total)}</strong></div>
              <input className="form-control mb-2" placeholder="Tu nombre" required minLength={2} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
              <input className="form-control mb-3" placeholder="Tu celular" required inputMode="tel" minLength={7} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              <button className="btn btn-wa btn-lg w-100" type="submit"><i className="bi bi-whatsapp me-1" /> Enviar pedido por WhatsApp</button>
              <small className="text-muted d-block mt-2">Un asesor confirma disponibilidad, envío y forma de pago contigo.</small>
              <button type="button" className="btn btn-link btn-sm text-muted mt-1 p-0" onClick={clear}>Vaciar carrito</button>
            </footer>
          </form>
        )}
      </aside>
    </div>
  )
}
