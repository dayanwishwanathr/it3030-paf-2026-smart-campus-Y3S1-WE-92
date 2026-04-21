import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import { bookingApi } from '../../api/bookingApi'
import { useAuth } from '../../context/AuthContext'

const StatusBadge = ({ status }) => {
  const cfg = {
    PENDING: { bg: 'rgba(168,85,247,0.15)', text: '#d8b4fe', border: 'rgba(168,85,247,0.3)' },
    APPROVED: { bg: 'rgba(16,185,129,0.15)', text: '#6ee7b7', border: 'rgba(16,185,129,0.3)' },
    REJECTED: { bg: 'rgba(239,68,68,0.15)', text: '#fca5a5', border: 'rgba(239,68,68,0.3)' },
    CANCELLED: { bg: 'rgba(100,116,139,0.15)', text: '#cbd5e1', border: 'rgba(100,116,139,0.3)' },
    COMPLETED: { bg: 'rgba(59,130,246,0.15)', text: '#93c5fd', border: 'rgba(59,130,246,0.3)' }
  }[status] || { bg: 'rgba(255,255,255,0.1)', text: '#fff', border: 'rgba(255,255,255,0.2)' }

  return (
    <span 
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      {status}
    </span>
  )
}

const ManageBookingsPage = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PENDING') // Default to pending for admins

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const statusParam = filter === 'ALL' ? null : filter
      const data = await bookingApi.getAllBookings({ status: statusParam })
      setBookings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const handleAction = async (id, action) => {
    const notes = window.prompt(`Enter notes for ${action} (optional):`)
    if (notes === null) return // cancelled prompt

    try {
      if (action === 'approve') await bookingApi.approveBooking(id, notes)
      if (action === 'reject') await bookingApi.rejectBooking(id, notes)
      fetchBookings()
    } catch (err) {
      alert(`Failed to ${action}: ` + (err.response?.data?.error || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY delete this booking?')) return
    try {
      await bookingApi.deleteBooking(id)
      fetchBookings()
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
            <p className="text-sm text-slate-400 mt-1">Review, approve, and manage resource reservations.</p>
          </div>
          
          <div className="flex gap-2 p-1 glass-card rounded-xl">
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f 
                    ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 glass-card border-dashed">
            <p className="text-slate-400">No bookings found for the selected filter.</p>
          </div>
        ) : (
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase font-semibold text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map(b => (
                  <tr key={b.id} className="table-row-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{b.userName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-cyan-300">{b.resourceName}</div>
                      <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]" title={b.purpose}>{b.purpose}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-200">{b.date}</div>
                      <div className="text-xs text-slate-400 mt-1">{b.startTime} - {b.endTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      {b.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAction(b.id, 'approve')}
                            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded bg-emerald-400/10 hover:bg-emerald-400/20 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(b.id, 'reject')}
                            className="text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 rounded bg-red-400/10 hover:bg-red-400/20 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-xs font-semibold text-slate-400 hover:text-red-400 px-3 py-1.5 rounded hover:bg-red-400/10 transition-colors ml-2 border border-slate-700 hover:border-red-400/30"
                        >
                          Delete
                        </button>
                      )}
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

export default ManageBookingsPage
