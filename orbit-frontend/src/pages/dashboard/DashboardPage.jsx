import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import { bookingApi } from '../../api/bookingApi'

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const BookIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: '#06b6d4' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const TicketIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: '#f59e0b' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
)

// ── Stat chip ────────────────────────────────────────────────────────────────
const StatChip = ({ label, value, color }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    borderRadius: 16, padding: '14px 20px', minWidth: 90,
    background: `rgba(${color},0.08)`, border: `1px solid rgba(${color},0.22)`,
  }}>
    <span style={{ fontSize: 28, fontWeight: 900, color: `rgb(${color})`, textShadow: `0 0 16px rgba(${color},0.5)`, lineHeight: 1 }}>
      {value}
    </span>
    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6, color: `rgba(${color},0.7)` }}>
      {label}
    </span>
  </div>
)

// ── Action card ───────────────────────────────────────────────────────────────
const ActionCard = ({ icon, title, desc, to, accentRgb }) => (
  <Link to={to} className="glass-card-btn group" style={{
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '28px 24px', minHeight: 160, textDecoration: 'none',
    borderRadius: 20,
  }}>
    {/* Icon orb */}
    <div style={{
      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      background: `rgba(${accentRgb},0.10)`, border: `1px solid rgba(${accentRgb},0.25)`,
      boxShadow: `0 0 20px rgba(${accentRgb},0.08)`,
    }}>
      {icon}
    </div>

    <div>
      <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 0 }}>{desc}</p>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, fontSize: 12, fontWeight: 600, color: `rgb(${accentRgb})` }}>
      <span>Get started</span>
      <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>
  </Link>
)

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_CFG = {
  USER:       { label: '👤 USER',       rgb: '6,182,212'  },
  TECHNICIAN: { label: '🔧 TECHNICIAN', rgb: '245,158,11' },
  ADMIN:      { label: '⚡ ADMIN',      rgb: '168,85,247' },
  MANAGER:    { label: '🏗️ MANAGER',   rgb: '16,185,129' },
}

const DashboardPage = () => {
  const { user } = useAuth()
  const role = user?.role ?? 'USER'
  const cfg = ROLE_CFG[role] ?? ROLE_CFG.USER
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const [stats, setStats] = useState({ total: '—', approved: '—', pending: '—' })

  useEffect(() => {
    bookingApi.getMyBookings().then(data => {
      const total    = data.length
      const approved = data.filter(b => b.status === 'APPROVED').length
      const pending  = data.filter(b => b.status === 'PENDING').length
      setStats({ total, approved, pending })
    }).catch(err => console.error(err))
  }, [])

  return (
    <Layout>

      {/* ── Verification banner ─────────────────────────────────────────── */}
      {!user?.verified && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
          background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 18, padding: '18px 24px', marginBottom: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'rgba(245,158,11,0.14)', border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2} style={{ width: 18, height: 18 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24', margin: 0 }}>Account not verified</p>
              <p style={{ fontSize: 12, color: '#78350f', margin: '4px 0 0', lineHeight: 1.5 }}>
                Enter your Student ID to unlock bookings, tickets, and all features.
              </p>
            </div>
          </div>
          <Link to="/profile" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 12, flexShrink: 0,
            background: 'rgba(245,158,11,0.16)', border: '1px solid rgba(245,158,11,0.38)',
            color: '#fbbf24', fontWeight: 700, fontSize: 13, textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.26)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.16)'}>
            Verify Now →
          </Link>
        </div>
      )}

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl" style={{
        background: `rgba(${cfg.rgb},0.05)`,
        border: `1px solid rgba(${cfg.rgb},0.15)`,
        padding: '36px 40px',
        marginBottom: 32,
      }}>
        {/* Dot grid texture */}
        <div className="absolute inset-0 dot-grid opacity-30" />
        {/* Right glow blob */}
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(${cfg.rgb},0.18) 0%, transparent 70%)` }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left: greeting */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: `rgba(${cfg.rgb},0.7)`, marginBottom: 10 }}>
              Smart Campus Hub
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.2 }}>
              Welcome back, {firstName} 👋
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '10px 0 16px', lineHeight: 1.6 }}>
              Here's what's happening on campus today.
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              borderRadius: 99, padding: '5px 12px',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
              background: `rgba(${cfg.rgb},0.12)`, border: `1px solid rgba(${cfg.rgb},0.25)`, color: `rgb(${cfg.rgb})`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: `rgb(${cfg.rgb})`, boxShadow: `0 0 6px rgb(${cfg.rgb})` }} />
              {cfg.label}
            </span>
          </div>

          {/* Right: stat chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flexShrink: 0 }}>
            <StatChip label="Bookings" value={stats.total}    color="6,182,212" />
            <StatChip label="Approved" value={stats.approved} color="16,185,129" />
            <StatChip label="Pending"  value={stats.pending}  color="168,85,247" />
          </div>
        </div>
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Quick Actions</h2>
          <span style={{ fontSize: 12, color: '#334155' }}>— jump right in</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          <ActionCard
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="#06b6d4" strokeWidth={1.8} style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
            title="Book a Resource"
            desc="Reserve campus rooms, labs, and equipment 24/7"
            to="/bookings/new"
            accentRgb={cfg.rgb}
          />
          <ActionCard
            icon={<TicketIcon />}
            title="Report an Issue"
            desc="Submit a maintenance or facility incident ticket"
            to="/tickets/new"
            accentRgb="245,158,11"
          />
          <ActionCard
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={1.8} style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
            title="Browse Resources"
            desc="Explore all available campus facilities"
            to="/resources"
            accentRgb="16,185,129"
          />
          <ActionCard
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="#a855f7" strokeWidth={1.8} style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>}
            title="Notifications"
            desc="View your campus activity alerts and updates"
            to="/notifications"
            accentRgb="168,85,247"
          />
        </div>
      </div>

    </Layout>
  )
}

export default DashboardPage
