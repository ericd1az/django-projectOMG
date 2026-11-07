import { Link } from 'react-router-dom'

export function CommonLayout({ children }) {
  return (
    <div className="common-layout">
      <Link className="wordmark" to="/" aria-label="Volver al inicio de NOVA">
        <span className="wordmark__icon">N</span><span>NOVA<span className="wordmark__dot">.</span></span>
      </Link>
      {children}
      <div className="common-layout__glow" aria-hidden="true" />
    </div>
  )
}
