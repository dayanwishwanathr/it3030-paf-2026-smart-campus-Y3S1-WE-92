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
  <div className="flex items-center gap-4 rounded-xl p-4 bg-white/[0.04] border border-white/5 shadow-inner">
    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-lg border"
      style={{ background: `rgba(${rgb},0.1)`, borderColor: `rgba(${rgb},0.2)` }}>
      {icon}
    </div>
    <div>
      <p className="text-[13px] font-black text-white leading-none mb-1 uppercase tracking-tight">{label}</p>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub}</p>
    </div>
  </div>
)

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
      const { data } = await axiosInstance.post('/auth/login', form)
      await login(data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication sequence failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050508] p-8 overflow-y-auto mesh-bg">
      {/* Background orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[1080px] flex rounded-3xl overflow-hidden glass-card shadow-[0_32px_120px_rgba(0,0,0,0.8)] border-white/10 min-h-[620px] anim-fade-in-up">
        
        {/* ── Left Panel: Visual ── */}
        <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden bg-gradient-to-br from-[#06101f] to-[#0c0c18] border-r border-white/5 p-12">
          <div className="absolute inset-0 dot-grid opacity-30" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-20">
              <OrbitLogo size={44} color="white" />
              <div>
                <p className="text-2xl font-black tracking-tight text-white leading-none">
                  <span className="text-[#f59e0b]">SLIIT</span> ORBIT
                </p>
                <p className="text-[10px] font-black tracking-[0.3em] text-cyan-400/60 uppercase mt-1">Smart Campus Hub</p>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <OrbitScene />
            </div>

            <div className="mt-auto">
              <h2 className="text-3xl font-black text-white leading-none tracking-tight mb-4 uppercase">
                Manage campus<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">Operations in Orbit.</span>
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <FeatureTile icon="🏛️" label="Assets" sub="Infrastructure" rgb="6,182,212" />
                <FeatureTile icon="📅" label="Events" sub="Smart Booking" rgb="59,130,246" />
              </div>
              <p className="text-[11px] font-bold text-slate-700 tracking-[0.2em] uppercase">© 2026 Space Operations Command</p>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Form ── */}
        <div className="flex-1 flex items-center justify-center p-12 relative bg-white/[0.01]">
          <div className="w-full max-w-[380px] anim-fade-in-up">
            
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-6">
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
                 Secure Uplink Required
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Welcome Back</h1>
              <p className="text-slate-500 font-medium">Verify your credentials to enter the hub.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-2xl bg-red-400/5 border border-red-400/20 text-red-400 flex items-center gap-3 anim-fade-in">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                <p className="text-sm font-bold uppercase tracking-wide">{error}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2.5 ml-1">Terminal ID (Email)</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'email' ? 'text-cyan-400' : 'text-slate-600'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </span>
                  <input
                    type="email" name="email" value={form.email}
                    onChange={onChange} required onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    placeholder="name@sliitorbit.lk"
                    className="input-glass w-full pl-12 pr-6 py-4 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2.5 ml-1">Access Key (Password)</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'password' ? 'text-cyan-400' : 'text-slate-600'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'} name="password" value={form.password}
                    onChange={onChange} required onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                    placeholder="••••••••••••"
                    className="input-glass w-full pl-12 pr-12 py-4 font-bold"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                    {showPw ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 uppercase tracking-widest text-xs font-black shadow-[0_10px_30px_rgba(6,182,212,0.3)]">
                {loading ? 'Initiating Uplink...' : 'Establish Connection'}
                {!loading && <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
              </button>
            </form>

            <div className="my-10 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Alternate Protocol</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <button
               onClick={() => { window.location.href = 'http://localhost:8080/oauth2/authorization/google' }}
               className="btn-secondary w-full py-3.5 flex items-center justify-center gap-3 font-bold group"
            >
              <svg className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Standard OAuth Integration
            </button>

            <p className="mt-10 text-center text-sm font-medium text-slate-500">
               New to the sector? <Link to="/register" className="text-cyan-400 border-b border-cyan-400/20 hover:text-white hover:border-white transition-all font-bold">Request Access →</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
