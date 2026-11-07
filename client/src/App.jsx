import { useEffect, useState } from 'react'
import { BUSINESS } from './config'
import { CatalogProvider } from './context/CatalogContext'
import { ShopProvider } from './context/ShopContext'
import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Featured from './components/Featured'
import Catalog from './components/Catalog'
import BrandGrid from './components/BrandGrid'
import Repair from './components/Repair'
import WhyUs from './components/WhyUs'
import About from './components/About'
import HowToBuy from './components/HowToBuy'
import Faq from './components/Faq'
import Locations from './components/Locations'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'
import QuickView from './components/QuickView'
import CartDrawer from './components/CartDrawer'
import Admin from './components/Admin'

const isAdminHash = () => window.location.hash.startsWith('#/admin')

function Site() {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('todas')
  const [category, setCategory] = useState('Todas')
  const [how, setHow] = useState('pasos')

  const goCatalog = () => setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }), 60)
  const pickBrand = (id) => { setBrand(id); setCategory('Todas'); setQuery(''); goCatalog() }
  const pickCategory = (c) => { setCategory(c); setBrand('todas'); setQuery(''); goCatalog() }
  const openHow = (tab) => setHow(tab)

  // Datos estructurados para Google (negocio local)
  useEffect(() => {
    const ld = {
      '@context': 'https://schema.org',
      '@graph': BUSINESS.locations.map((l) => ({
        '@type': 'Store', name: `${BUSINESS.name} - ${l.name}`, telephone: l.phone, email: BUSINESS.email,
        address: { '@type': 'PostalAddress', streetAddress: l.address, addressLocality: 'Bogotá', addressCountry: 'CO' },
      })),
    }
    const s = document.createElement('script')
    s.type = 'application/ld+json'; s.text = JSON.stringify(ld)
    document.head.appendChild(s)
    return () => s.remove()
  }, [])

  return (
    <>
      <TopBar />
      <Navbar pickCategory={pickCategory} openHow={openHow} />
      <Hero query={query} setQuery={setQuery} category={category} pickCategory={pickCategory} pickBrand={pickBrand} goCatalog={goCatalog} />
      <Featured />
      <Catalog query={query} setQuery={setQuery} brand={brand} setBrand={setBrand} category={category} setCategory={setCategory} />
      <BrandGrid pickBrand={pickBrand} />
      <Repair />
      <WhyUs />
      <About />
      <HowToBuy how={how} setHow={setHow} />
      <Faq />
      <Locations />
      <Contact />
      <Footer pickCategory={pickCategory} openHow={openHow} />
      <WhatsAppFab />
      <QuickView />
      <CartDrawer />
    </>
  )
}

export default function App() {
  const [admin, setAdmin] = useState(isAdminHash())
  useEffect(() => {
    const on = () => setAdmin(isAdminHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return (
    <CatalogProvider>
      <ShopProvider>{admin ? <Admin /> : <Site />}</ShopProvider>
    </CatalogProvider>
  )
}
