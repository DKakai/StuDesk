"use client"

export function StuDeskLogo({ size = "md", theme = "dark" }: { size?: "sm" | "md" | "lg" | "xl"; theme?: "dark" | "light" }) {
  const sizes = {
    sm: { icon: 22, text: "text-[15px]", gap: "gap-2" },
    md: { icon: 28, text: "text-[18px]", gap: "gap-2.5" },
    lg: { icon: 34, text: "text-[22px]", gap: "gap-3" },
    xl: { icon: 44, text: "text-[28px]", gap: "gap-3.5" },
  }
  const s = sizes[size]
  const fill = theme === "dark" ? "#0a0a0a" : "#ffffff"
  const fillDim = theme === "dark" ? "#0a0a0a" : "#ffffff"
  const textClass = theme === "dark" ? "text-stone-900" : "text-white"
  const dimClass = theme === "dark" ? "text-stone-400" : "text-white/40"

  return (
    <div className={`flex items-center ${s.gap}`}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 72 72" fill="none">
        <g transform="translate(36,36)">
          <path d="M0,-6 L-5,-26 L8,-24 Z" fill={fill} opacity="0.95" />
          <path d="M0,-6 L8,-24 L16,-10 Z" fill={fillDim} opacity="0.65" />
          <path d="M0,-6 L-5,-26 L8,-24 Z" fill={fill} opacity="0.95" transform="rotate(60)" />
          <path d="M0,-6 L8,-24 L16,-10 Z" fill={fillDim} opacity="0.65" transform="rotate(60)" />
          <path d="M0,-6 L-5,-26 L8,-24 Z" fill={fill} opacity="0.95" transform="rotate(120)" />
          <path d="M0,-6 L8,-24 L16,-10 Z" fill={fillDim} opacity="0.65" transform="rotate(120)" />
          <path d="M0,-6 L-5,-26 L8,-24 Z" fill={fill} opacity="0.95" transform="rotate(180)" />
          <path d="M0,-6 L8,-24 L16,-10 Z" fill={fillDim} opacity="0.65" transform="rotate(180)" />
          <path d="M0,-6 L-5,-26 L8,-24 Z" fill={fill} opacity="0.95" transform="rotate(240)" />
          <path d="M0,-6 L8,-24 L16,-10 Z" fill={fillDim} opacity="0.65" transform="rotate(240)" />
          <path d="M0,-6 L-5,-26 L8,-24 Z" fill={fill} opacity="0.95" transform="rotate(300)" />
          <path d="M0,-6 L8,-24 L16,-10 Z" fill={fillDim} opacity="0.65" transform="rotate(300)" />
        </g>
      </svg>
      <span className={`${s.text} tracking-[-0.02em] font-medium ${textClass}`} style={{ fontFamily: 'var(--font-body)' }}>
        Stu<span className={dimClass}>Desk</span>
      </span>
    </div>
  )
}