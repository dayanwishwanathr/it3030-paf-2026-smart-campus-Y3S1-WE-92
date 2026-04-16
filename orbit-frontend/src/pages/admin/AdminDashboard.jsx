import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'

const AdminStatCard = ({ icon, label, color, to }) => (
  <Link
    to={to}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition group flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
        {label}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">Click to manage →</p>
    </div>
  </Link>
)

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <Layout>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold">
          Admin Panel — Welcome, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-purple-100 mt-1 text-sm">
          Manage users, bookings, resources and tickets from here.
        </p>
        <span className="inline-block mt-3 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
          ADMIN
        </span>
      </div>

      {/* Admin modules */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Manage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminStatCard
          icon="👥"
          label="User Management"
          color="bg-purple-50"
          to="/admin/users"
        />
        <AdminStatCard
          icon="🏛️"
          label="Resources & Facilities"
          color="bg-blue-50"
          to="/resources"
        />
        <AdminStatCard
          icon="📅"
          label="All Bookings"
          color="bg-green-50"
          to="/bookings"
        />
        <AdminStatCard
          icon="🎫"
          label="Incident Tickets"
          color="bg-orange-50"
          to="/tickets"
        />
      </div>
    </Layout>
  )
}

export default AdminDashboard
