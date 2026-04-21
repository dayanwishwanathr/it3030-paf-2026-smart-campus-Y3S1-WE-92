import { useEffect, useState } from 'react'
import axiosInstance         from '../../api/axiosInstance'
import Layout                from '../../components/layout/Layout'
import { useAuth }           from '../../context/AuthContext'
import { RoleBadge, Badge }  from '../../components/common/Badge'

const ROLES = ['USER', 'MANAGER', 'TECHNICIAN', 'ADMIN']

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
      <div className="max-w-7xl mx-auto pb-20">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 anim-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
               <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">Platform Control</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">User Directory</h1>
            <p className="text-slate-500 font-medium mt-1">Manage platform access, roles, and security protocols.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="glass-card px-4 py-3 flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Total Population</span>
                <span className="text-xl font-black text-white leading-none">{users.length}</span>
             </div>
          </div>
        </div>

        {/* ── Error Notification ── */}
        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-xl px-4 py-3 border border-red-500/20 bg-red-500/5 text-red-400 anim-fade-in">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            <span className="text-sm font-bold uppercase tracking-wider">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-white transition-colors">✕</button>
          </div>
        )}

        {/* ── Control Bar ── */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Filter by name, email, or digital signature…"
              className="input-glass pl-12 pr-6 py-4 text-sm w-full font-medium"
            />
          </div>
          {search && (
            <button onClick={() => setSearch('')} className="btn-secondary px-8">Reset View</button>
          )}
        </div>

        {/* ── Data Grid / Table ── */}
        <div className="glass-card overflow-hidden border-white/5">
          {loading ? (
            <div className="py-32 flex flex-col items-center gap-6">
               <div className="relative w-16 h-16">
                 <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#06b6d4]" />
                 </div>
               </div>
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] anim-pulse">Synchronizing directory...</p>
            </div>

          ) : filtered.length === 0 ? (
            <div className="py-32 text-center">
              <div className="text-4xl mb-4 opacity-50">👤</div>
              <p className="text-lg font-bold text-white tracking-tight">No entities found</p>
              <p className="text-sm text-slate-500 mt-1">Refine your scanning parameters.</p>
            </div>

          ) : (
            <div className="overflow-x-auto overflow-y-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    {['Member Entity', 'Authorization', 'Protocol', 'Registered', 'Control'].map(h => (
                      <th key={h} className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, idx) => (
                    <tr
                      key={u.id}
                      className="group transition-all duration-300 hover:bg-white/[0.03] border-b border-white/[0.02] last:border-0"
                    >
                      {/* Member Info */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {u.profilePicture ? (
                              <img src={u.profilePicture} alt={u.name} className="h-10 w-10 rounded-xl object-cover ring-2 ring-white/5 group-hover:ring-cyan-500/50 transition-all"/>
                            ) : (
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg ${AVATAR_STYLE[u.role] ?? 'bg-slate-600'} ring-2 ring-white/5 group-hover:ring-cyan-500/50 transition-all`}>
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#09090b] rounded-full shadow-[0_0_8px_#10b981]" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white tracking-tight leading-none mb-1 group-hover:text-cyan-400 transition-colors">{u.name}</p>
                            <p className="text-[11px] font-bold text-slate-600 tracking-tighter truncate max-w-[200px]">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-8 py-5">
                         <RoleBadge role={u.role}/>
                      </td>

                      {/* Protocol / Provider */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                           <Badge color={u.provider === 'GOOGLE' ? 'red' : 'blue'}>
                              {u.provider === 'GOOGLE' && 'OAuth 2.0'}
                              {u.provider !== 'GOOGLE' && 'Local Auth'}
                           </Badge>
                        </div>
                      </td>

                      {/* Join Date */}
                      <td className="px-8 py-5">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{formatDate(u.createdAt)}</span>
                      </td>

                      {/* Control Panel */}
                      <td className="px-8 py-5">
                        {u.id !== currentUser?.id ? (
                          <div className="flex items-center gap-3">
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value)}
                              disabled={updating === u.id}
                              className="input-glass !py-1.5 !px-3 !rounded-lg text-[10px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer hover:border-white/20"
                            >
                              {ROLES.map(r => <option key={r} value={r} className="bg-[#050508] text-white font-sans">{r}</option>)}
                            </select>

                            {confirmDel === u.id ? (
                              <div className="flex items-center gap-1 anim-fade-in">
                                <button onClick={() => handleDelete(u.id)} disabled={deleting === u.id} className="btn-danger !px-3 !py-1.5 !text-[9px] !rounded-lg uppercase tracking-widest font-black">
                                  {deleting === u.id ? '...' : 'Wipe'}
                                </button>
                                <button onClick={() => setConfirmDel(null)} className="btn-secondary !px-3 !py-1.5 !text-[9px] !rounded-lg uppercase tracking-widest font-black">
                                  Abort
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setConfirmDel(u.id)} 
                                className="p-2 rounded-lg bg-red-500/5 text-red-500/50 hover:bg-red-500/10 hover:text-red-500 border border-red-500/0 hover:border-red-500/20 transition-all group/del"
                                title="Terminate Entity"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                              </button>
                            )}
                          </div>
                        ) : (
                          <Badge color="cyan">Active Identity</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Table Footer ── */}
          {!loading && filtered.length > 0 && (
            <div className="px-8 py-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Directory showing {filtered.length} of {users.length} unique entities
              </p>
              {search && (
                <button onClick={() => setSearch('')} className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-white transition-colors">
                  Reset Global View
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default UserManagementPage
