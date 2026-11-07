import { useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { getCapitalApi, getProductsApi } from '../../api/user'
import { getWeather } from '../../api/weather'
import { useAuth } from '../../hooks/useAuth'

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    getWeather(controller.signal)
      .then(setWeather)
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message) })
    return () => controller.abort()
  }, [])

  const weatherIcon = weather && weather.weather_code > 3 ? 'cloud' : 'sun'
  return (
    <section className="widget weather-widget" aria-label="Clima actual de Hermosillo">
      <div className="widget__top"><span className="widget__icon"><Icon name={weatherIcon || 'sun'} /></span><span className="widget__tag">API EXTERNA</span></div>
      <div className="widget__eyebrow">HERMOSILLO, SONORA</div>
      {weather ? <><strong className="weather-widget__temp">{Math.round(weather.temperature_2m)}°</strong><span className="weather-widget__detail">Temperatura actual · Humedad {weather.relative_humidity_2m}%</span></> : <p className="widget__message">{error || 'Consultando el clima actual…'}</p>}
      <small>Datos en tiempo real: Open-Meteo</small>
    </section>
  )
}

function SoapWidget({ token }) {
  const [code, setCode] = useState('MX')
  const [capital, setCapital] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function search(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await getCapitalApi(token, code.trim().toUpperCase())
      setCapital(result)
    } catch (err) {
      setCapital(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="widget soap-widget" aria-label="Consulta de capitales por SOAP">
      <div className="widget__top"><span className="widget__icon widget__icon--purple"><Icon name="globe" /></span><span className="widget__tag">SERVICIO SOAP</span></div>
      <h3>Explora el mundo</h3>
      <p>Consulta la capital de un país con su código de dos letras.</p>
      <form className="soap-form" onSubmit={search}>
        <input aria-label="Código de país" maxLength="2" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="MX" />
        <button type="submit" disabled={loading}>{loading ? 'Buscando…' : 'Consultar'}</button>
      </form>
      {capital && <div className="soap-result"><strong>{capital.capital}</strong><span>Capital de {capital.codigo_pais} · respuesta SOAP</span></div>}
      {error && <div className="soap-error">{error}</div>}
    </section>
  )
}

export function Dashboard() {
  const { auth } = useAuth()
  const [products, setProducts] = useState([])
  const [productsError, setProductsError] = useState('')

  useEffect(() => {
    let active = true
    getProductsApi(auth.token)
      .then((data) => { if (active) setProducts(Array.isArray(data) ? data : data.results || []) })
      .catch((error) => { if (active) setProductsError(error.message) })
    return () => { active = false }
  }, [auth.token])

  const firstName = auth.me.first_name || auth.me.username || auth.me.email.split('@')[0]
  return (
    <main className="dashboard-content">
      <div className="dashboard-heading"><span className="eyebrow eyebrow--dark">TU ESPACIO NOVA</span><h1>Hola, {firstName}<span className="wave">✳</span></h1><p>Este es tu punto de partida para descubrir la tecnología que te gusta.</p></div>
      <div className="dashboard-grid">
        <section className="welcome-card"><span className="welcome-card__label"><Icon name="star" /> BIENVENIDO A NOVA</span><h2>Todo lo que te inspira,<br /><em>en un solo lugar.</em></h2><p>Explora tu catálogo y mantente al día desde tu espacio personal.</p><div className="welcome-card__orb" aria-hidden="true"><Icon name="bolt" /></div></section>
        <WeatherWidget />
        <SoapWidget token={auth.token} />
      </div>
      <section id="catalogo" className="catalog-section">
        <div className="catalog-section__heading"><div><span className="eyebrow eyebrow--dark">EN TU TIENDA</span><h2>Productos para descubrir</h2></div><span className="catalog-count">{products.length} productos</span></div>
        {productsError ? <p className="catalog-empty">No se pudo cargar el catálogo: {productsError}</p> : products.length ? <div className="product-grid">{products.slice(0, 4).map((product, index) => <article className="product-card" key={product.id}><div className={`product-card__art product-card__art--${index % 4}`}><Icon name={index % 2 ? 'headphones' : 'laptop'} /></div><span className="product-card__category">{product.category}</span><h3>{product.name}</h3><span className="product-card__price">{money.format(Number(product.price))}</span></article>)}</div> : <p className="catalog-empty">Cargando productos…</p>}
      </section>
      <footer className="dashboard-footer">NOVA · Tu tienda de tecnología</footer>
    </main>
  )
}
