import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import { ActionCard } from '../../components/common/Card'
import { RoleBadge } from '../../components/common/Badge'
import { StatCard, StatsGrid } from '../../components/common/StatCard'
import { HeroSection } from '../../components/common/HeroSection'

// ── Icons ────────────────────────────────────────────────────────────────────
const BookIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
const TicketIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
const BuildingIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>

const ROLE_CFG = {
  USER:       { color: 'cyan',   label: 'USER'       },
  TECHNICIAN: { color: 'amber',  label: 'TECHNICIAN' },
  ADMIN:      { color: 'purple', label: 'ADMIN'      },
  MANAGER:    { color: 'green',  label: 'MANAGER'   },
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role ?? 'USER'
  const cfg = ROLE_CFG[role] ?? ROLE_CFG.USER
  const firstName = user?.name?.split(' ')[0] ?? 'Explorer'

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* ── Status Banner ── */}
        <HeroSection
          title={`Welcome back, ${firstName}`}
          subtitle="All campus systems are currently operational in your sector."
          accentColor={cfg.color}
          icon="⚡"
          roleBadge={<RoleBadge role={role} />}
          stats={[
            { value: 'Online', label: 'Network' },
            { value: 'Active', label: 'Sessions' },
            { value: 'Low',    label: 'Latencey' },
            { value: '24.1c',  label: 'Climate' },
          ]}
        />

        {/* ── Core Metrics ── */}
        <StatsGrid>
           <StatCard icon="🏛️" label="Total Resources" value="28" trend="up" trendValue="+3 new" color="cyan" />
           <StatCard icon="📅" label="Active Bookings" value="12" trend="up" trendValue="80% util" color="blue" />
           <StatCard icon="🎫" label="Open Tickets"    value="04" trend="down" trendValue="-2 fixed" color="amber" />
           <StatCard icon="🛡️" label="System Health"   value="99%" color="green" />
        </StatsGrid>

        {/* ── Quick Control Panel ── */}
        <div className="mt-12 mb-20">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-1.5 h-6 bg-cyan-400 rounded-full" />
             <h2 className="text-xl font-black text-white uppercase tracking-tight">Rapid Access Panel</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActionCard
              icon={<BookIcon />}
              title="Secure Booking"
              description="Instantly reserve lecture halls, pods, and high-performance labs."
              onClick={() => navigate('/bookings/new')}
              accentColor="cyan"
            />
            <ActionCard
              icon={<TicketIcon />}
              title="Submit Report"
              description="Notify campus technicians about equipment faults or incidents."
              onClick={() => navigate('/tickets/new')}
              accentColor="amber"
            />
            <ActionCard
              icon={<BuildingIcon />}
              title="Infrastructure Map"
              description="Dynamic catalogue of all campus smart-assets and facilities."
              onClick={() => navigate('/resources')}
              accentColor="blue"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage
