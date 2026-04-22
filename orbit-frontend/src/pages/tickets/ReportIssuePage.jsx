import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { ticketApi } from '../../api/ticketApi'

// ── Shared styles (matching booking UI) ───────────────────────────────────────
const S = {
  card: {
    background: '#131929',
    border: '1px solid #1e2d45',
    borderRadius: '12px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#f1f5f9',
    fontSize: '14px',
    padding: '10px 14px',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    background: '#0d1526',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#f1f5f9',
    fontSize: '14px',
    padding: '10px 14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#f1f5f9',
    fontSize: '14px',
    padding: '10px 14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
}

const CATEGORIES = ['ELECTRICAL', 'PLUMBING', 'IT', 'FURNITURE', 'HVAC', 'SAFETY', 'OTHER']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

// ── Priority badge preview ────────────────────────────────────────────────────
const PriorityPill = ({ p, selected, onClick }) => {
  const cfg = {
    LOW:      { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  text: '#34d399' },
    MEDIUM:   { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  text: '#fcd34d' },
    HIGH:     { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: '#fca5a5' },
    CRITICAL: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#d8b4fe' },
  }[p]

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        background: selected ? cfg.bg : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? cfg.border : 'rgba(255,255,255,0.08)'}`,
        color: selected ? cfg.text : '#475569',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {p}
    </button>
  )
}

// ── Attachment dropzone ────────────────────────────────────────────────────────
const AttachmentZone = ({ files, setFiles }) => {
  const [drag, setDrag] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    addFiles(dropped)
  }

  const addFiles = (newFiles) => {
    setFiles(prev => {
      const combined = [...prev, ...newFiles]
      return combined.slice(0, 3) // max 3
    })
  }

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx))

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        style={{
          border: `2px dashed ${drag ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px',
          padding: '28px',
          textAlign: 'center',
          cursor: 'pointer',
          background: drag ? 'rgba(6,182,212,0.04)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s',
        }}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => addFiles(Array.from(e.target.files))}
        />
        <svg style={{ width: 32, height: 32, color: '#475569', margin: '0 auto 8px' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 10.5h.008v.008H13.5V10.5zm-9 9h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          Drop images here or <span style={{ color: '#06b6d4', textDecoration: 'underline' }}>browse</span>
        </p>
        <p style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>Up to 3 images · JPG, PNG, WebP</p>
      </div>

      {/* Preview */}
      {files.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
          {files.map((f, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #1e2d45' }}
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#ef4444', border: 'none', color: '#fff',
                  fontSize: '10px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const ReportIssuePage = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
    resourceId: '',
    contactDetails: '',
  })

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.category) {
      setError('Title, description, and category are required.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const ticket = await ticketApi.createTicket(form)

      // Upload attachments if any
      for (const file of files) {
        try { await ticketApi.uploadAttachment(ticket.id, file) }
        catch (_) { /* non-blocking */ }
      }

      navigate(`/tickets/${ticket.id}`)
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit ticket.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 48 }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 12 }}
          >
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
            Report an Issue
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            Submit a maintenance or incident ticket. Our team will respond promptly.
          </p>
        </div>

        {/* ── Form card ── */}
        <form onSubmit={handleSubmit}>
          <div style={{ ...S.card, padding: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Title */}
            <div>
              <label style={S.label}>Issue Title *</label>
              <input
                style={S.input}
                placeholder="e.g. Projector not working in Lab A3"
                value={form.title}
                onChange={set('title')}
                required
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Category + Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={S.label}>Category *</label>
                <select style={S.select} value={form.category} onChange={set('category')} required>
                  <option value="">Select category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Priority</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  {PRIORITIES.map(p => (
                    <PriorityPill
                      key={p}
                      p={p}
                      selected={form.priority === p}
                      onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={S.label}>Description *</label>
              <textarea
                style={S.textarea}
                placeholder="Describe the issue in detail. What happened? Where? When?"
                value={form.description}
                onChange={set('description')}
                required
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Location/Resource */}
            <div>
              <label style={S.label}>Location / Resource ID <span style={{ color: '#475569', textTransform: 'none', fontSize: 11 }}>(optional)</span></label>
              <input
                style={S.input}
                placeholder="e.g. room ID, equipment ID, or 'Main Library 2nd floor'"
                value={form.resourceId}
                onChange={set('resourceId')}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Contact */}
            <div>
              <label style={S.label}>Preferred Contact <span style={{ color: '#475569', textTransform: 'none', fontSize: 11 }}>(optional)</span></label>
              <input
                style={S.input}
                placeholder="Phone number or best time to reach you"
                value={form.contactDetails}
                onChange={set('contactDetails')}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Attachments */}
            <div>
              <label style={S.label}>Photo Evidence <span style={{ color: '#475569', textTransform: 'none', fontSize: 11 }}>(optional, max 3)</span></label>
              <AttachmentZone files={files} setFiles={setFiles} />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fca5a5',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#cbd5e1', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-neon"
                style={{ padding: '9px 24px', fontSize: 13, fontWeight: 600 }}
              >
                {submitting ? 'Submitting…' : 'Submit Ticket'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </Layout>
  )
}

export default ReportIssuePage
