import { useEffect, useRef, useState } from 'react'
import { useCatalog } from '../context/CatalogContext'
import { useShop } from '../context/ShopContext'
import { money, waLink } from '../utils/helpers'
import { ProductImage } from './ProductCard'
import { photoFor } from '../utils/photos'

export default function QuickView() {
  const { quick, setQuick, add } = useShop()
  const { brandMap } = useCatalog()
  const [qty, setQty] = useState(1)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!quick) return
    setQty(1)
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setQuick(null)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [quick, setQuick])

  if (!quick) return null
  const p = quick
  const b = brandMap[p.brand] || { name: p.brand, color: '#8B93A1' }
  const msg = `Hola Digital Control 👋 Quiero este control:\n• ${b.name} - ${p.name}${p.ref ? `\n• Ref: ${p.ref}` : ''}\n• Precio: ${money(p.price)}\n¿Lo tienen disponible?`

  return (
    <div className="overlay" onClick={() => setQuick(null)}>
      <div className="qv" role="dialog" aria-modal="true" aria-label={p.name} onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="qv-close" onClick={() => setQuick(null)} aria-label="Cerrar"><i className="bi bi-x-lg" /></button>
        <div className="row g-0">
          <div className="col-md-5 qv-media" style={{ background: photoFor(p) ? '#F1F3F6' : `${b.color}2E` }}><ProductImage product={p} className="qv-svg" /></div>
          <div className="col-md-7 qv-body">
            <span className="p-brand">{b.name} · {p.category}</span>
            <h3 className="qv-title">{p.name}</h3>
            {p.ref && <p className="p-meta mb-2">Referencia: {p.ref}</p>}
            <p className="text-muted">{p.description || 'Pregúntanos por este control: te confirmamos disponibilidad y compatibilidad.'}</p>
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="qv-price">{money(p.price)}</span>
              <span className={`stock ${p.stock ? 'ok' : 'order'}`}>{p.stock ? 'Disponible' : 'Por encargo'}</span>
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Más">+</button>
              </div>
              <button className="btn btn-ink" onClick={() => { add(p.id, qty); setQuick(null) }}><i className="bi bi-bag-plus me-1" /> Agregar al carrito</button>
            </div>
            <a className="btn btn-wa mt-3" href={waLink(msg)} target="_blank" rel="noreferrer"><i className="bi bi-whatsapp me-1" /> Preguntar por WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  )
}
