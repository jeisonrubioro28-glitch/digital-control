// Detecta automáticamente las fotos guardadas en src/assets/productos/
//   {id}.jpg            -> foto de un producto
//   marca-{marca}.jpg   -> foto para todos los controles de esa marca sin foto propia
const files = import.meta.glob('../assets/productos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true, query: '?url', import: 'default',
})
const byName = {}
for (const [path, url] of Object.entries(files)) {
  byName[path.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase()] = url
}

export const photoFor = (p) => p.img || byName[String(p.id)] || byName[`marca-${p.brand}`] || ''
