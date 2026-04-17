import { useLocation } from 'react-router-dom'
import NotificationPanel from '../notifications/NotificationPanel'
import { useAuth } from '../../context/AuthContext'

const PAGE_TITLES = {
  '/dashboard':         { label: 'Dashboard',       icon: '⚡' },
  '/admin/dashboard':   { label: 'Dashboard',       icon: '⚡' },
  '/manager/dashboard': { label: 'Dashboard',       icon: '⚡' },
  '/admin/users':       { label: 'User Management', icon: '👥' },
  '/resources':         { label: 'Resources',       icon: '🏛️'  },
  '/bookings':          { label: 'Bookings',        icon: '📅' },
  '/bookings/new':      { label: 'New Booking',     icon: '➕' },
  '/tickets':           { label: 'Tickets',         icon: '🎫' },
  '/tickets/new':       { label: 'New Ticket',      icon: '➕' },
}

const ROLE_AVATAR = {
  ADMIN:      'role-admin-avatar',
  MANAGER:    'role-manager-avatar',
  TECHNICIAN: 'role-tech-avatar',
  USER:       'role-user-avatar',
}

const TopBar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const role     = user?.role ?? 'USER'
  const initials = user?.name?.charAt(0).toUpperCase() ?? '?'
  const page     = PAGE_TITLES[location.pathname]
  const title    = page?.label ?? 'SLIIT Orbit'
  const icon     = page?.icon  ?? '🛸'

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6"
      style={{
        height: '56px',
        background: 'rgba(5,5,8,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* ── Left: page title + date ── */}
      <div className="flex items-center gap-3 min-w-0">
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

      {/* ── Right: notifications + avatar chip ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <NotificationPanel />

        {/* Avatar pill */}
        <div
          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all duration-150 cursor-default select-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-6 w-6 rounded-full object-cover flex-shrink-0"
              style={{ boxShadow: '0 0 0 1.5px rgba(6,182,212,0.5)' }}
            />
          ) : (
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${ROLE_AVATAR[role]}`}
            >
              {initials}
            </div>
          )}
          <span className="hidden sm:block text-[12px] font-semibold max-w-[100px] truncate" style={{ color: '#cbd5e1' }}>
            {user?.name?.split(' ')[0]}
          </span>
        </div>
      </div>
    </header>
  )
}

export default TopBar
