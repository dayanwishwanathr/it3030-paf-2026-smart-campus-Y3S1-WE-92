import { useLocation } from 'react-router-dom'
import NotificationPanel from '../notifications/NotificationPanel'
import { useAuth } from '../../context/AuthContext'

const PAGE_TITLES = {
  '/dashboard':         { label: 'Dashboard',       icon: '📡' },
  '/admin/dashboard':   { label: 'Dashboard',       icon: '📡' },
  '/manager/dashboard': { label: 'Dashboard',       icon: '📡' },
  '/admin/users':       { label: 'User Management', icon: '👤' },
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
      className="sticky top-0 z-30 flex items-center justify-between px-8 border-b border-white/5"
      style={{
        height: '64px',
        background: 'rgba(5,5,8,0.7)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* ── Left: Breadcrumbs / Title ── */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-xl leading-none grayscale opacity-60 group-hover:grayscale-0 transition-all">{icon}</span>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-white tracking-tight uppercase leading-none">
              {title}
            </h1>
            <span className="hidden sm:block text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">
              {today}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Operations / User ── */}
      <div className="flex items-center gap-4">
        <NotificationPanel />

        {/* User Chip */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
           <div className="flex flex-col items-end hidden sm:flex">
              <p className="text-xs font-bold text-white leading-none mb-1">{user?.name}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user?.email}</p>
           </div>
           
           <div className="relative group cursor-pointer">
             {user?.profilePicture ? (
               <img
                 src={user.profilePicture}
                 alt={user.name}
                 className="h-9 w-9 rounded-xl object-cover ring-2 ring-white/5 group-hover:ring-cyan-500/50 transition-all"
               />
             ) : (
               <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg ${ROLE_AVATAR[role]} ring-2 ring-white/5 group-hover:ring-cyan-500/50 transition-all`}>
                 {initials}
               </div>
             )}
             {/* Simple online indicator */}
             <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#050508] rounded-full shadow-[0_0_8px_#10b981]" />
           </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
