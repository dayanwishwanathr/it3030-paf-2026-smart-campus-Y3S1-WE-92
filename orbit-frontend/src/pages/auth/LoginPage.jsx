import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import OrbitLogo from '../../components/common/OrbitLogo'

/* ─── Eye icons ────────────────────────────────────────────────────────────── */
const EyeOn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 18, height: 18 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)
const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 18, height: 18 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)

/* ─── Animated orbit scene ─────────────────────────────────────────────────── */
const OrbitScene = () => (
  <div style={{ position: 'relative', width: 240, height: 240, flexShrink: 0 }}>
    {/* Ambient aura */}
    <div style={{
      position: 'absolute', inset: 0, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.06) 45%, transparent 75%)',
      pointerEvents: 'none',
    }} />

    {/* Static outermost dashed ring */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }} viewBox="0 0 320 320" fill="none">
      <circle cx="160" cy="160" r="155" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 10" />
    </svg>

    {/* Outer orbit — slow spin */}
    <svg className="anim-orbit" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animationDuration: '20s' }} viewBox="0 0 320 320" fill="none">
      <ellipse cx="160" cy="160" rx="148" ry="56" stroke="rgba(6,182,212,0.38)" strokeWidth="1.2" strokeDasharray="7 9" />
      <circle cx="308" cy="160" r="7" fill="#06b6d4" style={{ filter: 'drop-shadow(0 0 10px #06b6d4)' }} />
      <circle cx="12" cy="160" r="4.5" fill="#06b6d4" opacity="0.45" />
    </svg>

    {/* Middle orbit — counter spin */}
    <svg className="anim-orbit-rev" style={{ position: 'absolute', inset: '15%', width: '70%', height: '70%', animationDuration: '14s' }} viewBox="0 0 224 224" fill="none">
      <ellipse cx="112" cy="112" rx="104" ry="40" stroke="rgba(59,130,246,0.42)" strokeWidth="1.2"
        strokeDasharray="5 7" transform="rotate(-18 112 112)" />
      <circle cx="216" cy="112" r="5.5" fill="#3b82f6" style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }} />
    </svg>

    {/* Inner orbit — fast spin */}
    <svg className="anim-orbit" style={{ position: 'absolute', inset: '29%', width: '42%', height: '42%', animationDuration: '8s' }} viewBox="0 0 134 134" fill="none">
      <ellipse cx="67" cy="67" rx="60" ry="23" stroke="rgba(168,85,247,0.38)" strokeWidth="1"
        strokeDasharray="4 7" transform="rotate(12 67 67)" />
      <circle cx="127" cy="67" r="4.5" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 7px #a855f7)' }} />
    </svg>

    {/* Centre planet */}
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 38%, rgba(6,182,212,0.22), rgba(59,130,246,0.12))',
        border: '1px solid rgba(6,182,212,0.45)',
        boxShadow: '0 0 48px rgba(6,182,212,0.22), inset 0 0 32px rgba(6,182,212,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <OrbitLogo size={40} color="white" />
      </div>
    </div>

    {/* Sparkle dots */}
    <div style={{ position: 'absolute', top: '16%', right: '20%', width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 12px #f59e0b', animation: 'dotPulse 2.5s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '16%', width: 5, height: 5, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 10px #06b6d4', animation: 'dotPulse 3.2s ease-in-out infinite 0.9s' }} />
    <div style={{ position: 'absolute', top: '32%', left: '12%', width: 4, height: 4, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6', animation: 'dotPulse 2.8s ease-in-out infinite 1.6s' }} />
    <div style={{ position: 'absolute', bottom: '28%', right: '12%', width: 5, height: 5, borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 10px #a855f7', animation: 'dotPulse 3.5s ease-in-out infinite 0.4s' }} />
  </div>
)

/* ─── Feature tile ─────────────────────────────────────────────────────────── */
const FeatureTile = ({ icon, label, sub, rgb }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 16,
    borderRadius: 12, padding: '16px 15px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `rgba(${rgb},0.14)`, border: `1px solid rgba(${rgb},0.28)`,
      fontSize: 16, lineHeight: 1,
    }}>{icon}</div>
    <div>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.2, margin: 0 }}>{label}</p>
      <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{sub}</p>
    </div>
  </div>
)

/* ═══════════════════════════════════════════════════════════════════════════ */
const LoginPage = () => {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [focused, setFocused] = useState(null)

  const onChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const onSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      console.log('🔐 Attempting login...', form.email)
      console.log('📍 Backend URL: http://localhost:8080')
      
      const { data } = await axiosInstance.post('/auth/login', form)
      
      console.log('✅ Login successful')
      await login(data.token)
    } catch (err) {
      console.error('❌ Login failed:', {
        status: err.response?.status,
        message: err.response?.data?.error,
        fullError: err.message,
        backendReachable: err.response ? 'Yes' : 'No (502 means backend not running)',
      })
      
      if (err.response?.status === 502) {
        setError('Backend server not responding. Make sure backend is running on localhost:8080')
      } else if (err.response?.status === 401) {
        setError('Invalid email or password.')
      } else {
        setError(err.response?.data?.error || 'Connection error. Please check backend server.')
      }
    } finally { setLoading(false) }
  }

  const inputCss = (name) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '16px 52px',
    fontSize: 15, fontFamily: "'Inter', sans-serif",
    borderRadius: 14, outline: 'none',
    color: '#f1f5f9',
    background: focused === name ? 'rgba(6,182,212,0.05)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused === name ? 'rgba(6,182,212,0.55)' : 'rgba(255,255,255,0.09)'}`,
    boxShadow: focused === name ? '0 0 0 3px rgba(6,182,212,0.12)' : 'none',
    transition: 'all 0.2s ease',
  })

  return (
    /* Outermost centering shell — true full-screen page background */
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      background: '#050508',
      overflowY: 'auto',
      padding: '40px 32px',
      boxSizing: 'border-box',
    }}>

      {/* Global page ambient glows — sit behind the card */}
      <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

      {/* ══ THE CARD ══════════════════════════════════════════════════════════
           This single element wraps BOTH panels and floats centered on page.
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="anim-fade-in-up"
        style={{
          position: 'relative',
          width: '100%', maxWidth: 1080,
          display: 'flex',
          borderRadius: 24,
          overflow: 'hidden',
          background: '#0c0c18',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 0 1px rgba(6,182,212,0.07), 0 32px 100px rgba(0,0,0,0.75), 0 0 80px rgba(6,182,212,0.06)',
          minHeight: 520,
        }}
      >

        {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
        <div style={{
          width: '50%',
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(145deg,#06101f 0%,#060d1a 40%,#050a14 70%,#0c0c18 100%)',
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Dot grid */}
          <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none' }} />

          {/* Glow orbs */}
          <div style={{ position: 'absolute', top: -80, left: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.13) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.10) 0%,transparent 70%)', pointerEvents: 'none' }} />

          {/* ── Content ── */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 44px' }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <OrbitLogo size={44} color="white" />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', letterSpacing: '-0.03em' }}>SLIIT</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>&nbsp;Orbit</span>
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(6,182,212,0.6)', marginTop: 2 }}>
                  Smart Campus Hub
                </p>
              </div>
            </div>

            {/* Orbit scene — centred in the remaining space */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
              <OrbitScene />
            </div>

            {/* Headline */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.03em', margin: 0 }}>
                Manage campus<br />
                <span style={{ background: 'linear-gradient(90deg,#06b6d4,#3b82f6 55%,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  operations in orbit.
                </span>
              </h2>
              <p style={{ fontSize: 13, color: '#4a5568', marginTop: 10, lineHeight: 1.65, maxWidth: 380 }}>
                A unified platform for campus resources, smart bookings, and incident management — built for SLIIT.
              </p>
            </div>

            {/* Feature tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              <FeatureTile icon="🏛️" label="Resources" sub="Rooms, labs & equipment" rgb="6,182,212" />
              <FeatureTile icon="📅" label="Bookings" sub="Smart reservation system" rgb="59,130,246" />
              <FeatureTile icon="🎫" label="Support Tickets" sub="Incident & fault tracking" rgb="245,158,11" />
              <FeatureTile icon="🔔" label="Notifications" sub="Real-time alerts" rgb="168,85,247" />
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#1e2d3d' }}>© 2026 SLIIT Orbit</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#1e2d3d' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                TLS Encrypted
              </div>
            </div>
          </div>
        </div>
        {/* ══ END LEFT ══ */}

        {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
        <div style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '36px 44px',
          background: 'transparent',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Subtle ambient inside right half */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

          {/* Form container */}
          <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }} className="anim-fade-in-up">

            {/* ── Header ── */}
            <div style={{ marginBottom: 28 }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 999, padding: '6px 14px', marginBottom: 18,
                background: 'rgba(6,182,212,0.10)', border: '1px solid rgba(6,182,212,0.22)',
                fontSize: 11, fontWeight: 700, color: '#67e8f9', letterSpacing: '0.04em',
              }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 12, height: 12 }}>
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure Campus Portal
              </div>

              <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
                Welcome back
              </h1>
              <p style={{ fontSize: 15, color: '#4a5568', marginTop: 10, lineHeight: 1.5 }}>
                Sign in to your SLIIT Orbit account
              </p>
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="anim-fade-in" style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                borderRadius: 14, padding: '14px 16px', marginBottom: 24,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
              }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, color: '#f87171', flexShrink: 0, marginTop: 1 }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p style={{ fontSize: 14, color: '#fca5a5', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={onSubmit}>

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4a5568', marginBottom: 10 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focused === 'email' ? '#06b6d4' : '#4a5568', transition: 'color 0.2s' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} style={{ width: 18, height: 18 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="login-email" type="email" name="email" value={form.email}
                    onChange={onChange} required autoComplete="email"
                    placeholder="you@sliitorbit.lk"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    style={inputCss('email')}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4a5568', marginBottom: 10 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focused === 'password' ? '#06b6d4' : '#4a5568', transition: 'color 0.2s' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} style={{ width: 18, height: 18 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="login-password" type={showPw ? 'text' : 'password'} name="password" value={form.password}
                    onChange={onChange} required autoComplete="current-password"
                    placeholder="••••••••••••"
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputCss('password'), paddingRight: 52 }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                    style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#4a5568', transition: 'color 0.2s', display: 'flex' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}>
                    {showPw ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
              </div>

              {/* Sign In button */}
              <button
                id="login-submit" type="submit" disabled={loading}
                className="btn-neon"
                style={{ width: '100%', padding: '14px 28px', fontSize: 15, fontWeight: 700, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              >
                <span className="btn-shimmer" />
                {loading ? (
                  <>
                    <svg style={{ width: 18, height: 18 }} className="animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 18, height: 18 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* ── Divider ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1e2d3d' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* ── Google ── */}
            <button
              id="login-google"
              onClick={() => { window.location.href = 'http://localhost:8080/oauth2/authorization/google' }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                padding: '13px 28px', fontSize: 14, fontWeight: 600, borderRadius: 14,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: "'Inter',sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* ── Register ── */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#4a5568', marginTop: 20 }}>
              Don't have an account?{' '}
              <Link to="/register"
                style={{ color: '#67e8f9', fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a5f3fc'}
                onMouseLeave={e => e.currentTarget.style.color = '#67e8f9'}>
                Create one →
              </Link>
            </p>

          </div>
          {/* /form container */}
        </div>
        {/* ══ END RIGHT ══ */}

      </div>
      {/* ══ END CARD ══ */}

    </div>
    /* /centering shell */
  )
}

export default LoginPage
