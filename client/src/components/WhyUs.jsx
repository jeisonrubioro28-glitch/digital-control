import { WHY_US } from '../config'

export default function WhyUs() {
  return (
    <section id="por-que">
      <div className="container">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <p className="section-sub">Lo que hace fácil comprar o reparar tu control con nosotros.</p>
        <div className="row g-4">
          {WHY_US.map(([c, icon, title, text]) => (
            <div className="col-md-6 col-lg-4" key={title}>
              <div className={`why why-${c}`}><i className={`bi ${icon}`} /><div><h3 className="h6">{title}</h3><p>{text}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
