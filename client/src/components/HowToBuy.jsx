import { HOW_TO_BUY } from '../config'

const TABS = [['pasos', 'Instrucciones'], ['pagos', 'Medios de pago'], ['garantia', 'Garantía'], ['entrega', 'Entrega']]

export default function HowToBuy({ how, setHow }) {
  return (
    <section id="como-comprar">
      <div className="container">
        <h2 className="section-title">¿Cómo comprar?</h2>
        <p className="section-sub">Pedir tu control es rápido: lo armas aquí y lo confirmas por WhatsApp.</p>
        <div className="tabs" role="tablist">
          {TABS.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={how === id} className={`chip ${how === id ? 'active' : ''}`} onClick={() => setHow(id)}>{label}</button>
          ))}
        </div>
        <div className="panel mt-3" role="tabpanel">
          {how === 'pasos' && (
            <ol className="how-steps">
              {HOW_TO_BUY.steps.map(([t, d], i) => (
                <li key={t}><span className="step-n">{i + 1}</span><div><strong>{t}</strong><span>{d}</span></div></li>
              ))}
            </ol>
          )}
          {how === 'pagos' && (
            <div className="row g-4">
              {HOW_TO_BUY.payments.map(([icon, t, d]) => (
                <div className="col-md-4" key={t}><div className="pay"><i className={`bi ${icon}`} /><strong>{t}</strong><span>{d}</span></div></div>
              ))}
            </div>
          )}
          {how === 'garantia' && <p className="mb-0 about-text"><i className="bi bi-shield-check me-2" />{HOW_TO_BUY.warranty}</p>}
          {how === 'entrega' && <p className="mb-0 about-text"><i className="bi bi-truck me-2" />{HOW_TO_BUY.delivery}</p>}
        </div>
      </div>
    </section>
  )
}
