import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationPanel from '../notifications/NotificationPanel'

const Navbar = () => {
  const { user, logout }  = useAuth()
  const location          = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) =>
    location.pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-gray-600 hover:text-blue-600'

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
            className="flex items-center gap-2 font-bold text-xl text-gray-900"
          >
            🛰️ <span>SLIIT Orbit</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {user?.role === 'ADMIN' ? (
              <>
                <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
                <Link to="/admin/users"     className={isActive('/admin/users')}>Users</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard"  className={isActive('/dashboard')}>Dashboard</Link>
              </>
            )}
          </div>

          {/* Right side — notifications + user menu */}
          <div className="flex items-center gap-3">
            <NotificationPanel />

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-full pl-2 pr-3 py-1.5 transition"
              >
                {/* Avatar */}
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      user?.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : user?.role === 'TECHNICIAN'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); logout() }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
