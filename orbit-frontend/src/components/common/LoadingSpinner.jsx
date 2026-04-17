/**
 * LoadingSpinner — full-screen centered orbit-themed loader.
 */
const LoadingSpinner = ({ message = 'Loading…' }) => (
  <div
    className="fixed inset-0 flex flex-col items-center justify-center"
    style={{ background: '#050508' }}
  >
    {/* Orbit rings */}
    <div className="relative w-16 h-16">
      {/* Outer ring */}
      <svg
        className="absolute inset-0 w-full h-full anim-orbit"
        viewBox="0 0 64 64" fill="none"
      >
        <circle
          cx="32" cy="32" r="28"
          stroke="rgba(6,182,212,0.25)" strokeWidth="1.5"
          strokeDasharray="4 6" strokeLinecap="round"
        />
        {/* Moving dot on outer ring */}
        <circle cx="60" cy="32" r="3" fill="#06b6d4" />
      </svg>

      {/* Inner ring */}
      <svg
        className="absolute inset-0 w-full h-full anim-orbit-rev"
        viewBox="0 0 64 64" fill="none"
        style={{ width: '70%', height: '70%', top: '15%', left: '15%' }}
      >
        <circle
          cx="32" cy="32" r="20"
          stroke="rgba(59,130,246,0.3)" strokeWidth="1.5"
          strokeDasharray="3 5" strokeLinecap="round"
        />
        <circle cx="52" cy="32" r="2.5" fill="#3b82f6" />
      </svg>

      {/* Centre planet */}
      <div
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-5 h-5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            boxShadow: '0 0 16px rgba(6,182,212,0.5)',
          }}
        />
      </div>
    </div>

    {/* Brand */}
    <div className="mt-6 flex items-baseline gap-1">
      <span className="text-sm font-black" style={{ color: '#f59e0b' }}>SLIIT</span>
      <span className="text-sm font-black text-white">&nbsp;Orbit</span>
    </div>

    {/* Message */}
    <p className="mt-2 text-[12px] font-medium" style={{ color: '#475569' }}>{message}</p>
  </div>
)

export default LoadingSpinner
