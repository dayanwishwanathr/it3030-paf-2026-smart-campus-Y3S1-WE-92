import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'

// ── Icons ────────────────────────────────────────────────────────────────────
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
)
const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
)
const CalIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
    <rect x="3" y="4" width="14" height="14" rx="1" strokeWidth="1.5" />
    <line x1="14" y1="2" x2="14" y2="6" strokeWidth="1.5" />
    <line x1="6" y1="2" x2="6" y2="6" strokeWidth="1.5" />
    <line x1="3" y1="9" x2="17" y2="9" strokeWidth="1.5" />
  </svg>
)
const TicketIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 000-4V6z" />
  </svg>
)

// ── FeaturedCard (large hero-style card) ─────────────────────────────────────
const FeaturedCard = ({ icon, title, desc, to, stagger }) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full h-full text-left rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] ${stagger ?? ''}`}
      style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))',
        border: '1px solid rgba(168,85,247,0.25)',
      }}
    >
      <span
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
        style={{ background: 'rgba(168,85,247,0.15)', color: 'rgb(168,85,247)' }}
      >
        {icon}
      </span>
      <div>
        <h3 className="text-base font-bold text-white mb-1">{title}</h3>
        <p className="text-[13px]" style={{ color: '#64748b' }}>{desc}</p>
      </div>
      <span
        className="mt-auto text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: 'rgb(168,85,247)' }}
      >
        Manage →
      </span>
    </button>
  )
}

// ── ModuleCard (smaller accent card) ─────────────────────────────────────────
const ModuleCard = ({ icon, title, desc, to, accentRgb = '99,102,241', stagger }) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full text-left rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] ${stagger ?? ''}`}
      style={{
        background: `linear-gradient(135deg, rgba(${accentRgb},0.1), rgba(${accentRgb},0.03))`,
        border: `1px solid rgba(${accentRgb},0.22)`,
      }}
    >
      <span
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
        style={{ background: `rgba(${accentRgb},0.15)`, color: `rgb(${accentRgb})` }}
      >
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-bold text-white mb-0.5">{title}</h3>
        <p className="text-[12px]" style={{ color: '#64748b' }}>{desc}</p>
      </div>
      <span
        className="mt-auto text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: `rgb(${accentRgb})` }}
      >
        Open →
      </span>
    </button>
  ) 
}

// ── Page ─────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'Admin'

  return (
    <Layout>
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 hero-purple">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div
          className="absolute -right-10 -top-10 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'rgba(168,85,247,0.7)' }}
            >
              System Control
            </p>
            <h2 className="text-2xl font-bold text-white">Admin Panel — {firstName} 🛸</h2>
            <p className="text-[13px] mt-1" style={{ color: '#64748b' }}>
              Full system control — users, resources, bookings, tickets.
            </p>
            <span
              className="inline-flex items-center gap-1.5 mt-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{
                background: 'rgba(168,85,247,0.12)',
                border: '1px solid rgba(168,85,247,0.25)',
                color: 'rgb(168,85,247)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'rgb(168,85,247)', boxShadow: '0 0 6px rgb(168,85,247)' }}
              />
              ⚡ ADMIN
            </span>
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Users',     rgb: '168,85,247' },
              { label: 'Resources', rgb: '6,182,212'  },
              { label: 'Bookings',  rgb: '16,185,129' },
              { label: 'Tickets',   rgb: '245,158,11' },
            ].map(({ label, rgb }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-2xl px-4 py-3 min-w-[72px]"
                style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.22)` }}
              >
                <span
                  className="text-2xl font-black"
                  style={{ color: `rgb(${rgb})`, textShadow: `0 0 12px rgba(${rgb},0.5)` }}
                >
                  —
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                  style={{ color: `rgba(${rgb},0.7)` }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modules ── */}
      <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>
        Manage
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FeaturedCard
          icon={<UsersIcon />}
          title="User Management"
          desc="View all registered users, assign roles across all 4 tiers, and remove accounts when needed."
          to="/admin/users"
          stagger="card-stagger-1"
        />
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ModuleCard icon={<BuildingIcon />} title="Resources & Facilities" desc="Oversee all campus rooms, labs, equipment"  to="/resources"       accentRgb="6,182,212"   stagger="card-stagger-2" />
          <ModuleCard icon={<CalIcon />}      title="All Bookings"           desc="Full visibility of every booking request"   to="/bookings/manage" accentRgb="16,185,129"  stagger="card-stagger-3" />
          <ModuleCard icon={<TicketIcon />}   title="Incident Tickets"       desc="Monitor all maintenance and support issues" to="/tickets"         accentRgb="245,158,11"  stagger="card-stagger-4" />
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
