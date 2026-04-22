import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { bookingApi } from '../../api/bookingApi'
import axiosInstance from '../../api/axiosInstance'

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  let hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'p.m' : 'a.m'
  hour = hour % 12 || 12
  return `${hour}:${m} ${ampm}`
}

const toMinutes = (timeStr) => {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':')
  return parseInt(h, 10) * 60 + parseInt(m, 10)
}

const todayStr = () => new Date().toISOString().slice(0, 10)

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  APPROVED: { bg: 'rgba(239,68,68,0.18)', border: 'rgba(239,68,68,0.5)', text: '#fca5a5', dot: '#ef4444', label: 'Approved (Booked)' },
  PENDING:  { bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.45)', text: '#fcd34d', dot: '#f59e0b', label: 'Pending Review' },
}

// ── Shared card style ─────────────────────────────────────────────────────────
const S = {
  card: {
    background: '#131929',
    border: '1px solid #1e2d45',
    borderRadius: '10px',
  },
  label: { fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' },
}

// ── Timeline Bar ─────────────────────────────────────────────────────────────
const TimelineBar = ({ bookings, availFrom, availTo }) => {
  const dayStart = toMinutes(availFrom || '08:00')
  const dayEnd   = toMinutes(availTo   || '18:00')
  const daySpan  = dayEnd - dayStart

  // Generate hour markers
  const hours = []
  for (let m = dayStart; m <= dayEnd; m += 60) {
    const h = Math.floor(m / 60)
    const ampm = h >= 12 ? 'p.m' : 'a.m'
    const label = `${h % 12 || 12}${ampm}`
    hours.push({ label, pct: ((m - dayStart) / daySpan) * 100 })
  }

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      {/* Hour tick labels */}
      <div style={{ position: 'relative', height: '18px', marginBottom: '6px' }}>
        {hours.map((h, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: `${h.pct}%`,
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: '#475569',
            whiteSpace: 'nowrap',
            fontWeight: '500',
          }}>{h.label}</span>
        ))}
      </div>

      {/* Track */}
      <div style={{
        position: 'relative',
        height: '36px',
        background: 'rgba(16,185,129,0.08)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        {/* Free label */}
        <span style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontSize: '11px', color: 'rgba(16,185,129,0.5)', fontWeight: '600',
          pointerEvents: 'none', zIndex: 0,
        }}>
          Available
        </span>

        {/* Booked segments */}
        {bookings.map((b, i) => {
          const start = toMinutes(b.startTime)
          const end   = toMinutes(b.endTime)
          const left  = Math.max(0, ((start - dayStart) / daySpan) * 100)
          const width = Math.min(100 - left, ((end - start) / daySpan) * 100)
          const cfg   = STATUS_CFG[b.status] || STATUS_CFG.PENDING

          return (
            <div
              key={i}
              title={`${b.resourceName} | ${formatTime(b.startTime)} – ${formatTime(b.endTime)} | ${b.status}`}
              style={{
                position: 'absolute',
                left:   `${left}%`,
                width:  `${width}%`,
                top: 0, bottom: 0,
                background: cfg.bg,
                borderLeft: `2px solid ${cfg.dot}`,
                borderRight: `2px solid ${cfg.dot}`,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: '10px', color: cfg.text, fontWeight: '600', whiteSpace: 'nowrap', padding: '0 4px' }}>
                {formatTime(b.startTime)} – {formatTime(b.endTime)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', display: 'inline-block' }} />
          <span style={{ fontSize: '11px', color: '#64748b' }}>Available</span>
        </div>
        {Object.entries(STATUS_CFG).map(([key, cfg]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: cfg.bg, border: `1px solid ${cfg.dot}`, display: 'inline-block' }} />
            <span style={{ fontSize: '11px', color: '#64748b' }}>{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Booking Slot Card ─────────────────────────────────────────────────────────
const SlotCard = ({ booking }) => {
  const cfg = STATUS_CFG[booking.status] || STATUS_CFG.PENDING
  return (
    <div style={{
      ...S.card,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      borderColor: cfg.border,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
        <div>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>
            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>
            {booking.purpose || 'No purpose specified'}
          </p>
        </div>
      </div>
      <span style={{
        padding: '3px 9px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: '700',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
        flexShrink: 0,
      }}>
        {booking.status}
      </span>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const AvailabilityPage = () => {
  const navigate = useNavigate()
  const [resources, setResources]   = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [date, setDate]             = useState(todayStr())
  const [bookings, setBookings]     = useState([])
  const [loading, setLoading]       = useState(false)
  const [searched, setSearched]     = useState(false)

  // Load all active resources for the dropdown
  useEffect(() => {
    axiosInstance.get('/resources', { params: { status: 'ACTIVE' } })
      .then(res => setResources(res.data?.content || res.data || []))
      .catch(err => console.error('Failed to load resources:', err))
  }, [])

  const selectedResource = resources.find(r => r.id === selectedId)

  const handleCheck = useCallback(async () => {
    if (!selectedId || !date) return
    setLoading(true)
    setSearched(true)
    try {
      const data = await bookingApi.getAvailability(selectedId, date)
      // Sort by startTime
      const sorted = [...data].sort((a, b) => a.startTime.localeCompare(b.startTime))
      setBookings(sorted)
    } catch (err) {
      console.error(err)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [selectedId, date])

  const approvedCount = bookings.filter(b => b.status === 'APPROVED').length
  const pendingCount  = bookings.filter(b => b.status === 'PENDING').length
  const isFree        = searched && bookings.length === 0

  return (
    <Layout>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 4px;
          padding: 2px;
          cursor: pointer;
          filter: invert(1);
        }
        select option { background: #131929; color: #f1f5f9; }
      `}</style>

      <div style={{ padding: '0 0 40px 0' }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg style={{ width: '16px', height: '16px', color: '#06b6d4' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
              Availability Viewer
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Check real-time time slot availability for any campus resource before making a booking.
          </p>
        </div>

        {/* ── Filter Card ── */}
        <div style={{ ...S.card, padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>

            {/* Resource picker */}
            <div>
              <p style={S.label}>Select Resource</p>
              <select
                value={selectedId}
                onChange={e => { setSelectedId(e.target.value); setSearched(false) }}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#0c1526', border: '1px solid #1e2d45',
                  borderRadius: '8px', color: selectedId ? '#f1f5f9' : '#475569',
                  fontSize: '13px', outline: 'none', cursor: 'pointer',
                }}
              >
                <option value="">-- Choose a resource --</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type?.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            {/* Date picker */}
            <div>
              <p style={S.label}>Select Date</p>
              <input
                type="date"
                value={date}
                min={todayStr()}
                onChange={e => { setDate(e.target.value); setSearched(false) }}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#0c1526', border: '1px solid #1e2d45',
                  borderRadius: '8px', color: '#f1f5f9',
                  fontSize: '13px', outline: 'none', cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Check button */}
            <div>
              <p style={{ ...S.label, visibility: 'hidden' }}>Action</p>
              <button
                onClick={handleCheck}
                disabled={!selectedId || !date || loading}
                style={{
                  width: '100%', padding: '10px 20px',
                  borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                  cursor: (!selectedId || !date || loading) ? 'not-allowed' : 'pointer',
                  background: (!selectedId || !date)
                    ? '#0c1526'
                    : 'linear-gradient(135deg, #06b6d4, #0284c7)',
                  border: (!selectedId || !date) ? '1px solid #1e2d45' : 'none',
                  color: (!selectedId || !date) ? '#475569' : '#fff',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
              >
                {loading ? 'Checking…' : '🔍 Check Availability'}
              </button>
            </div>
          </div>

          {/* Resource quick info */}
          {selectedResource && (
            <div style={{
              marginTop: '16px', paddingTop: '16px',
              borderTop: '1px solid #1e2d45',
              display: 'flex', gap: '24px', flexWrap: 'wrap',
            }}>
              <div>
                <p style={S.label}>Resource</p>
                <p style={{ fontSize: '13px', color: '#f1f5f9', margin: 0, fontWeight: '600' }}>{selectedResource.name}</p>
              </div>
              <div>
                <p style={S.label}>Type</p>
                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>{selectedResource.type?.replace('_', ' ')}</p>
              </div>
              <div>
                <p style={S.label}>Capacity</p>
                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>{selectedResource.capacity} seats</p>
              </div>
              <div>
                <p style={S.label}>Operating Hours</p>
                <p style={{ fontSize: '13px', color: '#06b6d4', margin: 0, fontWeight: '500' }}>
                  {formatTime(selectedResource.availableFrom)} – {formatTime(selectedResource.availableTo)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Results ── */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '120px', gap: '10px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #1e2d45', borderTopColor: '#06b6d4', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '13px', color: '#475569' }}>Fetching availability…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && searched && (
          <>
            {/* ── Summary badges ── */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                🔴 {approvedCount} Approved (Blocked)
              </span>
              <span style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d' }}>
                🟡 {pendingCount} Pending
              </span>
              <span style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                {isFree ? '✅ All slots free!' : '🟢 Remaining slots available'}
              </span>
            </div>

            {/* ── Timeline ── */}
            <div style={{ ...S.card, padding: '20px', marginBottom: '20px' }}>
              <p style={{ ...S.label, marginBottom: '14px', fontSize: '12px' }}>
                Visual Timeline — {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <TimelineBar
                bookings={bookings}
                availFrom={selectedResource?.availableFrom}
                availTo={selectedResource?.availableTo}
              />
            </div>

            {/* ── Slot list ── */}
            {bookings.length > 0 ? (
              <div style={{ ...S.card, padding: '20px' }}>
                <p style={{ ...S.label, marginBottom: '14px' }}>Booked Slots ({bookings.length})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {bookings.map(b => <SlotCard key={b.id} booking={b} />)}
                </div>
              </div>
            ) : (
              <div style={{ ...S.card, padding: '40px', textAlign: 'center' }}>
                <p style={{ fontSize: '32px', margin: '0 0 8px' }}>✅</p>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 6px' }}>All clear!</p>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>
                  No bookings found for <strong style={{ color: '#f1f5f9' }}>{selectedResource?.name}</strong> on this date.
                  All time slots are available!
                </p>
                <button
                  onClick={() => navigate('/bookings/new', { state: { resourceId: selectedId } })}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                    background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                    border: 'none', color: '#fff', cursor: 'pointer',
                  }}
                >
                  Book This Resource →
                </button>
              </div>
            )}

            {/* ── Book button when slots exist ── */}
            {bookings.length > 0 && (
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <button
                  onClick={() => navigate('/bookings/new', { state: { resourceId: selectedId } })}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                    background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                    border: 'none', color: '#fff', cursor: 'pointer',
                  }}
                >
                  Book This Resource →
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Empty initial state ── */}
        {!searched && !loading && (
          <div style={{ ...S.card, padding: '56px', textAlign: 'center' }}>
            <p style={{ fontSize: '40px', margin: '0 0 10px' }}>📅</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 6px' }}>
              Check Resource Availability
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Select a resource and date above, then click <strong style={{ color: '#f1f5f9' }}>"Check Availability"</strong> to see the real-time visual timeline.
            </p>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default AvailabilityPage
