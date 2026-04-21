import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'

// ── Module card (featured tall) ───────────────────────────────────────────────
const FeaturedCard = ({ icon, title, desc, to, stagger }) => (
  <Link to={to} className={`glass-card-btn flex flex-col justify-between p-6 row-span-2 min-h-[200px] ${stagger}`}>
    <div>
      <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', boxShadow: '0 0 20px rgba(168,85,247,0.12)' }}>
        {icon}
      </div>
      <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
      <p className="text-[13px] mt-2 leading-relaxed" style={{ color: '#475569' }}>{desc}</p>
    </div>
    <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'rgb(168,85,247)' }}>
      <span>Manage</span>
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
      </svg>
    </div>
  </Link>
)

// ── Module card (regular) ─────────────────────────────────────────────────────
const ModuleCard = ({ icon, title, desc, to, accentRgb, stagger }) => (
  <Link to={to} className={`glass-card-btn flex items-center gap-4 p-5 group ${stagger}`}>
    <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `rgba(${accentRgb},0.10)`, border: `1px solid rgba(${accentRgb},0.25)` }}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[13px] font-semibold text-white leading-tight">{title}</p>
      <p className="text-[11px] mt-0.5 truncate" style={{ color: '#475569' }}>{desc}</p>
    </div>
    <svg className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: `rgb(${accentRgb})` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  </Link>
)

const AdminDashboard = () => {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'Admin'

  return (
    <Layout>
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 hero-purple">
        <div className="absolute inset-0 dot-grid opacity-40"/>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)' }}/>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(168,85,247,0.7)' }}>
              System Control
            </p>
            <h2 className="text-2xl font-bold text-white">Admin Panel — {firstName} 🛸</h2>
            <p className="text-[13px] mt-1" style={{ color: '#64748b' }}>Full system control — users, resources, bookings, tickets.</p>
            <span className="inline-flex items-center gap-1.5 mt-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: 'rgb(168,85,247)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgb(168,85,247)', boxShadow: '0 0 6px rgb(168,85,247)' }}/>
              ⚡ ADMIN
            </span>
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Users',     rgb: '168,85,247' },
              { label: 'Resources', rgb: '6,182,212'   },
              { label: 'Bookings',  rgb: '16,185,129'  },
              { label: 'Tickets',   rgb: '245,158,11'  },
            ].map(({ label, rgb }) => (
              <div key={label} className="flex flex-col items-center rounded-2xl px-4 py-3 min-w-[72px]"
                style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.22)` }}>
                <span className="text-2xl font-black" style={{ color: `rgb(${rgb})`, textShadow: `0 0 12px rgba(${rgb},0.5)` }}>—</span>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: `rgba(${rgb},0.7)` }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modules ── */}
      <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>Manage</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FeaturedCard
          icon={<UsersSVG/>} title="User Management"
          desc="View all registered users, assign roles across all 4 tiers, and remove accounts when needed."
          to="/admin/users" stagger="card-stagger-1"
        />
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ModuleCard icon={<BuildingSVG/>} title="Resources & Facilities" desc="Oversee all campus rooms, labs, equipment" to="/resources" accentRgb="6,182,212"  stagger="card-stagger-2"/>
          <ModuleCard icon={<CalSVG/>}      title="All Bookings"          desc="Full visibility of every booking request"    to="/bookings/manage" accentRgb="16,185,129" stagger="card-stagger-3"/>
          <ModuleCard icon={<TicketSVG/>}   title="Incident Tickets"      desc="Monitor all maintenance and support issues"  to="/tickets"  accentRgb="245,158,11" stagger="card-stagger-4"/>
        </div>
      </div>
    </Layout>
  )
}

// ── SVG Icons ────────────────────────────────────────────────────────────────
const UsersSVG    = () => <svg className="h-6 w-6" style={{ color: 'rgb(168,85,247)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const BuildingSVG = () => <svg className="h-5 w-5" style={{ color: 'rgb(6,182,212)' }}  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
const CalSVG      = () => <svg className="h-5 w-5" style={{ color: 'rgb(16,185,129)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const TicketSVG   = () => <svg className="h-5 w-5" style={{ color: 'rgb(245,158,11)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>

export default AdminDashboard
