import { useState } from 'react'
import { api } from '../api'
import { BUSINESS } from '../config'
import { useCatalog } from '../context/CatalogContext'
import { waLink } from '../utils/helpers'

const SERVICES = [
  ['red', 'bi-bag-check', 'Venta de controles', 'Originales y compatibles para TV, decodificadores y aire acondicionado.'],
  ['green', 'bi-tools', 'Reparación', 'Teclas que no responden, controles mojados, plaquetas y contactos dañados.'],
  ['yellow', 'bi-cpu', 'Programación', 'Dejamos listo tu control universal para tu TV, equipo de sonido o aire.'],
  ['blue', 'bi-truck', 'Envíos', 'Entregas en Bogotá y despachos a todo el país.'],
]
const STEPS = [
  'Envíanos por WhatsApp una foto de tu control',
  'Te damos el diagnóstico y el precio',
  'Lo reparamos o te conseguimos uno igual',
  'Lo recoges en una sede o te lo enviamos',
]
const PROBLEMS = ['Las teclas no responden', 'Se mojó', 'No enciende el TV', 'Se perdió', 'Está roto por fuera']

export default function Repair() {
  const { brands } = useCatalog()
  const [f, setF] = useState({ name: '', phone: '', brand: '', model: '', message: '' })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const line = BUSINESS.whatsappLines.find((l) => /repar/i.test(l.label)) || BUSINESS.whatsappLines[0]

  const submit = (e) => {
    e.preventDefault()
    const text =
      `Hola Digital Control 👋 Necesito una reparación o un control nuevo.\n• Nombre: ${f.name}\n• Celular: ${f.phone}\n` +
      `• Marca del TV/equipo: ${f.brand || 'No sé'}\n• Modelo: ${f.model || 'No sé'}\n• Problema: ${f.message}\n(Te envío una foto por aquí)`
    window.open(waLink(text, line.number), '_blank')
    api('/contact', { method: 'POST', body: { ...f, type: 'reparacion' }, timeout: 20000 }).catch(() => {})
    setSent(true)
    setF({ name: '', phone: '', brand: '', model: '', message: '' })
  }

  return (
    <section id="reparacion" className="dark-band">
      <div className="container">
        <h2 className="section-title text-white">Servicio técnico: venta y reparación</h2>
        <p className="section-sub text-white-50">Todo lo que necesitas para volver a controlar tu televisor.</p>

        <div className="row g-4 mb-5">
          {SERVICES.map(([c, icon, title, text]) => (
            <div className="col-sm-6 col-lg-3" key={title}>
              <div className={`service service-${c}`}><i className={`bi ${icon}`} /><h3 className="h6">{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>

        <div className="row g-5">
          <div className="col-lg-6">
            <h3 className="h4 text-white mb-4">¿Cómo funciona la reparación?</h3>
            <ol className="steps">
              {STEPS.map((s, i) => <li key={s}><span className="step-n">{i + 1}</span><span>{s}</span></li>)}
            </ol>
          </div>
          <div className="col-lg-6">
            <form className="panel" onSubmit={submit}>
              <h3 className="h5 mb-3">Solicita tu reparación o tu control</h3>
              <div className="row g-2">
                <div className="col-sm-6"><input className="form-control" placeholder="Tu nombre" required minLength={2} value={f.name} onChange={set('name')} aria-label="Tu nombre" /></div>
                <div className="col-sm-6"><input className="form-control" placeholder="Tu celular" required inputMode="tel" minLength={7} value={f.phone} onChange={set('phone')} aria-label="Tu celular" /></div>
                <div className="col-sm-6">
                  <select className="form-select" value={f.brand} onChange={set('brand')} aria-label="Marca de tu TV">
                    <option value="">Marca de tu TV</option>
                    {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                    <option value="Otra">Otra marca</option>
                  </select>
                </div>
                <div className="col-sm-6"><input className="form-control" placeholder="Modelo (si lo sabes)" value={f.model} onChange={set('model')} aria-label="Modelo" /></div>
                <div className="col-12">
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {PROBLEMS.map((p) => <button type="button" key={p} className="chip" onClick={() => setF({ ...f, message: p })}>{p}</button>)}
                  </div>
                  <textarea className="form-control" rows="3" required minLength={3} placeholder="Cuéntanos qué le pasa a tu control" value={f.message} onChange={set('message')} aria-label="Problema" />
                </div>
              </div>
              <button className="btn btn-wa btn-lg w-100 mt-3" type="submit"><i className="bi bi-whatsapp me-1" /> Enviar por WhatsApp</button>
              {sent && <p className="text-success small mt-3 mb-0">Listo, se abrió WhatsApp con tu solicitud. Adjunta una foto del control y presiona enviar.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
