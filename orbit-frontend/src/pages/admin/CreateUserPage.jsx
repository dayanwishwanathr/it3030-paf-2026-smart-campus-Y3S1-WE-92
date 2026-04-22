import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import axiosInstance from '../../api/axiosInstance'

const ROLES = ['USER', 'MANAGER', 'TECHNICIAN', 'ADMIN']

const ROLE_CFG = {
  USER:       { rgb: '6,182,212',  desc: 'Standard student account' },
  MANAGER:    { rgb: '16,185,129', desc: 'Manages resources and bookings' },
  TECHNICIAN: { rgb: '245,158,11', desc: 'Handles maintenance tickets' },
  ADMIN:      { rgb: '168,85,247', desc: 'Full system access' },
}

export default function CreateUserPage() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'USER' })
  const [focused, setFocused] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const inputStyle = (name) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '13px 16px', fontSize: 14, fontFamily: "'Inter',sans-serif",
    borderRadius: 12, outline: 'none', color: '#f1f5f9',
    background: focused === name ? 'rgba(6,182,212,0.05)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused === name ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.09)'}`,
    boxShadow: focused === name ? '0 0 0 3px rgba(6,182,212,0.10)' : 'none',
    transition: 'all 0.2s',
  })

  const labelStyle = {
    display: 'block', fontSize: 10, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em',
    color: '#475569', marginBottom: 8,
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('All fields are required'); return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters'); return
    }
    setSaving(true)
    try {
      await axiosInstance.post('/users', form)
      navigate('/admin/users')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  const selectedRgb = ROLE_CFG[form.role]?.rgb ?? '6,182,212'

  return (
    <Layout>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 32 }}>
        <button onClick={() => navigate('/admin/users')} style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
          background: 'none', border: 'none', color: '#475569', cursor: 'pointer',
          fontSize: 13, fontFamily: "'Inter',sans-serif", padding: 0, transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 15, height: 15 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to User Management
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Create New User</h1>
        <p style={{ fontSize: 13, color: '#475569', marginTop: 8 }}>
          Manually create an account. Admin & Manager accounts are pre-verified.
        </p>
      </div>

      {/* ── Form card ── */}
      <div style={{ maxWidth: 560 }}>
        <div style={{
          background: '#0c0c18', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(168,85,247,0.06), 0 24px 80px rgba(0,0,0,0.6)',
        }}>
          {/* Card header */}
          <div style={{
            padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'linear-gradient(145deg,rgba(168,85,247,0.07),transparent)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'rgba(168,85,247,0.14)', border: '1px solid rgba(168,85,247,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgb(168,85,247)" strokeWidth={1.8} style={{ width: 18, height: 18 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Account Details</p>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Fill in the new user's information</p>
            </div>
          </div>

          {/* Form body */}
          <form onSubmit={onSubmit} style={{ padding: '28px 32px' }}>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 12, marginBottom: 20,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
              }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 15, height: 15, color: '#f87171', flexShrink: 0, marginTop: 1 }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <p style={{ fontSize: 13, color: '#fca5a5', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Full Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Full Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Dayan Wishwanath"
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                style={inputStyle('name')} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="e.g. student@sliit.lk"
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                style={inputStyle('email')} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle('password'), paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#475569' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 17, height: 17 }}>
                    {showPw
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {ROLES.map(r => {
                  const rgb = ROLE_CFG[r].rgb
                  const active = form.role === r
                  return (
                    <button key={r} type="button" onClick={() => set('role', r)}
                      style={{
                        padding: '12px 14px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                        background: active ? `rgba(${rgb},0.12)` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? `rgba(${rgb},0.4)` : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: active ? `0 0 0 1px rgba(${rgb},0.15)` : 'none',
                        transition: 'all 0.2s',
                      }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: active ? `rgb(${rgb})` : '#94a3b8', margin: 0 }}>{r}</p>
                      <p style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>{ROLE_CFG[r].desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={saving} className="btn-neon"
              style={{
                width: '100%', padding: '14px', fontSize: 14, fontWeight: 700,
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer',
              }}>
              <span className="btn-shimmer" />
              {saving ? (
                <>
                  <svg style={{ width: 16, height: 16 }} className="animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  Create User
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
