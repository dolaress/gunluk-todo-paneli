import Icon from './Icon'

/**
 * Günün sözü + günün MIT vurgusu.
 *
 * @param {{
 *   quote: { text: string, author: string },
 *   mitTask?: import('../constants').Task | null,
 *   onFocusMIT?: (task: import('../constants').Task) => void,
 * }} props
 */
export default function MotivationCard({ quote, mitTask, onFocusMIT }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-sky-600 p-5 text-white shadow-lg">
      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-white/70 uppercase">
        <Icon name="bolt" className="h-3.5 w-3.5" />
        Günün sözü
      </div>

      <blockquote className="mt-3">
        <p className="text-[15px] leading-relaxed font-medium text-balance">“{quote.text}”</p>
        <footer className="mt-2 text-xs text-white/65">— {quote.author}</footer>
      </blockquote>

      <div className="mt-5 rounded-xl bg-white/12 p-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-white/75 uppercase">
          <Icon name="star" className="h-3 w-3 fill-amber-300 text-amber-300" />
          Günün en önemli görevi
        </div>

        {mitTask ? (
          <div className="mt-2 flex items-center gap-3">
            <p
              className={`min-w-0 flex-1 text-sm font-medium ${
                mitTask.completed ? 'line-through opacity-70' : ''
              }`}
            >
              {mitTask.title}
            </p>
            {!mitTask.completed && onFocusMIT && (
              <button
                type="button"
                onClick={() => onFocusMIT(mitTask)}
                className="shrink-0 rounded-lg bg-white/20 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-white/30"
              >
                Odaklan
              </button>
            )}
            {mitTask.completed && (
              <span className="shrink-0 rounded-lg bg-emerald-400/25 px-2.5 py-1 text-xs font-medium">
                Tamamlandı
              </span>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-white/70">
            Henüz seçilmedi — bir görevi yıldızlayarak günün MIT'i yap.
          </p>
        )}
      </div>
    </section>
  )
}
