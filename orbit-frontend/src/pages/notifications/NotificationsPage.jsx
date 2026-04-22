import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { notificationApi } from '../../api/ticketApi'

// ── Notification type config ──────────────────────────────────────────────────
const TYPE_CFG = {
  TICKET_CREATED:       { icon: '🎫', color: '6,182,212',  label: 'New Ticket'     },
  TICKET_ASSIGNED:      { icon: '🔧', color: '245,158,11', label: 'Assigned'        },
  TICKET_STATUS_CHANGED:{ icon: '🔄', color: '168,85,247', label: 'Status Update'  },
  NEW_COMMENT:          { icon: '💬', color: '16,185,129', label: 'New Comment'     },
  BOOKING_APPROVED:     { icon: '✅', color: '16,185,129', label: 'Booking Approved'},
  BOOKING_REJECTED:     { icon: '❌', color: '239,68,68',  label: 'Booking Rejected'},
  NEW_BOOKING_REQUEST:  { icon: '📋', color: '59,130,246', label: 'Booking Request' },
}

const getCfg = (type) => TYPE_CFG[type] || { icon: '🔔', color: '148,163,184', label: type }

// ── Single notification row ───────────────────────────────────────────────────
const NotifRow = ({ notif, onMarkRead, onDelete, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const cfg = getCfg(notif.type)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 16px',
        background: notif.read
          ? (hovered ? 'rgba(255,255,255,0.02)' : 'transparent')
          : (hovered ? `rgba(${cfg.color},0.07)` : `rgba(${cfg.color},0.04)`),
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onClick={() => onClick(notif)}
    >
      {/* Icon orb */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: `rgba(${cfg.color},0.12)`,
        border: `1px solid rgba(${cfg.color},0.25)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
          <p style={{
            fontSize: 13, fontWeight: notif.read ? 500 : 700,
            color: notif.read ? '#94a3b8' : '#f1f5f9',
            margin: 0, lineHeight: 1.4,
          }}>
            {notif.message}
          </p>
          {!notif.read && (
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: `rgb(${cfg.color})`,
              boxShadow: `0 0 6px rgba(${cfg.color},0.6)`,
              flexShrink: 0, marginTop: 4,
            }} />
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 600, color: `rgba(${cfg.color},0.8)`,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {cfg.label}
          </span>
          <span style={{ fontSize: 11, color: '#475569' }}>
            {new Date(notif.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
        {!notif.read && (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkRead(notif.id) }}
            title="Mark as read"
            style={{
              background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
              width: 28, height: 28, borderRadius: 6, fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✓</button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notif.id) }}
          title="Delete"
          style={{
            background: 'none', border: 'none', color: '#475569', cursor: 'pointer',
            width: 28, height: 28, borderRadius: 6, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
const NotificationsPage = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL') // ALL | UNREAD

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const data = await notificationApi.getAll()
      setNotifications(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotifications() }, [])

  const handleMarkRead = async (id) => {
    await notificationApi.markRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllRead = async () => {
    await notificationApi.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleDelete = async (id) => {
    await notificationApi.delete(id)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleClick = (notif) => {
    if (!notif.read) handleMarkRead(notif.id)
    // Navigate based on type
    if (notif.referenceId) {
      if (notif.type.startsWith('BOOKING') || notif.type === 'NEW_BOOKING_REQUEST') {
        navigate(`/bookings/${notif.referenceId}`)
      } else if (notif.type.startsWith('TICKET') || notif.type === 'NEW_COMMENT') {
        navigate(`/tickets/${notif.referenceId}`)
      }
    }
  }

  const displayed = filter === 'UNREAD'
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  const pillStyle = (active) => active ? {
    padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
    background: '#0d2d3d', border: '1px solid #06b6d4', color: '#22d3ee',
    cursor: 'pointer', boxShadow: '0 0 8px rgba(6,182,212,0.15)',
  } : {
    padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
    background: '#0c1526', border: '1px solid #1e2d45', color: '#64748b',
    cursor: 'pointer',
  }

  return (
    <Layout>
      <div style={{ maxWidth: 700, margin: '0 auto', paddingBottom: 48 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: '#f1f5f9', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg,#06b6d4,#3b82f6)',
                  borderRadius: 20, padding: '2px 10px',
                  fontSize: 12, fontWeight: 700, color: '#fff',
                }}>
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Stay up to date with your campus activity
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)',
                color: '#22d3ee', cursor: 'pointer',
              }}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* ── Filters ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button style={pillStyle(filter === 'ALL')}   onClick={() => setFilter('ALL')}>All</button>
          <button style={pillStyle(filter === 'UNREAD')} onClick={() => setFilter('UNREAD')}>
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{
          background: '#131929', border: '1px solid #1e2d45', borderRadius: 12, overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
              height: 160, flexDirection: 'column', gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%',
                border: '2px solid #1e2d45', borderTopColor: '#06b6d4',
                animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 12, color: '#475569' }}>Loading…</p>
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', margin: '0 0 6px' }}>
                {filter === 'UNREAD' ? 'All caught up!' : 'No notifications yet'}
              </p>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                {filter === 'UNREAD'
                  ? 'You have no unread notifications.'
                  : 'Activity on bookings and tickets will appear here.'}
              </p>
            </div>
          ) : displayed.map(n => (
            <NotifRow
              key={n.id}
              notif={n}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              onClick={handleClick}
            />
          ))}
        </div>

      </div>
    </Layout>
  )
}

export default NotificationsPage
