import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Auth pages
import LoginPage      from './pages/auth/LoginPage'
import RegisterPage   from './pages/auth/RegisterPage'
import OAuth2Success  from './pages/auth/OAuth2Success'

// User pages
import DashboardPage  from './pages/dashboard/DashboardPage'
import CataloguePage  from './pages/resources/CataloguePage'

// Placeholder for Module B (Member 2)
const BookingPlaceholder = () => (
  <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>
    <h2>Booking Module</h2>
    <p>This flow (/bookings/new) will be implemented by Member 2.</p>
  </div>
)

// Admin pages
import AdminDashboard     from './pages/admin/AdminDashboard'
import UserManagementPage from './pages/admin/UserManagementPage'

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard'

const App = () => {
  return (
    <AuthProvider>
      <Routes>

        {/* ── Public ──────────────────────────────────────────────── */}
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />

        {/* ── USER + TECHNICIAN ────────────────────────────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['USER', 'TECHNICIAN']}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute allowedRoles={['USER', 'TECHNICIAN', 'ADMIN', 'MANAGER']}>
            <CataloguePage />
          </ProtectedRoute>
        } />

        <Route path="/bookings/new" element={
          <ProtectedRoute allowedRoles={['USER', 'TECHNICIAN', 'ADMIN', 'MANAGER']}>
            <BookingPlaceholder />
          </ProtectedRoute>
        } />

        {/* ── ADMIN only ───────────────────────────────────────────── */}
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

        {/* ── MANAGER only ─────────────────────────────────────────── */}
        <Route path="/manager/dashboard" element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerDashboard />
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
