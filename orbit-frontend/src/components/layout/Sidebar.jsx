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

// ── Icons ───────────────────────────────────────────────────────────────────
const GridIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
const UsersIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const BuildingIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
const CalIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const TicketIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
const SignOutIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>

// ── Nav mapping ─────────────────────────────────────────────────────────────
const NAV = {
  ADMIN:      [
    { to: '/admin/dashboard', label: 'Dashboard',  icon: <GridIcon /> },
    { to: '/admin/users',     label: 'Users',       icon: <UsersIcon /> },
    { to: '/resources',       label: 'Resources',   icon: <BuildingIcon /> },
    { to: '/bookings',        label: 'Bookings',    icon: <CalIcon /> },
    { to: '/tickets',         label: 'Tickets',     icon: <TicketIcon /> },
  ],
  MANAGER:    [
    { to: '/manager/dashboard', label: 'Dashboard',      icon: <GridIcon /> },
    { to: '/resources',         label: 'Resources',      icon: <BuildingIcon /> },
    { to: '/bookings',          label: 'Bookings',       icon: <CalIcon /> },
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
      className="fixed left-0 top-0 h-full flex flex-col z-40 shadow-2xl transition-all duration-300 border-r border-white/5"
      style={{
        width: '240px',
        background: 'rgba(5,5,8,0.92)',
        backdropFilter: 'blur(30px)',
      }}
    >
      {/* ── Logo Area ── */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <OrbitLogo size={32} color="white" />
        <div className="flex flex-col leading-none">
          <span className="text-[17px] font-black tracking-tight text-white">ORBIT</span>
          <span className="text-[9px] font-black tracking-[0.2em] text-[#f59e0b] -mt-0.5">SMART CAMPUS</span>
        </div>
      </div>

      {/* ── Current User Summary ── */}
      <div className="px-5 pt-6 pb-2">
         <div className="flex items-center gap-3 mb-4 p-2 rounded-2xl bg-white/[0.04] border border-white/5">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg ${tokens.avatar}`}>
               {initials}
            </div>
            <div className="min-w-0">
               <p className="text-[13px] font-bold text-white truncate leading-none mb-1">{user?.name?.split(' ')[0]}</p>
               <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${tokens.badge}`}>
                  {role}
               </span>
            </div>
         </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
        <p className="px-3 pt-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
          Main Menu
        </p>

        {links.map(({ to, label, icon }, idx) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to + '/'))
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all relative ${
                isActive
                  ? `bg-cyan-500/10 text-cyan-400 border border-cyan-500/20`
                  : `text-slate-500 hover:text-white hover:bg-white/[0.04] border border-transparent`
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                {icon}
              </span>
              <span className="truncate">{label}</span>
              {isActive && (
                <span className="ml-auto w-1 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Footer / Actions ── */}
      <div className="p-4 mt-auto border-t border-white/5 space-y-2">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
        >
          <SignOutIcon />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
