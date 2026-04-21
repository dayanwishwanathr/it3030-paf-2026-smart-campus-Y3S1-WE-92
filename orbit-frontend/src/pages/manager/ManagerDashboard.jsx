import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import { ActionCard } from '../../components/common/Card'
import { RoleBadge } from '../../components/common/Badge'
import { HeroSection } from '../../components/common/HeroSection'

// Icons
const BuildingIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
const CalIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5"/></svg>
const CheckIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
const XIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>

const ManagerDashboard = () => {
  const navigate = useNavigate()
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

      {/* ── Management Section ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Management</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ActionCard
            icon={<BuildingIcon />}
            title="Manage Resources"
            description="Create, update, and manage all campus facilities"
            onClick={() => navigate('/resources')}
            accentColor="green"
          />
          <ActionCard
            icon={<CalIcon />}
            title="Booking Requests"
            description="Review pending bookings and approve or reject requests"
            onClick={() => navigate('/bookings')}
            accentColor="cyan"
          />
          <ActionCard
            icon={<CheckIcon />}
            title="Approvals"
            description="Review and manage resource and booking approvals"
            onClick={() => navigate('/admin/users')}
            accentColor="green"
          />
        </div>
      </div>
    </Layout>
  )
}

export default ManagerDashboard
