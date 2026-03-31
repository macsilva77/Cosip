import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MaintenanceOrders from './pages/MaintenanceOrders'
import MapView from './pages/MapView'
import UserRegistration from './pages/UserRegistration'
import EnergyBill from './pages/EnergyBill'
import Routing from './pages/Routing'
import Teams from './pages/Teams'
import Admin from './pages/Admin'
import CitizenPortal from './pages/CitizenPortal'

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function ProtectedRoute({ children, citizenOnly = false, staffOnly = false }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (citizenOnly && user.role !== 'citizen') return <Navigate to="/" replace />
  if (staffOnly && user.role === 'citizen') return <Navigate to="/portal" replace />
  return children
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('cosip_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  function login(userData) {
    setUser(userData)
    sessionStorage.setItem('cosip_user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    sessionStorage.removeItem('cosip_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<UserRegistration />} />
          <Route
            path="/portal"
            element={
              <ProtectedRoute citizenOnly>
                <CitizenPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute staffOnly>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="ordens" element={<MaintenanceOrders />} />
            <Route path="mapa" element={<MapView />} />
            <Route path="conta-energia" element={<EnergyBill />} />
            <Route path="roteirizacao" element={<Routing />} />
            <Route path="equipes" element={<Teams />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
