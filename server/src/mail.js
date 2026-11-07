import nodemailer from 'nodemailer'

let transport = null
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  const port = Number(process.env.SMTP_PORT || 465)
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

// Envía un correo al dueño del negocio. Si no hay SMTP configurado, no hace nada.
export function notify(subject, text) {
  if (!transport) return
  transport
    .sendMail({ from: `Digital Control <${process.env.SMTP_USER}>`, to: process.env.MAIL_TO || process.env.SMTP_USER, subject, text })
    .catch((e) => console.error('No se pudo enviar el correo:', e.message))
}
