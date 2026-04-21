import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import OrbitLogo from '../../components/common/OrbitLogo'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const PublicResourcePreviewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [resource, setResource] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch resource details and public bookings simultaneously
      const [resRes, bookRes] = await Promise.all([
        axiosInstance.get(`/resources/${id}`),
        axiosInstance.get(`/bookings/public/resource/${id}`)
      ])
      
      setResource(resRes.data)
      
      // Filter out past bookings to only show current/future
      const now = new Date()
      const bookingsArray = Array.isArray(bookRes.data) ? bookRes.data : []
      const upcoming = bookingsArray.filter(b => {
        if (!b.date || !b.endTime) return false;
        try {
          const bookingDateTime = new Date(`${b.date}T${b.endTime}`)
          return bookingDateTime > now
        } catch (e) {
          return false
        }
      }).sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))
      
      setBookings(upcoming)
    } catch (err) {
      console.error(err)
      setError('Could not load resource details. It may have been removed or is temporarily unavailable.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ height: '100vh', background: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner />
    </div>
  )
  
  if (error || !resource) return (
    <div style={{ height: '100vh', background: '#050508', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#f87171', padding: 24, textAlign: 'center' }}>
      <div style={{ padding: 20, background: 'rgba(239,68,68,0.1)', borderRadius: '50%', marginBottom: 16 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 32, height: 32 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Unable to Load Resource</h2>
      <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 320 }}>{error}</p>
    </div>
  )

  const handleBookNow = () => {
    // Navigate to login with a specific returnUrl telling it where to go after auth!
    navigate(`/login?returnUrl=${encodeURIComponent(`/bookings/new?resourceId=${id}`)}`)
  }

  // Format date smartly
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
    
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  // Format time (e.g. 14:00 -> 2:00 PM)
  const formatTime = (timeStr) => {
    return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050508', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Top Nav ── */}
      <header style={{ 
        padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, 
        background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' 
      }}>
        <OrbitLogo size={32} color="white" />
        <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#f59e0b' }}>SLIIT</span>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#f1f5f9' }}>&nbsp;Orbit</span>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px', paddingBottom: 100 }}>
        
        {/* Resource Header Card */}
        <div className="glass-card" style={{ overflow: 'hidden', marginBottom: 24 }}>
          {resource.imageUrl ? (
            <div style={{ width: '100%', height: 220, position: 'relative' }}>
              <img 
                src={resource.imageUrl} 
                alt={resource.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
            </div>
          ) : (
             <div style={{ width: '100%', height: 120, background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: 40 }}>🏛️</span>
             </div>
          )}
          
          <div style={{ padding: 24, position: 'relative', marginTop: resource.imageUrl ? -60 : 0 }}>
            {(resource.status === 'AVAILABLE' || !resource.status) && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: 11, fontWeight: 700, border: '1px solid rgba(16,185,129,0.3)', marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> OUT OF SESSION
              </span>
            )}
            {resource.status && resource.status !== 'AVAILABLE' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 11, fontWeight: 700, border: '1px solid rgba(239,68,68,0.3)', marginBottom: 12 }}>
                 <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} /> {resource.status.replace('_', ' ')}
              </span>
            )}
            
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: 0, marginBottom: 8 }}>{resource.name}</h1>
            
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {resource.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                Capacity: {resource.capacity}
              </div>
            </div>
            
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
              {resource.description || "No description provided for this resource."}
            </p>
          </div>
        </div>

        {/* Schedule */}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18, color: '#3b82f6' }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Upcoming Bookings
        </h3>
        
        {bookings.length === 0 ? (
          <div style={{ padding: 24, borderRadius: 12, border: '1px dashed rgba(255,255,255,0.14)', textAlign: 'center' }}>
            <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>✨</span>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>This resource is completely free for the foreseeable future. You can book it right now!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bookings.map((booking) => (
              <div key={booking.id} style={{ 
                display: 'flex', alignItems: 'stretch', 
                background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden'
              }}>
                <div style={{ width: 4, background: '#a855f7' }} />
                <div style={{ padding: '14px 16px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{booking.purpose}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, color: '#cbd5e1', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14, color: '#64748b' }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {formatDate(booking.date)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14, color: '#64748b' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Floating Action Bar ── */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        padding: '20px 24px', 
        background: 'rgba(12,12,24,0.95)', borderTop: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
        display: 'flex', justifyContent: 'center'
      }}>
        <button 
          onClick={handleBookNow}
          className="btn-neon" 
          style={{ 
            width: '100%', maxWidth: 400, padding: '16px', fontSize: 16, fontWeight: 700, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 
        }}>
          <span className="btn-shimmer" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 18, height: 18 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Book this Resource
        </button>
      </div>

    </div>
  )
}

export default PublicResourcePreviewPage
