import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import NotificationPanel from '../notifications/NotificationPanel'
import { useAuth } from '../../context/AuthContext'

const PAGE_TITLES = {
  '/dashboard':             { label: 'Dashboard',          icon: '⚡' },
  '/admin/dashboard':       { label: 'Dashboard',          icon: '⚡' },
  '/manager/dashboard':     { label: 'Dashboard',          icon: '⚡' },
  '/admin/users':           { label: 'User Management',    icon: '👥' },
  '/resources':             { label: 'Resources',          icon: '🏛️'  },
  '/bookings':              { label: 'Bookings',           icon: '📅' },
  '/bookings/manage':       { label: 'Manage Bookings',    icon: '📅' },
  '/bookings/new':          { label: 'New Booking',        icon: '➕' },
  '/bookings/availability': { label: 'Availability Viewer', icon: '📊' },
  '/tickets':               { label: 'Tickets',            icon: '🎫' },
  '/tickets/new':           { label: 'New Ticket',         icon: '➕' },
  '/profile':               { label: 'My Profile',         icon: '👤' },
}

const ROLE_AVATAR = {
  ADMIN:      'role-admin-avatar',
  MANAGER:    'role-manager-avatar',
  TECHNICIAN: 'role-tech-avatar',
  USER:       'role-user-avatar',
}

const TopBar = ({ onMenuClick }) => {
  const navigate       = useNavigate()
  const location       = useLocation()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropRef        = useRef(null)

  const role     = user?.role ?? 'USER'
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const page     = PAGE_TITLES[location.pathname]
  const title    = page?.label ?? 'SLIIT Orbit'
  const icon     = page?.icon  ?? '🛸'

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
      height: '64px',
      background: 'rgba(5,5,8,0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1e2d45',
    }}>
      {/* ── Left: page title + date ── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="show-on-mobile"
          style={{ background: 'transparent', border: 'none', color: '#f1f5f9', cursor: 'pointer', padding: '4px', marginRight: '4px' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base leading-none select-none">{icon}</span>
          <h1 className="text-[15px] font-bold truncate" style={{ color: '#f1f5f9' }}>
            {title}
          </h1>
        </div>
        <span className="hidden sm:block" style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
        <span className="hidden sm:block text-[12px] font-medium truncate" style={{ color: '#475569' }}>
          {today}
        </span>
      </div>

      {/* ── Right: availability shortcut + notifications + avatar dropdown ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Availability Viewer quick-access */}
        <button
          onClick={() => navigate('/bookings/availability')}
          title="Check Resource Availability"
          style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: location.pathname === '/bookings/availability' ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
            border: location.pathname === '/bookings/availability' ? '1px solid rgba(6,182,212,0.5)' : '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.12)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)' }}
          onMouseLeave={e => { if (location.pathname !== '/bookings/availability') { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' } }}
        >
          <svg style={{ width: '15px', height: '15px', color: '#06b6d4' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <NotificationPanel />

        {/* ── Avatar dropdown ── */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          {/* Avatar button — avatar only, no text */}
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              width: 36, height: 36, borderRadius: '50%', padding: 0,
              border: open ? '2px solid rgba(6,182,212,0.7)' : '2px solid rgba(255,255,255,0.12)',
              background: 'transparent', cursor: 'pointer', flexShrink: 0,
              boxShadow: open ? '0 0 0 3px rgba(6,182,212,0.15)' : 'none',
              transition: 'all 0.2s', overflow: 'hidden',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)' }}
            onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div className={`h-full w-full flex items-center justify-center text-[11px] font-bold text-white ${ROLE_AVATAR[role]}`}>
                {initials}
              </div>
            )}
          </button>

          {/* Dropdown menu */}
          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: 168, borderRadius: 12, overflow: 'hidden',
              background: '#0e0e1c', border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(6,182,212,0.06)',
              zIndex: 50, padding: '6px',
            }}>
              {/* My Profile */}
              <Link to="/profile" onClick={() => setOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 9, width: '100%',
                padding: '9px 10px', borderRadius: 9,
                fontSize: 13, fontWeight: 600, color: '#cbd5e1',
                textDecoration: 'none', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#f1f5f9' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 15, height: 15, color: '#06b6d4', flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                My Profile
              </Link>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '3px 0' }} />

              {/* Sign Out */}
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: 9, width: '100%',
                padding: '9px 10px', borderRadius: 9, border: 'none',
                fontSize: 13, fontWeight: 600, color: '#f87171',
                background: 'transparent', cursor: 'pointer', textAlign: 'left',
                fontFamily: "'Inter',sans-serif", transition: 'all 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 15, height: 15, flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar
