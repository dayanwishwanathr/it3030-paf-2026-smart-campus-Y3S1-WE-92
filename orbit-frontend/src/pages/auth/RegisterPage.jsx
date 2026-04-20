import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import OrbitLogo from '../../components/common/OrbitLogo'

/* ─── Eye icons ─────────────────────────────────────────────────────────────── */
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

/* ─── Password strength ──────────────────────────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { score: s, label: 'Weak', color: '#ef4444' }
  if (s <= 3) return { score: s, label: 'Fair', color: '#f59e0b' }
  if (s === 4) return { score: s, label: 'Good', color: '#06b6d4' }
  return { score: s, label: 'Strong', color: '#10b981' }
}

/* ─── Orbit scene (same as login) ───────────────────────────────────────────── */
const OrbitScene = () => (
  <div style={{ position: 'relative', width: 240, height: 240, flexShrink: 0 }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(59,130,246,0.06) 45%, transparent 75%)', pointerEvents: 'none' }} />

    {/* Static dashed ring */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }} viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="116" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 10" />
    </svg>

    {/* Outer ring — slow spin */}
    <svg className="anim-orbit" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animationDuration: '20s' }} viewBox="0 0 240 240" fill="none">
      <ellipse cx="120" cy="120" rx="111" ry="42" stroke="rgba(168,85,247,0.38)" strokeWidth="1.2" strokeDasharray="7 9" />
      <circle cx="231" cy="120" r="7" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 10px #a855f7)' }} />
      <circle cx="9" cy="120" r="4.5" fill="#a855f7" opacity="0.45" />
    </svg>

    {/* Middle ring — counter */}
    <svg className="anim-orbit-rev" style={{ position: 'absolute', inset: '15%', width: '70%', height: '70%', animationDuration: '14s' }} viewBox="0 0 168 168" fill="none">
      <ellipse cx="84" cy="84" rx="78" ry="30" stroke="rgba(59,130,246,0.42)" strokeWidth="1.2"
        strokeDasharray="5 7" transform="rotate(-18 84 84)" />
      <circle cx="162" cy="84" r="5.5" fill="#3b82f6" style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }} />
    </svg>

    {/* Inner ring — fast */}
    <svg className="anim-orbit" style={{ position: 'absolute', inset: '29%', width: '42%', height: '42%', animationDuration: '8s' }} viewBox="0 0 101 101" fill="none">
      <ellipse cx="50.5" cy="50.5" rx="45" ry="17" stroke="rgba(6,182,212,0.38)" strokeWidth="1"
        strokeDasharray="4 7" transform="rotate(12 50.5 50.5)" />
      <circle cx="95.5" cy="50.5" r="4.5" fill="#06b6d4" style={{ filter: 'drop-shadow(0 0 7px #06b6d4)' }} />
    </svg>

    {/* Centre planet */}
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 38%, rgba(168,85,247,0.22), rgba(59,130,246,0.12))',
        border: '1px solid rgba(168,85,247,0.45)',
        boxShadow: '0 0 48px rgba(168,85,247,0.22), inset 0 0 32px rgba(168,85,247,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <OrbitLogo size={36} color="white" />
      </div>
    </div>

    {/* Sparkles */}
    <div style={{ position: 'absolute', top: '16%', right: '20%', width: 7, height: 7, borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 12px #a855f7', animation: 'dotPulse 2.5s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '16%', width: 5, height: 5, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 10px #06b6d4', animation: 'dotPulse 3.2s ease-in-out infinite 0.9s' }} />
    <div style={{ position: 'absolute', top: '32%', left: '12%', width: 4, height: 4, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6', animation: 'dotPulse 2.8s ease-in-out infinite 1.6s' }} />
    <div style={{ position: 'absolute', bottom: '28%', right: '12%', width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b', animation: 'dotPulse 3.5s ease-in-out infinite 0.4s' }} />
  </div>
)

/* ─── Step row ───────────────────────────────────────────────────────────────── */
const Step = ({ n, title, sub, last }) => (
  <div style={{ display: 'flex', gap: 12 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: '#fff',
        background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
        boxShadow: '0 0 12px rgba(168,85,247,0.4)',
      }}>{n}</div>
      {!last && <div style={{ flex: 1, width: 1, minHeight: 14, marginTop: 3, background: 'linear-gradient(to bottom, rgba(168,85,247,0.4), transparent)' }} />}
    </div>
    <div style={{ paddingBottom: last ? 0 : 14, paddingTop: 3 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.2, margin: 0 }}>{title}</p>
      <p style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>{sub}</p>
    </div>
  </div>
)

/* ─── Feature tile ───────────────────────────────────────────────────────────── */
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

/* ══════════════════════════════════════════════════════════════════════════════ */
const RegisterPage = () => {
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [focused, setFocused] = useState(null)

  const strength = getStrength(form.password)
  const pwMismatch = form.confirmPassword && form.confirmPassword !== form.password

  const onChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const onSubmit = async e => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const { data } = await axiosInstance.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
      })
      await login(data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  const inputCss = (name) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '14px 48px',
    fontSize: 14, fontFamily: "'Inter', sans-serif",
    borderRadius: 12, outline: 'none',
    color: '#f1f5f9',
    background: focused === name ? 'rgba(168,85,247,0.05)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused === name ? 'rgba(168,85,247,0.5)' : (name === 'confirmPassword' && pwMismatch ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.09)')}`,
    boxShadow: focused === name ? '0 0 0 3px rgba(168,85,247,0.10)' : 'none',
    transition: 'all 0.2s ease',
  })

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      background: '#050508',
      overflowY: 'auto',
      padding: '40px 32px',
      boxSizing: 'border-box',
    }}>

      {/* Page ambient glows */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

      {/* ══ CARD ══ */}
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
          boxShadow: '0 0 0 1px rgba(168,85,247,0.07), 0 32px 100px rgba(0,0,0,0.75), 0 0 80px rgba(168,85,247,0.06)',
          minHeight: 520,
        }}
      >

        {/* ══ LEFT PANEL ══ */}
        <div style={{
          width: '50%',
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(145deg,#0e0618 0%,#090d1a 40%,#050a14 70%,#0c0c18 100%)',
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Dot grid */}
          <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none' }} />
          {/* Glow orbs */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.09) 0%,transparent 70%)', pointerEvents: 'none' }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 44px' }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <OrbitLogo size={44} color="white" />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', letterSpacing: '-0.03em' }}>SLIIT</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>&nbsp;Orbit</span>
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(168,85,247,0.65)', marginTop: 2 }}>
                  Smart Campus Hub
                </p>
              </div>
            </div>

            {/* Orbit scene */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
              <OrbitScene />
            </div>

            {/* Headline */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.03em', margin: 0 }}>
                Join SLIIT Orbit<br />
                <span style={{ background: 'linear-gradient(90deg,#a855f7,#3b82f6 55%,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  as a campus member.
                </span>
              </h2>
              <p style={{ fontSize: 13, color: '#4a5568', marginTop: 10, lineHeight: 1.65 }}>
                Create your account for instant access to campus resources, bookings, and support tickets.
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
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#1e2d3d' }}>© 2026 SLIIT Orbit</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#1e2d3d' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 12, height: 12 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                TLS Encrypted
              </div>
            </div>
          </div>
        </div>
        {/* ══ END LEFT ══ */}

        {/* ══ RIGHT PANEL ══ */}
        <div style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '36px 44px',
          background: 'transparent',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Ambient */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

          {/* Form container */}
          <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }} className="anim-fade-in-up">

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 999, padding: '6px 14px', marginBottom: 16,
                background: 'rgba(168,85,247,0.10)', border: '1px solid rgba(168,85,247,0.25)',
                fontSize: 11, fontWeight: 700, color: '#d8b4fe', letterSpacing: '0.04em',
              }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 12, height: 12 }}>
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                New Account
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
                Create your account
              </h1>
              <p style={{ fontSize: 14, color: '#4a5568', marginTop: 8, lineHeight: 1.5 }}>
                Join the SLIIT Orbit platform
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="anim-fade-in" style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                borderRadius: 12, padding: '12px 14px', marginBottom: 20,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
              }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 15, height: 15, color: '#f87171', flexShrink: 0, marginTop: 1 }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p style={{ fontSize: 13, color: '#fca5a5', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit}>

              {/* Full Name */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4a5568', marginBottom: 8 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focused === 'name' ? '#a855f7' : '#4a5568', transition: 'color 0.2s' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} style={{ width: 17, height: 17 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="reg-name" type="text" name="name" value={form.name}
                    onChange={onChange} required autoComplete="name"
                    placeholder="e.g. Dayan Wishwanath"
                    onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    style={inputCss('name')}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4a5568', marginBottom: 8 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focused === 'email' ? '#a855f7' : '#4a5568', transition: 'color 0.2s' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} style={{ width: 17, height: 17 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="reg-email" type="email" name="email" value={form.email}
                    onChange={onChange} required autoComplete="email"
                    placeholder="you@sliitorbit.lk"
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    style={inputCss('email')}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4a5568', marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focused === 'password' ? '#a855f7' : '#4a5568', transition: 'color 0.2s' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} style={{ width: 17, height: 17 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="reg-password" type={showPw ? 'text' : 'password'} name="password" value={form.password}
                    onChange={onChange} required autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                    style={{ ...inputCss('password'), paddingRight: 48 }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#4a5568', transition: 'color 0.2s', display: 'flex' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}>
                    {showPw ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 99,
                        width: `${(strength.score / 5) * 100}%`,
                        background: strength.color,
                        boxShadow: `0 0 8px ${strength.color}`,
                        transition: 'all 0.35s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: strength.color, flexShrink: 0, minWidth: 36 }}>{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4a5568', marginBottom: 8 }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focused === 'confirmPassword' ? '#a855f7' : '#4a5568', transition: 'color 0.2s' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} style={{ width: 17, height: 17 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <input
                    id="reg-confirm" type={showCf ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                    onChange={onChange} required autoComplete="new-password"
                    placeholder="Re-enter your password"
                    onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused(null)}
                    style={{ ...inputCss('confirmPassword'), paddingRight: 48 }}
                  />
                  <button type="button" onClick={() => setShowCf(v => !v)} tabIndex={-1}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#4a5568', transition: 'color 0.2s', display: 'flex' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}>
                    {showCf ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
                {pwMismatch && (
                  <p style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>Passwords do not match</p>
                )}
              </div>

              {/* Submit */}
              <button
                id="reg-submit" type="submit" disabled={loading}
                className="btn-neon"
                style={{
                  width: '100%', padding: '14px 28px', fontSize: 15, fontWeight: 700,
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                  boxShadow: '0 0 24px rgba(168,85,247,0.35)',
                }}
              >
                <span className="btn-shimmer" />
                {loading ? (
                  <>
                    <svg style={{ width: 17, height: 17 }} className="animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Account
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 17, height: 17 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Sign in link */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#4a5568', marginTop: 20 }}>
              Already have an account?{' '}
              <Link to="/login"
                style={{ color: '#d8b4fe', fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e9d5ff'}
                onMouseLeave={e => e.currentTarget.style.color = '#d8b4fe'}>
                Sign in →
              </Link>
            </p>

          </div>
          {/* /form container */}
        </div>
        {/* ══ END RIGHT ══ */}

      </div>
      {/* ══ END CARD ══ */}

    </div>
  )
}

export default RegisterPage
