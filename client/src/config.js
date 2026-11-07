// =====================================================================
//  DATOS DEL NEGOCIO  →  edita aquí todo lo que diga "EDITAR"
// =====================================================================
export const BUSINESS = {
  name: 'Digital Control',
  slogan: 'Venta y reparación de controles remotos',
  city: 'Bogotá, Colombia',

  // EDITAR: líneas de WhatsApp. Número con código de país, sin "+" ni espacios.
  // La primera es la principal (botones de producto, formulario, etc.).
  whatsappLines: [
    { label: 'Ventas', number: '573000000001' },
    { label: 'Reparaciones', number: '573000000002' },
    { label: 'Pedidos y envíos', number: '573000000003' },
  ],

  // EDITAR
  phones: ['(601) 000 0000', '300 000 0000'],
  email: 'contacto@digitalcontrol.co',
  schedule: 'Lunes a sábado: 9:00 a.m. a 6:00 p.m.',

  // EDITAR: dos sucursales y dos puntos de venta (cambia o borra los que no apliquen)
  locations: [
    { type: 'Sucursal', name: 'Sucursal 1', address: 'Calle 00 # 00 - 00, Barrio', phone: '300 000 0001' },
    { type: 'Sucursal', name: 'Sucursal 2', address: 'Carrera 00 # 00 - 00, Barrio', phone: '300 000 0002' },
    { type: 'Punto de venta', name: 'Punto de venta 1', address: 'Calle 00 # 00 - 00, Local 0', phone: '300 000 0003' },
    { type: 'Punto de venta', name: 'Punto de venta 2', address: 'Carrera 00 # 00 - 00, Local 0', phone: '300 000 0004' },
  ],

  // EDITAR: links reales de las redes
  social: {
    facebook: 'https://www.facebook.com/tu-pagina',
    instagram: 'https://www.instagram.com/tu-usuario',
    tiktok: 'https://www.tiktok.com/@tu-usuario',
  },
}

// ---------- Contenido de la página (EDITAR los textos a tu gusto) ----------
export const WHY_US = [
  ['red', 'bi-grid-3x3-gap', 'Todas las marcas', 'LG, Samsung, Sony, Panasonic, Challenger, Hyundai, Kalley y muchas más.'],
  ['green', 'bi-whatsapp', 'Atención por WhatsApp', 'Envíanos una foto de tu control y te decimos si lo tenemos.'],
  ['yellow', 'bi-tools', 'Reparamos y programamos', 'Si tu control tiene arreglo, lo dejamos funcionando.'],
  ['blue', 'bi-truck', 'Envíos a todo el país', 'Entregas en Bogotá y despachos a otras ciudades.'],
  ['red', 'bi-geo-alt', 'Puntos en Bogotá', 'Sucursales y puntos de venta donde puedes recoger tu pedido.'],
  ['green', 'bi-tag', 'Precios claros', 'Ves el precio de cada control antes de escribirnos.'],
]

export const HOW_TO_BUY = {
  steps: [
    ['Busca tu control', 'Usa el buscador o filtra por marca y tipo de control.'],
    ['Agrégalo al carrito', 'Puedes pedir uno o varios. Si dudas de la referencia, envíanos una foto.'],
    ['Envía el pedido por WhatsApp', 'Te llega el resumen listo; un asesor lo confirma contigo.'],
    ['Paga y recibe', 'Recoge en una sede o te lo enviamos a tu casa.'],
  ],
  payments: [
    ['bi-cash-coin', 'Efectivo', 'Paga en cualquiera de nuestras sedes.'],
    ['bi-phone', 'Transferencia o billeteras', 'Nequi, Daviplata o transferencia bancaria. Pregúntanos por los datos.'],
    ['bi-credit-card', 'Tarjeta', 'Consulta con tu asesor la disponibilidad en cada sede.'],
  ],
  warranty:
    'Todos los controles se prueban antes de entregarlos. Si el control que compraste no funciona con tu equipo, escríbenos con tu pedido y buscamos la solución. (EDITAR: escribe aquí tus condiciones reales de garantía y reparación.)',
  delivery:
    'Entregas en Bogotá y envíos a todo el país por transportadora. Cuando confirmes tu pedido por WhatsApp te informamos el costo y el tiempo de entrega según tu ciudad. (EDITAR: escribe aquí tus condiciones reales de envío.)',
}

export const FAQ = [
  ['¿Cómo sé cuál es la referencia de mi control?', 'Normalmente está impresa en la parte de atrás del control o dentro del compartimiento de las pilas. Si no la ves, envíanos una foto del control y de tu televisor por WhatsApp y lo identificamos.'],
  ['¿Pueden reparar mi control en lugar de comprar uno nuevo?', 'Sí. Revisamos teclas que no responden, controles mojados y contactos dañados. Escríbenos con una foto y te damos un diagnóstico.'],
  ['¿Sirve un control universal para mi televisor?', 'Para muchas marcas sí. Si lo compras con nosotros, te lo dejamos programado para tu equipo.'],
  ['¿Hacen envíos fuera de Bogotá?', 'Sí, enviamos a todo el país. El costo y el tiempo dependen de tu ciudad; te los confirmamos por WhatsApp.'],
  ['¿Qué pasa si el control no es compatible?', 'Escríbenos con tu pedido para ayudarte a encontrar el correcto. Consulta las condiciones de garantía en la sección ¿Cómo comprar?'],
]
