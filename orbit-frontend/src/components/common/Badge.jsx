export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-700 text-slate-100',
    success: 'bg-green-900 text-green-100',
    error: 'bg-red-900 text-red-100',
    warning: 'bg-amber-900 text-amber-100',
    info: 'bg-blue-900 text-blue-100',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export const RoleBadge = ({ role }) => {
  const roleConfig = {
    USER: { label: '👤 USER', variant: 'info' },
    TECHNICIAN: { label: '🔧 TECHNICIAN', variant: 'warning' },
    ADMIN: { label: '⚡ ADMIN', variant: 'error' },
    MANAGER: { label: '🏗️ MANAGER', variant: 'success' },
  }

  const config = roleConfig[role] || roleConfig.USER

  return <Badge variant={config.variant}>{config.label}</Badge>
}
