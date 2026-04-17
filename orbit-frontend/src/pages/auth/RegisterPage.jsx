import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import OrbitLogo from '../../components/common/OrbitLogo'

// ── Password strength ────────────────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 6)           score++
  if (pw.length >= 10)          score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Weak',   color: '#ef4444' }
  if (score <= 3) return { score, label: 'Fair',   color: '#f59e0b' }
  if (score === 4) return { score, label: 'Good',   color: '#06b6d4' }
  return               { score, label: 'Strong', color: '#10b981' }
}

// ── Step indicator ────────────────────────────────────────────────────────────
const Step = ({ n, title, desc, last }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 0 12px rgba(6,182,212,0.4)' }}>
        {n}
      </div>
      {!last && <div className="mt-1 w-px flex-1" style={{ minHeight: '18px', background: 'linear-gradient(to bottom, rgba(6,182,212,0.4), transparent)' }}/>}
    </div>
    <div className="pb-4 pt-0.5">
      <p className="text-[13px] font-semibold leading-tight text-white">{title}</p>
      <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: '#475569' }}>{desc}</p>
    </div>
  </div>
)

// ── Eye icons ────────────────────────────────────────────────────────────────
const EyeOn  = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
const EyeOff = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>

const RegisterPage = () => {
  const { login } = useAuth()
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const strength = getStrength(form.password)

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const handleSubmit = async e => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const { data } = await axiosInstance.post('/auth/register', { name: form.name, email: form.email, password: form.password })
      await login(data.token)
    } catch (err) { setError(err.response?.data?.error || 'Registration failed. Please try again.') }
    finally { setLoading(false) }
  }

  const pwMismatch = form.confirmPassword && form.confirmPassword !== form.password

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: '#050508' }}>

      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ left: '20%', top: '35%', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', transform: 'translate(-50%,-50%)' }}/>
        <div className="absolute rounded-full" style={{ right: '8%', bottom: '10%', width: '340px', height: '340px', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)' }}/>
      </div>

      <div className="relative w-full max-w-[960px] anim-fade-in">
        <div className="overflow-hidden rounded-2xl md:grid md:grid-cols-[52%_48%]"
          style={{ border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 32px 100px rgba(0,0,0,0.7)' }}>

          {/* ══ LEFT PANEL ══ */}
          <div className="relative hidden md:flex flex-col justify-between px-10 pt-10 pb-8 overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #080d1a 0%, #060a14 50%, #050508 100%)' }}>
            <div className="absolute inset-0 dot-grid opacity-60"/>
            <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)' }}/>
            <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)' }}/>

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <OrbitLogo size={38} color="white" />
              <div>
                <div className="flex items-baseline">
                  <span className="text-xl font-black tracking-tight" style={{ color: '#f59e0b' }}>SLIIT</span>
                  <span className="text-xl font-black tracking-tight text-white">&nbsp;Orbit</span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'rgba(6,182,212,0.6)' }}>Smart Campus Hub</p>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="text-[24px] font-extrabold leading-tight tracking-tight text-white">
                  Join SLIIT Orbit<br/>
                  <span style={{ background: 'linear-gradient(90deg, #06b6d4, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    as a campus member.
                  </span>
                </h2>
                <p className="mt-3 text-[13px] leading-relaxed" style={{ color: '#64748b' }}>
                  Create your account and get instant access to campus resources, bookings, and support tickets.
                </p>
              </div>

              {/* Steps */}
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>Getting started</p>
                <Step n="1" title="Fill in your details"  desc="Your name, email and a secure password"/>
                <Step n="2" title="Create your account"   desc="Submitted securely over TLS encryption"/>
                <Step n="3" title="Sign in immediately"   desc="No email verification — access right away" last/>
              </div>

              {/* What you get */}
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>What you get</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: '🏛️', label: 'Campus Resources', color: 'rgba(6,182,212,0.15)',  border: 'rgba(6,182,212,0.2)'  },
                    { icon: '📅', label: 'Booking System',   color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.2)' },
                    { icon: '🎫', label: 'Support Tickets',  color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.2)' },
                    { icon: '🔔', label: 'Notifications',    color: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.2)' },
                  ].map(({ icon, label, color, border }) => (
                    <div key={label} className="flex items-center gap-2 rounded-xl px-3 py-2"
                      style={{ background: color, border: `1px solid ${border}` }}>
                      <span className="text-base leading-none">{icon}</span>
                      <span className="text-[11px] font-semibold" style={{ color: '#cbd5e1' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between">
              <p className="text-[11px]" style={{ color: '#1e293b' }}>© 2026 SLIIT Orbit · IT3030</p>
              <div className="flex items-center gap-1 text-[11px]" style={{ color: '#1e293b' }}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                TLS Secured
              </div>
            </div>
          </div>

          {/* ══ RIGHT — Form ══ */}
          <div className="flex flex-col bg-[#07070d] px-8 py-8">

            {/* Mobile logo */}
            <div className="mb-6 flex items-center gap-2.5 md:hidden">
              <OrbitLogo size={30} color="white" />
              <div className="flex items-baseline">
                <span className="text-lg font-black" style={{ color: '#f59e0b' }}>SLIIT</span>
                <span className="text-lg font-black text-white">&nbsp;Orbit</span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', color: '#d8b4fe' }}>
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/></svg>
                New Account
              </span>
              <h1 className="mt-3 text-[24px] font-bold tracking-tight text-white">Create your account</h1>
              <p className="mt-1 text-[13px]" style={{ color: '#475569' }}>Join the SLIIT Orbit platform</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl px-4 py-3 anim-fade-in"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <svg className="h-4 w-4 mt-0.5 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 flex-1">

              {/* Name */}
              <div>
                <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </span>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder="e.g. Dayan Wishwanath" className="input-glass pl-10 pr-4 py-2.5 text-sm"/>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder="you@example.com" className="input-glass pl-10 pr-4 py-2.5 text-sm"/>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </span>
                  <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                    placeholder="Min. 6 characters" className="input-glass pl-10 pr-10 py-2.5 text-sm"/>
                  <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#475569' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                    {showPw ? <EyeOff/> : <EyeOn/>}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(strength.score / 5) * 100}%`, background: strength.color, boxShadow: `0 0 8px ${strength.color}` }}/>
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  </span>
                  <input type={showCf ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                    placeholder="Re-enter your password"
                    className={`input-glass pl-10 pr-10 py-2.5 text-sm ${pwMismatch ? 'error' : ''}`}/>
                  <button type="button" onClick={() => setShowCf(v => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#475569' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                    {showCf ? <EyeOff/> : <EyeOn/>}
                  </button>
                </div>
                {pwMismatch && <p className="mt-1.5 text-[11px] text-red-400">Passwords do not match</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-neon w-full py-3 text-sm flex items-center justify-center gap-2 mt-1">
                <span className="btn-shimmer"/>
                {loading ? (
                  <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Creating account…</>
                ) : (
                  <>Create Account<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-5">
              <div className="mb-4 h-px" style={{ background: 'rgba(255,255,255,0.07)' }}/>
              <p className="text-center text-sm" style={{ color: '#475569' }}>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold transition-colors" style={{ color: '#67e8f9' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a5f3fc'}
                  onMouseLeave={e => e.currentTarget.style.color = '#67e8f9'}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default RegisterPage
