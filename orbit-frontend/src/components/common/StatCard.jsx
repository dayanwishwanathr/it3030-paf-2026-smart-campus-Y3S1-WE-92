export const StatCard = ({ label, value, icon, trend, className = '' }) => (
  <div className={`bg-slate-800 rounded-lg border border-slate-700 p-4 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>}
      </div>
      {icon && <div className="text-3xl text-slate-400">{icon}</div>}
    </div>
  </div>
)

export const StatsGrid = ({ stats, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
    {stats.map((stat, idx) => (
      <StatCard
        key={idx}
        label={stat.label}
        value={stat.value}
        icon={stat.icon}
        trend={stat.trend}
      />
    ))}
  </div>
)
