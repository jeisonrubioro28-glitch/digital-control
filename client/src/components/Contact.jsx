import { useState } from 'react'
import { api } from '../api'
import { BUSINESS } from '../config'
import { waLink } from '../utils/helpers'

const SOCIALS = [
  ['facebook', 'bi-facebook', 'Facebook', '#1877F2'],
  ['instagram', 'bi-instagram', 'Instagram', '#E1306C'],
  ['tiktok', 'bi-tiktok', 'TikTok', '#FE2C55'],
]

export default function Contact() {
  const [f, setF] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    window.open(waLink(`Hola Digital Control, soy ${f.name} (${f.phone}). ${f.message}`), '_blank')
    api('/contact', { method: 'POST', body: { ...f, type: 'contacto' }, timeout: 20000 }).catch(() => {})
    setSent(true)
    setF({ name: '', phone: '', message: '' })
  }

  return (
    <section id="contacto" className="band">
      <div className="container">
        <h2 className="section-title">Contáctenos</h2>
        <p className="section-sub">Escríbenos y te respondemos por WhatsApp.</p>
        <div className="row g-4">
          <div className="col-lg-6">
            <form className="panel" onSubmit={submit}>
              <label className="form-label" htmlFor="c-name">Tu nombre</label>
              <input id="c-name" className="form-control mb-3" required minLength={2} value={f.name} onChange={set('name')} />
              <label className="form-label" htmlFor="c-phone">Tu celular</label>
              <input id="c-phone" className="form-control mb-3" required inputMode="tel" minLength={7} value={f.phone} onChange={set('phone')} />
              <label className="form-label" htmlFor="c-msg">¿Qué control buscas?</label>
              <textarea id="c-msg" className="form-control mb-3" rows="4" required minLength={3}
                placeholder="Marca y modelo de tu TV, o cuéntanos qué le pasa a tu control" value={f.message} onChange={set('message')} />
              <button className="btn btn-wa btn-lg w-100" type="submit"><i className="bi bi-whatsapp me-1" /> Enviar por WhatsApp</button>
              {sent && <p className="text-success small mt-3 mb-0">Listo, se abrió WhatsApp con tu mensaje. Solo presiona enviar.</p>}
            </form>
          </div>
          <div className="col-lg-6">
            <div className="panel h-100">
              <h3 className="h5 mb-3">Datos de contacto</h3>
              <ul className="contact-list">
                <li><i className="bi bi-geo-alt" /> {BUSINESS.city}</li>
                {BUSINESS.phones.map((t) => <li key={t}><i className="bi bi-telephone" /> {t}</li>)}
                <li><i className="bi bi-envelope" /> {BUSINESS.email}</li>
                <li><i className="bi bi-clock" /> {BUSINESS.schedule}</li>
              </ul>
              <h3 className="h5 mt-4 mb-3">Síguenos</h3>
              <div className="d-flex flex-wrap gap-2">
                {SOCIALS.map(([key, icon, label, color]) => (
                  <a key={key} className="social" style={{ '--c': color }} href={BUSINESS.social[key]} target="_blank" rel="noreferrer"><i className={`bi ${icon}`} /> {label}</a>
                ))}
                <a className="social" style={{ '--c': '#25D366' }} href={waLink()} target="_blank" rel="noreferrer"><i className="bi bi-whatsapp" /> WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
