import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import { ActionCard } from '../../components/common/Card'
import { RoleBadge } from '../../components/common/Badge'
import { HeroSection } from '../../components/common/HeroSection'

// ── Icons ─────────────────────────────────────────────────────────────────────
const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
)

const CalIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="14" height="14" rx="1" />
    <line x1="14" y1="2" x2="14" y2="6" />
    <line x1="6" y1="2" x2="6" y2="6" />
    <line x1="3" y1="9" x2="17" y2="9" />
  </svg>
)

// ── Permission Row ─────────────────────────────────────────────────────────────
const PermRow = ({ label, allowed }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
      background: allowed ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
      border: `1px solid ${allowed ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.2)'}`,
      color: allowed ? '#34d399' : '#64748b',
    }}>
      {allowed ? '✓' : '✕'}
      {allowed ? 'Allowed' : 'Restricted'}
    </span>
  </div>
)

const perms = [
  { label: 'View all resources',    allowed: true  },
  { label: 'Create/edit resources', allowed: true  },
  { label: 'Approve bookings',      allowed: true  },
  { label: 'Reject bookings',       allowed: true  },
  { label: 'View all bookings',     allowed: true  },
  { label: 'Assign tickets',        allowed: true  },
  { label: 'Delete users',          allowed: false },
  { label: 'Delete any booking',    allowed: false },
]

// ── Main Page ─────────────────────────────────────────────────────────────────
const ManagerDashboard = () => {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'Manager'

  return (
    <Layout>
      {/* ── Hero banner ── */}
      <HeroSection
        title={`Welcome, ${firstName} 👋`}
        subtitle="Manage campus resources and review booking requests."
        accentColor="green"
        icon="🏗️"
        roleBadge={<RoleBadge role="MANAGER" />}
        stats={[
          { value: '—', label: 'Resources' },
          { value: '—', label: 'Bookings' },
          { value: '—', label: 'Pending' },
          { value: '—', label: 'Approved' },
        ]}
      />

      {/* ── Content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: actions */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>
            Quick Actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionCard
              icon={<BuildingIcon />}
              title="Resources"
              desc="Add, edit, or deactivate campus facilities and equipment. Set availability and capacity."
              to="/resources"
              accentRgb="16,185,129"
            />
            <ActionCard
              icon={<CalIcon />}
              title="Booking Requests"
              desc="Review pending bookings, approve or reject with reason."
              to="/bookings/manage"
              accentRgb="6,182,212"
            />
          </div>
        </div>

        {/* Right: permissions */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>
            Your Permissions
          </p>
          <div className="glass-card p-5 space-y-4">
            {perms.map((p, i) => <PermRow key={i} {...p} />)}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ManagerDashboard
