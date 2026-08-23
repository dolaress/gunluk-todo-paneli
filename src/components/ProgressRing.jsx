/**
 * Dairesel ilerleme göstergesi — saf SVG, grafik kütüphanesi yok.
 * @param {{ percent: number, size?: number, stroke?: number, label?: string, sublabel?: string }} props
 */
export default function ProgressRing({
  percent = 0,
  size = 148,
  stroke = 12,
  label,
  sublabel,
}) {
  const safe = Math.max(0, Math.min(100, Math.round(percent)))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - safe / 100)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Tamamlanma oranı yüzde ${safe}`}
        className="-rotate-90"
      >
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-black/8 dark:stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.32, 0.72, 0, 1)' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">
          {label ?? `%${safe}`}
        </span>
        {sublabel && (
          <span className="mt-0.5 text-xs text-muted dark:text-white/45">{sublabel}</span>
        )}
      </div>
    </div>
  )
}
