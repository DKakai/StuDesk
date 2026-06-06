"use client"

export function StuDeskLogo({ size = "md", theme = "dark", iconOnly = false }: { size?: "sm" | "md" | "lg" | "xl"; theme?: "dark" | "light"; iconOnly?: boolean }) {
  const sizes = {
    sm: { icon: 18, text: "text-sm", gap: "gap-1.5" },
    md: { icon: 22, text: "text-lg", gap: "gap-2" },
    lg: { icon: 28, text: "text-2xl", gap: "gap-2.5" },
    xl: { icon: 36, text: "text-3xl", gap: "gap-3" },
  }

  const s = sizes[size]
  const color = theme === "dark" ? "#0a0a0a" : "#ffffff"
  const textColor = theme === "dark" ? "text-stone-900" : "text-white"
  const dimClass = theme === "dark" ? "text-stone-400" : "text-white/60"

  return (
    <div className={`flex items-center ${s.gap}`}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="30" height="30" rx="8" fill={color} />
        <path d="M9 8h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9V8z" fill={theme === "dark" ? "#ffffff" : "#0a0a0a"} opacity="0.9" />
        <path d="M11 8h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8" fill={theme === "dark" ? "#e7e5e4" : "#1c1917"} opacity="0.5" />
        <circle cx="22" cy="11" r="2.5" fill={theme === "dark" ? "#ffffff" : "#0a0a0a"} />
        <circle cx="22" cy="11" r="1" fill={color} />
        <line x1="11.5" y1="12" x2="17" y2="12" stroke={color} strokeWidth="1" opacity="0.4" />
        <line x1="11.5" y1="15" x2="16" y2="15" stroke={color} strokeWidth="1" opacity="0.3" />
        <line x1="11.5" y1="18" x2="15" y2="18" stroke={color} strokeWidth="1" opacity="0.2" />
      </svg>

      {!iconOnly && (
        <span className={`${s.text} tracking-tight font-medium ${textColor}`} style={{ fontFamily: 'var(--font-body)', letterSpacing: '-0.02em' }}>
          Stu<span className={dimClass} style={{ fontWeight: 300 }}>Desk</span> <span className={dimClass} style={{ fontWeight: 300 }}>AI</span>
        </span>
      )}
    </div>
  )
}

export function StuDeskMark({ size = 24, theme = "dark" }: { size?: number; theme?: "dark" | "light" }) {
  const color = theme === "dark" ? "#0a0a0a" : "#ffffff"

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="30" height="30" rx="8" fill={color} />
      <path d="M9 8h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9V8z" fill={theme === "dark" ? "#ffffff" : "#0a0a0a"} opacity="0.9" />
      <path d="M11 8h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8" fill={theme === "dark" ? "#e7e5e4" : "#1c1917"} opacity="0.5" />
      <circle cx="22" cy="11" r="2.5" fill={theme === "dark" ? "#ffffff" : "#0a0a0a"} />
      <circle cx="22" cy="11" r="1" fill={color} />
      <line x1="11.5" y1="12" x2="17" y2="12" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="11.5" y1="15" x2="16" y2="15" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="11.5" y1="18" x2="15" y2="18" stroke={color} strokeWidth="1" opacity="0.2" />
    </svg>
  )
}