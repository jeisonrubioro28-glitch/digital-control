import { BUSINESS } from '../config'

// Las cuatro teclas de colores del control filtran el catálogo por tipo.
const KEYS = [
  { cat: 'Smart TV', cls: 'red', label: 'Smart TV' },
  { cat: 'Convencional', cls: 'green', label: 'Convencional' },
  { cat: 'Decodificador', cls: 'yellow', label: 'Deco' },
  { cat: 'Universal', cls: 'blue', label: 'Universal' },
]

function HeroRemote({ category, pickCategory }) {
  const lcd = category === 'Todas' ? 'Todos los controles' : category
  return (
    <div className="remote" aria-label="Control remoto interactivo">
      <div className="remote-top">
        <span className="remote-led" aria-hidden="true" />
        <button className="rkey rkey-power" onClick={() => pickCategory('Todas')} aria-label="Ver todos los controles">
          <i className="bi bi-power" />
        </button>
      </div>
      <div className="remote-lcd" aria-live="polite"><small>Mostrando</small><strong>{lcd}</strong></div>
      <div className="remote-keys">
        {KEYS.map((k, i) => (
          <button key={k.cat} className={`rkey rkey-${k.cls} ${category === k.cat ? 'on' : ''}`}
            style={{ '--d': `${0.5 + i * 0.18}s` }} onClick={() => pickCategory(k.cat)}>
            {k.label}
          </button>
        ))}
      </div>
      <div className="remote-dpad" aria-hidden="true"><span>OK</span></div>
      <div className="remote-rockers" aria-hidden="true"><span><b>+</b><b>−</b></span><span><b>+</b><b>−</b></span></div>
      <div className="remote-brand">{BUSINESS.name}</div>
    </div>
  )
}

export default function Hero({ query, setQuery, category, pickCategory, pickBrand, goCatalog }) {
  return (
    <section id="inicio" className="hero">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            <h1 className="hero-title">¿Se dañó o se perdió el control de tu televisor?</h1>
            <p className="hero-lead">
              Lo tenemos, lo reparamos o lo conseguimos. Controles para las marcas de TV y decodificadores
              más usadas en Colombia, con entrega en {BUSINESS.city.split(',')[0]} y envíos a todo el país.
            </p>
            <form className="tv-search" onSubmit={(e) => { e.preventDefault(); goCatalog() }}>
              <i className="bi bi-search" aria-hidden="true" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Marca o modelo de tu TV" aria-label="Buscar control remoto" />
              <button className="btn btn-ink" type="submit">Buscar</button>
            </form>
            <div className="d-flex flex-wrap gap-2 mt-3 align-items-center">
              <span className="text-muted small">Más buscados:</span>
              {[['lg', 'LG'], ['samsung', 'Samsung'], ['sony', 'Sony'], ['kalley', 'Kalley'], ['universal', 'Universal']].map(([id, l]) => (
                <button key={id} className="chip" onClick={() => pickBrand(id)}>{l}</button>
              ))}
            </div>
            <ul className="hero-facts">
              <li><i className="bi bi-whatsapp" /> Asesoría por WhatsApp</li>
              <li><i className="bi bi-tools" /> Venta y reparación</li>
              <li><i className="bi bi-geo-alt" /> {BUSINESS.locations.length} puntos en Bogotá</li>
            </ul>
          </div>
          <div className="col-lg-5"><HeroRemote category={category} pickCategory={pickCategory} /></div>
        </div>
      </div>
    </section>
  )
}
