import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'
import { ticketApi } from '../../api/ticketApi'

// ── Shared palette (matching booking pages) ───────────────────────────────────
const STATUS_CFG = {
  OPEN:        { bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.3)',  text: '#67e8f9', dot: '#06b6d4' },
  IN_PROGRESS: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fcd34d', dot: '#f59e0b' },
  RESOLVED:    { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#34d399', dot: '#10b981' },
  CLOSED:      { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', text: '#cbd5e1', dot: '#64748b' },
  REJECTED:    { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  text: '#fca5a5', dot: '#ef4444' },
}

const PRIORITY_CFG = {
  LOW:      { text: '#34d399', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)'  },
  MEDIUM:   { text: '#fcd34d', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
  HIGH:     { text: '#fca5a5', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'   },
  CRITICAL: { text: '#d8b4fe', bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)' },
}

// ── Pill badge ────────────────────────────────────────────────────────────────
const Badge = ({ label, cfg }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 9px', borderRadius: 6,
    fontSize: 11, fontWeight: 600,
    background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot || cfg.text }} />
    {label}
  </span>
)

// ── Comment bubble ────────────────────────────────────────────────────────────
const CommentBubble = ({ comment, currentUserId, onEdit, onDelete, isAdmin }) => {
  const [editing, setEditing] = useState(false)
  const [body, setBody] = useState(comment.body)
  const isOwn = comment.authorId === currentUserId

  const roleCfg = {
    ADMIN:      { color: '#d8b4fe' },
    MANAGER:    { color: '#6ee7b7' },
    TECHNICIAN: { color: '#fcd34d' },
    USER:       { color: '#94a3b8' },
  }[comment.authorRole] || { color: '#94a3b8' }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10, padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {comment.authorName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{comment.authorName}</span>
            <span style={{ fontSize: 11, color: roleCfg.color, marginLeft: 6 }}>{comment.authorRole}</span>
            {comment.edited && <span style={{ fontSize: 10, color: '#475569', marginLeft: 6 }}>(edited)</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(isOwn || isAdmin) && (
            <>
              {isOwn && !editing && (
                <button onClick={() => setEditing(true)} style={btnGhost}>Edit</button>
              )}
              <button
                onClick={() => onDelete(comment.id)}
                style={{ ...btnGhost, color: '#f87171' }}
              >Delete</button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <div style={{ marginTop: 10 }}>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(6,182,212,0.3)', borderRadius: 8,
              color: '#f1f5f9', fontSize: 13, padding: '8px 12px',
              resize: 'vertical', fontFamily: 'inherit', minHeight: 60,
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button
              onClick={() => { onEdit(comment.id, body); setEditing(false) }}
              style={btnPrimary}
            >Save</button>
            <button onClick={() => { setEditing(false); setBody(comment.body) }} style={btnGhost}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 8, lineHeight: 1.6 }}>{comment.body}</p>
      )}

      <p style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>
        {new Date(comment.createdAt).toLocaleString()}
      </p>
    </div>
  )
}

const btnGhost = {
  background: 'none', border: 'none', color: '#64748b',
  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
  padding: '2px 6px', borderRadius: 4,
}

const btnPrimary = {
  background: 'linear-gradient(135deg,#06b6d4,#3b82f6)',
  border: 'none', borderRadius: 7, color: '#fff',
  fontSize: 12, fontWeight: 600, padding: '6px 14px',
  cursor: 'pointer', fontFamily: 'inherit',
}

// ── Status Action Panel ────────────────────────────────────────────────────────
const StatusActions = ({ ticket, role, userId, onAction }) => {
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const isAssignee = ticket.assignedTo === userId
  const isAdmin = role === 'ADMIN' || role === 'MANAGER'
  const isTech = role === 'TECHNICIAN' && isAssignee

  const actions = []

  if (ticket.status === 'OPEN' && (isAdmin || isTech)) {
    actions.push({ label: 'Mark In Progress', status: 'IN_PROGRESS', color: '#f59e0b', needsNote: false })
  }
  if (ticket.status === 'IN_PROGRESS' && (isAdmin || isTech)) {
    actions.push({ label: 'Mark Resolved', status: 'RESOLVED', color: '#10b981', needsNote: true, notePlaceholder: 'Describe what was done to resolve this issue…' })
  }
  if (ticket.status === 'RESOLVED' && isAdmin) {
    actions.push({ label: 'Close Ticket', status: 'CLOSED', color: '#64748b', needsNote: false })
  }
  if (['OPEN', 'IN_PROGRESS'].includes(ticket.status) && isAdmin) {
    actions.push({ label: 'Reject', status: 'REJECTED', color: '#ef4444', needsNote: true, notePlaceholder: 'Reason for rejection…' })
  }

  if (actions.length === 0) return null

  const trigger = (action) => {
    if (action.needsNote) {
      setPendingAction(action)
      setShowNotes(true)
    } else {
      onAction(action.status, {})
    }
  }

  const confirm = () => {
    if (!notes.trim() && pendingAction?.needsNote) return
    const payload = pendingAction.status === 'RESOLVED'
      ? { status: pendingAction.status, resolutionNotes: notes }
      : { status: pendingAction.status, rejectionReason: notes }
    onAction(pendingAction.status, payload)
    setShowNotes(false)
    setNotes('')
  }

  return (
    <div style={{
      background: '#131929', border: '1px solid #1e2d45',
      borderRadius: 12, padding: 20, marginTop: 24,
    }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 14,
        textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Actions
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {actions.map(a => (
          <button
            key={a.status}
            onClick={() => trigger(a)}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: `rgba(${a.color === '#f59e0b' ? '245,158,11' : a.color === '#10b981' ? '16,185,129' : a.color === '#64748b' ? '100,116,139' : '239,68,68'},0.1)`,
              border: `1px solid ${a.color}33`,
              color: a.color, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {showNotes && (
        <div style={{ marginTop: 14 }}>
          <textarea
            placeholder={pendingAction?.notePlaceholder}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              color: '#f1f5f9', fontSize: 13, padding: '10px 12px',
              resize: 'vertical', fontFamily: 'inherit', minHeight: 72,
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={confirm} style={btnPrimary}>Confirm</button>
            <button onClick={() => { setShowNotes(false); setNotes('') }} style={btnGhost}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <p style={{
    fontSize: 12, fontWeight: 700, color: '#475569',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14,
  }}>{children}</p>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
const TicketDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role ?? 'USER'

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentBody, setCommentBody] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [error, setError] = useState('')

  const fetchTicket = async () => {
    try {
      const data = await ticketApi.getTicketById(id)
      setTicket(data)
    } catch (e) {
      setError('Could not load ticket.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTicket() }, [id])

  const handleAction = async (status, extra) => {
    try {
      await ticketApi.updateStatus(id, { status, ...extra })
      fetchTicket()
    } catch (e) {
      setError(e.response?.data?.error || 'Action failed.')
    }
  }

  const handleAddComment = async () => {
    if (!commentBody.trim()) return
    setSubmittingComment(true)
    try {
      await ticketApi.addComment(id, commentBody)
      setCommentBody('')
      fetchTicket()
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleEditComment = async (cid, body) => {
    await ticketApi.editComment(cid, body)
    fetchTicket()
  }

  const handleDeleteComment = async (cid) => {
    if (!window.confirm('Delete this comment?')) return
    await ticketApi.deleteComment(cid)
    fetchTicket()
  }

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, flexDirection: 'column', gap: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #1e2d45', borderTopColor: '#06b6d4', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#475569', fontSize: 12 }}>Loading ticket…</p>
      </div>
    </Layout>
  )

  if (!ticket) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ color: '#f87171' }}>{error || 'Ticket not found.'}</p>
        <button onClick={() => navigate(-1)} style={{ ...btnPrimary, marginTop: 12 }}>Go Back</button>
      </div>
    </Layout>
  )

  const statusCfg  = STATUS_CFG[ticket.status]  || STATUS_CFG.OPEN
  const priorityCfg = PRIORITY_CFG[ticket.priority] || PRIORITY_CFG.MEDIUM

  return (
    <Layout>
      <div style={{ maxWidth: 780, margin: '0 auto', paddingBottom: 48 }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ ...btnGhost, marginBottom: 18, padding: '2px 0' }}>
          ← Back to Tickets
        </button>

        {/* ── Header card ── */}
        <div style={{
          background: '#131929', border: '1px solid #1e2d45',
          borderRadius: 12, padding: 24, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <Badge label={ticket.status} cfg={statusCfg} />
                <Badge label={ticket.priority} cfg={{ ...priorityCfg, dot: priorityCfg.text }} />
                <span style={{ fontSize: 11, color: '#475569', padding: '3px 8px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {ticket.category}
                </span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
                {ticket.title}
              </h1>
              <p style={{ fontSize: 12, color: '#475569', margin: 0, fontFamily: 'monospace' }}>
                #{ticket.id?.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginTop: 16, whiteSpace: 'pre-wrap' }}>
            {ticket.description}
          </p>

          {/* Meta grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12, marginTop: 20,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 8, padding: 16,
          }}>
            <MetaField label="Reported by" value={ticket.createdByName} />
            <MetaField label="Assigned to" value={ticket.assignedToName || '—'} />
            <MetaField label="Created" value={new Date(ticket.createdAt).toLocaleDateString()} />
            {ticket.updatedAt && <MetaField label="Last updated" value={new Date(ticket.updatedAt).toLocaleDateString()} />}
            {ticket.contactDetails && <MetaField label="Contact" value={ticket.contactDetails} />}
            {ticket.resourceId && <MetaField label="Resource ID" value={ticket.resourceId.slice(-8)} />}
          </div>

          {/* Resolution notes */}
          {ticket.resolutionNotes && (
            <div style={{ marginTop: 16, background: 'rgba(16,185,129,0.05)',
              border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 4,
                textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resolution Notes</p>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{ticket.resolutionNotes}</p>
            </div>
          )}

          {/* Rejection reason */}
          {ticket.rejectionReason && (
            <div style={{ marginTop: 16, background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 4,
                textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rejection Reason</p>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{ticket.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* ── Attachments ── */}
        {ticket.attachments?.length > 0 && (
          <div style={{ background: '#131929', border: '1px solid #1e2d45',
            borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <SectionTitle>Attachments ({ticket.attachments.length})</SectionTitle>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {ticket.attachments.map(a => (
                <a
                  key={a.id}
                  href={ticketApi.getAttachmentUrl(a.id)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'block', borderRadius: 8,
                    border: '1px solid #1e2d45', overflow: 'hidden', transition: 'opacity 0.2s' }}
                >
                  <img
                    src={ticketApi.getAttachmentUrl(a.id)}
                    alt={a.originalFilename}
                    style={{ width: 100, height: 80, objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <p style={{ fontSize: 10, color: '#475569', padding: '4px 6px',
                    margin: 0, textAlign: 'center', maxWidth: 100,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.originalFilename}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Status actions ── */}
        <StatusActions ticket={ticket} role={role} userId={user?.id} onAction={handleAction} />

        {/* ── Comments ── */}
        <div style={{ background: '#131929', border: '1px solid #1e2d45',
          borderRadius: 12, padding: 20, marginTop: 20 }}>
          <SectionTitle>Comments ({ticket.comments?.length || 0})</SectionTitle>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {(ticket.comments || []).length === 0 && (
              <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: '20px 0' }}>
                No comments yet. Be the first to comment.
              </p>
            )}
            {(ticket.comments || []).map(c => (
              <CommentBubble
                key={c.id}
                comment={c}
                currentUserId={user?.id}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                isAdmin={role === 'ADMIN'}
              />
            ))}
          </div>

          {/* Add comment */}
          <div>
            <textarea
              placeholder="Write a comment…"
              value={commentBody}
              onChange={e => setCommentBody(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                color: '#f1f5f9', fontSize: 13, padding: '10px 12px',
                resize: 'vertical', fontFamily: 'inherit', minHeight: 72,
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                onClick={handleAddComment}
                disabled={submittingComment || !commentBody.trim()}
                className="btn-neon"
                style={{ padding: '7px 18px', fontSize: 12, fontWeight: 600, opacity: !commentBody.trim() ? 0.4 : 1 }}
              >
                {submittingComment ? 'Posting…' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}

const MetaField = ({ label, value }) => (
  <div>
    <p style={{ fontSize: 10, fontWeight: 600, color: '#475569',
      textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>
      {label}
    </p>
    <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0, fontWeight: 500 }}>
      {value}
    </p>
  </div>
)

export default TicketDetailsPage
