import { Link, useNavigate } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { useAuth } from '../hooks/useAuth'

export function AdminLayout({ children }) {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Link className="wordmark wordmark--light" to="/dashboard">
          <span className="wordmark__icon">N</span><span>NOVA<span className="wordmark__dot">.</span></span>
        </Link>
        <span className="sidebar__caption">MI ESPACIO</span>
        <span className="sidebar__link sidebar__link--active"><Icon name="grid layout" /> Resumen</span>
        <a className="sidebar__link" href="#catalogo"><Icon name="shopping bag" /> Mi tienda</a>
        <div className="sidebar__bottom">
          <div className="sidebar__avatar">{(auth.me.first_name || auth.me.username || 'U').charAt(0).toUpperCase()}</div>
          <div className="sidebar__person"><strong>{auth.me.first_name || auth.me.username}</strong><span>{auth.me.email}</span></div>
          <button className="sidebar__logout" onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión"><Icon name="sign out" /></button>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <span><Icon name="shield alternate" /> Área privada de tu tienda</span>
          <button className="topbar-logout" onClick={handleLogout}>Cerrar sesión <Icon name="sign out" /></button>
        </header>
        {children}
      </div>
    </div>
  )
}
