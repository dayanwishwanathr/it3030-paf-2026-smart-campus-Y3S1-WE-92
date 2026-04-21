import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosInstance'

// ── Cloudinary config ────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD  = 'dkztweyhk'
const CLOUDINARY_PRESET = 'orbit_uploads'

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'p.m' : 'a.m';
  hour = hour % 12 || 12; // convert 0 to 12
  return `${hour}:${m} ${ampm}`;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const TYPES    = ['ALL', 'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const STATUSES = ['ALL', 'ACTIVE', 'OUT_OF_SERVICE']

const TYPE_LABELS = {
  ALL:          'All Types',
  LECTURE_HALL: 'Lecture Hall',
  LAB:          'Lab',
  MEETING_ROOM: 'Meeting Room',
  EQUIPMENT:    'Equipment',
}

const STATUS_LABELS = {
  ALL:            'All',
  ACTIVE:         'Active',
  OUT_OF_SERVICE: 'Out of Service',
}

const EMPTY_FORM = {
  name: '', type: 'LECTURE_HALL', location: '', capacity: '',
  description: '', imageUrl: '', availabilityStatus: 'ACTIVE',
  availableFrom: '08:00', availableTo: '18:00',
}

// ── Shared inline styles ──────────────────────────────────────────────────────
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
  pillInactive: {
    padding:       '5px 12px',
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
  pillActiveType: {
    padding:       '5px 12px',
    borderRadius:  '6px',
    fontSize:      '12px',
    fontWeight:    '600',
    background:    '#0d2d3d',
    border:        '1px solid #06b6d4',
    color:         '#22d3ee',
    cursor:        'pointer',
    whiteSpace:    'nowrap',
  },
  pillActiveStatus: {
    padding:       '5px 12px',
    borderRadius:  '6px',
    fontSize:      '12px',
    fontWeight:    '600',
    background:    '#0d2d1f',
    border:        '1px solid #10b981',
    color:         '#34d399',
    cursor:        'pointer',
    whiteSpace:    'nowrap',
  },
  divider: {
    height:     '1px',
    background: '#1e2d45',
    margin:     '0',
  },
  label: {
    fontSize:      '10px',
    fontWeight:    '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color:         '#334155',
    marginRight:   '6px',
    flexShrink:    0,
  },
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

// ── ResourceCard ──────────────────────────────────────────────────────────────
const ResourceCard = ({ resource, canManage, onBook, onEdit, onDelete }) => {
  const isActive = resource.availabilityStatus === 'ACTIVE'
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...S.card,
        borderColor: hovered ? '#2a3f5f' : '#1e2d45',
        display:     'flex',
        flexDirection: 'column',
        overflow:    'hidden',
      }}
    >
      {/* Top accent line or Image */}
      {resource.imageUrl ? (
        <div style={{ width: '100%', height: '150px', borderBottom: '1px solid #1e2d45' }}>
          <img 
            src={resource.imageUrl} 
            alt={resource.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
          />
        </div>
      ) : (
        <div style={{ height: '2px', background: '#06b6d4' }} />
      )}

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>

        {/* Title + status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {resource.name}
            </p>
            <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {resource.location}
            </p>
          </div>
          <StatusBadge status={resource.availabilityStatus} />
        </div>

        {/* Type */}
        <TypeTag type={resource.type} />

        {/* Description */}
        <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5', margin: 0, flex: 1 }}>
          {resource.description || 'No description provided.'}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#475569' }}>
          <span>
            <span style={{ color: '#94a3b8', fontWeight: '500' }}>{resource.capacity}</span>
            {' '}seats
          </span>
          <span>{formatTime(resource.availableFrom)} – {formatTime(resource.availableTo)}</span>
        </div>

        {/* Divider */}
        <div style={S.divider} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => onBook(resource)}
            disabled={!isActive}
            style={{
              flex:          1,
              padding:       '6px 0',
              borderRadius:  '6px',
              fontSize:      '12px',
              fontWeight:    '600',
              border:        'none',
              cursor:        isActive ? 'pointer' : 'not-allowed',
              background:    isActive ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : '#1a2540',
              color:         isActive ? '#fff' : '#334155',
              transition:    'opacity 0.2s',
            }}
          >
            {isActive ? 'Book' : 'Unavailable'}
          </button>

          {canManage && (
            <>
              <button
                onClick={() => onEdit(resource)}
                style={{
                  padding:      '6px 12px',
                  borderRadius: '6px',
                  fontSize:     '12px',
                  fontWeight:   '500',
                  background:   '#1a2540',
                  border:       '1px solid #243050',
                  color:        '#94a3b8',
                  cursor:       'pointer',
                  transition:   'background 0.15s',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(resource)}
                style={{
                  padding:      '6px 12px',
                  borderRadius: '6px',
                  fontSize:     '12px',
                  fontWeight:   '500',
                  background:   'rgba(239,68,68,0.07)',
                  border:       '1px solid rgba(239,68,68,0.2)',
                  color:        '#f87171',
                  cursor:       'pointer',
                  transition:   'background 0.15s',
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── ResourceModal ─────────────────────────────────────────────────────────────
const ResourceModal = ({ resource, onClose, onSave, saving }) => {
  const [form,      setForm]      = useState(resource || EMPTY_FORM)
  const [uploading, setUploading] = useState(false)
  const [dragOver,  setDragOver]  = useState(false)
  const fileInputRef = useRef(null)

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const uploadToCloudinary = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return }
    if (file.size > 10 * 1024 * 1024)   { alert('Image must be under 10 MB.');    return }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file',           file)
      fd.append('upload_preset',  CLOUDINARY_PRESET)
      const res  = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        { method: 'POST', body: fd }
      )
      const data = await res.json()
      if (data.secure_url) {
        set('imageUrl', data.secure_url)
      } else {
        alert('Upload failed: ' + (data.error?.message || 'Unknown error'))
      }
    } catch {
      alert('Upload failed. Check your internet connection.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e) => uploadToCloudinary(e.target.files[0])
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    uploadToCloudinary(e.dataTransfer.files[0])
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        ...S.card,
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Modal header */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '14px 18px',
          borderBottom:   '1px solid #1e2d45',
        }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>
            {resource?.id ? 'Edit Resource' : 'Add Resource'}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#475569', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={e => { e.preventDefault(); onSave({ ...form, capacity: Number(form.capacity) }) }}
          style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Name *</label>
            <input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Lecture Hall A1" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Type *</label>
              <select style={S.input} value={form.type} onChange={e => set('type', e.target.value)} required>
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Lab</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Status</label>
              <select style={S.input} value={form.availabilityStatus} onChange={e => set('availabilityStatus', e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Location *</label>
            <input style={S.input} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Block A, Level 2" required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Capacity *</label>
            <input style={S.input} type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="e.g. 80" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Available From</label>
              <input style={S.input} type="time" value={form.availableFrom} onChange={e => set('availableFrom', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Available To</label>
              <input style={S.input} type="time" value={form.availableTo} onChange={e => set('availableTo', e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Description</label>
            <textarea style={{ ...S.input, resize: 'none', height: '72px' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of this resource…" />
          </div>

          {/* ── Image Upload ── */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Resource Image</label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {form.imageUrl ? (
              /* ── Preview ── */
              <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e2d45' }}>
                <img
                  src={form.imageUrl}
                  alt="Resource preview"
                  style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'rgba(0,0,0,0)',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                >
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
                      background: '#131929', border: '1px solid #1e2d45', color: '#f1f5f9', cursor: 'pointer',
                    }}
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => set('imageUrl', '')}
                    style={{
                      padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              /* ── Drop Zone ── */
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border:        `2px dashed ${dragOver ? '#06b6d4' : '#1e2d45'}`,
                  borderRadius:  '8px',
                  padding:       '24px 16px',
                  textAlign:     'center',
                  cursor:        uploading ? 'not-allowed' : 'pointer',
                  background:    dragOver ? 'rgba(6,182,212,0.05)' : '#0c1526',
                  transition:    'all 0.2s',
                }}
              >
                {uploading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div
                      className="animate-spin"
                      style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #1e2d45', borderTopColor: '#06b6d4' }}
                    />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Uploading to Cloudinary…</span>
                  </div>
                ) : (
                  <>
                    <svg
                      style={{ width: '28px', height: '28px', color: '#334155', margin: '0 auto 8px' }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Click to upload or drag & drop</p>
                    <p style={{ fontSize: '11px', color: '#334155', marginTop: '3px' }}>PNG, JPG, WEBP — max 10 MB</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '9px', borderRadius: '7px',
                fontSize: '13px', fontWeight: '500',
                background: '#1a2540', border: '1px solid #243050', color: '#94a3b8', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              style={{
                flex: 1, padding: '9px', borderRadius: '7px',
                fontSize: '13px', fontWeight: '600',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                border: 'none', color: '#fff', cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                opacity: (saving || uploading) ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving…' : resource?.id ? 'Save Changes' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const CataloguePage = () => {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [resources,     setResources]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [search,        setSearch]        = useState('')
  const [typeFilter,    setTypeFilter]    = useState('ALL')
  const [statusFilter,  setStatusFilter]  = useState('ALL')
  const [modalResource, setModalResource] = useState(null)
  const [saving,        setSaving]        = useState(false)

  const canManage = user?.role === 'MANAGER' || user?.role === 'ADMIN'

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true); setError(null)
      const hasFilters = typeFilter !== 'ALL' || statusFilter !== 'ALL'
      let url
      if (search.trim()) {
        url = `/resources?search=${encodeURIComponent(search.trim())}`
      } else if (hasFilters) {
        const p = new URLSearchParams()
        if (typeFilter   !== 'ALL') p.set('type',   typeFilter)
        if (statusFilter !== 'ALL') p.set('status', statusFilter)
        url = `/resources/filter?${p.toString()}`
      } else {
        url = '/resources'
      }
      const { data } = await axiosInstance.get(url)
      setResources(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resources.')
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter, statusFilter])

  useEffect(() => { fetchResources() }, [fetchResources])

  const handleBook   = r => navigate('/bookings/new', { state: { resourceId: r.id, resourceName: r.name } })
  const handleSave   = async (formData) => {
    setSaving(true)
    try {
      if (formData.id) await axiosInstance.put(`/resources/${formData.id}`, formData)
      else             await axiosInstance.post('/resources', formData)
      setModalResource(null)
      await fetchResources()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed.')
    } finally { setSaving(false) }
  }
  const handleDelete = async (r) => {
    if (!window.confirm(`Delete "${r.name}"? This cannot be undone.`)) return
    try {
      await axiosInstance.delete(`/resources/${r.id}`)
      await fetchResources()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.')
    }
  }

  const clearFilters     = () => { setSearch(''); setTypeFilter('ALL'); setStatusFilter('ALL') }
  const hasActiveFilters = search || typeFilter !== 'ALL' || statusFilter !== 'ALL'

  return (
    <Layout>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
            Resource Catalogue
          </h1>
          <p style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>
            Browse and book campus facilities and equipment
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#475569' }}>
            {resources.length} resource{resources.length !== 1 ? 's' : ''}
          </span>
          {canManage && (
            <button
              onClick={() => setModalResource({})}
              style={{
                padding:      '7px 14px',
                borderRadius: '7px',
                fontSize:     '12px',
                fontWeight:   '600',
                background:   'linear-gradient(135deg, #06b6d4, #3b82f6)',
                border:       'none',
                color:        '#fff',
                cursor:       'pointer',
              }}
            >
              + Add Resource
            </button>
          )}
        </div>
      </div>

      {/* ── Filter panel ── */}
      <div style={{ ...S.card, padding: '14px 16px', marginBottom: '20px' }}>

        {/* Filter row: Search + Dropdowns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          
          {/* Search bar (Main) */}
          <div style={{ position: 'relative', flex: '2', minWidth: '200px' }}>
            <svg
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#475569', pointerEvents: 'none' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              style={{ ...S.input, paddingLeft: '34px' }}
              placeholder="Search by name, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Type Dropdown */}
          <div style={{ flex: '1', minWidth: '140px' }}>
            <select
              style={S.input}
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              {TYPES.map(t => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div style={{ flex: '1', minWidth: '140px' }}>
            <select
              style={S.input}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{ 
                ...S.pillInactive, 
                border: 'none', 
                background: 'transparent',
                color: '#ef4444',
                padding: '0 8px'
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px', flexDirection: 'column', gap: '10px' }}>
          <div className="animate-spin" style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #1e2d45', borderTopColor: '#06b6d4' }} />
          <p style={{ fontSize: '12px', color: '#475569' }}>Loading resources…</p>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div style={{ ...S.card, padding: '32px', textAlign: 'center', borderColor: 'rgba(239,68,68,0.25)' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '6px' }}>Failed to load resources</p>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={fetchResources}
            style={{
              padding: '7px 18px', borderRadius: '7px', fontSize: '12px', fontWeight: '600',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: 'none', color: '#fff', cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && resources.length === 0 && (
        <div style={{ ...S.card, padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '6px' }}>No resources found</p>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            {hasActiveFilters ? 'Try adjusting your filters.' : 'No resources added yet.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                marginTop: '14px', padding: '7px 18px', borderRadius: '7px',
                fontSize: '12px', fontWeight: '500',
                background: '#1a2540', border: '1px solid #243050', color: '#94a3b8', cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* ── Resource grid ── */}
      {!loading && !error && resources.length > 0 && (
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap:                 '14px',
        }}>
          {resources.map(r => (
            <ResourceCard
              key={r.id}
              resource={r}
              canManage={canManage}
              onBook={handleBook}
              onEdit={res => setModalResource(res)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modalResource !== null && (
        <ResourceModal
          resource={modalResource?.id ? modalResource : null}
          onClose={() => setModalResource(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </Layout>
  )
}

export default CataloguePage
