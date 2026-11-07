import { useState } from 'react'
import { BUSINESS } from '../config'
import { mapEmbed, mapsLink, waLink } from '../utils/helpers'

export default function Locations() {
  const [i, setI] = useState(0)
  const sel = BUSINESS.locations[i]
  return (
    <section id="sedes">
      <div className="container">
        <h2 className="section-title">¿Dónde estamos? Sedes en {BUSINESS.city.split(',')[0]}</h2>
        <p className="section-sub">{BUSINESS.schedule}</p>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="loc-list">
              {BUSINESS.locations.map((l, idx) => (
                <button key={l.name} className={`loc ${idx === i ? 'active' : ''}`} onClick={() => setI(idx)} aria-pressed={idx === i}>
                  <span className="loc-type">{l.type}</span>
                  <strong>{l.name}</strong>
                  <span className="loc-line"><i className="bi bi-geo-alt" /> {l.address}, {BUSINESS.city.split(',')[0]}</span>
                  <span className="loc-line"><i className="bi bi-telephone" /> {l.phone}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="col-lg-7">
            <div className="map">
              <iframe title={`Mapa de ${sel.name}`} src={mapEmbed(sel.address)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className="d-flex flex-wrap gap-2 mt-3">
              <a className="btn btn-ink" href={mapsLink(sel.address)} target="_blank" rel="noreferrer"><i className="bi bi-signpost-2 me-1" /> Cómo llegar</a>
              <a className="btn btn-wa" href={waLink(`Hola, quiero información de ${sel.name}.`)} target="_blank" rel="noreferrer"><i className="bi bi-whatsapp me-1" /> Escribir por WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
