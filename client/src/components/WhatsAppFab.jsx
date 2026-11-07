import { useState } from 'react'
import { BUSINESS } from '../config'
import { waLink } from '../utils/helpers'

export default function WhatsAppFab() {
  const [open, setOpen] = useState(false)
  return (
    <div className="wa-fab">
      {open && (
        <div className="wa-menu" role="menu">
          <strong>¿Con quién quieres hablar?</strong>
          {BUSINESS.whatsappLines.map((l) => (
            <a key={l.number} role="menuitem" href={waLink('Hola Digital Control, tengo una pregunta.', l.number)} target="_blank" rel="noreferrer">
              <i className="bi bi-whatsapp" /> {l.label}
            </a>
          ))}
        </div>
      )}
      <button className="wa-float" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Escríbenos por WhatsApp">
        <i className={`bi ${open ? 'bi-x-lg' : 'bi-whatsapp'}`} />
      </button>
    </div>
  )
}
