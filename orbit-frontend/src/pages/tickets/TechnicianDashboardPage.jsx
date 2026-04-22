import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'
import { ticketApi } from '../../api/ticketApi'

// ── Shared constants ──────────────────────────────────────────────────────────
const STATUS_CFG = {
  OPEN:        { bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.3)',  text: '#67e8f9', dot: '#06b6d4' },
  IN_PROGRESS: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fcd34d', dot: '#f59e0b' },
  RESOLVED:    { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#34d399', dot: '#10b981' },
  CLOSED:      { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', text: '#cbd5e1', dot: '#64748b' },
  REJECTED:    { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  text: '#fca5a5', dot: '#ef4444' },
}

const PRIORITY_CFG = {
  LOW:      { text: '#34d399' },
  MEDIUM:   { text: '#fcd34d' },
  HIGH:     { text: '#fca5a5' },
  CRITICAL: { text: '#d8b4fe' },
}

const SLA_BADGE = {
  ON_TRACK:         { color: '#10b981', label: 'On Track'          },
  AT_RISK:          { color: '#f59e0b', label: '⚠ At Risk'          },
  BREACHED:         { color: '#ef4444', label: '🚨 Breached'         },
  RESOLVED_ON_TIME: { color: '#06b6d4', label: '⚡ On Time'          },
  RESOLVED_LATE:    { color: '#94a3b8', label: 'Resolved Late'      },
}

const S = {
  card: {
    background: '#131929',
    border: '1px solid #1e2d45',
    borderRadius: 10,
    transition: 'all 0.2s',
  },
  pillInactive: {
    padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
    background: '#0c1526', border: '1px solid #1e2d45', color: '#64748b',
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
  },
  pillActive: {
    padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
    background: '#0d2d3d', border: '1px solid #06b6d4', color: '#22d3ee',
    cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 0 10px rgba(6,182,212,0.15)',
  },
}

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.OPEN
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
      {status?.replace('_', ' ')}
    </span>
  )
}

// ── Ticket card ───────────────────────────────────────────────────────────────
const TicketCard = ({ ticket, onQuickAction, role, userId }) => {
  const [hovered, setHovered] = useState(false)
  const priorityCfg = PRIORITY_CFG[ticket.priority] || PRIORITY_CFG.MEDIUM
  const isAssignee  = ticket.assignedTo === userId
  const canProgress = (role === 'TECHNICIAN' && isAssignee) || role === 'ADMIN' || role === 'MANAGER'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...S.card,
        background:   hovered ? '#151e32' : '#131929',
        borderColor:  hovered ? '#2a3f5f' : '#1e2d45',
        transform:    hovered ? 'translateY(-2px)' : 'none',
        boxShadow:    hovered ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 16, gap: 10,
      }}
    >
      {/* Top row: title + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ticket.title}
          </p>
          <p style={{ fontSize: 10, color: '#475569', margin: '2px 0 0', fontFamily: 'monospace' }}>
            #{ticket.id?.slice(-8).toUpperCase()}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      {/* Info row */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 6, padding: '8px 10px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px',
      }}>
        <MetaChip label="Category" value={ticket.category} />
        <MetaChip label="Priority" value={ticket.priority} valueColor={priorityCfg.text} />
        <MetaChip label="Reporter" value={ticket.createdByName || '—'} />
        <MetaChip label="Assigned" value={ticket.assignedToName || '—'} />
      </div>

      {/* SLA badge */}
      {ticket.slaStatus && (() => {
        const sla = SLA_BADGE[ticket.slaStatus]
        return sla ? (
          <span style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: 4,
            fontSize: 10, fontWeight: 700,
            background: `${sla.color}18`,
            border: `1px solid ${sla.color}44`,
            color: sla.color, alignSelf: 'flex-start',
          }}>
            ⏱ SLA: {sla.label}
          </span>
        ) : null
      })()}

      {/* Description preview */}
      <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {ticket.description}
      </p>

      {/* Spacer */}
      <div style={{ flex: 1 }} />
      <div style={{ height: 1, background: '#1e2d45' }} />

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>
          {new Date(ticket.createdAt).toLocaleDateString()}
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          {canProgress && ticket.status === 'IN_PROGRESS' && (
            <button
              onClick={() => onQuickAction(ticket.id, 'RESOLVED')}
              style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                color: '#34d399', cursor: 'pointer',
              }}
            >
              Mark Resolved
            </button>
          )}
          {canProgress && ticket.status === 'OPEN' && (
            <button
              onClick={() => onQuickAction(ticket.id, 'IN_PROGRESS')}
              style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                color: '#fcd34d', cursor: 'pointer',
              }}
            >
              Start
            </button>
          )}
          <Link
            to={`/tickets/${ticket.id}`}
            style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)',
              color: '#22d3ee', textDecoration: 'none',
            }}
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  )
}

const MetaChip = ({ label, value, valueColor }) => (
  <div>
    <p style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase',
      letterSpacing: '0.04em', margin: '0 0 1px', fontWeight: 600 }}>{label}</p>
    <p style={{ fontSize: 11, color: valueColor || '#cbd5e1', margin: 0, fontWeight: 500 }}>{value}</p>
  </div>
)

// ── Stats strip ────────────────────────────────────────────────────────────────
const StatStrip = ({ tickets }) => {
  const counts = tickets.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1
    return acc
  }, {})

  const stats = [
    { label: 'Open',        value: counts.OPEN        || 0, color: '6,182,212'  },
    { label: 'In Progress', value: counts.IN_PROGRESS || 0, color: '245,158,11' },
    { label: 'Resolved',    value: counts.RESOLVED    || 0, color: '16,185,129' },
    { label: 'Total',       value: tickets.length,          color: '148,163,184' },
  ]

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: `rgba(${s.color},0.07)`,
          border: `1px solid rgba(${s.color},0.2)`,
          borderRadius: 10, padding: '10px 18px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72,
        }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: `rgb(${s.color})`,
            textShadow: `0 0 10px rgba(${s.color},0.4)` }}>{s.value}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: `rgba(${s.color},0.7)`,
            textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── SLA Stats Panel (ADMIN / MANAGER / TECHNICIAN) ───────────────────────────
const fmtMin = (min) => {
  if (min == null) return '—'
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

const SlaStatsPanel = ({ stats }) => {
  const items = [
    { label: 'Avg Response Time',   value: fmtMin(stats.avgTimeToFirstResponseMinutes), color: '6,182,212'   },
    { label: 'Avg Resolution Time', value: fmtMin(stats.avgTimeToResolutionMinutes),    color: '16,185,129'  },
    { label: 'SLA Breaches',        value: stats.breachedCount ?? 0,                    color: '239,68,68'   },
  ]
  return (
    <div style={{
      background: 'rgba(6,182,212,0.03)',
      border: '1px solid rgba(6,182,212,0.12)',
      borderRadius: 10, padding: '14px 18px',
      marginBottom: 20,
      display: 'flex', gap: 0, flexWrap: 'wrap',
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase',
        letterSpacing: '0.07em', margin: '0 0 12px', width: '100%' }}>⏱ SLA Performance</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%' }}>
        {items.map(s => (
          <div key={s.label} style={{
            background: `rgba(${s.color},0.07)`,
            border: `1px solid rgba(${s.color},0.2)`,
            borderRadius: 8, padding: '8px 16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120,
          }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: `rgb(${s.color})`,
              textShadow: `0 0 8px rgba(${s.color},0.3)` }}>{s.value}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: `rgba(${s.color},0.7)`,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2,
              textAlign: 'center' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const TechnicianDashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role ?? 'USER'

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [slaStats, setSlaStats] = useState(null)

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const data = await ticketApi.getTickets(filter === 'ALL' ? null : filter)
      setTickets(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTickets() }, [filter])

  // Load SLA stats for privileged roles
  useEffect(() => {
    if (role === 'ADMIN' || role === 'MANAGER' || role === 'TECHNICIAN') {
      ticketApi.getStats().then(setSlaStats).catch(() => {})
    }
  }, [])

  const handleQuickAction = async (ticketId, status) => {
    try {
      await ticketApi.updateStatus(ticketId, { status })
      fetchTickets()
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to update ticket')
    }
  }

  const FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

  const pageTitle = role === 'TECHNICIAN' ? 'My Assigned Tickets'
    : role === 'ADMIN' || role === 'MANAGER' ? 'All Tickets'
    : 'My Tickets'

  return (
    <Layout>
      <div style={{ paddingBottom: 32 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: '#f1f5f9', margin: '0 0 4px' }}>
              {pageTitle}
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              {role === 'TECHNICIAN' ? 'Manage your assigned incident tickets'
                : role === 'USER' ? 'Track the status of your submitted tickets'
                : 'Review and manage all incident tickets'}
            </p>
          </div>
          <button
            onClick={() => navigate('/tickets/new')}
            className="btn-neon"
            style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600 }}
          >
            + Report Issue
          </button>
        </div>

        {/* ── Stats ── */}
        {tickets.length > 0 && <StatStrip tickets={tickets} />}

        {/* ── SLA Performance Panel ── */}
        {slaStats && (role === 'ADMIN' || role === 'MANAGER' || role === 'TECHNICIAN') && (
          <SlaStatsPanel stats={slaStats} />
        )}

        {/* ── Filters ── */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={filter === f ? S.pillActive : S.pillInactive}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: 160, flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%',
              border: '2px solid #1e2d45', borderTopColor: '#06b6d4',
              animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: 12, color: '#475569' }}>Loading tickets…</p>
          </div>
        ) : tickets.length === 0 ? (
          <div style={{ ...S.card, padding: 48, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12,
              background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg style={{ width: 24, height: 24, color: '#06b6d4' }} fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', margin: '0 0 6px' }}>
              No tickets found
            </p>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>
              {filter !== 'ALL' ? `No ${filter.replace('_', ' ').toLowerCase()} tickets.` : 'No tickets have been submitted yet.'}
            </p>
            <button
              onClick={() => navigate('/tickets/new')}
              className="btn-neon"
              style={{ padding: '8px 20px', fontSize: 13 }}
            >
              Report an Issue
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {tickets.map(t => (
              <TicketCard
                key={t.id}
                ticket={t}
                onQuickAction={handleQuickAction}
                role={role}
                userId={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TechnicianDashboardPage
