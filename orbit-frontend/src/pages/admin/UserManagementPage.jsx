import { useEffect, useState } from 'react'
import axiosInstance         from '../../api/axiosInstance'
import Layout                from '../../components/layout/Layout'
import { useAuth }           from '../../context/AuthContext'

const ROLES = ['USER', 'MANAGER', 'TECHNICIAN', 'ADMIN']

// ── Role badge config ─────────────────────────────────────────────────────────
const ROLE_CFG = {
  ADMIN:      { rgb: '168,85,247', label: '⚡ ADMIN'      },
  MANAGER:    { rgb: '16,185,129', label: '🏗️ MANAGER'   },
  TECHNICIAN: { rgb: '245,158,11', label: '🔧 TECHNICIAN' },
  USER:       { rgb: '6,182,212',  label: '👤 USER'       },
}

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CFG[role] ?? { rgb: '100,116,139', label: role }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
      style={{ background: `rgba(${cfg.rgb},0.12)`, border: `1px solid rgba(${cfg.rgb},0.28)`, color: `rgb(${cfg.rgb})` }}>
      {cfg.label}
    </span>
  )
}

const AVATAR_STYLE = {
  ADMIN:      'role-admin-avatar',
  MANAGER:    'role-manager-avatar',
  TECHNICIAN: 'role-tech-avatar',
  USER:       'role-user-avatar',
}

const UserManagementPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [updating, setUpdating] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)

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

  const formatDate = d => d ? new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—'

  return (
    <Layout>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 anim-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-[13px] mt-1 flex items-center gap-2" style={{ color: '#475569' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }}/>
            {users.length} registered users
          </p>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl px-4 py-3 anim-fade-in"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <svg className="h-4 w-4 mt-0.5 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── Search ── */}
      <div className="mb-5">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-glass pl-10 pr-4 py-2.5 text-sm w-full"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4" style={{ color: '#334155' }}>
            {/* Mini orbit spinner */}
            <div className="relative w-10 h-10">
              <svg className="absolute inset-0 w-full h-full anim-orbit" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5" strokeDasharray="4 4"/>
                <circle cx="36" cy="20" r="2.5" fill="#06b6d4"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}/>
              </div>
            </div>
            <p className="text-sm">Loading users…</p>
          </div>

        ) : filtered.length === 0 ? (
          <div className="py-20 text-center" style={{ color: '#334155' }}>
            <p className="text-sm font-medium">No users found.</p>
            <p className="text-[12px] mt-1">Try a different search term</p>
          </div>

        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['User', 'Role', 'Provider', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr
                    key={u.id}
                    className="transition-all duration-150"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', animationDelay: `${idx * 25}ms` }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.04)'; e.currentTarget.style.borderLeft = '2px solid rgba(6,182,212,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = 'none'; }}
                  >
                    {/* User info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {u.profilePicture ? (
                          <img src={u.profilePicture} alt={u.name} className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                            style={{ boxShadow: '0 0 0 1.5px rgba(6,182,212,0.4)' }}/>
                        ) : (
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${AVATAR_STYLE[u.role] ?? 'bg-slate-600'}`}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-[13px] font-semibold text-white leading-tight">{u.name}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="px-5 py-4"><RoleBadge role={u.role}/></td>

                    {/* Provider */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                        style={u.provider === 'GOOGLE'
                          ? { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }
                          : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
                        {u.provider === 'GOOGLE' && (
                          <svg className="h-3 w-3" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        )}
                        {u.provider}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-[12px]" style={{ color: '#475569' }}>{formatDate(u.createdAt)}</td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      {u.id !== currentUser?.id ? (
                        <div className="flex items-center gap-2">
                          {/* Role select */}
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u.id, e.target.value)}
                            disabled={updating === u.id}
                            className="rounded-xl text-[12px] font-semibold px-2.5 py-1.5 outline-none transition-all disabled:opacity-50"
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#e2e8f0',
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            {ROLES.map(r => <option key={r} value={r} style={{ background: '#0a0a14' }}>{r}</option>)}
                          </select>

                          {/* Delete */}
                          {confirmDel === u.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(u.id)} disabled={deleting === u.id}
                                className="rounded-xl px-3 py-1.5 text-[11px] font-bold text-white transition-all disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 0 12px rgba(239,68,68,0.3)' }}>
                                {deleting === u.id ? '…' : 'Confirm'}
                              </button>
                              <button onClick={() => setConfirmDel(null)}
                                className="rounded-xl px-3 py-1.5 text-[11px] transition-all"
                                style={{ color: '#64748b', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDel(u.id)}
                              className="rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all"
                              style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(239,68,68,0.2)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.18)'; e.currentTarget.style.boxShadow = 'none' }}>
                              Delete
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] italic" style={{ color: '#334155' }}>You</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Table footer ── */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[11px]" style={{ color: '#334155' }}>
              Showing {filtered.length} of {users.length} users
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="text-[11px] font-medium transition-colors"
                style={{ color: '#06b6d4' }}
                onMouseEnter={e => e.currentTarget.style.color = '#67e8f9'}
                onMouseLeave={e => e.currentTarget.style.color = '#06b6d4'}>
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default UserManagementPage
