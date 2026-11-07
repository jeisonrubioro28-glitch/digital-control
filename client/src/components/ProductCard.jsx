import { useCatalog } from '../context/CatalogContext'
import { useShop } from '../context/ShopContext'
import { money, waLink } from '../utils/helpers'
import { photoFor } from '../utils/photos'
import RemoteSVG from './RemoteSVG'

export function ProductImage({ product, className = 'p-svg' }) {
  const { brandMap } = useCatalog()
  const b = brandMap[product.brand] || { name: product.brand, color: '#8B93A1' }
  const src = photoFor(product)
  return src ? (
    <img src={src} alt={`${b.name} ${product.name}`} loading="lazy" />
  ) : (
    <RemoteSVG color={b.color} brand={b.name} variant={product.variant} className={className} />
  )
}

export default function ProductCard({ product }) {
  const { brandMap } = useCatalog()
  const { add, setQuick } = useShop()
  const b = brandMap[product.brand] || { name: product.brand, color: '#8B93A1' }
  const msg =
    `Hola Digital Control 👋 Quiero este control:\n• ${b.name} - ${product.name}` +
    `${product.ref ? `\n• Ref: ${product.ref}` : ''}\n• Precio: ${money(product.price)}\n¿Lo tienen disponible?`

  return (
    <article className="p-card">
      <button className="p-media" style={{ background: photoFor(product) ? '#F1F3F6' : `${b.color}2E` }} onClick={() => setQuick(product)} aria-label={`Vista rápida de ${product.name}`}>
        {product.tag && <span className="p-tag">{product.tag}</span>}
        <ProductImage product={product} />
        <span className="p-eye"><i className="bi bi-eye" /> Vista rápida</span>
      </button>
      <div className="p-body">
        <span className="p-brand">{b.name}</span>
        <h3 className="p-name">{product.name}</h3>
        <span className="p-meta">{product.ref ? `Ref. ${product.ref} · ` : ''}{product.category}</span>
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <span className="p-price">{money(product.price)}</span>
          <span className={`stock ${product.stock ? 'ok' : 'order'}`}>{product.stock ? 'Disponible' : 'Por encargo'}</span>
        </div>
        <button className="btn btn-ink w-100" onClick={() => add(product.id)}>
          <i className="bi bi-bag-plus me-1" /> Agregar al carrito
        </button>
        <a className="p-wa" href={waLink(msg)} target="_blank" rel="noreferrer">
          <i className="bi bi-whatsapp" /> Preguntar por WhatsApp
        </a>
      </div>
    </article>
  )
}
