import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosInstance'

// ── Constants ─────────────────────────────────────────────────────────────────
const TYPES    = ['ALL', 'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const STATUSES = ['ALL', 'ACTIVE', 'OUT_OF_SERVICE']

const TYPE_META = {
  LECTURE_HALL: { label: 'Lecture Hall', icon: '🏛️', rgb: '6,182,212'   },
  LAB:          { label: 'Lab',          icon: '🔬', rgb: '168,85,247'  },
  MEETING_ROOM: { label: 'Meeting Room', icon: '🤝', rgb: '16,185,129'  },
  EQUIPMENT:    { label: 'Equipment',    icon: '📷', rgb: '245,158,11'  },
}

const EMPTY_FORM = {
  name: '', type: 'LECTURE_HALL', location: '', capacity: '',
  description: '', imageUrl: '', availabilityStatus: 'ACTIVE',
  availableFrom: '08:00', availableTo: '18:00',
}

// ── Sub-components ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isActive = status === 'ACTIVE'
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{
        background: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
        border:     isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
        color:      isActive ? '#6ee7b7' : '#fca5a5',
      }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: isActive ? '#10b981' : '#ef4444', boxShadow: isActive ? '0 0 5px #10b981' : '0 0 5px #ef4444' }} />
      {isActive ? 'Active' : 'Out of Service'}
    </span>
  )
}

const TypeBadge = ({ type }) => {
  const meta = TYPE_META[type] || { label: type, icon: '📦', rgb: '100,116,139' }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
      style={{ background: `rgba(${meta.rgb},0.10)`, border: `1px solid rgba(${meta.rgb},0.25)`, color: `rgb(${meta.rgb})` }}>
      <span>{meta.icon}</span>{meta.label}
    </span>
  )
}

const ResourceCard = ({ resource, canManage, onBook, onEdit, onDelete, index }) => {
  const meta = TYPE_META[resource.type] || { rgb: '100,116,139', icon: '📦' }
  const isActive = resource.availabilityStatus === 'ACTIVE'

  return (
    <div className={`glass-card flex flex-col overflow-hidden card-stagger-${Math.min(index + 1, 6)}`}>
      {/* Colour accent top bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, rgb(${meta.rgb}), transparent)` }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[15px] text-white leading-tight truncate">{resource.name}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: '#64748b' }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span className="truncate">{resource.location}</span>
            </div>
          </div>
          <StatusBadge status={resource.availabilityStatus} />
        </div>

        {/* Type badge */}
        <div className="mb-3">
          <TypeBadge type={resource.type} />
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: '#475569' }}>
          {resource.description || 'No description provided.'}
        </p>

        {/* Metadata chips */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#475569' }}>Capacity</p>
            <p className="text-sm font-bold" style={{ color: `rgb(${meta.rgb})` }}>{resource.capacity}</p>
          </div>
          <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#475569' }}>Hours</p>
            <p className="text-sm font-bold text-white">{resource.availableFrom}–{resource.availableTo}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onBook(resource)}
            disabled={!isActive}
            className="btn-neon flex-1 py-2 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="btn-shimmer" />{isActive ? '📅 Book' : 'Unavailable'}
          </button>
          {canManage && (
            <>
              <button onClick={() => onEdit(resource)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#94a3b8' }}
                title="Edit">✏️</button>
              <button onClick={() => onDelete(resource)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', color: '#fca5a5' }}
                title="Delete">🗑️</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Resource Form Modal ────────────────────────────────────────────────────────
const ResourceModal = ({ resource, onClose, onSave, saving }) => {
  const [form, setForm] = useState(resource || EMPTY_FORM)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, capacity: Number(form.capacity) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto anim-fade-in-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">{resource?.id ? 'Edit Resource' : 'Add New Resource'}</h2>
            <button onClick={onClose} className="text-2xl leading-none" style={{ color: '#475569' }}>×</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>Name *</label>
                <input className="input-glass" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Lecture Hall A1" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>Type *</label>
                  <select className="input-glass" value={form.type} onChange={e => set('type', e.target.value)} required>
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LAB">Lab</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>Status</label>
                  <select className="input-glass" value={form.availabilityStatus} onChange={e => set('availabilityStatus', e.target.value)}>
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>Location *</label>
                <input className="input-glass" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Block A, Level 2" required />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>Capacity *</label>
                <input className="input-glass" type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="e.g. 80" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>Available From</label>
                  <input className="input-glass" type="time" value={form.availableFrom} onChange={e => set('availableFrom', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>Available To</label>
                  <input className="input-glass" type="time" value={form.availableTo} onChange={e => set('availableTo', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>Description</label>
                <textarea className="input-glass resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of the resource…" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>Image URL</label>
                <input className="input-glass" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://…" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#94a3b8' }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-neon flex-1 py-2.5 text-sm font-semibold">
                <span className="btn-shimmer" />
                {saving ? 'Saving…' : (resource?.id ? 'Save Changes' : 'Create Resource')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const CataloguePage = () => {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [resources,    setResources]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  // Filter state
  const [search,     setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Modal state
  const [modalResource, setModalResource] = useState(null)  // null=closed, {}=create, resource=edit
  const [saving,        setSaving]        = useState(false)

  const canManage = user?.role === 'MANAGER' || user?.role === 'ADMIN'

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const hasFilters = typeFilter !== 'ALL' || statusFilter !== 'ALL'

      let url
      if (search.trim()) {
        url = `/resources?search=${encodeURIComponent(search.trim())}`
      } else if (hasFilters) {
        const params = new URLSearchParams()
        if (typeFilter !== 'ALL')   params.set('type', typeFilter)
        if (statusFilter !== 'ALL') params.set('status', statusFilter)
        url = `/resources/filter?${params.toString()}`
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

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleBook = (resource) => {
    navigate('/bookings/new', { state: { resourceId: resource.id, resourceName: resource.name } })
  }

  const handleSave = async (formData) => {
    setSaving(true)
    try {
      if (formData.id) {
        await axiosInstance.put(`/resources/${formData.id}`, formData)
      } else {
        await axiosInstance.post('/resources', formData)
      }
      setModalResource(null)
      await fetchResources()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (resource) => {
    if (!window.confirm(`Delete "${resource.name}"? This cannot be undone.`)) return
    try {
      await axiosInstance.delete(`/resources/${resource.id}`)
      await fetchResources()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.')
    }
  }

  const handleClearFilters = () => {
    setSearch('')
    setTypeFilter('ALL')
    setStatusFilter('ALL')
  }

  const hasActiveFilters = search || typeFilter !== 'ALL' || statusFilter !== 'ALL'

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      {/* ── Page header ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 hero-cyan">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(6,182,212,0.7)' }}>
              Module A — Facilities & Assets
            </p>
            <h1 className="text-2xl font-bold text-white">Resource Catalogue</h1>
            <p className="text-[13px] mt-1" style={{ color: '#64748b' }}>
              Browse and book campus facilities and equipment.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold"
              style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', color: '#67e8f9' }}>
              <span className="w-1.5 h-1.5 rounded-full anim-dot-pulse" style={{ background: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }} />
              {resources.length} Resources
            </span>
            {canManage && (
              <button className="btn-neon px-4 py-2 text-sm" onClick={() => setModalResource({})}>
                <span className="btn-shimmer" />+ Add Resource
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              className="input-glass pl-9"
              placeholder="Search by name, location or type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Type filter */}
          <div className="flex gap-1.5 flex-wrap">
            {TYPES.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
                style={typeFilter === t
                  ? { background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)', color: '#67e8f9' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
                }>
                {TYPE_META[t]?.icon || '🌐'} {t === 'ALL' ? 'All Types' : TYPE_META[t]?.label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex gap-1.5">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
                style={statusFilter === s
                  ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
                }>
                {s === 'ALL' ? 'All Statuses' : s === 'ACTIVE' ? '🟢 Active' : '🔴 Out of Service'}
              </button>
            ))}

            {hasActiveFilters && (
              <button onClick={handleClearFilters}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── States ── */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(6,182,212,0.3)', borderTopColor: '#06b6d4' }} />
            <p className="text-xs" style={{ color: '#475569' }}>Loading resources…</p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="glass-card p-5 text-center" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-2xl mb-2">⚠️</p>
          <p className="font-semibold text-white mb-1">Failed to load resources</p>
          <p className="text-sm mb-4" style={{ color: '#64748b' }}>{error}</p>
          <button className="btn-neon px-4 py-2 text-sm" onClick={fetchResources}>
            <span className="btn-shimmer" />Retry
          </button>
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="glass-card p-10 text-center">
          <p className="text-4xl mb-3">🏛️</p>
          <p className="font-semibold text-white mb-1">No resources found</p>
          <p className="text-sm" style={{ color: '#64748b' }}>
            {hasActiveFilters ? 'Try adjusting your filters.' : 'No resources are in the catalogue yet.'}
          </p>
          {hasActiveFilters && (
            <button onClick={handleClearFilters} className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(6,182,212,0.10)', border: '1px solid rgba(6,182,212,0.25)', color: '#67e8f9' }}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* ── Resource Grid ── */}
      {!loading && !error && resources.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {resources.map((r, i) => (
            <ResourceCard
              key={r.id}
              resource={r}
              index={i}
              canManage={canManage}
              onBook={handleBook}
              onEdit={res => setModalResource(res)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Resource Modal ── */}
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
