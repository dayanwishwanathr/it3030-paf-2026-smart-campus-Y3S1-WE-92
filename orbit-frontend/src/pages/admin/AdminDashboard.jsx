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

// ── Stat chip ─────────────────────────────────────────────────────────────────
const StatChip = ({ label, rgb }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    borderRadius: 16, padding: '14px 20px', minWidth: 90,
    background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.22)`,
  }}>
    <span style={{ fontSize: 28, fontWeight: 900, color: `rgb(${rgb})`, textShadow: `0 0 16px rgba(${rgb},0.5)`, lineHeight: 1 }}>—</span>
    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6, color: `rgba(${rgb},0.7)` }}>{label}</span>
  </div>
)

// ── FeaturedCard (tall hero-style card) ───────────────────────────────────────
const FeaturedCard = ({ icon, title, desc, to }) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      style={{
        width: '100%', height: '100%', textAlign: 'left', borderRadius: 20,
        padding: '28px 24px', display: 'flex', flexDirection: 'column',
        gap: 0, border: 'none', cursor: 'pointer', transition: 'all 0.25s',
        background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))',
        borderStyle: 'solid', borderWidth: 1, borderColor: 'rgba(168,85,247,0.25)',
        minHeight: 200,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.45)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.25)' }}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 48, height: 48, borderRadius: 14, marginBottom: 20,
        background: 'rgba(168,85,247,0.15)', color: 'rgb(168,85,247)',
      }}>
        {icon}
      </span>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, flex: 1 }}>{desc}</p>
      <span style={{
        marginTop: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'rgb(168,85,247)',
      }}>
        Manage →
      </span>
    </button>
  )
}

// ── ModuleCard (smaller accent card) ─────────────────────────────────────────
const ModuleCard = ({ icon, title, desc, to, accentRgb = '99,102,241' }) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      style={{
        width: '100%', textAlign: 'left', borderRadius: 20,
        padding: '24px 20px', display: 'flex', flexDirection: 'column',
        border: 'none', cursor: 'pointer', transition: 'all 0.25s',
        background: `linear-gradient(135deg, rgba(${accentRgb},0.10), rgba(${accentRgb},0.03))`,
        borderStyle: 'solid', borderWidth: 1, borderColor: `rgba(${accentRgb},0.22)`,
        minHeight: 160,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = `rgba(${accentRgb},0.45)` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = `rgba(${accentRgb},0.22)` }}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 44, height: 44, borderRadius: 12, marginBottom: 18,
        background: `rgba(${accentRgb},0.15)`, color: `rgb(${accentRgb})`,
      }}>
        {icon}
      </span>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, flex: 1 }}>{desc}</p>
      <span style={{
        marginTop: 16, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: `rgb(${accentRgb})`,
      }}>
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
      <div className="relative overflow-hidden rounded-2xl hero-purple" style={{ padding: '36px 40px', marginBottom: 32 }}>
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div
          className="absolute -right-12 -top-12 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(168,85,247,0.7)', marginBottom: 10 }}>
              System Control
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.2 }}>
              Admin Panel - Welcome Back 👋
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '10px 0 16px', lineHeight: 1.6 }}>
              Full system control - users, resources, bookings, tickets.
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              borderRadius: 99, padding: '5px 12px',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
              background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: 'rgb(168,85,247)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgb(168,85,247)', boxShadow: '0 0 6px rgb(168,85,247)' }} />
              ⚡ ADMIN
            </span>
          </div>

          {/* Stat chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flexShrink: 0 }}>
            <StatChip label="Users" rgb="168,85,247" />
            <StatChip label="Resources" rgb="6,182,212" />
            <StatChip label="Bookings" rgb="16,185,129" />
            <StatChip label="Tickets" rgb="245,158,11" />
          </div>
        </div>
      </div>

      {/* ── Modules ── */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Manage</h2>
        <span style={{ fontSize: 12, color: '#334155' }}>— system modules</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, alignItems: 'start' }}>
        {/* Featured: User Management */}
        <FeaturedCard
          icon={<UsersIcon />}
          title="User Management"
          desc="View all registered users, assign roles across all 4 tiers, and remove accounts when needed."
          to="/admin/users"
        />

        {/* 3 module cards in a 2-col sub-grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ModuleCard icon={<BuildingIcon />} title="Resources & Facilities" desc="Oversee all campus rooms, labs, and equipment" to="/resources" accentRgb="6,182,212" />
          <ModuleCard icon={<CalIcon />} title="All Bookings" desc="Full visibility of every booking request" to="/bookings/manage" accentRgb="16,185,129" />
          <ModuleCard icon={<TicketIcon />} title="Incident Tickets" desc="Monitor all maintenance and support issues" to="/tickets" accentRgb="245,158,11" />
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
