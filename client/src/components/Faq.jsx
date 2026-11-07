import { FAQ } from '../config'

export default function Faq() {
  return (
    <section id="preguntas" className="band">
      <div className="container" style={{ maxWidth: 860 }}>
        <h2 className="section-title">Preguntas frecuentes</h2>
        <p className="section-sub">Lo que más nos preguntan antes de comprar o reparar.</p>
        <div className="faq">
          {FAQ.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </div>
    </section>
  )
}
