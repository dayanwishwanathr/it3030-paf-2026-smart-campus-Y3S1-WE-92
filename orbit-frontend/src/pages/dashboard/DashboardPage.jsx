import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
)

const QuickActionCard = ({ icon, title, description, to, color }) => (
  <Link
    to={to}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition group"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${color}`}>
      {icon}
    </div>
    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">{title}</h3>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </Link>
)

const DashboardPage = () => {
  const { user } = useAuth()

  return (
    <Layout>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-blue-100 mt-1 text-sm">
          Here's what's happening on campus today.
        </p>
        <span className="inline-block mt-3 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
          {user?.role}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🏫" label="My Bookings"    value="—" color="bg-blue-50" />
        <StatCard icon="🎫" label="My Tickets"     value="—" color="bg-orange-50" />
        <StatCard icon="✅" label="Approved"        value="—" color="bg-green-50" />
        <StatCard icon="⏳" label="Pending"         value="—" color="bg-yellow-50" />
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionCard
          icon="📅"
          title="Book a Resource"
          description="Reserve a room, lab, or equipment"
          to="/bookings/new"
          color="bg-blue-50"
        />
        <QuickActionCard
          icon="🔧"
          title="Report an Issue"
          description="Submit a maintenance or incident ticket"
          to="/tickets/new"
          color="bg-orange-50"
        />
        <QuickActionCard
          icon="📋"
          title="My Bookings"
          description="View and manage your bookings"
          to="/bookings"
          color="bg-green-50"
        />
        <QuickActionCard
          icon="🎫"
          title="My Tickets"
          description="Track your reported incidents"
          to="/tickets"
          color="bg-purple-50"
        />
        <QuickActionCard
          icon="🏛️"
          title="Browse Resources"
          description="Explore available campus facilities"
          to="/resources"
          color="bg-indigo-50"
        />
      </div>
    </Layout>
  )
}

export default DashboardPage
