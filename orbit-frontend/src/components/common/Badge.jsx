const COLOR_MAP = {
  cyan:   { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.25)', text: '#67e8f9', dot: '#06b6d4' },
  blue:   { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', text: '#93c5fd', dot: '#3b82f6' },
  amber:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', text: '#fcd34d', dot: '#f59e0b' },
  purple: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)', text: '#d8b4fe', dot: '#a855f7' },
  green:  { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#6ee7b7', dot: '#10b981' },
  red:    { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)',  text: '#fca5a5', dot: '#ef4444' },
}

export const Badge = ({ children, color = 'cyan', dot = false }) => {
  const cfg = COLOR_MAP[color] || COLOR_MAP.cyan
  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none border shadow-sm"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.text }}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full anim-dot-pulse" style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }} />
      )}
      {children}
    </span>
  )
}

export const RoleBadge = ({ role }) => {
  const roleMap = {
    ADMIN:      { color: 'purple', label: 'Admin' },
    MANAGER:    { color: 'green',  label: 'Manager' },
    TECHNICIAN: { color: 'amber',  label: 'Technician' },
    USER:       { color: 'cyan',   label: 'User' },
  }
  const cfg = roleMap[role] || roleMap.USER
  return <Badge color={cfg.color} dot>{cfg.label}</Badge>
}
