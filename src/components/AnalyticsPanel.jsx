import { formatDuration } from '../utils/date'
import CategoryChart from './CategoryChart'
import Heatmap from './Heatmap'
import Icon from './Icon'
import ProgressRing from './ProgressRing'
import StatTile from './StatTile'

/**
 * Analitik paneli: ilerleme halkası, seri sayacı,
 * kategori dağılımı ve 30 günlük ısı haritası.
 *
 * @param {{
 *   summary: { total: number, completed: number, remaining: number, percent: number, plannedMinutes: number, doneMinutes: number },
 *   streak: number,
 *   breakdown: Array<object>,
 *   heatmap: Array<object>,
 *   selectedDate: string,
 *   onSelectDate: (date: string) => void,
 * }} props
 */
export default function AnalyticsPanel({
  summary,
  streak,
  breakdown,
  heatmap,
  selectedDate,
  onSelectDate,
}) {
  const streakHint =
    streak > 0
      ? `${streak} gündür kesintisiz görev tamamlıyorsun`
      : 'Bir görevi tamamla, seri başlasın'

  return (
    <div className="space-y-4">
      <section className="card p-5" aria-label="Günlük ilerleme">
        <h2 className="text-sm font-semibold tracking-tight">Bugünkü ilerleme</h2>

        <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <ProgressRing
            percent={summary.percent}
            sublabel={`${summary.completed}/${summary.total} görev`}
          />

          <dl className="w-full flex-1 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted dark:text-white/45">Tamamlanan</dt>
              <dd className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                {summary.completed}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted dark:text-white/45">Bekleyen</dt>
              <dd className="font-medium tabular-nums">{summary.remaining}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line pt-3 dark:border-white/8">
              <dt className="text-muted dark:text-white/45">Planlanan</dt>
              <dd className="font-medium whitespace-nowrap tabular-nums">
                {formatDuration(summary.plannedMinutes)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted dark:text-white/45">Harcanan</dt>
              <dd className="font-medium whitespace-nowrap tabular-nums">
                {formatDuration(summary.doneMinutes)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <StatTile
          icon="flame"
          label="Seri"
          value={`${streak} gün`}
          hint={streakHint}
          accent="text-orange-500"
        />
        <StatTile
          icon="chart"
          label="Tamamlanma"
          value={`%${summary.percent}`}
          hint={`${summary.total} görevin ${summary.completed} tanesi`}
        />
      </div>

      <section className="card p-5" aria-label="Kategori dağılımı">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Kategoriye göre dağılım</h2>
        <CategoryChart data={breakdown} />
      </section>

      <section className="card p-5" aria-label="Son 30 günün ısı haritası">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight">Son 30 gün</h2>
          <Icon name="chart" className="h-3.5 w-3.5 text-muted dark:text-white/35" />
          <span className="ml-auto text-xs text-muted dark:text-white/40">
            Bir güne tıklayarak geç
          </span>
        </div>
        <Heatmap data={heatmap} selectedDate={selectedDate} onSelectDate={onSelectDate} />
      </section>
    </div>
  )
}
