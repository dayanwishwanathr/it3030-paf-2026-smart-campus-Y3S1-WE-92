import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import { bookingApi } from '../../api/bookingApi'

// ── Stat chip ────────────────────────────────────────────────────────────────
const StatChip = ({ label, value, color, border, glow }) => (
  <div className="flex flex-col items-center rounded-2xl px-4 py-3 min-w-[72px]"
    style={{ background: `rgba(${color},0.08)`, border: `1px solid rgba(${color},0.22)` }}>
    <span className="text-2xl font-black" style={{ color: `rgb(${color})`, textShadow: `0 0 12px rgba(${color},0.5)` }}>
      {value}
    </span>
    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: `rgba(${color},0.7)` }}>
      {label}
    </span>
  </div>
)

// ── Featured action card (tall) ───────────────────────────────────────────────
const FeaturedCard = ({ icon, title, desc, to, accentRgb, stagger }) => (
  <Link to={to} className={`glass-card-btn flex flex-col justify-between p-6 row-span-2 min-h-[200px] ${stagger}`}>
    <div>
      {/* Icon orb */}
      <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: `rgba(${accentRgb},0.12)`,
          border: `1px solid rgba(${accentRgb},0.3)`,
          boxShadow: `0 0 20px rgba(${accentRgb},0.12)`,
          transition: 'all 0.2s ease',
        }}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
      <p className="text-[13px] mt-2 leading-relaxed" style={{ color: '#475569' }}>{desc}</p>
    </div>
    <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold" style={{ color: `rgb(${accentRgb})` }}>
      <span>Get started</span>
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>
  </Link>
)

// ── Regular action card ───────────────────────────────────────────────────────
const ActionCard = ({ icon, title, desc, to, accentRgb, stagger }) => (
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </Link>
)

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_CFG = {
  USER:       { color: 'text-cyan-500', rgb: '6,182,212', label: '👤 USER' },
  TECHNICIAN: { color: 'text-amber-500', rgb: '245,158,11', label: '🔧 TECHNICIAN' },
  ADMIN:      { color: 'text-purple-500', rgb: '168,85,247', label: '⚡ ADMIN' },
  MANAGER:    { color: 'text-emerald-500', rgb: '16,185,129', label: '🏗️ MANAGER' },
}

const DashboardPage = () => {
  const { user } = useAuth()
  const role = user?.role ?? 'USER'
  const cfg = ROLE_CFG[role] ?? ROLE_CFG.USER
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const [stats, setStats] = useState({ total: '—', approved: '—', pending: '—' })

  useEffect(() => {
    // Fetch live booking stats
    bookingApi.getMyBookings().then(data => {
      const total = data.length
      const approved = data.filter(b => b.status === 'APPROVED').length
      const pending = data.filter(b => b.status === 'PENDING').length
      setStats({ total, approved, pending })
    }).catch(err => console.error(err))
  }, [])

  return (
    <Layout>
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6" style={{ background: `rgba(${cfg.rgb},0.05)`, border: `1px solid rgba(${cfg.rgb},0.15)` }}>
        {/* Dot grid texture */}
        <div className="absolute inset-0 dot-grid opacity-40" />
        {/* Right glow blob */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(${cfg.rgb},0.2) 0%, transparent 70%)` }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          {/* Left: greeting */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: `rgba(${cfg.rgb},0.7)` }}>
              Smart Campus Hub
            </p>
            <h2 className="text-2xl font-bold text-white">Welcome back, {firstName} 👋</h2>
            <p className="text-[13px] mt-1" style={{ color: '#64748b' }}>Here's what's happening on campus today.</p>
            <span className="inline-flex items-center gap-1.5 mt-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: `rgba(${cfg.rgb},0.12)`, border: `1px solid rgba(${cfg.rgb},0.25)`, color: `rgb(${cfg.rgb})` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: `rgb(${cfg.rgb})`, boxShadow: `0 0 6px rgb(${cfg.rgb})` }} />
              {cfg.label}
            </span>
          </div>

          {/* Right: stat chips */}
          <div className="flex flex-wrap gap-3">
            <StatChip label="Bookings" value={stats.total} color="6,182,212" />
            <StatChip label="Approved" value={stats.approved} color="16,185,129" />
            <StatChip label="Pending" value={stats.pending} color="168,85,247" />
          </div>
        </div>
      </div>

      {/* ── Quick Actions Section ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ActionCard
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}
            title="Book a Resource"
            desc="Reserve campus rooms, labs, and equipment 24⁄7"
            to="/bookings/new"
            accentRgb={cfg.rgb}
          />
          <ActionCard
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
            title="My Bookings"
            desc="View and manage your upcoming reservations"
            to="/bookings"
            accentRgb={cfg.rgb}
          />
          <ActionCard
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
            title="Browse Resources"
            desc="Explore all available campus facilities"
            to="/resources"
            accentRgb={cfg.rgb}
          />
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage
