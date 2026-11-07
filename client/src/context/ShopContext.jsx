import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useCatalog } from './CatalogContext'

const Ctx = createContext(null)
export const useShop = () => useContext(Ctx)

const load = () => {
  try { return JSON.parse(localStorage.getItem('dc_cart') || '[]') } catch { return [] }
}

// Carrito (guardado en el navegador), cajón del carrito y "vista rápida" de producto.
export function ShopProvider({ children }) {
  const { products } = useCatalog()
  const [items, setItems] = useState(load)
  const [drawer, setDrawer] = useState(false)
  const [quick, setQuick] = useState(null)

  useEffect(() => {
    try { localStorage.setItem('dc_cart', JSON.stringify(items)) } catch { /* sin almacenamiento */ }
  }, [items])

  const add = useCallback((id, qty = 1) => {
    setItems((cur) => {
      const f = cur.find((i) => i.id === id)
      return f ? cur.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i)) : [...cur, { id, qty }]
    })
    setDrawer(true)
  }, [])
  const setQty = useCallback((id, qty) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty: Math.min(Math.max(qty, 1), 99) } : i))), [])
  const remove = useCallback((id) => setItems((cur) => cur.filter((i) => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const lines = useMemo(
    () => items.map((i) => ({ product: products.find((p) => p.id === i.id), qty: i.qty })).filter((l) => l.product),
    [items, products]
  )
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const total = lines.reduce((s, l) => s + l.qty * l.product.price, 0)

  return (
    <Ctx.Provider value={{ lines, count, total, add, setQty, remove, clear, drawer, setDrawer, quick, setQuick }}>
      {children}
    </Ctx.Provider>
  )
}
