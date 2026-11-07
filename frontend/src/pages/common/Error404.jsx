import { Link } from 'react-router-dom'

export function Error404() {
  return <main className="auth-card not-found"><span className="auth-card__eyebrow">ERROR 404</span><h1>Esta página no existe.</h1><p>Vuelve al inicio y sigue explorando NOVA.</p><Link className="primary-link" to="/">Ir al inicio</Link></main>
}
