import { Collapse } from 'bootstrap'
import { BUSINESS } from '../config'
import { useCatalog } from '../context/CatalogContext'
import { useShop } from '../context/ShopContext'

export function LogoMark() {
  return (
    <span className="logo-keys" aria-hidden="true">
      <i style={{ background: '#E5382B' }} /><i style={{ background: '#1FA35B' }} />
      <i style={{ background: '#F4B823' }} /><i style={{ background: '#2764E8' }} />
    </span>
  )
}

export default function Navbar({ pickCategory, openHow }) {
  const { categories } = useCatalog()
  const { count, setDrawer } = useShop()

  const close = () => {
    const el = document.getElementById('nav')
    if (el?.classList.contains('show')) Collapse.getOrCreateInstance(el).hide()
  }
  const Drop = ({ label, children }) => (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#!" role="button" data-bs-toggle="dropdown" aria-expanded="false">{label}</a>
      <ul className="dropdown-menu">{children}</ul>
    </li>
  )
  const Item = ({ href, onClick, children }) => (
    <li><a className="dropdown-item" href={href} onClick={() => { onClick?.(); close() }}>{children}</a></li>
  )

  return (
    <nav className="navbar navbar-expand-xl nav-dc sticky-top">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2 brand-font" href="#inicio">
          <LogoMark /> {BUSINESS.name}
        </a>
        <div className="d-flex align-items-center gap-2 order-xl-last">
          <button className="cart-btn" onClick={() => setDrawer(true)} aria-label={`Abrir carrito (${count})`}>
            <i className="bi bi-bag" />{count > 0 && <b>{count}</b>}
          </button>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Abrir menú">
            <span className="navbar-toggler-icon" />
          </button>
        </div>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-xl-center gap-xl-1">
            <Drop label="Productos">
              <Item href="#catalogo" onClick={() => pickCategory('Todas')}>Todos los controles</Item>
              {categories.map((c) => (
                <Item key={c.name} href="#catalogo" onClick={() => pickCategory(c.name)}>
                  <span className="dot" style={{ background: c.color }} /> {c.name}
                </Item>
              ))}
            </Drop>
            <li className="nav-item"><a className="nav-link" href="#marcas" onClick={close}>Marcas</a></li>
            <li className="nav-item"><a className="nav-link" href="#reparacion" onClick={close}>Servicio técnico</a></li>
            <Drop label="Quiénes somos">
              <Item href="#nosotros">La empresa</Item>
              <Item href="#por-que">¿Por qué elegirnos?</Item>
              <Item href="#sedes">¿Dónde estamos?</Item>
            </Drop>
            <Drop label="¿Cómo comprar?">
              <Item href="#como-comprar" onClick={() => openHow('pasos')}>Instrucciones</Item>
              <Item href="#como-comprar" onClick={() => openHow('pagos')}>Medios de pago</Item>
              <Item href="#como-comprar" onClick={() => openHow('garantia')}>Políticas de garantía</Item>
              <Item href="#como-comprar" onClick={() => openHow('entrega')}>Políticas de entrega</Item>
            </Drop>
            <li className="nav-item"><a className="nav-link" href="#contacto" onClick={close}>Contáctenos</a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
