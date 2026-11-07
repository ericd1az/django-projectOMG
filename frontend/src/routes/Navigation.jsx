import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AdminLayout } from '../layouts/AdminLayout'
import { ClientLayout } from '../layouts/ClientLayout'
import { CommonLayout } from '../layouts/CommonLayout'
import { Dashboard } from '../pages/admin/Dashboard'
import { Home } from '../pages/client/Home'
import { Login } from '../pages/common/Login'
import { Register } from '../pages/common/Register'
import { Error404 } from '../pages/common/Error404'

function ProtectedRoute({ children }) {
  const { auth } = useAuth()
  const location = useLocation()
  if (auth === undefined) return <div className="app-loading">Preparando tu espacio…</div>
  if (!auth) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

function GuestRoute({ children }) {
  const { auth } = useAuth()
  if (auth === undefined) return <div className="app-loading">Preparando tu espacio…</div>
  if (auth) return <Navigate to="/dashboard" replace />
  return children
}

export function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
        <Route path="/login" element={<GuestRoute><CommonLayout><Login /></CommonLayout></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><CommonLayout><Register /></CommonLayout></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="*" element={<CommonLayout><Error404 /></CommonLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
