import { useCatalog } from '../context/CatalogContext'
import ProductCard from './ProductCard'

export default function Featured() {
  const { products } = useCatalog()
  const best = products.filter((p) => p.bestseller)
  if (!best.length) return null
  return (
    <section id="mas-vendidos" className="pb-0">
      <div className="container">
        <h2 className="section-title">Los más vendidos</h2>
        <p className="section-sub">Los controles que más nos piden nuestros clientes.</p>
        <div className="feat-row">
          {best.map((p) => <div className="feat-item" key={p.id}><ProductCard product={p} /></div>)}
        </div>
      </div>
    </section>
  )
}
