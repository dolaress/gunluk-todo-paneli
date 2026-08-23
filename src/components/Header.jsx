import { formatLongDate, relativeDayLabel, todayKey } from '../utils/date'
import Icon from './Icon'

/**
 * Üst çubuk: tarih gezinme, görünüm değiştirici, tema ve ekleme.
 *
 * @param {{
 *   dateKey: string,
 *   onDateChange: (date: string) => void,
 *   onToday: () => void,
 *   view: 'timeline' | 'list',
 *   onViewChange: (view: 'timeline' | 'list') => void,
 *   theme: 'light' | 'dark',
 *   onToggleTheme: () => void,
 *   onAddTask: () => void,
 *   page: 'dashboard' | 'settings',
 *   onNavigate: (page: 'dashboard' | 'settings') => void,
 * }} props
 */
export default function Header({
  dateKey,
  onDateChange,
  onToday,
  view,
  onViewChange,
  theme,
  onToggleTheme,
  onAddTask,
  page,
  onNavigate,
}) {
  const relative = relativeDayLabel(dateKey)
  const isToday = dateKey === todayKey()

  const shiftDay = (delta) => {
    const date = new Date(dateKey)
    date.setDate(date.getDate() + delta)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    onDateChange(`${y}-${m}-${d}`)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md dark:border-white/8 dark:bg-[#0e1013]/85">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-6 lg:py-4">
        {/* Marka + tarih */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Icon name="timeline" className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm leading-tight font-semibold tracking-tight">
              Günlük Todo Kontrol Paneli
            </h1>
            <p className="truncate text-xs text-muted dark:text-white/45">
              {relative && <span className="font-medium">{relative} · </span>}
              {formatLongDate(dateKey)}
            </p>
          </div>
        </div>

        {/* Tarih gezinme */}
        <div className="flex items-center gap-1.5 lg:ml-2">
          <button
            type="button"
            onClick={() => shiftDay(-1)}
            aria-label="Önceki gün"
            className="btn-ghost px-2.5 py-2"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
          </button>

          <input
            type="date"
            value={dateKey}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
            aria-label="Tarih seç"
            className="field w-auto px-3 py-2 text-xs tabular-nums"
          />

          <button
            type="button"
            onClick={() => shiftDay(1)}
            aria-label="Sonraki gün"
            className="btn-ghost px-2.5 py-2"
          >
            <Icon name="chevronRight" className="h-4 w-4" />
          </button>

          {!isToday && (
            <button type="button" onClick={onToday} className="btn-ghost px-3 py-2 text-xs">
              Bugün
            </button>
          )}
        </div>

        {/* Görünüm + eylemler */}
        <div className="flex items-center gap-2 lg:ml-auto">
          {page === 'dashboard' && (
            <div
              role="group"
              aria-label="Görünüm"
              className="inline-flex rounded-xl bg-black/5 p-1 dark:bg-white/8"
            >
              <button
                type="button"
                onClick={() => onViewChange('timeline')}
                aria-pressed={view === 'timeline'}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  view === 'timeline'
                    ? 'bg-surface text-ink shadow-sm dark:bg-white/12 dark:text-white'
                    : 'text-muted hover:text-ink dark:text-white/50'
                }`}
              >
                <Icon name="timeline" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Timeline</span>
              </button>
              <button
                type="button"
                onClick={() => onViewChange('list')}
                aria-pressed={view === 'list'}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-surface text-ink shadow-sm dark:bg-white/12 dark:text-white'
                    : 'text-muted hover:text-ink dark:text-white/50'
                }`}
              >
                <Icon name="list" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Liste</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigate(page === 'settings' ? 'dashboard' : 'settings')}
            aria-label={page === 'settings' ? 'Panele dön' : 'Ayarlar'}
            className="btn-ghost px-2.5 py-2"
          >
            <Icon name={page === 'settings' ? 'home' : 'settings'} className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            className="btn-ghost px-2.5 py-2"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-4 w-4" />
          </button>

          <button type="button" onClick={onAddTask} className="btn-primary ml-auto px-3 lg:ml-0">
            <Icon name="plus" className="h-4 w-4" />
            <span className="hidden sm:inline">Görev ekle</span>
          </button>
        </div>
      </div>
    </header>
  )
}
