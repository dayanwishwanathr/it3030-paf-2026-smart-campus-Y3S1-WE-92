import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN']

const RoleBadge = ({ role }) => {
  const colors = {
    ADMIN:      'bg-purple-100 text-purple-700',
    TECHNICIAN: 'bg-orange-100 text-orange-700',
    USER:       'bg-blue-100 text-blue-700',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[role] || 'bg-gray-100 text-gray-600'}`}>
      {role}
    </span>
  )
}

const UserManagementPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')
  const [updating, setUpdating] = useState(null) // userId being updated
  const [deleting, setDeleting] = useState(null) // userId being deleted
  const [confirmDelete, setConfirmDelete] = useState(null) // userId to confirm

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get('/users')
      setUsers(data)
    } catch {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId)
    try {
      const { data } = await axiosInstance.patch(`/users/${userId}/role`, { role: newRole })
      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)))
    } catch {
      setError('Failed to update role.')
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (userId) => {
    setDeleting(userId)
    try {
      await axiosInstance.delete(`/users/${userId}`)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setConfirmDelete(null)
    } catch {
      setError('Failed to delete user.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : '—'

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} total users</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">

                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.profilePicture ? (
                          <img src={u.profilePicture} alt={u.name}
                            className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <RoleBadge role={u.role} />
                    </td>

                    {/* Provider */}
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        u.provider === 'GOOGLE'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.provider}
                      </span>
                    </td>

                    {/* Joined date */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(u.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">

                        {/* Role dropdown — disabled for self */}
                        {u.id !== currentUser?.id ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={updating === u.id}
                            className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-gray-400 italic">You</span>
                        )}

                        {/* Delete — disabled for self */}
                        {u.id !== currentUser?.id && (
                          confirmDelete === u.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(u.id)}
                                disabled={deleting === u.id}
                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg disabled:opacity-50 transition"
                              >
                                {deleting === u.id ? '...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(u.id)}
                              className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-1.5 rounded-lg transition"
                            >
                              Delete
                            </button>
                          )
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default UserManagementPage
