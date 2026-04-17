import { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

// ── Type tokens ──────────────────────────────────────────────────────────────
const TYPE_CFG = {
  BOOKING_APPROVED:      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)', label: 'Approved'       },
  BOOKING_REJECTED:      { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.25)',  label: 'Rejected'       },
  TICKET_STATUS_CHANGED: { color: '#06b6d4', bg: 'rgba(6,182,212,0.10)',  border: 'rgba(6,182,212,0.25)',  label: 'Ticket Update'  },
  NEW_COMMENT:           { color: '#a855f7', bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.25)', label: 'New Comment'    },
}
const DEFAULT_CFG = { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', label: 'Notice' }

const BellIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
  </svg>
)

const formatTime = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const NotificationPanel = () => {
  const [open, setOpen]                   = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const [bellClass, setBellClass]         = useState('')
  const panelRef                          = useRef(null)

  const fetchAll = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        axiosInstance.get('/notifications'),
        axiosInstance.get('/notifications/unread-count'),
      ])
      setNotifications(notifRes.data)
      const newCount = countRes.data.count
      if (newCount > unreadCount) { setBellClass('anim-bell'); setTimeout(() => setBellClass(''), 700) }
      setUnreadCount(newCount)
    } catch {}
  }

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = e => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleBell = () => { setOpen(v => !v); if (!open) fetchAll() }

  const markRead = async id => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {}
  }

  const markAllRead = async () => {
    try {
      await axiosInstance.patch('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {}
  }

  const deleteNotif = async (id, e) => {
    e.stopPropagation()
    try {
      await axiosInstance.delete(`/notifications/${id}`)
      const deleted = notifications.find(n => n.id === id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      if (deleted && !deleted.isRead) setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {}
  }

  return (
    <div className="relative" ref={panelRef}>

      {/* Bell button */}
      <button
        onClick={handleBell}
        className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 ${bellClass}`}
        style={{ color: '#64748b', background: 'transparent' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#f1f5f9' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}
        aria-label="Notifications"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white anim-glow-pulse"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 0 8px rgba(6,182,212,0.6)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-[380px] rounded-2xl overflow-hidden z-50 anim-slide-right"
          style={{
            background: 'rgba(8,8,16,0.97)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(6,182,212,0.06)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold transition-colors"
                style={{ color: '#67e8f9' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a5f3fc'}
                onMouseLeave={e => e.currentTarget.style.color = '#67e8f9'}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14" style={{ color: '#334155' }}>
                <BellIcon />
                <p className="mt-3 text-sm font-medium">No notifications yet</p>
                <p className="text-[11px] mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.slice(0, 15).map((n, i) => {
                const cfg = TYPE_CFG[n.type] ?? DEFAULT_CFG
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markRead(n.id)}
                    className="flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: !n.isRead ? 'rgba(6,182,212,0.04)' : 'transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = !n.isRead ? 'rgba(6,182,212,0.04)' : 'transparent'}
                  >
                    {/* Color dot */}
                    <div className="mt-1.5 flex-shrink-0 flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: !n.isRead ? cfg.color : '#1e293b', boxShadow: !n.isRead ? `0 0 6px ${cfg.color}` : 'none' }}/>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold mb-1"
                        style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      <p className="text-[13px] leading-snug" style={{ color: n.isRead ? '#475569' : '#e2e8f0' }}>
                        {n.message}
                      </p>
                      <p className="text-[11px] mt-1" style={{ color: '#334155' }}>{formatTime(n.createdAt)}</p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={e => deleteNotif(n.id, e)}
                      className="flex-shrink-0 mt-0.5 transition-colors"
                      style={{ color: '#334155' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-center text-[11px]" style={{ color: '#334155' }}>
                Showing {Math.min(notifications.length, 15)} of {notifications.length}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
