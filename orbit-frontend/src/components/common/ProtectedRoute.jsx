import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

// allowedRoles: optional array e.g. ['ADMIN'] or ['ADMIN','TECHNICIAN']
// If not passed, any logged-in user can access the route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  // Still checking auth — show spinner
  if (loading) return <LoadingSpinner />

  // Not logged in — redirect to login
  if (!user) return <Navigate to="/login" replace />

  // Logged in but wrong role — redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
