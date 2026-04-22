export const HeroSection = ({
  title,
  subtitle,
  accentColor = 'blue',
  icon,
  roleBadge,
  stats = [],
}) => {
  const accentClasses = {
    blue: 'from-blue-900 to-blue-800',
    green: 'from-green-900 to-green-800',
    amber: 'from-amber-900 to-amber-800',
    purple: 'from-purple-900 to-purple-800',
    cyan: 'from-cyan-900 to-cyan-800',
  }

  const bgGradient = accentClasses[accentColor] || accentClasses.blue

  return (
    <div className={`bg-gradient-to-r ${bgGradient} rounded-lg p-8 mb-8`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          {icon && <div className="text-4xl">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-slate-200">{subtitle}</p>
          </div>
        </div>
        {roleBadge && <div>{roleBadge}</div>}
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
