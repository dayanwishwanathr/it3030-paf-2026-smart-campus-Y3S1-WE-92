export const StatCard = ({ icon, label, value, trend, trendValue, color = 'cyan' }) => {
  const accentRGB = {
    cyan:   '6,182,212',
    blue:   '59,130,246',
    amber:  '245,158,11',
    purple: '168,85,247',
    green:  '16,185,129',
  }[color] || '6,182,212'

  return (
    <div className="glass-card p-6 flex items-start justify-between group transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl border transition-all duration-300 group-hover:scale-110"
          style={{ 
            background: `rgba(${accentRGB}, 0.1)`, 
            borderColor: `rgba(${accentRGB}, 0.2)`,
            color: `rgb(${accentRGB})`,
            boxShadow: `0 0 20px rgba(${accentRGB}, 0.05)`
          }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 group-hover:text-cyan-400 transition-colors">
            {label}
          </p>
          <h3 className="text-3xl font-black text-white tracking-tighter tabular-nums leading-none">
            {value}
          </h3>
          
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-current bg-opacity-10">
                {trend === 'up' ? '↑' : '↓'}
              </span>
              {trendValue}
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle indicator dot */}
      <div 
        className="w-1.5 h-1.5 rounded-full mt-1.5 opacity-40 group-hover:opacity-100 transition-all duration-500"
        style={{ background: `rgb(${accentRGB})`, boxShadow: `0 0 8px rgb(${accentRGB})` }}
      />
    </div>
  )
}

export const StatsGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
    {children}
  </div>
)
