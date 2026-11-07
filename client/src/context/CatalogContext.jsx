import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import seed from '../../../shared/catalog.seed.json'
import { api } from '../api'

const Ctx = createContext(null)
export const useCatalog = () => useContext(Ctx)

const clean = (c) => ({ ...c, products: c.products.filter((p) => p.active !== false) })

// Muestra al instante el catálogo incluido en la página y, cuando el servidor responde
// (puede tardar si el hosting gratuito estaba "dormido"), lo reemplaza por el más reciente.
export function CatalogProvider({ children }) {
  const [data, setData] = useState({ ...clean(seed), source: 'local' })
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    let off = false
    api('/catalog', { timeout: 70000 })
      .then((c) => { if (!off && c.products?.length) setData({ ...clean(c), source: 'api' }) })
      .catch(() => {})
    return () => { off = true }
  }, [version])

  const value = useMemo(
    () => ({ ...data, brandMap: Object.fromEntries(data.brands.map((b) => [b.id, b])), refresh }),
    [data, refresh]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
