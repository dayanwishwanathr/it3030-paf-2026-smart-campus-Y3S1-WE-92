import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import { bookingApi } from '../../api/bookingApi'
import { useAuth } from '../../context/AuthContext'

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'p.m' : 'a.m';
  hour = hour % 12 || 12; // convert 0 to 12
  return `${hour}:${m} ${ampm}`;
}

// ── Shared Styling (Matching Catalogue) ───────────────────────────────────────
const S = {
  card: {
    background:   '#131929',
    border:       '1px solid #1e2d45',
    borderRadius: '10px',
    transition:   'all 0.2s',
  },
  divider: {
    height:     '1px',
    background: '#1e2d45',
    margin:     '0',
  },
  pillInactive: {
    padding:       '6px 14px',
    borderRadius:  '6px',
    fontSize:      '12px',
    fontWeight:    '500',
    background:    '#0c1526',
    border:        '1px solid #1e2d45',
    color:         '#64748b',
    cursor:        'pointer',
    whiteSpace:    'nowrap',
    transition:    'all 0.15s',
  },
  pillActive: {
    padding:       '6px 14px',
    borderRadius:  '6px',
    fontSize:      '12px',
    fontWeight:    '600',
    background:    '#2d0d3d', // slightly purple for admins
    border:        '1px solid #a855f7', // purple border
    color:         '#d8b4fe',
    cursor:        'pointer',
    whiteSpace:    'nowrap',
    boxShadow:     '0 0 10px rgba(168,85,247,0.15)',
  }
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    PENDING:   { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', text: '#d8b4fe', dot: '#a855f7' },
    APPROVED:  { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#34d399', dot: '#10b981' },
    REJECTED:  { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  text: '#fca5a5', dot: '#ef4444' },
    CANCELLED: { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', text: '#cbd5e1', dot: '#64748b' },
    COMPLETED: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#93c5fd', dot: '#3b82f6' }
  }[status] || { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', text: '#fff', dot: '#fff' }

  return (
    <span style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           '5px',
      padding:       '3px 8px',
      borderRadius:  '6px',
      fontSize:      '11px',
      fontWeight:    '600',
      background:    cfg.bg,
      border:        `1px solid ${cfg.border}`,
      color:         cfg.text,
      flexShrink:    0,
    }}>
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: cfg.dot,
        flexShrink: 0,
      }} />
      {status}
    </span>
  )
}

// ── AdminBookingCard ──────────────────────────────────────────────────────────
const AdminBookingCard = ({ booking, onAction, onDelete, isAdmin }) => {
  const [hovered, setHovered] = useState(false)
  const isPending = booking.status === 'PENDING'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...S.card,
        background:  hovered ? '#151e32' : '#131929',
        borderColor: hovered ? '#3f2a5f' : '#1e2d45', // slight purple hover border for admin page
        display:     'flex',
        flexDirection: 'column',
        overflow:    'hidden',
        textAlign:   'left',
        padding:     '16px',
        gap:         '12px',
        transform:   hovered ? 'translateY(-2px)' : 'none',
        boxShadow:   hovered ? '0 4px 20px rgba(168,85,247,0.05)' : 'none'
      }}
    >
      {/* Top Header: Resource & Status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {booking.resourceName}
          </p>
          <p style={{ fontSize: '11px', color: '#a855f7', margin: '2px 0 0', fontWeight: '500' }}>
            Requested by: {booking.userName}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Date & Time Info Box */}
      <div style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '6px', 
        padding: '10px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginTop: '4px'
      }}>
        <div>
          <p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px', fontWeight: '600' }}>Date</p>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, fontWeight: '500' }}>{booking.date}</p>
        </div>
        <div>
          <p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px', fontWeight: '600' }}>Time</p>
          <p style={{ fontSize: '12px', color: '#06b6d4', margin: 0, fontWeight: '500' }}>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
        </div>
      </div>

      {/* Purpose */}
      <div>
        <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 2px 0', fontWeight: '500' }}>Purpose:</p>
        <p style={{ fontSize: '13px', color: '#e2e8f0', margin: 0, lineHeight: '1.4' }}>
          {booking.purpose || 'No purpose specified'}
        </p>
      </div>

      <div style={{ flex: 1 }} />
      <div style={S.divider} />

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '2px', gap: '8px' }}>
        {isPending && (
          <>
            <button
              onClick={() => onAction(booking.id, 'reject')}
              style={{
                padding:      '6px 14px',
                borderRadius: '6px',
                fontSize:     '12px',
                fontWeight:   '600',
                background:   'rgba(239,68,68,0.1)',
                border:       '1px solid rgba(239,68,68,0.3)',
                color:        '#f87171',
                cursor:       'pointer',
                transition:   'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
            >
              Reject
            </button>
            <button
              onClick={() => onAction(booking.id, 'approve')}
              style={{
                padding:      '6px 14px',
                borderRadius: '6px',
                fontSize:     '12px',
                fontWeight:   '600',
                background:   'rgba(16,185,129,0.1)',
                border:       '1px solid rgba(16,185,129,0.3)',
                color:        '#34d399',
                cursor:       'pointer',
                transition:   'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)' }}
            >
              Approve
            </button>
          </>
        )}

        {isAdmin && !isPending && (
          <button
            onClick={() => onDelete(booking.id)}
            style={{
              padding:      '6px 14px',
              borderRadius: '6px',
              fontSize:     '12px',
              fontWeight:   '500',
              background:   '#1a2540',
              border:       '1px solid #1e2d45',
              color:        '#94a3b8',
              cursor:       'pointer',
              transition:   'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#fca5a5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a2540'; e.currentTarget.style.borderColor = '#1e2d45'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
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
      <div style={{ padding: '0 0 32px 0' }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 4px' }}>
              Manage Bookings
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Review, approve, and manage resource reservations
            </p>
          </div>

          {/* ── Filters ── */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={filter === f ? S.pillActive : S.pillInactive}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Loading / Empty States ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px', flexDirection: 'column', gap: '10px' }}>
            <div className="animate-spin" style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #1e2d45', borderTopColor: '#a855f7' }} />
            <p style={{ fontSize: '12px', color: '#475569' }}>Loading bookings…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ ...S.card, padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9', marginBottom: '6px' }}>No bookings found</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              {filter !== 'ALL' ? `There are no ${filter.toLowerCase()} bookings.` : 'No bookings exist in the system yet.'}
            </p>
          </div>
        ) : (
          /* ── Booking Grid ── */
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap:                 '16px',
          }}>
            {bookings.map(b => (
              <AdminBookingCard 
                key={b.id} 
                booking={b} 
                onAction={handleAction} 
                onDelete={handleDelete}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

      </div>
    </Layout>
  )
}

export default ManageBookingsPage
