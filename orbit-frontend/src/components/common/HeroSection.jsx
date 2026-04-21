export const HeroSection = ({
  title,
  subtitle,
  accentColor = 'cyan',
  icon,
  roleBadge,
  stats = [],
}) => {
  const accentRGB = {
    cyan:   '6,182,212',
    blue:   '59,130,246',
    amber:  '245,158,11',
    purple: '168,85,247',
    green:  '16,185,129',
  }[accentColor] || '6,182,212'

  return (
    <div className="relative overflow-hidden rounded-2xl p-8 mb-10 border border-white/5 bg-white/[0.01]">
      {/* Background patterns */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 0% 0%, rgba(${accentRGB}, 0.2) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(${accentRGB}, 0.1) 0%, transparent 50%)`
        }} 
      />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
          <div className="flex items-start gap-5">
            {icon && (
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-xl border"
                style={{ 
                  background: `rgba(${accentRGB}, 0.1)`, 
                  borderColor: `rgba(${accentRGB}, 0.2)`,
                  boxShadow: `0 0 30px rgba(${accentRGB}, 0.1)`
                }}
              >
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white tracking-tight uppercase">{title}</h1>
                {roleBadge}
              </div>
              <p className="text-slate-400 font-medium max-w-2xl">{subtitle}</p>
            </div>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card p-5 bg-white/[0.03] border-white/5 transition-all hover:bg-white/[0.05] group">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 group-hover:text-cyan-400 transition-colors">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-white tracking-tighter tabular-nums leading-none">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
