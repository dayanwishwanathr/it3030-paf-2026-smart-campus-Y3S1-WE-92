import { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

const NotificationPanel = () => {
  const [open, setOpen]                   = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const panelRef                          = useRef(null)

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get('/notifications')
      setNotifications(data)
    } catch {
      // silently fail — non-critical
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axiosInstance.get('/notifications/unread-count')
      setUnreadCount(data.count)
    } catch {
      // silently fail
    }
  }

  // Load on mount + poll every 30 seconds
  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()

    const interval = setInterval(() => {
      fetchNotifications()
      fetchUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBellClick = () => {
    setOpen((prev) => !prev)
    if (!open) fetchNotifications()
  }

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {}
  }

  const handleMarkAllAsRead = async () => {
    try {
      await axiosInstance.patch('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {}
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      await axiosInstance.delete(`/notifications/${id}`)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      const deleted = notifications.find((n) => n.id === id)
      if (deleted && !deleted.isRead) setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {}
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'BOOKING_APPROVED':     return 'bg-green-100 text-green-700'
      case 'BOOKING_REJECTED':     return 'bg-red-100 text-red-700'
      case 'TICKET_STATUS_CHANGED': return 'bg-blue-100 text-blue-700'
      case 'NEW_COMMENT':          return 'bg-purple-100 text-purple-700'
      default:                     return 'bg-gray-100 text-gray-600'
    }
  }

  const formatType = (type) =>
    type?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const now  = new Date()
    const diff = Math.floor((now - date) / 1000)
    if (diff < 60)   return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="relative" ref={panelRef}>

      {/* Bell button */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                <p className="text-2xl mb-2">🔔</p>
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 15).map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                    !n.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Unread dot */}
                  <div className="mt-1.5 flex-shrink-0">
                    {!n.isRead
                      ? <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      : <div className="w-2 h-2 rounded-full" />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(n.type)}`}>
                      {formatType(n.type)}
                    </span>
                    <p className="text-sm text-gray-700 mt-1 leading-snug">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(n.id, e)}
                    className="text-gray-300 hover:text-red-400 transition flex-shrink-0 mt-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default NotificationPanel
