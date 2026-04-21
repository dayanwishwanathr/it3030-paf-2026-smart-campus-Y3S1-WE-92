import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import { Card, ActionCard } from '../../components/common/Card'
import { Badge, RoleBadge } from '../../components/common/Badge'
import { StatCard, StatsGrid } from '../../components/common/StatCard'
import { HeroSection } from '../../components/common/HeroSection'

// Icon SVGs
const GridIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/></svg>
const BookIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>
const TicketIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5a1 1 0 00-1 1v12a1 1 0 001 1H15.5a1 1 0 001-1v-12a1 1 0 00-1-1H4.5zm0-1h11a2 2 0 012 2v12a2 2 0 01-2 2h-11a2 2 0 01-2-2V4.5a2 2 0 012-2z"/></svg>
const BuildingIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_CFG = {
  USER:       { color: 'cyan',   label: '👤 USER'       },
  TECHNICIAN: { color: 'amber',  label: '🔧 TECHNICIAN' },
  ADMIN:      { color: 'purple', label: '⚡ ADMIN'      },
  MANAGER:    { color: 'green',  label: '🏗️ MANAGER'   },
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role ?? 'USER'
  const cfg = ROLE_CFG[role] ?? ROLE_CFG.USER
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <Layout>
      {/* ── Hero banner ── */}
      <HeroSection
        title={`Welcome back, ${firstName} 👋`}
        subtitle="Here's what's happening on campus today."
        accentColor={cfg.color}
        icon="⚡"
        roleBadge={<RoleBadge role={role} />}
        stats={[
          { value: '—', label: 'Resources' },
          { value: '—', label: 'Bookings' },
          { value: '—', label: 'Pending' },
          { value: '—', label: 'Tickets' },
        ]}
      />

      {/* ── Quick Actions Section ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ActionCard
            icon={<BookIcon />}
            title="Book a Resource"
            description="Reserve campus rooms, labs, and equipment 24⁄7"
            onClick={() => navigate('/bookings/new')}
            accentColor={cfg.color}
          />
          <ActionCard
            icon={<TicketIcon />}
            title="Report an Issue"
            description="Submit a maintenance or incident ticket"
            onClick={() => navigate('/tickets')}
            accentColor={cfg.color}
          />
          <ActionCard
            icon={<BuildingIcon />}
            title="Browse Resources"
            description="Explore all available campus facilities"
            onClick={() => navigate('/resources')}
            accentColor={cfg.color}
          />
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage
