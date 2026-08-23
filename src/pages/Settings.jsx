import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import StatTile from '../components/StatTile'
import { CATEGORIES, STORAGE_KEYS } from '../constants'
import { formatShortDate } from '../utils/date'
import { clearAllTaskData, exportAllData, getAllTaskDates, loadAllTasks } from '../utils/storage'
import { summarize } from '../utils/stats'

/**
 * Ayarlar: tema, veri özeti, dışa aktarma ve sıfırlama.
 *
 * @param {{ theme: 'light' | 'dark', onThemeChange: (t: 'light' | 'dark') => void, onBack: () => void }} props
 */
export default function Settings({ theme, onThemeChange, onBack }) {
  const [refreshToken, setRefreshToken] = useState(0)
  const [confirming, setConfirming] = useState(false)

  const stats = useMemo(() => {
    const days = loadAllTasks()
    const entries = Object.values(days)
    const totals = entries.reduce(
      (acc, tasks) => {
        const s = summarize(tasks)
        acc.total += s.total
        acc.completed += s.completed
        acc.minutes += s.plannedMinutes
        return acc
      },
      { total: 0, completed: 0, minutes: 0 },
    )
    const dates = getAllTaskDates()
    return { ...totals, dayCount: dates.length, first: dates[0], last: dates[dates.length - 1] }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken])

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportAllData(), null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todo-yedek-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    clearAllTaskData()
    setConfirming(false)
    setRefreshToken((n) => n + 1)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Ayarlar</h2>
        <p className="mt-1 text-sm text-muted dark:text-white/45">
          Tüm veriler yalnızca bu tarayıcının localStorage'ında saklanır.
        </p>
      </div>

      <section className="card p-5" aria-label="Görünüm">
        <h3 className="text-sm font-semibold tracking-tight">Görünüm</h3>
        <p className="mt-1 text-sm text-muted dark:text-white/45">
          Tema tercihi cihazında saklanır.
        </p>
        <div className="mt-4 flex gap-2">
          {[
            { id: 'light', label: 'Açık', icon: 'sun' },
            { id: 'dark', label: 'Koyu', icon: 'moon' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onThemeChange(option.id)}
              aria-pressed={theme === option.id}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                theme === option.id
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/12 dark:text-brand-300'
                  : 'border-line text-muted hover:bg-black/4 dark:border-white/10 dark:text-white/55 dark:hover:bg-white/8'
              }`}
            >
              <Icon name={option.icon} className="mx-auto mb-1.5 h-4 w-4" />
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Veri özeti">
        <h3 className="mb-3 text-sm font-semibold tracking-tight">Verilerin</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile
            icon="list"
            label="Toplam görev"
            value={stats.total}
            hint={`${stats.completed} tanesi tamamlandı`}
          />
          <StatTile icon="chart" label="Kayıtlı gün" value={stats.dayCount} hint={
            stats.first ? `${formatShortDate(stats.first)} – ${formatShortDate(stats.last)}` : 'Henüz kayıt yok'
          } />
          <StatTile
            icon="clock"
            label="Planlanan"
            value={`${Math.round(stats.minutes / 60)} sa`}
            hint="tüm günler toplamı"
          />
        </div>
      </section>

      <section className="card p-5" aria-label="Kategoriler">
        <h3 className="text-sm font-semibold tracking-tight">Kategoriler</h3>
        <p className="mt-1 text-sm text-muted dark:text-white/45">
          Kategori listesi{' '}
          <code className="rounded bg-black/6 px-1 py-0.5 text-xs dark:bg-white/10">
            src/constants/index.js
          </code>{' '}
          dosyasından yönetilir.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <span
              key={c.id}
              className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium ${c.chip}`}
            >
              <span className={`h-2 w-2 rounded-full ${c.dot}`} />
              {c.label}
            </span>
          ))}
        </div>
      </section>

      <section className="card p-5" aria-label="Veri yönetimi">
        <h3 className="text-sm font-semibold tracking-tight">Veri yönetimi</h3>
        <p className="mt-1 text-sm text-muted dark:text-white/45">
          Anahtar biçimi:{' '}
          <code className="rounded bg-black/6 px-1 py-0.5 text-xs dark:bg-white/10">
            {STORAGE_KEYS.taskPrefix}YYYY-AA-GG
          </code>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={handleExport} className="btn-ghost">
            <Icon name="download" className="h-4 w-4" />
            JSON olarak dışa aktar
          </button>

          {confirming ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="btn bg-rose-600 text-white hover:bg-rose-700"
              >
                <Icon name="trash" className="h-4 w-4" />
                Evet, hepsini sil
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="btn-ghost">
                Vazgeç
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="btn border border-rose-500/30 text-rose-600 hover:bg-rose-500/8 dark:text-rose-400"
            >
              <Icon name="trash" className="h-4 w-4" />
              Tüm görevleri sil
            </button>
          )}
        </div>
      </section>

      <button type="button" onClick={onBack} className="btn-ghost">
        <Icon name="chevronLeft" className="h-4 w-4" />
        Panele dön
      </button>
    </div>
  )
}
