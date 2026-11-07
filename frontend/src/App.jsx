import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthProvider'
import { Navigation } from './routes/Navigation'
import './App.scss'

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <ToastContainer position="bottom-right" autoClose={4000} theme="colored" />
    </AuthProvider>
  )
}

export default App
