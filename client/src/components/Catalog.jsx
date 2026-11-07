import { useEffect, useMemo, useState } from 'react'
import { useCatalog } from '../context/CatalogContext'
import { norm, waLink } from '../utils/helpers'
import ProductCard from './ProductCard'

const PAGE = 12

export default function Catalog({ query, setQuery, brand, setBrand, category, setCategory }) {
  const { brands, categories, products, brandMap } = useCatalog()
  const [sort, setSort] = useState('relevancia')
  const [limit, setLimit] = useState(PAGE)

  useEffect(() => setLimit(PAGE), [query, brand, category, sort])

  const results = useMemo(() => {
    const terms = norm(query).split(/\s+/).filter(Boolean)
    const label = (p) => `${brandMap[p.brand]?.name || ''} ${p.name}`
    let list = products.filter((p) => {
      const hay = norm(`${p.name} ${brandMap[p.brand]?.name || ''} ${p.ref || ''} ${p.category}`)
      return terms.every((t) => hay.includes(t)) && (brand === 'todas' || p.brand === brand) && (category === 'Todas' || p.category === category)
    })
    const by = {
      vendidos: (a, b) => Number(!!b.bestseller) - Number(!!a.bestseller),
      menor: (a, b) => a.price - b.price,
      mayor: (a, b) => b.price - a.price,
      az: (a, b) => label(a).localeCompare(label(b)),
      za: (a, b) => label(b).localeCompare(label(a)),
    }[sort]
    return by ? [...list].sort(by) : list
  }, [products, brandMap, query, brand, category, sort])

  const hasFilters = query || brand !== 'todas' || category !== 'Todas'
  const clear = () => { setQuery(''); setBrand('todas'); setCategory('Todas') }

  return (
    <section id="catalogo">
      <div className="container">
        <h2 className="section-title">Encuentra tu control</h2>
        <p className="section-sub">Busca por marca, modelo o referencia, o filtra por tipo de control.</p>

        <div className="filters">
          <div className="row g-2">
            <div className="col-lg-5">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search" /></span>
                <input className="form-control" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ej: LG magic, Samsung BN59, Kalley smart…" aria-label="Buscar" />
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <select className="form-select" value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Marca">
                <option value="todas">Todas las marcas</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="col-6 col-lg-4">
              <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar">
                <option value="relevancia">Ordenar: relevancia</option>
                <option value="vendidos">Más vendidos primero</option>
                <option value="menor">Precio: de menor a mayor</option>
                <option value="mayor">Precio: de mayor a menor</option>
                <option value="az">Nombre: A a Z</option>
                <option value="za">Nombre: Z a A</option>
              </select>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className={`chip ${category === 'Todas' ? 'active' : ''}`} onClick={() => setCategory('Todas')}>Todos</button>
            {categories.map((c) => (
              <button key={c.name} className={`chip ${category === c.name ? 'active' : ''}`} onClick={() => setCategory(c.name)}>
                <span className="dot" style={{ background: c.color }} />{c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center my-3">
          <span className="text-muted small">Mostrando {Math.min(limit, results.length)} de {results.length} {results.length === 1 ? 'control' : 'controles'}</span>
          {hasFilters && <button className="btn btn-link btn-sm text-light" onClick={clear}><i className="bi bi-x-circle me-1" />Limpiar filtros</button>}
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <i className="bi bi-binoculars display-5" />
            <h3 className="h5 mt-2">No vemos ese control en la lista</h3>
            <p className="text-muted">Probablemente lo tengamos. Cuéntanos la marca y el modelo de tu TV y te respondemos rápido.</p>
            <a className="btn btn-wa" target="_blank" rel="noreferrer"
              href={waLink(`Hola Digital Control, busco un control${query ? ` para: ${query}` : ''}. ¿Lo tienen?`)}>
              <i className="bi bi-whatsapp me-1" /> Preguntar por WhatsApp
            </a>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {results.slice(0, limit).map((p) => (
                <div className="col-6 col-md-4 col-xl-3" key={p.id}><ProductCard product={p} /></div>
              ))}
            </div>
            {limit < results.length && (
              <div className="text-center mt-5">
                <button className="btn btn-ink btn-lg" onClick={() => setLimit((l) => l + PAGE)}>Ver más controles</button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
