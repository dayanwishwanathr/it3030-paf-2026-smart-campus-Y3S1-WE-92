import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { bookingApi } from '../../api/bookingApi'
import axiosInstance from '../../api/axiosInstance'

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
const TYPE_LABELS = {
  ALL:          'All Types',
  LECTURE_HALL: 'Lecture Hall',
  LAB:          'Lab',
  MEETING_ROOM: 'Meeting Room',
  EQUIPMENT:    'Equipment',
}

const S = {
  card: {
    background:   '#131929',
    border:       '1px solid #1e2d45',
    borderRadius: '10px',
    transition:   'border-color 0.2s',
  },
  input: {
    width:           '100%',
    background:      '#0c1526',
    border:          '1px solid #1e2d45',
    borderRadius:    '8px',
    color:           '#f1f5f9',
    fontSize:        '13px',
    padding:         '8px 12px',
    fontFamily:      'inherit',
    outline:         'none',
    transition:      'border-color 0.2s',
  },
  label: {
    fontSize:      '11px',
    fontWeight:    '500',
    color:         '#64748b',
    marginBottom:  '5px',
    display:       'block'
  },
  divider: {
    height:     '1px',
    background: '#1e2d45',
    margin:     '0',
  },
  btnPrimary: {
    padding:       '9px',
    borderRadius:  '7px',
    fontSize:      '13px',
    fontWeight:    '600',
    background:    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    border:        'none',
    color:         '#fff',
    cursor:        'pointer',
    width:         '100%',
    textAlign:     'center'
  }
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const active = status === 'ACTIVE'
  return (
    <span style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           '5px',
      padding:       '2px 8px',
      borderRadius:  '4px',
      fontSize:      '11px',
      fontWeight:    '500',
      background:    active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
      border:        active ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
      color:         active ? '#34d399' : '#f87171',
      flexShrink:    0,
    }}>
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: active ? '#10b981' : '#ef4444',
        flexShrink: 0,
      }} />
      {active ? 'Active' : 'Offline'}
    </span>
  )
}

// ── TypeTag ───────────────────────────────────────────────────────────────────
const TypeTag = ({ type }) => (
  <span style={{
    display:      'inline-block',
    padding:      '2px 8px',
    borderRadius: '4px',
    fontSize:     '11px',
    fontWeight:   '500',
    background:   '#1a2540',
    border:       '1px solid #243050',
    color:        '#94a3b8',
  }}>
    {TYPE_LABELS[type] ?? type}
  </span>
)

// ── ResourceSelectCard ────────────────────────────────────────────────────────
const ResourceSelectCard = ({ resource, onSelect }) => {
  const [hovered, setHovered] = useState(false)
  const isActive = resource.availabilityStatus === 'ACTIVE'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...S.card,
        background:  hovered ? '#151e32' : '#131929',
        borderColor: hovered ? '#06b6d4' : '#1e2d45',
        display:     'flex',
        flexDirection: 'column',
        overflow:    'hidden',
        textAlign:   'left',
        opacity:     isActive ? 1 : 0.6,
        padding: 0,
        width: '100%',
        transform:   hovered ? 'translateY(-2px)' : 'none',
        transition:  'all 0.2s',
        boxShadow:   hovered ? '0 4px 20px rgba(6,182,212,0.1)' : 'none'
      }}
    >
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
        
        {/* Top Header: Title & Type */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: hovered ? '#22d3ee' : '#f1f5f9', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
              {resource.name}
            </p>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <svg style={{ display: 'inline', width: '12px', height: '12px', marginRight: '4px', verticalAlign: '-2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {resource.location}
            </p>
          </div>
          <TypeTag type={resource.type} />
        </div>

        {/* Capacity & Time Info Box */}
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
            <p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px', fontWeight: '600' }}>Capacity</p>
            <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, fontWeight: '500' }}>{resource.capacity} seats</p>
          </div>
          <div>
            <p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px', fontWeight: '600' }}>Hours</p>
            <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, fontWeight: '500' }}>{formatTime(resource.availableFrom)} - {formatTime(resource.availableTo)}</p>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isActive) onSelect(resource.id);
          }}
          disabled={!isActive}
          style={{
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            gap:           '6px',
            width:         '100%',
            padding:       '8px 0',
            borderRadius:  '6px',
            fontSize:      '13px',
            fontWeight:    '600',
            border:        isActive ? '1px solid rgba(6,182,212,0.4)' : '1px solid #1e2d45',
            cursor:        isActive ? 'pointer' : 'not-allowed',
            background:    isActive 
                             ? (hovered ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(6,182,212,0.1)')
                             : '#1a2540',
            color:         isActive ? (hovered ? '#fff' : '#22d3ee') : '#64748b',
            transition:    'all 0.2s',
          }}
        >
          {isActive ? (
            <>
              Select Resource
              <svg style={{ width: '14px', height: '14px', transform: hovered ? 'translateX(2px)' : 'none', transition: 'transform 0.2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </>
          ) : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}


const BookResourcePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialResourceId = searchParams.get('resourceId')

  const [resources, setResources] = useState([])
  const [loadingResources, setLoadingResources] = useState(true)
  
  const [formData, setFormData] = useState({
    resourceId: initialResourceId || '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: ''
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axiosInstance.get('/resources')
      .then(res => {
        setResources(res.data)
        setLoadingResources(false)
      })
      .catch(err => {
        console.error(err)
        setLoadingResources(false)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (selectedResource) {
      // ✓ VALIDATION 1: Ensure start time is before end time
      if (formData.startTime >= formData.endTime) {
        setError('Start time must be earlier than the end time.')
        return
      }
      
      // ✓ VALIDATION 2: Check resource availability window
      const availStart = selectedResource.availableFrom || '00:00'
      const availEnd = selectedResource.availableTo || '23:59'

      if (formData.startTime < availStart || formData.endTime > availEnd) {
        setError(`This resource is only available between ${formatTime(availStart)} and ${formatTime(availEnd)}.`)
        return
      }

      // ✓ VALIDATION 3: Verify attendee count is valid (numeric and >= 1)
      const attendees = parseInt(formData.attendees, 10)
      if (isNaN(attendees) || attendees < 1) {
        setError('Expected attendees must be at least 1.')
        return
      }

      // ✓ VALIDATION 4: Ensure attendees don't exceed resource capacity
      if (selectedResource.capacity && attendees > selectedResource.capacity) {
        setError(`Expected attendees cannot exceed the maximum capacity of ${selectedResource.capacity}.`)
        return
      }
    }

    setSubmitting(true)

    try {
      await bookingApi.createBooking(formData)
      navigate('/bookings')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedResource = resources.find(r => r.id === formData.resourceId)
  const step1 = !formData.resourceId

  const handleReset = () => {
    setFormData({
      resourceId: '',
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
      attendees: ''
    });
    setError('');
  };

  return (
    <Layout>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 4px;
          padding: 2px;
          cursor: pointer;
          filter: invert(1); /* Makes the black icon white for dark mode */
        }
      `}</style>
      <div style={{ padding: '0 0 32px 0' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 4px' }}>
            Book a Resource
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            {step1 ? 'Select a campus facility or equipment to book.' : 'Fill in the booking details for your selected resource.'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {step1 ? (
          <div>
            {loadingResources ? (
              <p style={{ fontSize: '13px', color: '#475569' }}>Loading resources...</p>
            ) : (
              <div style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap:                 '14px',
              }}>
                {resources.map(res => (
                  <ResourceSelectCard 
                    key={res.id} 
                    resource={res} 
                    onSelect={(id) => setFormData(prev => ({ ...prev, resourceId: id }))} 
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ ...S.card, padding: '24px' }}>
            
            {/* Selected Resource Overview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resource Selected</span>
                {selectedResource && (
                  <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', margin: '4px 0 0' }}>
                    {selectedResource.name}
                  </h2>
                )}
              </div>
              {!initialResourceId && (
                <button 
                  type="button" 
                  onClick={handleReset}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = '#ef4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; }}
                >
                  Reset Form
                </button>
              )}
            </div>

            <div style={S.divider} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              
              <div>
                <label style={S.label}>Date *</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  style={S.input}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={S.label}>Start Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={S.label}>End Time *</label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    style={S.input}
                  />
                </div>
              </div>

              <div>
                <label style={S.label}>Purpose *</label>
                <input
                  type="text"
                  name="purpose"
                  required
                  placeholder="e.g., Team meeting, Project presentation"
                  value={formData.purpose}
                  onChange={handleChange}
                  style={S.input}
                />
              </div>

              <div>
                <label style={S.label}>Expected Attendees *</label>
                <input
                  type="number"
                  name="attendees"
                  min="1"
                  max={selectedResource?.capacity || undefined}
                  required
                  placeholder="Number of people"
                  value={formData.attendees}
                  onChange={handleChange}
                  style={S.input}
                />
              </div>

              <div style={{ marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ ...S.btnPrimary, opacity: submitting ? 0.6 : 1 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>

          </div>
        )}
      </div>
    </Layout>
  )
}

export default BookResourcePage
