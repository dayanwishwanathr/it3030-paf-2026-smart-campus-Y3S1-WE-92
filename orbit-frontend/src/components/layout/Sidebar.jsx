import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import OrbitLogo from '../common/OrbitLogo'

// ── Role tokens ─────────────────────────────────────────────────────────────
const ROLE = {
  USER:       { badge: 'role-user-badge',    active: 'role-user-active',    hover: 'role-user-hover',    dot: 'role-user-dot',    avatar: 'role-user-avatar'    },
  ADMIN:      { badge: 'role-admin-badge',   active: 'role-admin-active',   hover: 'role-admin-hover',   dot: 'role-admin-dot',   avatar: 'role-admin-avatar'   },
  MANAGER:    { badge: 'role-manager-badge', active: 'role-manager-active', hover: 'role-manager-hover', dot: 'role-manager-dot', avatar: 'role-manager-avatar' },
  TECHNICIAN: { badge: 'role-tech-badge',    active: 'role-tech-active',    hover: 'role-tech-hover',    dot: 'role-tech-dot',    avatar: 'role-tech-avatar'    },
}

// ── Nav links per role ───────────────────────────────────────────────────────
const NAV = {
  ADMIN:      [
    { to: '/admin/dashboard', label: 'Dashboard',  icon: <GridIcon /> },
    { to: '/admin/users',     label: 'Users',       icon: <UsersIcon /> },
    { to: '/resources',       label: 'Resources',   icon: <BuildingIcon /> },
    { to: '/bookings/manage', label: 'Bookings',    icon: <CalIcon /> },
    { to: '/tickets',         label: 'Tickets',     icon: <TicketIcon /> },
  ],
  MANAGER:    [
    { to: '/manager/dashboard', label: 'Dashboard',      icon: <GridIcon /> },
    { to: '/resources',         label: 'Resources',      icon: <BuildingIcon /> },
    { to: '/bookings/manage',   label: 'Bookings',       icon: <CalIcon /> },
  ],
  TECHNICIAN: [
    { to: '/dashboard', label: 'Dashboard', icon: <GridIcon /> },
    { to: '/tickets',   label: 'Tickets',   icon: <TicketIcon /> },
  ],
  USER:       [
    { to: '/dashboard',  label: 'Dashboard',    icon: <GridIcon /> },
    { to: '/resources',  label: 'Resources',    icon: <BuildingIcon /> },
    { to: '/bookings',   label: 'My Bookings',  icon: <CalIcon /> },
    { to: '/tickets',    label: 'My Tickets',   icon: <TicketIcon /> },
  ],
}

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const role    = user?.role ?? 'USER'
  const tokens  = ROLE[role]   ?? ROLE.USER
  const links   = NAV[role]    ?? NAV.USER
  const initials = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-40"
      style={{
        width: '240px',
        background: 'rgba(5,5,8,0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* ── Logo area ── */}
      <div className="flex items-center gap-2.5 px-5 py-[18px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <OrbitLogo size={38} color="white" />
        <div className="flex items-baseline leading-none">
          <span className="text-[17px] font-black tracking-tight" style={{ color: '#f59e0b' }}>SLIIT</span>
          <span className="text-[17px] font-black tracking-tight text-white">&nbsp;Orbit</span>
        </div>
      </div>

      {/* ── Role badge ── */}
      <div className="px-4 pt-4 pb-1">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${tokens.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full anim-dot-pulse ${tokens.dot}`} />
          {role}
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>
          Navigation
        </p>

        {links.map(({ to, label, icon }, idx) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to + '/'))
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 relative ${
                isActive
                  ? `nav-item-active ${tokens.active}`
                  : `text-slate-500 ${tokens.hover}`
              }`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <span className="h-4 w-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-110">
                {icon}
              </span>
              <span>{label}</span>
              {isActive && (
                <span className={`ml-auto h-1.5 w-1.5 rounded-full ${tokens.dot}`} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── User section ── */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* User info row */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
              style={{ boxShadow: '0 0 0 2px rgba(6,182,212,0.4)' }}
            />
          ) : (
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${tokens.avatar}`}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold truncate" style={{ color: '#e2e8f0' }}>{user?.name}</p>
            <p className="text-[11px] truncate"  style={{ color: '#475569'  }}>{user?.email}</p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="mt-1.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150"
          style={{ color: '#475569' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#f87171'
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#475569'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <SignOutIcon />
          Sign out
        </button>
      </div>
    </aside>
  )
}

// ── SVG Icons ────────────────────────────────────────────────────────────────
function GridIcon()     { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function UsersIcon()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> }
function BuildingIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg> }
function CalIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function TicketIcon()   { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg> }
function SignOutIcon()  { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> }

export default Sidebar
