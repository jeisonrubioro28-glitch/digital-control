import { useCatalog } from '../context/CatalogContext'

export default function BrandGrid({ pickBrand }) {
  const { brands, products } = useCatalog()
  return (
    <section id="marcas" className="band">
      <div className="container">
        <h2 className="section-title">Controles para todas las marcas</h2>
        <p className="section-sub">Toca una marca para ver sus controles. Si no encuentras la tuya, escríbenos: la conseguimos.</p>
        <div className="brand-wall">
          {brands.map((b) => {
            const count = products.filter((x) => x.brand === b.id).length
            return (
              <button key={b.id} className="brand-chip" style={{ '--c': b.color }} onClick={() => pickBrand(b.id)}>
                {b.name}<sup>{count}</sup>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
