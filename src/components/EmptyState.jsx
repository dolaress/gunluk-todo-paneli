import Icon from './Icon'

/**
 * Liste ya da timeline boşken gösterilen yer tutucu.
 * @param {{ title: string, description?: string, actionLabel?: string, onAction?: () => void }} props
 */
export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-14 text-center dark:border-white/10">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/12 dark:text-brand-300">
        <Icon name="list" className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-xs text-sm text-muted dark:text-white/45">{description}</p>
      )}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn-primary mt-5">
          <Icon name="plus" className="h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
