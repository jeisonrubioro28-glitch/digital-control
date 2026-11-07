// Muestra qué controles ya tienen foto y cuáles faltan.   Uso:  npm run fotos
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
const seed = JSON.parse(fs.readFileSync(path.join(root, 'shared/catalog.seed.json'), 'utf8'))
const dir = path.join(root, 'client/src/assets/productos')
fs.mkdirSync(dir, { recursive: true })
const have = new Set(fs.readdirSync(dir).map((f) => f.replace(/\.[^.]+$/, '').toLowerCase()))
const brand = Object.fromEntries(seed.brands.map((b) => [b.id, b.name]))

let lines = ['FOTOS DE LOS CONTROLES', '======================', 'Guarda cada foto en client/src/assets/productos/ con el nombre indicado (jpg, png o webp).', '']
lines.push('A) FOTO POR MARCA (sirve para todos los controles de esa marca):', '')
for (const b of seed.brands) lines.push(`  ${have.has('marca-' + b.id) ? '[x]' : '[ ]'}  marca-${b.id}.jpg   ->  ${b.name}`)
lines.push('', 'B) FOTO POR PRODUCTO (si quieres una foto distinta en cada control):', '')
for (const p of seed.products) {
  const ok = have.has(String(p.id)) || p.img
  lines.push(`  ${ok ? '[x]' : '[ ]'}  ${p.id}.jpg   ->  ${brand[p.brand]} - ${p.name}${p.ref ? ' (' + p.ref + ')' : ''}`)
}
const out = lines.join('\n')
fs.writeFileSync(path.join(root, 'LISTA-DE-FOTOS.txt'), out)
console.log(out)
console.log('\nGuardé esta lista en LISTA-DE-FOTOS.txt')
