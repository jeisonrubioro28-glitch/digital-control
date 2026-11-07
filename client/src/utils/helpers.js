import { BUSINESS } from '../config'

export const waLink = (msg = 'Hola Digital Control, quiero información sobre un control remoto.', number) =>
  `https://wa.me/${number || BUSINESS.whatsappLines[0].number}?text=${encodeURIComponent(msg)}`

export const money = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export const mapEmbed = (address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address + ', Bogotá, Colombia')}&output=embed`

export const mapsLink = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', Bogotá, Colombia')}`

// Quita tildes y pasa a minúsculas para que "sámsung" encuentre "Samsung"
export const norm = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
