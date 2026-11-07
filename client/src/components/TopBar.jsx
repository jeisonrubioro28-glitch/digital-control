import { BUSINESS } from '../config'
import { waLink } from '../utils/helpers'

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="container d-flex flex-wrap justify-content-center justify-content-md-between align-items-center gap-1">
        <span className="d-flex flex-wrap gap-3">
          <span><i className="bi bi-telephone" /> {BUSINESS.phones.join(' · ')}</span>
          <span className="d-none d-xxl-inline"><i className="bi bi-clock" /> {BUSINESS.schedule}</span>
        </span>
        <span className="d-flex flex-wrap gap-2 align-items-center">
          <span className="d-none d-md-inline">WhatsApp:</span>
          {BUSINESS.whatsappLines.map((l) => (
            <a key={l.number} className="topbar-wa" href={waLink('Hola Digital Control, tengo una pregunta.', l.number)} target="_blank" rel="noreferrer">
              <i className="bi bi-whatsapp" /> {l.label}
            </a>
          ))}
        </span>
      </div>
    </div>
  )
}
