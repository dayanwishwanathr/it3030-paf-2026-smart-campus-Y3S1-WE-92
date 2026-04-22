import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'

const ROLES = ['USER', 'MANAGER', 'TECHNICIAN', 'ADMIN']

// ── Shared input style (matching Add Resource modal) ────────────────────────
const SI = {
  input: {
    width: '100%', boxSizing: 'border-box',
    background: '#0c1526', border: '1px solid #1e2d45',
    borderRadius: '8px', color: '#f1f5f9',
    fontSize: '13px', padding: '8px 12px',
    fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
  },
  label: {
    display: 'block', fontSize: '11px', fontWeight: '500',
    color: '#64748b', marginBottom: '5px',
  },
}

// ── CreateUserModal ──────────────────────────────────────────────────────────
const CreateUserModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MANAGER' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password) { setError('All fields are required'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setSaving(true)
    try {
      const { data } = await axiosInstance.post('/users', form)
      onCreated(data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user')
    } finally { setSaving(false) }
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: '#131929', border: '1px solid #1e2d45', borderRadius: '12px',
        width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #1e2d45' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>Create Staff Account</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '13px' }}>

          {error && (
            <div style={{ padding: '9px 12px', borderRadius: '7px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', fontSize: '12px', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <div>
            <label style={SI.label}>Full Name *</label>
            <input style={SI.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Kavindu Perera" required
              onFocus={e => e.target.style.borderColor = '#1e4d6b'} onBlur={e => e.target.style.borderColor = '#1e2d45'} />
          </div>

          <div>
            <label style={SI.label}>Email Address *</label>
            <input type="email" style={SI.input} value={form.email} onChange={e => set('email', e.target.value)} placeholder="e.g. staff@sliit.lk" required
              onFocus={e => e.target.style.borderColor = '#1e4d6b'} onBlur={e => e.target.style.borderColor = '#1e2d45'} />
          </div>

          <div>
            <label style={SI.label}>Password *</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} style={{ ...SI.input, paddingRight: 38 }} value={form.password}
                onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" required
                onFocus={e => e.target.style.borderColor = '#1e4d6b'} onBlur={e => e.target.style.borderColor = '#1e2d45'} />
              <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 15, height: 15 }}>
                  {showPw
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                  }
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label style={SI.label}>Role *</label>
            <select style={SI.input} value={form.role} onChange={e => set('role', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#1e4d6b'} onBlur={e => e.target.style.borderColor = '#1e2d45'}>
              <option value="MANAGER">Manager</option>
              <option value="TECHNICIAN">Technician</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '9px', borderRadius: '7px', fontSize: '13px', fontWeight: '500', background: '#1a2540', border: '1px solid #243050', color: '#94a3b8', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{ flex: 1, padding: '9px', borderRadius: '7px', fontSize: '13px', fontWeight: '600', background: 'linear-gradient(135deg,rgba(168,85,247,0.9),rgba(139,60,220,0.9))', border: 'none', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Role badge ────────────────────────────────────────────────────────────────
const ROLE_CFG = {
  ADMIN: { rgb: '168,85,247', label: '⚡ ADMIN' },
  MANAGER: { rgb: '16,185,129', label: '🏗️ MANAGER' },
  TECHNICIAN: { rgb: '245,158,11', label: '🔧 TECHNICIAN' },
  USER: { rgb: '6,182,212', label: '👤 USER' },
}

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CFG[role] ?? { rgb: '100,116,139', label: role }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      borderRadius: 99, padding: '4px 10px',
      fontSize: 10, fontWeight: 700,
      background: `rgba(${cfg.rgb},0.12)`,
      border: `1px solid rgba(${cfg.rgb},0.28)`,
      color: `rgb(${cfg.rgb})`,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}

const AVATAR_STYLE = {
  ADMIN: 'role-admin-avatar',
  MANAGER: 'role-manager-avatar',
  TECHNICIAN: 'role-tech-avatar',
  USER: 'role-user-avatar',
}

const UserManagementPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try { setLoading(true); const { data } = await axiosInstance.get('/users'); setUsers(data) }
    catch { setError('Failed to load users.') }
    finally { setLoading(false) }
  }

  const handleRoleChange = async (uid, newRole) => {
    setUpdating(uid)
    try { const { data } = await axiosInstance.patch(`/users/${uid}/role`, { role: newRole }); setUsers(prev => prev.map(u => u.id === uid ? data : u)) }
    catch { setError('Failed to update role.') }
    finally { setUpdating(null) }
  }

  const handleDelete = async uid => {
    setDeleting(uid)
    try { await axiosInstance.delete(`/users/${uid}`); setUsers(prev => prev.filter(u => u.id !== uid)); setConfirmDel(null) }
    catch { setError('Failed to delete user.') }
    finally { setDeleting(null) }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = d => d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <>
      <Layout>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.2 }}>
            User Management
          </h1>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block', flexShrink: 0 }} />
            {users.length} registered users
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            borderRadius: 14, padding: '14px 16px', marginBottom: 20,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <svg style={{ width: 16, height: 16, color: '#f87171', flexShrink: 0, marginTop: 1 }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p style={{ fontSize: 13, color: '#fca5a5', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* ── Search bar + Create button ── */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', maxWidth: 360, flex: 1 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }}>
              <svg style={{ width: 15, height: 15 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              style={{
                width: '100%', boxSizing: 'border-box',
                paddingLeft: 42, paddingRight: 16, paddingTop: 11, paddingBottom: 11,
                fontSize: 13, fontFamily: "'Inter',sans-serif",
                borderRadius: 12, outline: 'none', color: '#f1f5f9',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                transition: 'all 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(6,182,212,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.10)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {/* Create User button */}
          <button
            onClick={() => setShowCreate(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
              padding: '11px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.85), rgba(139,60,220,0.9))',
              color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: "'Inter',sans-serif",
              boxShadow: '0 0 20px rgba(168,85,247,0.3)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(168,85,247,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(168,85,247,0.3)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 15, height: 15 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create User
          </button>
        </div>

        {/* ── Table card ── */}
        <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>

          {loading ? (
            <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: '#334155' }}>
              <div style={{ position: 'relative', width: 40, height: 40 }}>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} className="anim-orbit" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="16" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle cx="36" cy="20" r="2.5" fill="#06b6d4" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }} />
                </div>
              </div>
              <p style={{ fontSize: 13 }}>Loading users…</p>
            </div>

          ) : filtered.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#334155' }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>No users found.</p>
              <p style={{ fontSize: 12, marginTop: 6 }}>Try a different search term</p>
            </div>

          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['User', 'Role', 'Provider', 'Joined', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '14px 24px', textAlign: 'left',
                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.12em', color: '#334155',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr
                      key={u.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* User */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          {u.profilePicture ? (
                            <img src={u.profilePicture} alt={u.name}
                              style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, boxShadow: '0 0 0 2px rgba(6,182,212,0.35)' }} />
                          ) : (
                            <div className={`${AVATAR_STYLE[u.role] ?? 'bg-slate-600'}`}
                              style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{u.name}</p>
                            <p style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role badge */}
                      <td style={{ padding: '16px 24px' }}><RoleBadge role={u.role} /></td>

                      {/* Provider */}
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          borderRadius: 99, padding: '4px 10px', fontSize: 10, fontWeight: 600,
                          ...(u.provider === 'GOOGLE'
                            ? { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }
                            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }),
                        }}>
                          {u.provider === 'GOOGLE' && (
                            <svg style={{ width: 11, height: 11 }} viewBox="0 0 24 24">
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                          )}
                          {u.provider}
                        </span>
                      </td>

                      {/* Joined */}
                      <td style={{ padding: '16px 24px', fontSize: 12, color: '#475569', whiteSpace: 'nowrap' }}>
                        {formatDate(u.createdAt)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 24px' }}>
                        {u.id !== currentUser?.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {/* Role select */}
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value)}
                              disabled={updating === u.id}
                              style={{
                                borderRadius: 10, fontSize: 12, fontWeight: 600,
                                padding: '7px 10px', outline: 'none', cursor: 'pointer',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#e2e8f0', fontFamily: "'Inter',sans-serif",
                                opacity: updating === u.id ? 0.5 : 1,
                                transition: 'all 0.2s',
                              }}
                            >
                              {ROLES.map(r => <option key={r} value={r} style={{ background: '#0a0a14' }}>{r}</option>)}
                            </select>

                            {/* Delete */}
                            {confirmDel === u.id ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <button
                                  onClick={() => handleDelete(u.id)} disabled={deleting === u.id}
                                  style={{
                                    borderRadius: 10, padding: '7px 12px', fontSize: 11, fontWeight: 700,
                                    color: '#fff', border: 'none', cursor: 'pointer',
                                    background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                                    boxShadow: '0 0 12px rgba(239,68,68,0.3)',
                                    opacity: deleting === u.id ? 0.5 : 1,
                                  }}>
                                  {deleting === u.id ? '…' : 'Confirm'}
                                </button>
                                <button onClick={() => setConfirmDel(null)}
                                  style={{
                                    borderRadius: 10, padding: '7px 12px', fontSize: 11,
                                    color: '#64748b', border: '1px solid rgba(255,255,255,0.08)',
                                    background: 'rgba(255,255,255,0.04)', cursor: 'pointer',
                                  }}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmDel(u.id)}
                                style={{
                                  borderRadius: 10, padding: '7px 12px', fontSize: 11, fontWeight: 600,
                                  color: '#ef4444', border: '1px solid rgba(239,68,68,0.18)',
                                  background: 'rgba(239,68,68,0.08)', cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(239,68,68,0.2)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.18)'; e.currentTarget.style.boxShadow = 'none' }}>
                                Delete
                              </button>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, fontStyle: 'italic', color: '#334155' }}>You</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          {!loading && filtered.length > 0 && (
            <div style={{
              padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p style={{ fontSize: 12, color: '#334155' }}>
                Showing {filtered.length} of {users.length} users
              </p>
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ fontSize: 12, fontWeight: 600, color: '#06b6d4', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#67e8f9'}
                  onMouseLeave={e => e.currentTarget.style.color = '#06b6d4'}>
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      </Layout>

      {/* ── Create User Modal ── */}
      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={(newUser) => setUsers(prev => [...prev, newUser])}
        />
      )}
    </>
  )
}

export default UserManagementPage
