import { useEffect, useState } from 'react'
import Icon from './Icon'

const DURATION_MS = 6000

/**
 * Silme sonrası "Geri Al" bildirimi. Süre dolunca kendini kapatır.
 * @param {{ entry: {task: {title: string}} | null, onUndo: () => void, onDismiss: () => void }} props
 */
export default function UndoToast({ entry, onUndo, onDismiss }) {
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    if (!entry) return undefined

    setProgress(1)
    const startedAt = Date.now()

    const raf = setInterval(() => {
      const elapsed = Date.now() - startedAt
      setProgress(Math.max(0, 1 - elapsed / DURATION_MS))
    }, 80)

    const timer = setTimeout(onDismiss, DURATION_MS)
    return () => {
      clearInterval(raf)
      clearTimeout(timer)
    }
  }, [entry, onDismiss])

  if (!entry) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-toast-up fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <div className="overflow-hidden rounded-2xl bg-[#16181d] text-white shadow-2xl dark:bg-[#23262d]">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Icon name="trash" className="h-4 w-4 shrink-0 text-white/50" />
          <p className="min-w-0 flex-1 truncate text-sm">
            <span className="font-medium">{entry.task.title || 'Görev'}</span> silindi
          </p>
          <button
            type="button"
            onClick={onUndo}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/12 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/20"
          >
            <Icon name="undo" className="h-3.5 w-3.5" />
            Geri Al
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Bildirimi kapat"
            className="shrink-0 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="h-0.5 bg-white/10">
          <div
            className="h-full bg-brand-300 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
