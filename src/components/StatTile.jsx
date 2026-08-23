import Icon from './Icon'

/**
 * Küçük istatistik kutusu (görev sayısı, planlanan süre, seri vb.).
 * @param {{ icon: string, label: string, value: string | number, hint?: string, accent?: string }} props
 */
export default function StatTile({ icon, label, value, hint, accent = 'text-brand-600 dark:text-brand-300' }) {
  return (
    <div className="card px-4 py-3.5">
      <div className="flex items-center gap-2">
        <Icon name={icon} className={`h-4 w-4 ${accent}`} />
        <span className="text-xs font-medium tracking-wide text-muted uppercase dark:text-white/45">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl leading-none font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-muted dark:text-white/40">{hint}</p>}
    </div>
  )
}
