import { useState, useRef } from 'react'
import { useNavigate }      from 'react-router-dom'
import { useAuth }          from '../../context/AuthContext'
import axiosInstance        from '../../api/axiosInstance'
import OrbitLogo            from '../../components/common/OrbitLogo'

const CLOUD_NAME    = 'dqaxt8iqi'
const UPLOAD_PRESET = 'sliit-orbit'

const FACULTY_MAP = { IT: 'Computing', EN: 'Engineering', BM: 'Business', HS: 'Humanities & Science' }
const FACULTY_COLOR = { Computing: '#06b6d4', Engineering: '#f59e0b', Business: '#10b981', 'Humanities & Science': '#a855f7' }

function detectFaculty(id) {
  const prefix = id?.toUpperCase().slice(0, 2)
  return FACULTY_MAP[prefix] || null
}

function validateCampusId(id) {
  return /^(IT|EN|BM|HS)\d{8}$/i.test(id?.trim())
}

const EyeOn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 17, height: 17 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
)
const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 17, height: 17 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
  </svg>
)

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]         = useState({ name: user?.name || '', campusId: user?.campusId || '', password: '', confirmPassword: '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.profilePicture || null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [focused, setFocused]   = useState(null)
  const fileRef = useRef()

  const detectedFaculty = detectFaculty(form.campusId)
  const campusIdValid   = form.campusId ? validateCampusId(form.campusId) : true
  const facultyColor    = FACULTY_COLOR[detectedFaculty] || '#06b6d4'

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB'); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const uploadToCloudinary = async () => {
    if (!avatarFile) return null
    const fd = new FormData()
    fd.append('file', avatarFile)
    fd.append('upload_preset', UPLOAD_PRESET)
    const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Image upload failed')
    return data.secure_url
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')

    if (form.campusId && !campusIdValid) { setError('Invalid Student ID format. Example: IT23413474'); return }
    if (form.password && form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password && form.password !== form.confirmPassword) { setError('Passwords do not match'); return }

    setSaving(true)
    try {
      let profilePicture = null
      if (avatarFile) {
        setUploading(true)
        profilePicture = await uploadToCloudinary()
        setUploading(false)
      }

      const payload = {}
      if (form.name && form.name !== user?.name)           payload.name           = form.name
      if (form.campusId && form.campusId !== user?.campusId) payload.campusId     = form.campusId.toUpperCase().trim()
      if (form.password)                                    payload.password       = form.password
      if (profilePicture)                                   payload.profilePicture = profilePicture

      await axiosInstance.patch('/users/me/profile', payload)
      await refreshUser()
      setSuccess('Profile saved successfully!')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile')
    } finally {
      setSaving(false); setUploading(false)
    }
  }

  const inputCss = (name) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '13px 16px', fontSize: 14, fontFamily: "'Inter',sans-serif",
    borderRadius: 12, outline: 'none', color: '#f1f5f9',
    background: focused === name ? 'rgba(6,182,212,0.05)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused === name ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.09)'}`,
    boxShadow: focused === name ? '0 0 0 3px rgba(6,182,212,0.10)' : 'none',
    transition: 'all 0.2s',
  })

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ minHeight: '100vh', background: '#050508', fontFamily: "'Inter',sans-serif", padding: '40px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      {/* Ambient glows */}
      <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)', pointerEvents: 'none' }}/>

      <div style={{ width: '100%', maxWidth: 640, position: 'relative', zIndex: 1 }} className="anim-fade-in-up">

        {/* Back button */}
        <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 13, fontFamily: "'Inter',sans-serif", marginBottom: 28, padding: 0, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color='#94a3b8'} onMouseLeave={e => e.currentTarget.style.color='#475569'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Dashboard
        </button>

        {/* Card */}
        <div style={{ background: '#0c0c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(6,182,212,0.06), 0 24px 80px rgba(0,0,0,0.7)' }}>

          {/* Header bar */}
          <div style={{ padding: '28px 36px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(145deg,#06101f,#0c0c18)', paddingBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <OrbitLogo size={32} color="white"/>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', letterSpacing: '-0.01em' }}>SLIIT</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}> Orbit</span>
                <p style={{ fontSize: 10, color: 'rgba(6,182,212,0.6)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 1 }}>My Profile</p>
              </div>
            </div>

            {/* Verification status badge */}
            {!user?.verified ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.3)', fontSize: 12, fontWeight: 700, color: '#fbbf24' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'dotPulse 1.5s ease-in-out infinite' }}/>
                Account not verified — enter your Student ID below
              </div>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.3)', fontSize: 12, fontWeight: 700, color: '#34d399' }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Verified · {user?.faculty} Faculty · {user?.campusId}
              </div>
            )}
          </div>

          {/* Form body */}
          <form onSubmit={onSubmit} style={{ padding: '32px 36px' }}>

            {/* Avatar upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(6,182,212,0.4)', boxShadow: '0 0 24px rgba(6,182,212,0.15)', background: '#0a0a16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : <span style={{ fontSize: 28, fontWeight: 800, color: '#06b6d4' }}>{initials}</span>
                  }
                  {uploading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,8,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                      <svg style={{ width: 24, height: 24, color: '#06b6d4' }} className="animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => fileRef.current.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', border: '2px solid #0c0c18', background: 'rgba(6,182,212,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} style={{ width: 13, height: 13 }}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }}/>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{user?.name}</p>
                <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{user?.email}</p>
                <p style={{ fontSize: 11, color: '#334155', marginTop: 6 }}>Click the camera icon to update photo · Max 5 MB</p>
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', marginBottom: 20 }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 15, height: 15, color: '#f87171', flexShrink: 0, marginTop: 1 }}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                <p style={{ fontSize: 13, color: '#fca5a5', margin: 0 }}>{error}</p>
              </div>
            )}
            {success && (
              <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', marginBottom: 20 }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 15, height: 15, color: '#34d399', flexShrink: 0, marginTop: 1 }}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                <p style={{ fontSize: 13, color: '#6ee7b7', margin: 0 }}>{success}</p>
              </div>
            )}

            {/* Section: Identity */}
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1e293b', marginBottom: 14 }}>Account Details</p>

            {/* Full name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#475569', marginBottom: 8 }}>Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name"
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} style={inputCss('name')}/>
            </div>

            {/* Email — readonly */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#475569', marginBottom: 8 }}>Email Address <span style={{ color: '#1e293b', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(cannot change)</span></label>
              <input value={user?.email || ''} readOnly style={{ ...inputCss('email'), color: '#475569', cursor: 'not-allowed', opacity: 0.6 }}/>
            </div>

            {/* Section: Verification */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, marginBottom: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1e293b', marginBottom: 14 }}>Student Verification</p>

              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#475569', marginBottom: 8 }}>
                  Student ID {user?.verified && <span style={{ color: '#34d399', marginLeft: 6 }}>✓ Verified</span>}
                </label>
                <input value={form.campusId} onChange={e => { setForm({ ...form, campusId: e.target.value }); setError('') }}
                  placeholder="e.g. IT23413474"
                  onFocus={() => setFocused('campusId')} onBlur={() => setFocused(null)}
                  style={{ ...inputCss('campusId'), border: `1px solid ${!campusIdValid && form.campusId ? 'rgba(239,68,68,0.5)' : focused === 'campusId' ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.09)'}` }}
                />
              </div>

              {/* Real-time faculty detection */}
              {detectedFaculty && campusIdValid && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }} className="anim-fade-in">
                  <span style={{ fontSize: 13 }}>🎓</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: facultyColor }}>{detectedFaculty} Faculty detected</span>
                </div>
              )}
              {form.campusId && !campusIdValid && (
                <p style={{ fontSize: 11, color: '#f87171', marginBottom: 8 }}>Format: IT / EN / BM / HS followed by 8 digits</p>
              )}
              <p style={{ fontSize: 11, color: '#334155', marginBottom: 0 }}>
                Prefixes: IT = Computing · EN = Engineering · BM = Business · HS = Humanities & Science
              </p>
            </div>

            {/* Section: Security */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, marginBottom: 28 }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1e293b', marginBottom: 14 }}>
                {user?.provider === 'GOOGLE' ? 'Set Password (optional — enables email login)' : 'Change Password (optional)'}
              </p>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#475569', marginBottom: 8 }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Leave blank to keep current"
                    onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                    style={{ ...inputCss('password'), paddingRight: 44 }}/>
                  <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                    {showPw ? <EyeOff/> : <EyeOn/>}
                  </button>
                </div>
              </div>

              {form.password && (
                <div style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#475569', marginBottom: 8 }}>Confirm Password</label>
                  <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                    style={{ ...inputCss('confirm'), border: `1px solid ${form.confirmPassword && form.confirmPassword !== form.password ? 'rgba(239,68,68,0.5)' : focused === 'confirm' ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.09)'}` }}/>
                  {form.confirmPassword && form.confirmPassword !== form.password && (
                    <p style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>Passwords do not match</p>
                  )}
                </div>
              )}
            </div>

            {/* Save button */}
            <button type="submit" disabled={saving} className="btn-neon"
              style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span className="btn-shimmer"/>
              {saving ? (
                <><svg style={{ width: 17, height: 17 }} className="animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>{uploading ? 'Uploading image…' : 'Saving…'}</>
              ) : (
                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 17, height: 17 }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Save Profile{!user?.verified && form.campusId && campusIdValid ? ' & Verify Account' : ''}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
