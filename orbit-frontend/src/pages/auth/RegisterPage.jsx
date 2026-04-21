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

/* ─── Password strength ──────────────────────────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { score: s, label: 'WEAK', color: '#ef4444' }
  if (s <= 3) return { score: s, label: 'FAIR', color: '#f59e0b' }
  if (s === 4) return { score: s, label: 'GOOD', color: '#06b6d4' }
  return { score: s, label: 'SOLID', color: '#10b981' }
}

/* ─── Orbit scene (same as login) ───────────────────────────────────────────── */
const OrbitScene = () => (
   <div style={{ position: 'relative', width: 240, height: 240, flexShrink: 0 }}>
     <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(59,130,246,0.06) 45%, transparent 75%)', pointerEvents: 'none' }} />
     <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }} viewBox="0 0 240 240" fill="none">
       <circle cx="120" cy="120" r="116" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 10" />
     </svg>
     <svg className="anim-orbit" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animationDuration: '20s' }} viewBox="0 0 240 240" fill="none">
       <ellipse cx="120" cy="120" rx="111" ry="42" stroke="rgba(168,85,247,0.38)" strokeWidth="1.2" strokeDasharray="7 9" />
       <circle cx="231" cy="120" r="7" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 10px #a855f7)' }} />
     </svg>
     <svg className="anim-orbit-rev" style={{ position: 'absolute', inset: '15%', width: '70%', height: '70%', animationDuration: '14s' }} viewBox="0 0 168 168" fill="none">
       <ellipse cx="84" cy="84" rx="78" ry="30" stroke="rgba(59,130,246,0.42)" strokeWidth="1.2" strokeDasharray="5 7" transform="rotate(-18 84 84)" />
       <circle cx="162" cy="84" r="5.5" fill="#3b82f6" style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }} />
     </svg>
     <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       <div style={{
         width: 72, height: 72, borderRadius: '50%',
         background: 'radial-gradient(circle at 38% 38%, rgba(168,85,247,0.22), rgba(59,130,246,0.12))',
         border: '1px solid rgba(168,85,247,0.45)',
         boxShadow: '0 0 48px rgba(168,85,247,0.22)',
         display: 'flex', alignItems: 'center', justifyContent: 'center',
       }}>
         <OrbitLogo size={36} color="white" />
       </div>
     </div>
   </div>
)

/* ─── Feature tile ───────────────────────────────────────────────────────────── */
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
    if (form.password !== form.confirmPassword) { setError('Passwords mismatch detected.'); return }
    if (form.password.length < 6) { setError('Key length insufficient (min 6 chars).'); return }
    setLoading(true)
    try {
      const { data } = await axiosInstance.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
      })
      await login(data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'Entity creation failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050508] p-8 overflow-y-auto mesh-bg">
       {/* Background orbs */}
       <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
       <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

       <div className="relative w-full max-w-[1080px] flex rounded-3xl overflow-hidden glass-card shadow-[0_32px_120px_rgba(0,0,0,0.8)] border-white/10 min-h-[620px] anim-fade-in-up">
         
         {/* ── Left Panel ── */}
         <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden bg-gradient-to-br from-[#0e0618] to-[#0c0c18] border-r border-white/5 p-12">
           <div className="absolute inset-0 dot-grid opacity-30" />
           
           <div className="relative z-10 flex flex-col h-full">
             <div className="flex items-center gap-4 mb-20">
               <OrbitLogo size={44} color="white" />
               <div>
                  <p className="text-2xl font-black tracking-tight text-white leading-none">
                    <span className="text-[#f59e0b]">SLIIT</span> ORBIT
                  </p>
                  <p className="text-[10px] font-black tracking-[0.3em] text-purple-400/60 uppercase mt-1">Smart Campus Hub</p>
               </div>
             </div>

             <div className="flex-1 flex items-center justify-center">
               <OrbitScene />
             </div>

             <div className="mt-auto">
               <h2 className="text-3xl font-black text-white leading-none tracking-tight mb-4 uppercase">
                 Join SLIIT Orbit<br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">Expand the Network.</span>
               </h2>
               <div className="grid grid-cols-2 gap-3 mb-8">
                 <FeatureTile icon="📅" label="Protocol" sub="Event Engine" rgb="168,85,247" />
                 <FeatureTile icon="🛡️" label="Identity" sub="Secure Access" rgb="6,182,212" />
               </div>
               <p className="text-[11px] font-bold text-slate-700 tracking-[0.2em] uppercase">© 2026 Space Operations Command</p>
             </div>
           </div>
         </div>

         {/* ── Right Panel ── */}
         <div className="flex-1 flex items-center justify-center p-12 relative bg-white/[0.01]">
           <div className="w-full max-w-[380px] anim-fade-in-up">
             
             <div className="mb-8 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/20 text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] animate-pulse" />
                  New Entity Registration
               </div>
               <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Create Identity</h1>
               <p className="text-slate-500 font-medium">Join the unified campus infrastructure.</p>
             </div>

             {error && (
               <div className="mb-6 p-4 rounded-2xl bg-red-400/5 border border-red-400/20 text-red-400 flex items-center gap-3 anim-fade-in">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                 <p className="text-sm font-bold uppercase tracking-wide">{error}</p>
               </div>
             )}

             <form onSubmit={onSubmit} className="space-y-4">
               <div>
                 <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 ml-1">Entity Name</label>
                 <div className="relative">
                   <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'name' ? 'text-purple-400' : 'text-slate-600'}`}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   </span>
                   <input
                     type="text" name="name" value={form.name}
                     onChange={onChange} required onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                     placeholder="Digital Alias"
                     className="input-glass w-full pl-12 pr-6 py-3.5 font-bold"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 ml-1">Uplink Address (Email)</label>
                 <div className="relative">
                   <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'email' ? 'text-purple-400' : 'text-slate-600'}`}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   </span>
                   <input
                     type="email" name="email" value={form.email}
                     onChange={onChange} required onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                     placeholder="name@sliitorbit.lk"
                     className="input-glass w-full pl-12 pr-6 py-3.5 font-bold"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 ml-1">Access Key (Password)</label>
                 <div className="relative">
                   <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'password' ? 'text-purple-400' : 'text-slate-600'}`}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   </span>
                   <input
                     type={showPw ? 'text' : 'password'} name="password" value={form.password}
                     onChange={onChange} required onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                     placeholder="Secret Sequence"
                     className="input-glass w-full pl-12 pr-12 py-3.5 font-bold"
                   />
                   <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                     {showPw ? <EyeOff /> : <EyeOn />}
                   </button>
                 </div>
                 {form.password && (
                   <div className="flex items-center gap-6 mt-3 ml-1">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full transition-all duration-500" style={{ width: `${(strength.score/5)*100}%`, background: strength.color, boxShadow: `0 0 10px ${strength.color}` }} />
                      </div>
                      <span className="text-[9px] font-black tracking-widest leading-none" style={{ color: strength.color }}>{strength.label}</span>
                   </div>
                 )}
               </div>

               <div className="pb-4">
                 <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 ml-1">Confirm Access Key</label>
                 <div className="relative">
                   <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'confirmPassword' ? (pwMismatch ? 'text-red-400' : 'text-purple-400') : 'text-slate-600'}`}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                   </span>
                   <input
                     type={showCf ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                     onChange={onChange} required onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused(null)}
                     placeholder="Verify Sequence"
                     className={`input-glass w-full pl-12 pr-12 py-3.5 font-bold ${pwMismatch ? '!border-red-500/50' : ''}`}
                   />
                   <button type="button" onClick={() => setShowCf(!showCf)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                     {showCf ? <EyeOff /> : <EyeOn />}
                   </button>
                 </div>
               </div>

               <button type="submit" disabled={loading} className="btn-primary !bg-gradient-to-r from-purple-500 to-blue-500 w-full py-4 uppercase tracking-widest text-xs font-black shadow-[0_10px_30px_rgba(168,85,247,0.3)]">
                 {loading ? 'Processing Protocol...' : 'Initialize Identity'}
                 {!loading && <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
               </button>
             </form>

             <p className="mt-8 text-center text-sm font-medium text-slate-500">
                Already registered? <Link to="/login" className="text-purple-400 border-b border-purple-400/20 hover:text-white hover:border-white transition-all font-bold">Sign In →</Link>
             </p>

           </div>
         </div>

       </div>
     </div>
  )
}

export default RegisterPage
