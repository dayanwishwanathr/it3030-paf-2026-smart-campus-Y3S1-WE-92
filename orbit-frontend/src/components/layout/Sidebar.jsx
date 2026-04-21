import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import OrbitLogo from '../common/OrbitLogo'

// ── Role colors ─────────────────────────────────────────────────────────────
const ROLE_COLORS = {
  USER:       { hex: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)' },
  ADMIN:      { hex: '#a855f7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.25)' },
  MANAGER:    { hex: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
  TECHNICIAN: { hex: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
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

  const role     = user?.role ?? 'USER'
  const rColor   = ROLE_COLORS[role] ?? ROLE_COLORS.USER
  const links    = NAV[role]    ?? NAV.USER
  const initials = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <aside
      style={{
        position: 'fixed', left: 0, top: 0, height: '100%',
        width: '240px',
        background: '#0a1120',
        borderRight: '1px solid #1e2d45',
        display: 'flex', flexDirection: 'column',
        zIndex: 40,
      }}
    >
      {/* ── Logo area ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '18px 20px', borderBottom: '1px solid #1e2d45' }}>
        <OrbitLogo size={32} color="white" />
        <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
          <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#f59e0b' }}>SLIIT</span>
          <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#f1f5f9' }}>&nbsp;Orbit</span>
        </div>
      </div>

      {/* ── Role badge ── */}
      <div style={{ padding: '16px 16px 4px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px', borderRadius: '6px',
          fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em',
          textTransform: 'uppercase',
          background: rColor.bg,
          color: rColor.hex,
          border: `1px solid ${rColor.border}`
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: rColor.hex }} />
          {role}
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', margin: 0 }}>
          Navigation
        </p>

        {links.map(({ to, label, icon }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to + '/'))
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '13px', fontWeight: '500',
                textDecoration: 'none',
                background: isActive ? 'rgba(6,182,212,0.1)' : 'transparent',
                color: isActive ? '#22d3ee' : '#94a3b8',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' } }}
            >
              <span style={{ display: 'flex', width: '18px', height: '18px', opacity: isActive ? 1 : 0.7 }}>
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* ── User section ── */}
      <div style={{ padding: '12px', borderTop: '1px solid #1e2d45' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', 
          padding: '10px', borderRadius: '8px', 
          background: '#131929', border: '1px solid #1e2d45' 
        }}>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '600', color: '#fff',
              background: rColor.hex,
            }}>
              {initials}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Loading...'}
            </p>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || '...'}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '10px 12px', marginTop: '8px', borderRadius: '8px',
            fontSize: '13px', fontWeight: '500',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#64748b', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' }}
        >
          <span style={{ width: '16px', height: '16px' }}><SignOutIcon /></span>
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
