import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationPanel from '../notifications/NotificationPanel'
import OrbitLogo from '../common/OrbitLogo'

// ── Role colour tokens ──────────────────────────────────────────────────────
const ROLE_STYLES = {
  ADMIN:      { badge: 'bg-violet-500/15 text-violet-300 border-violet-500/25',  active: 'text-violet-400',  hover: 'hover:text-violet-300 hover:bg-violet-500/10', avatar: 'bg-violet-600' },
  MANAGER:    { badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25', active: 'text-emerald-400', hover: 'hover:text-emerald-300 hover:bg-emerald-500/10', avatar: 'bg-emerald-600' },
  TECHNICIAN: { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/25',    active: 'text-amber-400',   hover: 'hover:text-amber-300 hover:bg-amber-500/10',   avatar: 'bg-amber-600' },
  USER:       { badge: 'bg-sky-500/15 text-sky-300 border-sky-500/25',           active: 'text-sky-400',     hover: 'hover:text-sky-300 hover:bg-sky-500/10',       avatar: 'bg-sky-600' },
}

const Navbar = () => {
  const { user, logout }   = useAuth()
  const location           = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)

  const role    = user?.role ?? 'USER'
  const styles  = ROLE_STYLES[role] ?? ROLE_STYLES.USER
  const initials = user?.name?.charAt(0).toUpperCase() ?? '?'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Home route by role
  const homeRoute =
    role === 'ADMIN'   ? '/admin/dashboard'   :
    role === 'MANAGER' ? '/manager/dashboard' :
    '/dashboard'

  // Active link helper
  const linkClass = (path) =>
    `px-3 py-1.5 rounded-lg text-sm transition-colors ${
      location.pathname === path
        ? `${styles.active} bg-white/[0.06] font-semibold`
        : `text-slate-400 ${styles.hover}`
    }`

  // Nav links per role
  const navLinks = {
    ADMIN:      [{ to: '/admin/dashboard', label: 'Dashboard' }, { to: '/admin/users', label: 'Users' }],
    MANAGER:    [{ to: '/manager/dashboard', label: 'Dashboard' }, { to: '/resources', label: 'Resources' }, { to: '/bookings/manage', label: 'Bookings' }],
    TECHNICIAN: [{ to: '/dashboard', label: 'Dashboard' }, { to: '/tickets', label: 'Tickets' }],
    USER:       [{ to: '/dashboard', label: 'Dashboard' }, { to: '/resources', label: 'Resources' }, { to: '/bookings', label: 'My Bookings' }, { to: '/tickets', label: 'My Tickets' }],
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to={homeRoute} className="flex items-center gap-2.5 flex-shrink-0">
            <OrbitLogo size={32} color="white" />
            <div className="flex items-baseline gap-0">
              <span className="text-lg font-black text-amber-400 tracking-tight">SLIIT</span>
              <span className="text-lg font-black text-white tracking-tight">&nbsp;Orbit</span>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {(navLinks[role] ?? []).map(({ to, label }) => (
                <Link key={to} to={to} className={linkClass(to)}>
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            {user && <NotificationPanel />}

            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-slate-800 transition-all"
                >
                  {/* Avatar */}
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-700"
                    />
                  ) : (
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${styles.avatar}`}>
                      {initials}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-slate-200 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <svg
                    className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-800 border border-slate-700 shadow-xl py-1 overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-sm font-semibold text-slate-100 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                      <span className={`inline-flex items-center mt-2 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${styles.badge}`}>
                        {role}
                      </span>
                    </div>
                    {/* Logout */}
                    <button
                      onClick={() => { setMenuOpen(false); logout() }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            {user && (
              <button
                className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && user && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1">
          {(navLinks[role] ?? []).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm ${
                location.pathname === to
                  ? `${styles.active} bg-white/[0.06] font-semibold`
                  : `text-slate-300 ${styles.hover}`
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-1 border-t border-slate-800">
            <button
              onClick={() => { setMobileOpen(false); logout() }}
              className="block w-full text-left rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-slate-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
