export const Card = ({ children, className = '' }) => (
  <div className={`glass-card ${className}`}>
    {children}
  </div>
)

export const ActionCard = ({ icon, title, description, onClick, accentColor = 'cyan' }) => {
  // Use CSS variables from index.css for consistency
  const accentRGB = {
    cyan:   '6,182,212',
    blue:   '59,130,246',
    amber:  '245,158,11',
    purple: '168,85,247',
    green:  '16,185,129',
  }[accentColor] || '6,182,212'

  return (
    <button
      onClick={onClick}
      className="glass-card w-full p-6 text-left transition-all duration-300 hover:-translate-y-1 group"
      style={{
        '--accent-rgb': accentRGB
      }}
    >
      <div className="flex items-start gap-4">
        <div 
          className="text-2xl p-3 rounded-xl transition-colors duration-300"
          style={{ 
            background: `rgba(${accentRGB}, 0.1)`, 
            color: `rgb(${accentRGB})`,
            border: `1px solid rgba(${accentRGB}, 0.2)`
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{description}</p>
        </div>
        <div className="text-slate-700 group-hover:text-cyan-400 transition-all transform group-hover:translate-x-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </div>
      </div>
    </button>
  )
}
