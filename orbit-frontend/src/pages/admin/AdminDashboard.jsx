import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import { ActionCard } from '../../components/common/Card'
import { RoleBadge } from '../../components/common/Badge'
import { HeroSection } from '../../components/common/HeroSection'

// Icons
const UsersIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
const BuildingIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
const CalIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5"/></svg>
const TicketIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5a1 1 0 00-1 1v12a1 1 0 001 1H15.5a1 1 0 001-1v-12a1 1 0 00-1-1H4.5zm0-1h11a2 2 0 012 2v12a2 2 0 01-2 2h-11a2 2 0 01-2-2V4.5a2 2 0 012-2z"/></svg>

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'Admin'

  return (
    <Layout>
      {/* ── Hero banner ── */}
      <HeroSection
        title={`Admin Panel — ${firstName} 🛸`}
        subtitle="Full system control — users, resources, bookings, tickets."
        accentColor="purple"
        icon="⚙️"
        roleBadge={<RoleBadge role="ADMIN" />}
        stats={[
          { value: '—', label: 'Users' },
          { value: '—', label: 'Resources' },
          { value: '—', label: 'Bookings' },
          { value: '—', label: 'Tickets' },
        ]}
      />

      {/* ── Management Section ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Management</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActionCard
            icon={<UsersIcon />}
            title="User Management"
            description="View all users, assign roles across all tiers, and manage accounts"
            onClick={() => navigate('/admin/users')}
            accentColor="purple"
          />
          <ActionCard
            icon={<BuildingIcon />}
            title="Resources & Facilities"
            description="Oversee all campus rooms, labs, and equipment"
            onClick={() => navigate('/resources')}
            accentColor="cyan"
          />
          <ActionCard
            icon={<CalIcon />}
            title="All Bookings"
            description="Full visibility of every booking request and approval"
            onClick={() => navigate('/bookings')}
            accentColor="green"
          />
          <ActionCard
            icon={<TicketIcon />}
            title="Incident Tickets"
            description="Monitor all maintenance and support issues system-wide"
            onClick={() => navigate('/tickets')}
            accentColor="amber"
          />
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
