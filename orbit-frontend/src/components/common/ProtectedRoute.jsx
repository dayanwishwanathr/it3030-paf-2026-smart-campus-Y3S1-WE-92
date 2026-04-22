import { Navigate } from 'react-router-dom'
import { useAuth }   from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

/**
 * allowedRoles    — optional array e.g. ['ADMIN'] or ['ADMIN','TECHNICIAN']
 * requireVerified — if true, unverified users are redirected to /dashboard
 *                   (they can still see the dashboard but not the guarded feature)
 */
const ProtectedRoute = ({ children, allowedRoles, requireVerified }) => {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />

  // Not logged in — send to login
  if (!user) return <Navigate to="/login" replace />

  // Wrong role — send to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  // Feature requires verified account — send back to dashboard with banner
  if (requireVerified && !user.verified) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
