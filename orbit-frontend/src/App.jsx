import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Auth pages
import LoginPage      from './pages/auth/LoginPage'
import RegisterPage   from './pages/auth/RegisterPage'
import OAuth2Success  from './pages/auth/OAuth2Success'

// User pages
import DashboardPage  from './pages/dashboard/DashboardPage'

// Admin pages
import AdminDashboard      from './pages/admin/AdminDashboard'
import UserManagementPage  from './pages/admin/UserManagementPage'

const App = () => {
  return (
    <AuthProvider>
      <Routes>

        {/* ── Public routes ───────────────────────────────────────── */}
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/oauth2/success"  element={<OAuth2Success />} />

        {/* ── Protected — any logged-in user ──────────────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* ── Protected — ADMIN only ───────────────────────────────── */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserManagementPage />
          </ProtectedRoute>
        } />

        {/* ── Fallback ─────────────────────────────────────────────── */}
        <Route path="/"  element={<Navigate to="/dashboard" replace />} />
        <Route path="*"  element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </AuthProvider>
  )
}

export default App
