import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import OrbitLogo from '../../components/common/OrbitLogo'

const OAuth2Success = () => {
  const [params] = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    if (token) login(token)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#050508' }}>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute rounded-full" style={{ left: '50%', top: '50%', width: '400px', height: '400px', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)' }}/>
      </div>

      {/* Orbit spinner */}
      <div className="relative w-20 h-20 mb-6">
        <svg className="absolute inset-0 w-full h-full anim-orbit" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="34" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5" strokeDasharray="5 6"/>
          <circle cx="74" cy="40" r="4" fill="#06b6d4" style={{ filter: 'drop-shadow(0 0 6px #06b6d4)' }}/>
        </svg>
        <svg className="absolute inset-0 w-full h-full anim-orbit-rev" viewBox="0 0 80 80" fill="none"
          style={{ width: '65%', height: '65%', top: '17.5%', left: '17.5%' }}>
          <circle cx="40" cy="40" r="22" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5" strokeDasharray="3 5"/>
          <circle cx="62" cy="40" r="3" fill="#3b82f6" style={{ filter: 'drop-shadow(0 0 5px #3b82f6)' }}/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full" style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 20px rgba(6,182,212,0.5)' }}/>
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-base font-black" style={{ color: '#f59e0b' }}>SLIIT</span>
        <span className="text-base font-black text-white">&nbsp;Orbit</span>
      </div>

      <p className="text-sm font-semibold text-white mb-1">Completing sign-in…</p>
      <p className="text-[12px]" style={{ color: '#475569' }}>Setting up your Google account</p>
    </div>
  )
}

export default OAuth2Success
