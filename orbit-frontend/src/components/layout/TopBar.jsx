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
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useAuth()

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
      style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', // Add horizontal padding explicitly
        height: '64px',
        background: 'rgba(5,5,8,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1e2d45',
      }}
    >
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

      {/* ── Right: availability shortcut + notifications + avatar chip ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Availability Viewer quick-access icon */}
        <button
          onClick={() => navigate('/bookings/availability')}
          title="Check Resource Availability"
          style={{
            width: '34px', height: '34px',
            borderRadius: '8px',
            background: location.pathname === '/bookings/availability'
              ? 'rgba(6,182,212,0.15)'
              : 'rgba(255,255,255,0.04)',
            border: location.pathname === '/bookings/availability'
              ? '1px solid rgba(6,182,212,0.5)'
              : '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
            boxShadow: location.pathname === '/bookings/availability'
              ? '0 0 10px rgba(6,182,212,0.2)'
              : 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(6,182,212,0.12)'
            e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'
          }}
          onMouseLeave={e => {
            if (location.pathname !== '/bookings/availability') {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            }
          }}
        >
          <svg style={{ width: '15px', height: '15px', color: '#06b6d4' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <NotificationPanel />

        {/* Avatar pill — links to /profile */}
        <Link to="/profile"
          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all duration-150 select-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor='rgba(6,182,212,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)' }}
        >
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name}
              className="h-6 w-6 rounded-full object-cover flex-shrink-0"
              style={{ boxShadow: '0 0 0 1.5px rgba(6,182,212,0.5)' }}
            />
          ) : (
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${ROLE_AVATAR[role]}`}>
              {initials}
            </div>
          )}
          <div className="hidden sm:flex flex-col" style={{ lineHeight: 1.2 }}>
            <span className="text-[12px] font-semibold max-w-[100px] truncate" style={{ color: '#cbd5e1' }}>
              {user?.name?.split(' ')[0]}
            </span>
            {user?.campusId && (
              <span className="text-[10px] font-medium" style={{ color: '#475569' }}>{user.campusId}</span>
            )}
            {!user?.verified && (
              <span className="text-[10px] font-bold" style={{ color: '#f59e0b' }}>Unverified</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  )
}

export default TopBar
