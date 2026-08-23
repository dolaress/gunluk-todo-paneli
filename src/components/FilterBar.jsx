import { CATEGORIES, PRIORITIES } from '../constants'
import Icon from './Icon'

const STATUSES = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Bekleyen' },
  { id: 'completed', label: 'Tamamlanan' },
]

/**
 * Liste görünümünün filtre çubuğu: arama, kategori, öncelik, durum.
 *
 * @param {{
 *   filters: { search: string, category: string, priority: string, status: string },
 *   onChange: (patch: object) => void,
 *   resultCount: number,
 * }} props
 */
export default function FilterBar({ filters, onChange, resultCount }) {
  const isFiltered =
    filters.search || filters.category !== 'all' || filters.priority !== 'all' || filters.status !== 'all'

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted dark:text-white/35"
          />
          <input
            type="search"
            className="field pl-10"
            placeholder="Görevlerde ara…"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            aria-label="Görevlerde ara"
          />
        </div>

        <div className="flex gap-3">
          <select
            className="field sm:w-40"
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
            aria-label="Kategoriye göre filtrele"
          >
            <option value="all">Tüm kategoriler</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            className="field sm:w-36"
            value={filters.priority}
            onChange={(e) => onChange({ priority: e.target.value })}
            aria-label="Önceliğe göre filtrele"
          >
            <option value="all">Tüm öncelikler</option>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="Tamamlanma durumu"
          className="inline-flex rounded-xl bg-black/5 p-1 dark:bg-white/8"
        >
          {STATUSES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange({ status: s.id })}
              aria-pressed={filters.status === s.id}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.status === s.id
                  ? 'bg-surface text-ink shadow-sm dark:bg-white/12 dark:text-white'
                  : 'text-muted hover:text-ink dark:text-white/50 dark:hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <span className="text-xs tabular-nums text-muted dark:text-white/40">
          {resultCount} görev
        </span>

        {isFiltered && (
          <button
            type="button"
            onClick={() =>
              onChange({ search: '', category: 'all', priority: 'all', status: 'all' })
            }
            className="ml-auto text-xs font-medium text-brand-600 hover:underline dark:text-brand-300"
          >
            Filtreleri temizle
          </button>
        )}
      </div>
    </div>
  )
}
