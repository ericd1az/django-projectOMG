import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { useAuth } from '../../hooks/useAuth'

export function Home() {
  const { auth } = useAuth()
  return (
    <div className="home-page">
      <header className="home-nav">
        <Link className="wordmark wordmark--light" to="/">
          <span className="wordmark__icon">N</span><span>NOVA<span className="wordmark__dot">.</span></span>
        </Link>
        <nav aria-label="Navegación principal">
          <a href="#destacados">Destacados</a>
          <Link to={auth ? '/dashboard' : '/login'}>{auth ? 'Mi espacio' : 'Iniciar sesión'}</Link>
          {!auth && <Link className="nav-signup" to="/register">Crear cuenta <Icon name="arrow right" /></Link>}
        </nav>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero__content">
            <span className="eyebrow"><span className="eyebrow__spark" /> TECNOLOGÍA PARA CADA DÍA</span>
            <h1>Tu próxima gran idea comienza con <em>buena tecnología.</em></h1>
            <p>Descubre una selección de productos pensada para trabajar, crear y disfrutar sin límites.</p>
            <div className="hero-actions">
              <Link className="primary-link" to={auth ? '/dashboard' : '/register'}>{auth ? 'Ir a mi espacio' : 'Explorar la tienda'} <Icon name="arrow right" /></Link>
              <a className="secondary-link" href="#destacados">Ver destacados</a>
            </div>
            <div className="hero-trust"><Icon name="check circle" /> Un espacio sencillo para encontrar lo que te inspira</div>
          </div>
          <div className="hero-art" aria-label="Selección de tecnología NOVA">
            <div className="hero-art__halo" />
            <div className="hero-art__float hero-art__float--top"><Icon name="bolt" /> NUEVAS IDEAS</div>
            <div className="hero-art__device"><div className="hero-art__screen"><span className="hero-art__screen-dot" /><span className="hero-art__screen-line" /><Icon name="laptop" /></div></div>
            <div className="hero-art__float hero-art__float--bottom"><span className="hero-art__product-icon"><Icon name="headphones" /></span><span><strong>Diseñado para ti</strong><small>Potencia tu día</small></span></div>
          </div>
        </section>

        <section id="destacados" className="home-features">
          <div className="section-heading"><span>EXPLORA NOVA</span><h2>Tecnología que acompaña tu ritmo.</h2></div>
          <div className="feature-grid">
            <article className="feature-card"><span><Icon name="laptop" /></span><h3>Para crear</h3><p>Herramientas para convertir tus proyectos en realidad.</p></article>
            <article className="feature-card"><span><Icon name="headphones" /></span><h3>Para disfrutar</h3><p>Una experiencia más inmersiva en cada momento.</p></article>
            <article className="feature-card"><span><Icon name="mobile alternate" /></span><h3>Para conectar</h3><p>Todo lo que necesitas para seguir en movimiento.</p></article>
          </div>
        </section>
      </main>
      <footer className="home-footer"><span>NOVA. Tecnología para cada día.</span><span>Hecho para explorar.</span></footer>
    </div>
  )
}
