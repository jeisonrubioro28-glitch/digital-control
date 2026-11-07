import { BUSINESS } from '../config'
import { useCatalog } from '../context/CatalogContext'
import { waLink } from '../utils/helpers'
import { LogoMark } from './Navbar'

export default function Footer({ pickCategory, openHow }) {
  const { categories } = useCatalog()
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 brand-font fs-5 mb-2"><LogoMark /> {BUSINESS.name}</div>
            <p className="text-white-50 mb-3">{BUSINESS.slogan} en {BUSINESS.city}.</p>
            <div className="d-flex gap-2">
              <a className="foot-social" href={BUSINESS.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a className="foot-social" href={BUSINESS.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a className="foot-social" href={BUSINESS.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><i className="bi bi-tiktok" /></a>
              <a className="foot-social" href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp"><i className="bi bi-whatsapp" /></a>
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h4 className="foot-title">Productos</h4>
            <ul className="foot-list">
              {categories.map((c) => <li key={c.name}><a href="#catalogo" onClick={() => pickCategory(c.name)}>{c.name}</a></li>)}
              <li><a href="#marcas">Todas las marcas</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-3">
            <h4 className="foot-title">Nuestra empresa</h4>
            <ul className="foot-list">
              <li><a href="#nosotros">Quiénes somos</a></li>
              <li><a href="#reparacion">Servicio técnico</a></li>
              <li><a href="#como-comprar" onClick={() => openHow('entrega')}>Entrega</a></li>
              <li><a href="#como-comprar" onClick={() => openHow('garantia')}>Garantía</a></li>
              <li><a href="#preguntas">Preguntas frecuentes</a></li>
              <li><a href="#sedes">Sedes</a></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h4 className="foot-title">Contacto</h4>
            <ul className="foot-list">
              <li><i className="bi bi-geo-alt" /> {BUSINESS.city}</li>
              {BUSINESS.phones.map((t) => <li key={t}><i className="bi bi-telephone" /> {t}</li>)}
              <li><i className="bi bi-envelope" /> {BUSINESS.email}</li>
              <li><i className="bi bi-clock" /> {BUSINESS.schedule}</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <small>© {new Date().getFullYear()} {BUSINESS.name}. Todos los derechos reservados.</small>
          <small><a href="#/admin">Administración</a></small>
        </div>
      </div>
    </footer>
  )
}
