import { formatDuration } from '../utils/date'

/**
 * Kategoriye göre süre dağılımı — donut + liste.
 * Grafik kütüphanesi yerine saf SVG yay hesabı kullanılır.
 *
 * @param {{ data: Array<{id: string, label: string, hex: string, minutes: number, count: number, percent: number}> }} props
 */
export default function CategoryChart({ data }) {
  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0)

  if (!data.length || !totalMinutes) {
    return (
      <p className="py-8 text-center text-sm text-muted dark:text-white/40">
        Süre girilmiş görev yok.
      </p>
    )
  }

  const size = 116
  const stroke = 16
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  // Yayları önceden hesapla: her dilimin uzunluğu ve başlangıç kayması.
  const arcs = data.reduce((acc, slice) => {
    const dash = circumference * (slice.minutes / totalMinutes)
    const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0
    acc.push({ ...slice, dash, offset })
    return acc
  }, [])

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
      <div className="relative shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label="Kategoriye göre zaman dağılımı"
        >
          {arcs.map((arc) => (
            <circle
              key={arc.id}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={arc.hex}
              strokeWidth={stroke}
              strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
              strokeDashoffset={-arc.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-semibold tabular-nums">
            {formatDuration(totalMinutes)}
          </span>
          <span className="text-[10px] text-muted dark:text-white/40">planlandı</span>
        </div>
      </div>

      <ul className="w-full flex-1 space-y-2.5">
        {data.map((slice) => (
          <li key={slice.id} className="flex items-baseline gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 translate-y-0.5 rounded-full"
              style={{ backgroundColor: slice.hex }}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate leading-tight">{slice.label}</span>
              <span className="block text-xs tabular-nums text-muted dark:text-white/45">
                {slice.count} görev · {formatDuration(slice.minutes)}
              </span>
            </span>
            <span className="shrink-0 text-sm font-medium tabular-nums">%{slice.percent}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
