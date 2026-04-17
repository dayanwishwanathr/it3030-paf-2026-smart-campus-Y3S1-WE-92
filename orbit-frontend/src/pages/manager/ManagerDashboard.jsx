import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'

const FeaturedCard = ({ icon, title, desc, to, stagger }) => (
  <Link to={to} className={`glass-card-btn flex flex-col justify-between p-6 row-span-2 min-h-[200px] ${stagger}`}>
    <div>
      <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 20px rgba(16,185,129,0.12)' }}>
        {icon}
      </div>
      <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
      <p className="text-[13px] mt-2 leading-relaxed" style={{ color: '#475569' }}>{desc}</p>
    </div>
    <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'rgb(16,185,129)' }}>
      <span>Manage</span>
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
      </svg>
    </div>
  </Link>
)

const ActionCard = ({ icon, title, desc, to, accentRgb, stagger }) => (
  <Link to={to} className={`glass-card-btn flex items-center gap-4 p-5 group ${stagger}`}>
    <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `rgba(${accentRgb},0.10)`, border: `1px solid rgba(${accentRgb},0.25)` }}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[13px] font-semibold text-white">{title}</p>
      <p className="text-[11px] mt-0.5 truncate" style={{ color: '#475569' }}>{desc}</p>
    </div>
    <svg className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: `rgb(${accentRgb})` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  </Link>
)

const PermRow = ({ can, text }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
      style={{
        background: can ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)',
        border:     can ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.2)',
        color:      can ? '#10b981' : '#ef4444',
      }}>
      {can ? '✓' : '✗'}
    </span>
    <p className="text-[12px] leading-relaxed" style={{ color: '#64748b' }}>{text}</p>
  </div>
)

const ManagerDashboard = () => {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'Manager'

  const perms = [
    { can: true,  text: 'Create and update campus resources (rooms, labs, equipment)' },
    { can: true,  text: 'Set resource availability windows and status' },
    { can: true,  text: 'Review and approve or reject booking requests' },
    { can: false, text: 'Cannot manage users or assign roles — Admin only' },
  ]

  return (
    <Layout>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 hero-emerald">
        <div className="absolute inset-0 dot-grid opacity-40"/>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)' }}/>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(16,185,129,0.7)' }}>
              Resource Control
            </p>
            <h2 className="text-2xl font-bold text-white">Welcome, {firstName} 👋</h2>
            <p className="text-[13px] mt-1" style={{ color: '#64748b' }}>Manage campus resources and review booking requests.</p>
            <span className="inline-flex items-center gap-1.5 mt-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: 'rgb(16,185,129)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgb(16,185,129)', boxShadow: '0 0 6px rgb(16,185,129)' }}/>
              🏗️ MANAGER
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Resources', rgb: '16,185,129' },
              { label: 'Bookings', rgb: '6,182,212'   },
              { label: 'Pending',  rgb: '245,158,11'  },
              { label: 'Approved', rgb: '168,85,247'  },
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

      {/* ── Content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: actions */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeaturedCard
              icon={<BuildingSVG/>}
              title="Resources"
              desc="Add, edit, or deactivate campus facilities and equipment. Set availability and capacity."
              to="/resources" stagger="card-stagger-1"
            />
            <ActionCard
              icon={<CalSVG/>}
              title="Booking Requests"
              desc="Review pending bookings, approve or reject with reason"
              to="/bookings" accentRgb="6,182,212" stagger="card-stagger-2"
            />
          </div>
        </div>

        {/* Right: permissions */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>Your Permissions</p>
          <div className="glass-card p-5 space-y-4">
            {perms.map((p, i) => <PermRow key={i} {...p}/>)}
          </div>
        </div>
      </div>
    </Layout>
  )
}

const BuildingSVG = () => <svg className="h-6 w-6" style={{ color: 'rgb(16,185,129)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
const CalSVG      = () => <svg className="h-5 w-5" style={{ color: 'rgb(6,182,212)' }}  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>

export default ManagerDashboard
