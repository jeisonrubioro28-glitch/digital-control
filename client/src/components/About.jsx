import { BUSINESS } from '../config'

const VALUES = [
  ['bi-patch-check', 'Controles probados', 'Revisamos cada control antes de entregarlo.'],
  ['bi-chat-dots', 'Respuesta rápida', 'Te atendemos directamente por WhatsApp.'],
  ['bi-people', 'Negocio familiar', 'Te asesoramos con honestidad y precios justos.'],
]

export default function About() {
  return (
    <section id="nosotros" className="band">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <h2 className="section-title">Quiénes somos</h2>
            {/* EDITAR: cuenta aquí la historia real del negocio */}
            <p className="about-text">
              {BUSINESS.name} es un negocio familiar de {BUSINESS.city.split(',')[0]} dedicado a la venta y reparación
              de controles remotos para televisores. Trabajamos con las marcas más usadas del mercado para que
              nunca te quedes sin tu control.
            </p>
            <p className="about-text">
              Nuestra misión es que encuentres rápido lo que necesitas, con buen precio y con la asesoría de
              personas que conocen el producto.
            </p>
          </div>
          <div className="col-lg-6">
            <ul className="values">
              {VALUES.map(([icon, t, d]) => (
                <li key={t}><i className={`bi ${icon}`} /><div><strong>{t}</strong><span>{d}</span></div></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
