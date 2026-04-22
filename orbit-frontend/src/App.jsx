import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Auth pages
import LoginPage      from './pages/auth/LoginPage'
import RegisterPage   from './pages/auth/RegisterPage'
import OAuth2Success  from './pages/auth/OAuth2Success'

// Profile
import ProfilePage    from './pages/profile/ProfilePage'

// User pages
import DashboardPage  from './pages/dashboard/DashboardPage'
import CataloguePage  from './pages/resources/CataloguePage'

// Booking pages
import BookResourcePage   from './pages/bookings/BookResourcePage'
import MyBookingsPage     from './pages/bookings/MyBookingsPage'
import ManageBookingsPage from './pages/bookings/ManageBookingsPage'
import AvailabilityPage   from './pages/bookings/AvailabilityPage'

// Admin pages
import AdminDashboard     from './pages/admin/AdminDashboard'
import UserManagementPage from './pages/admin/UserManagementPage'
import CreateUserPage     from './pages/admin/CreateUserPage'

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard'

// Public pages
import PublicResourcePreviewPage from './pages/resources/PublicResourcePreviewPage'

// ── Module C: Tickets & Notifications ─────────────────────────────────────────
import ReportIssuePage         from './pages/tickets/ReportIssuePage'
import TicketDetailsPage       from './pages/tickets/TicketDetailsPage'
import TechnicianDashboardPage from './pages/tickets/TechnicianDashboardPage'
import NotificationsPage       from './pages/notifications/NotificationsPage'

const ALL_ROLES = ['USER', 'TECHNICIAN', 'ADMIN', 'MANAGER']

const App = () => {
  return (
    <AuthProvider>
      <Routes>

        {/* ── Public ──────────────────────────────────────────────── */}
        <Route path="/resources/preview/:id" element={<PublicResourcePreviewPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />

        {/* ── Profile (any authenticated user) ──────────────────────── */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={ALL_ROLES}>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* ── USER + TECHNICIAN ────────────────────────────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['USER', 'TECHNICIAN']}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute allowedRoles={ALL_ROLES}>
            <CataloguePage />
          </ProtectedRoute>
        } />

        <Route path="/bookings/new" element={
          <ProtectedRoute allowedRoles={ALL_ROLES} requireVerified>
            <BookResourcePage />
          </ProtectedRoute>
        } />

        <Route path="/bookings" element={
          <ProtectedRoute allowedRoles={ALL_ROLES} requireVerified>
            <MyBookingsPage />
          </ProtectedRoute>
        } />

        <Route path="/bookings/availability" element={
          <ProtectedRoute allowedRoles={ALL_ROLES} requireVerified>
            <AvailabilityPage />
          </ProtectedRoute>
        } />

        {/* ── Module C: Tickets ────────────────────────────────────── */}
        <Route path="/tickets" element={
          <ProtectedRoute allowedRoles={ALL_ROLES} requireVerified>
            <TechnicianDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/tickets/new" element={
          <ProtectedRoute allowedRoles={ALL_ROLES} requireVerified>
            <ReportIssuePage />
          </ProtectedRoute>
        } />
        <Route path="/tickets/:id" element={
          <ProtectedRoute allowedRoles={ALL_ROLES} requireVerified>
            <TicketDetailsPage />
          </ProtectedRoute>
        } />

        {/* ── Module D: Notifications ───────────────────────────────── */}
        <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={ALL_ROLES}>
            <NotificationsPage />
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
        <Route path="/admin/users/create" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <CreateUserPage />
          </ProtectedRoute>
        } />

        {/* ── ADMIN & MANAGER ──────────────────────────────────────── */}
        <Route path="/bookings/manage" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
            <ManageBookingsPage />
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
