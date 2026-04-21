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

// ── Icons ────────────────────────────────────────────────────────────
const LocationIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
)

const CapacityIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
)

// ── Sub-components ────────────────────────────────────────────────────────────
const ResourceCard = ({ resource, canManage, onBook, onEdit, onDelete, index }) => {
  const meta = TYPE_META[resource.type] || { rgb: '148,163,184', icon: '📦' }
  const isActive = resource.availabilityStatus === 'ACTIVE'

  return (
    <div className={`glass-card flex flex-col overflow-hidden card-stagger-${Math.min(index + 1, 6)} group`}>
      {/* Image Container with Badge Overlay */}
      <div className="relative h-48 overflow-hidden bg-slate-900/50">
        <img 
          src={resource.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'} 
          alt={resource.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Overlay */}
        <div className="absolute top-3 right-3 anim-fade-in">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${isActive ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20' : 'bg-red-500/90 text-white shadow-lg shadow-red-500/20'}`}>
            {isActive ? 'Active' : 'Out of Service'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Header Information */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-white truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{resource.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
            <LocationIcon />
            <span className="truncate">{resource.location}</span>
          </div>
        </div>

        {/* Type Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold"
            style={{ background: `rgba(${meta.rgb},0.12)`, border: `1px solid rgba(${meta.rgb},0.25)`, color: `rgb(${meta.rgb})` }}>
            <span>{meta.icon}</span>{meta.label}
          </span>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 h-8 italic">
          {resource.description || 'No specific description provided for this resource.'}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5 pt-4 border-t border-white/5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-slate-600">
              <CapacityIcon /> Capacity
            </div>
            <p className="text-sm font-bold text-white">{resource.capacity}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-slate-600">
              <ClockIcon /> Hours
            </div>
            <p className="text-sm font-bold text-white">{resource.availableFrom} - {resource.availableTo}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={() => onBook(resource)}
            disabled={!isActive}
            className="btn-neon flex-[3] py-2.5 text-xs font-bold disabled:opacity-40"
          >
            <span className="btn-shimmer" />
            <span className="flex items-center justify-center gap-1.5">
              📅 {isActive ? 'Book Now' : 'Resource Unavailable'}
            </span>
          </button>
          
          {canManage && (
            <div className="flex gap-2 flex-1">
              <button 
                onClick={() => onEdit(resource)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-inner"
                title="Edit"
              >
                ✏️
              </button>
              <button 
                onClick={() => onDelete(resource)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:text-white hover:bg-red-500/50 transition-all shadow-inner"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Resource Form Modal ──
const ResourceModal = ({ resource, onClose, onSave, saving }) => {
  const [form, setForm] = useState(resource || EMPTY_FORM)
  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto anim-fade-in-up border-white/10 shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{resource?.id ? '✏️ Edit Resource' : '➕ Add New Resource'}</h2>
              <p className="text-xs text-slate-500 mt-1">Configure facility specifications and availability.</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-2xl text-slate-500 hover:text-white transition-all">×</button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, capacity: Number(form.capacity) }) }} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Resource Name *</label>
                <input className="input-glass" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. B405 Lecture Hall" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Category Type *</label>
                  <select className="input-glass" value={form.type} onChange={e => set('type', e.target.value)} required>
                    {TYPES.filter(t => t !== 'ALL').map(t => (
                      <option key={t} value={t} className="bg-[#050508]">{TYPE_META[t]?.label || t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Operation Status</label>
                  <select className="input-glass" value={form.availabilityStatus} onChange={e => set('availabilityStatus', e.target.value)}>
                    <option value="ACTIVE" className="bg-[#050508]">Active / Operational</option>
                    <option value="OUT_OF_SERVICE" className="bg-[#050508]">Out of Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Physical Location *</label>
                <input className="input-glass" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Main Building, Floor 4" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Capacity</label>
                  <input className="input-glass" type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="100" />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Opens At</label>
                  <input className="input-glass" type="time" value={form.availableFrom} onChange={e => set('availableFrom', e.target.value)} />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Closes At</label>
                  <input className="input-glass" type="time" value={form.availableTo} onChange={e => set('availableTo', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Detailed Description</label>
                <textarea className="input-glass resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Provide any specific rules or equipment info..." />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Cover Image URL</label>
                <input className="input-glass text-xs" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-white/5">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving} 
                className="btn-neon flex-1 py-3 text-xs"
              >
                <span className="btn-shimmer" />
                {saving ? 'Saving...' : (resource?.id ? '💾 Update Change' : '🚀 Create Resource')}
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
  const [modalResource, setModalResource] = useState(null)
  const [saving,        setSaving]        = useState(false)

  const canManage = user?.role === 'MANAGER' || user?.role === 'ADMIN'

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true)
      const hasFilters = typeFilter !== 'ALL' || statusFilter !== 'ALL'
      let url = '/resources'
      if (search.trim()) url += `?search=${encodeURIComponent(search.trim())}`
      else if (hasFilters) {
        const p = new URLSearchParams()
        if (typeFilter !== 'ALL') p.set('type', typeFilter)
        if (statusFilter !== 'ALL') p.set('status', statusFilter)
        url += `/filter?${p}`
      }
      const { data } = await axiosInstance.get(url)
      setResources(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync resource database.')
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter, statusFilter])

  useEffect(() => { fetchResources() }, [fetchResources])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/5">
              🏛️
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Resources</h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">Manage and reserve campus smart-facilities.</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="glass-card flex items-center gap-5 px-5 py-3 border-white/5 bg-white/[0.02]">
               <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <BuildingIcon />
               </div>
               <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Inventory Size</p>
                  <p className="text-xl font-black text-white mt-1 leading-none">{resources.length}</p>
               </div>
            </div>
            {canManage && (
              <button className="btn-neon px-6 py-4 text-sm flex items-center gap-2 group" onClick={() => setModalResource({})}>
                <span className="btn-shimmer" />
                <span className="text-xl leading-none group-hover:rotate-90 transition-transform duration-300">+</span> Add Resource
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Controls Bar */}
        <div className="glass-card p-6 mb-12 border-white/5 shadow-xl">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
            {/* Main Search Input */}
            <div className="xl:col-span-5 relative group">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors">
                  <SearchIcon />
               </div>
               <input 
                  className="input-glass pl-12 h-12 text-sm bg-black/20" 
                  placeholder="Find by name, room number, or keywords..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Filter Pills */}
            <div className="xl:col-span-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                 <BuildingIcon />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-2">Category:</span>
                 <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {TYPES.map(t => (
                      <button key={t} onClick={() => setTypeFilter(t)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border whitespace-nowrap ${
                          typeFilter === t ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-transparent border-transparent text-slate-500 hover:text-white'
                        }`}>
                        {t === 'ALL' ? 'ALL' : TYPE_META[t]?.label.toUpperCase()}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                 <StatusIcon />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-2">Status:</span>
                 <div className="flex gap-1.5">
                    {STATUSES.map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                          statusFilter === s ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-transparent border-transparent text-slate-500 hover:text-white'
                        }`}>
                        {s === 'ALL' ? 'ALL' : s.toUpperCase()}
                      </button>
                    ))}
                 </div>
              </div>

              {(search || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <button 
                   onClick={() => { setSearch(''); setTypeFilter('ALL'); setStatusFilter('ALL'); }}
                   className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                >
                   🔄 Reset View
                </button>
             )}
            </div>
          </div>
        </div>

        {/* Result Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 anim-fade-in">
             <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin" />
             </div>
             <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest text-white mb-1">Accessing Hub...</p>
                <p className="text-xs text-slate-500">Retrieving real-time facility availability</p>
             </div>
          </div>
        ) : error ? (
           <div className="glass-card p-12 text-center border-red-500/20 bg-red-500/5 anim-fade-in max-w-2xl mx-auto">
              <span className="text-4xl mb-4 block">⚠️</span>
              <h3 className="text-lg font-bold text-white mb-2">Connection Disrupted</h3>
              <p className="text-sm text-slate-400 mb-6">{error}</p>
              <button onClick={fetchResources} className="btn-neon px-8 py-3 text-xs">
                <span className="btn-shimmer" /> Reconect Now
              </button>
           </div>
        ) : resources.length === 0 ? (
          <div className="glass-card py-40 text-center anim-fade-in border-white/5">
             <div className="text-6xl mb-6">🏜️</div>
             <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Catalogue Empty</h3>
             <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
               {search || typeFilter !== 'ALL' || statusFilter !== 'ALL' 
                 ? "No resources match your current selection. Try a broader search or reset your filters."
                 : "The resource database is currently empty. Administrators are working on populating the catalogue."}
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 mb-12">
            {resources.map((r, i) => (
              <ResourceCard
                key={r.id}
                resource={r}
                index={i}
                canManage={canManage}
                onBook={res => navigate('/bookings/new', { state: { resourceId: res.id, resourceName: res.name } })}
                onEdit={setModalResource}
                onDelete={async (res) => {
                   if (window.confirm(`Are you sure you want to permanently delete "${res.name}"?`)) {
                      try {
                        await axiosInstance.delete(`/resources/${res.id}`);
                        fetchResources();
                      } catch (err) { alert('Delete operation failed.'); }
                   }
                }}
              />
            ))}
          </div>
        )}

        {/* Footer / Pagination Controls */}
        {!loading && !error && resources.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between py-12 border-t border-white/5 text-slate-500 gap-6 mb-16">
             <div className="flex items-center gap-6">
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Showing <span className="text-white font-black px-1.5 py-0.5 rounded bg-white/5">{resources.length}</span> results found
                </p>
                <div className="h-4 w-px bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-3">
                   <span className="text-[10px] uppercase font-black">View mode:</span>
                   <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                      <button className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-400">
                         <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 002-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                      </button>
                      <button className="p-1.5 rounded-md text-slate-600 hover:text-slate-400">
                         <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
                      </button>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <button disabled className="px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-white/5 transition-all">← Back</button>
                <div className="flex items-center gap-1.5">
                   <button className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 flex items-center justify-center text-[11px] font-black">1</button>
                   <button className="w-9 h-9 rounded-xl hover:bg-white/5 border border-transparent text-slate-500 flex items-center justify-center text-[11px] font-black transition-all">2</button>
                </div>
                <button className="px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all underline decoration-cyan-500/50 underline-offset-4">Next →</button>
             </div>
          </div>
        )}
      </div>

      {/* Persistence Modals */}
      {modalResource && (
        <ResourceModal
          resource={modalResource?.id ? modalResource : null}
          onClose={() => setModalResource(null)}
          onSave={async (formData) => {
             setSaving(true);
             try {
                if (formData.id) await axiosInstance.put(`/resources/${formData.id}`, formData);
                else await axiosInstance.post('/resources', formData);
                setModalResource(null);
                fetchResources();
             } catch (err) { alert(err.response?.data?.message || 'Transaction failed.'); }
             finally { setSaving(false); }
          }}
          saving={saving}
        />
      )}
    </Layout>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────
function BuildingIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} className="h-4 w-4"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg> }
function StatusIcon()   { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} className="h-4 w-4"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> }

export default CataloguePage
