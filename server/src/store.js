// Almacenamiento SIN base de datos: un archivo JSON.
//  - Fuente de verdad: shared/catalog.seed.json (va en tu repositorio).
//  - Los cambios del panel se guardan también en server/data/catalog.json.
//  - Si configuras GITHUB_TOKEN, los cambios se envían como commit al repositorio,
//    así NO se pierden aunque el hosting gratuito reinicie el servidor.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SEED_FILE = path.resolve(__dirname, '../../shared/catalog.seed.json')
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve(__dirname, '../data')
const DB_FILE = path.join(DATA_DIR, 'catalog.json')
const MSG_FILE = path.join(DATA_DIR, 'messages.json')

let db = { brands: [], categories: [], products: [] }
let messages = []
let queue = Promise.resolve()
let ghTimer = null
let ghState = { lastOk: null, lastError: null }

export const githubEnabled = () => !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO)

const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'))
async function writeJson(file, data) {
  const tmp = `${file}.tmp`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2))
  await fs.rename(tmp, file)
}
const enqueue = (fn) => (queue = queue.then(fn, fn))

export async function init() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  // Con GitHub, el repositorio manda; sin GitHub, manda el último guardado local.
  if (githubEnabled()) db = await readJson(SEED_FILE)
  else {
    try { db = await readJson(DB_FILE) } catch { db = await readJson(SEED_FILE) }
  }
  try { messages = await readJson(MSG_FILE) } catch { messages = [] }
}

async function pushToGithub() {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH = 'main', GITHUB_PATH = 'shared/catalog.seed.json' } = process.env
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json',
    'User-Agent': 'digital-control', 'X-GitHub-Api-Version': '2022-11-28',
  }
  try {
    const cur = await fetch(`${url}?ref=${GITHUB_BRANCH}`, { headers })
    const sha = cur.ok ? (await cur.json()).sha : undefined
    const res = await fetch(url, {
      method: 'PUT', headers,
      body: JSON.stringify({
        message: 'Actualizar catálogo desde el panel de administración',
        content: Buffer.from(JSON.stringify(db, null, 2)).toString('base64'),
        sha, branch: GITHUB_BRANCH,
      }),
    })
    if (!res.ok) throw new Error(`GitHub respondió ${res.status}`)
    ghState = { lastOk: new Date().toISOString(), lastError: null }
  } catch (e) {
    ghState = { ...ghState, lastError: e.message }
    console.error('No se pudo guardar en GitHub:', e.message)
  }
}

// Guarda en disco al instante y en GitHub unos segundos después (agrupa varios cambios seguidos).
function persist() {
  const job = enqueue(() => writeJson(DB_FILE, db))
  if (githubEnabled()) {
    clearTimeout(ghTimer)
    ghTimer = setTimeout(pushToGithub, 15000)
  }
  return job
}

export const getDb = () => db
export const getStatus = () => ({ persist: githubEnabled() ? 'github' : 'local', github: ghState })
export const publicCatalog = () => ({
  brands: db.brands, categories: db.categories, products: db.products.filter((p) => p.active !== false),
})

export async function mutate(fn) {
  const result = fn(db)
  await persist()
  return result
}
export async function replaceAll(next) {
  db = next
  await persist()
}
export const nextProductId = () => db.products.reduce((m, p) => Math.max(m, p.id), 0) + 1

// ----- mensajes y pedidos -----
export const getMessages = () => messages
export async function addMessage(m) {
  const msg = { id: Date.now().toString(36), createdAt: new Date().toISOString(), ...m }
  messages = [msg, ...messages].slice(0, 300)
  await enqueue(() => writeJson(MSG_FILE, messages))
  return msg
}
export async function removeMessage(id) {
  messages = messages.filter((m) => m.id !== id)
  await enqueue(() => writeJson(MSG_FILE, messages))
}
