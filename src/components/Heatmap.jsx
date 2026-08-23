import { dayNameShort, formatShortDate } from '../utils/date'

/** Seviye -> renk. GitHub katkı ızgarasıyla aynı mantık. */
const LEVEL_CLASS = [
  'bg-black/6 dark:bg-white/8',
  'bg-brand-500/25',
  'bg-brand-500/45',
  'bg-brand-500/70',
  'bg-brand-500',
]

/**
 * Son N günün tamamlanma ısı haritası.
 * Veri localStorage'daki geçmiş tarihli `todos-*` kayıtlarından üretilir.
 *
 * @param {{
 *   data: Array<{date: string, total: number, completed: number, percent: number, level: number}>,
 *   onSelectDate?: (date: string) => void,
 *   selectedDate?: string,
 * }} props
 */
export default function Heatmap({ data, onSelectDate, selectedDate }) {
  const activeDays = data.filter((d) => d.completed > 0).length

  return (
    <div>
      {/* 15 sütunluk ızgara: 30 gün dar kenar çubuğunda iki satıra sığar. */}
      <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5">
        {data.map((day) => {
            const label = `${formatShortDate(day.date)} ${dayNameShort(day.date)} — ${
              day.total ? `${day.completed}/${day.total} tamamlandı` : 'kayıt yok'
            }`
            return (
              <button
                key={day.date}
                type="button"
                title={label}
                aria-label={label}
                aria-current={day.date === selectedDate ? 'date' : undefined}
                onClick={() => onSelectDate?.(day.date)}
                className={`aspect-square w-full rounded-[3px] transition-transform hover:scale-110 ${
                  LEVEL_CLASS[day.level]
                } ${
                  day.date === selectedDate
                    ? 'ring-2 ring-brand-600 ring-offset-2 ring-offset-surface dark:ring-offset-[#15181d]'
                    : ''
                }`}
              />
            )
          })}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted dark:text-white/40">
        <span className="tabular-nums">
          Son {data.length} günün {activeDays} gününde ilerleme var
        </span>
        <span className="ml-auto flex items-center gap-1">
          Az
          {LEVEL_CLASS.map((cls, i) => (
            <span key={i} aria-hidden="true" className={`h-2.5 w-2.5 rounded-[2px] ${cls}`} />
          ))}
          Çok
        </span>
      </div>
    </div>
  )
}
