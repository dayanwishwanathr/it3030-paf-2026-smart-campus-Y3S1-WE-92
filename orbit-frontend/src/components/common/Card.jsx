export const Card = ({ children, className = '' }) => (
  <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
    {children}
  </div>
)

export const ActionCard = ({ icon, title, description, onClick, accentColor = 'blue' }) => {
  const accentClasses = {
    blue: 'hover:border-blue-500 hover:shadow-blue-500/20',
    green: 'hover:border-green-500 hover:shadow-green-500/20',
    amber: 'hover:border-amber-500 hover:shadow-amber-500/20',
    purple: 'hover:border-purple-500 hover:shadow-purple-500/20',
    cyan: 'hover:border-cyan-500 hover:shadow-cyan-500/20',
  }

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 bg-slate-800 border border-slate-700 rounded-lg transition-all duration-200 cursor-pointer ${accentClasses[accentColor] || accentClasses.blue} hover:shadow-lg`}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl text-slate-300">{icon}</div>
        <div className="text-left">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </button>
  )
}
