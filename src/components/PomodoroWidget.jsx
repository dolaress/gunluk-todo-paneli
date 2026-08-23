import { formatClock } from '../utils/date'
import Icon from './Icon'

/**
 * 25 dakikalık pomodoro widget'ı.
 * Bir göreve tıklanınca `startForTask` ile o görev için sayaç başlar.
 *
 * @param {{ pomodoro: ReturnType<typeof import('../hooks/usePomodoro').usePomodoro>, activeTask?: import('../constants').Task | null }} props
 */
export default function PomodoroWidget({ pomodoro, activeTask }) {
  const { mode, running, secondsLeft, progress, completedRounds, start, pause, reset, stop } =
    pomodoro

  const isFocus = mode === 'focus'

  return (
    <section className="card p-5" aria-label="Pomodoro zamanlayıcı">
      <div className="flex items-center gap-2">
        <Icon name="clock" className="h-4 w-4 text-brand-600 dark:text-brand-300" />
        <h2 className="text-sm font-semibold tracking-tight">Pomodoro</h2>
        <span
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
            isFocus
              ? 'bg-brand-500/12 text-brand-600 dark:text-brand-300'
              : 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300'
          }`}
        >
          {isFocus ? 'Odak' : 'Mola'}
        </span>
        {completedRounds > 0 && (
          <span className="ml-auto text-xs tabular-nums text-muted dark:text-white/40">
            {completedRounds} tur
          </span>
        )}
      </div>

      <p className="mt-4 text-center text-4xl font-semibold tracking-tight tabular-nums">
        {formatClock(secondsLeft)}
      </p>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/8 dark:bg-white/10"
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Pomodoro ilerlemesi"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ease-linear ${
            isFocus ? 'bg-brand-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>

      <p className="mt-3 min-h-8 text-center text-xs leading-relaxed text-muted dark:text-white/45">
        {activeTask ? (
          <>
            Odaklanılan görev:{' '}
            <span className="font-medium text-ink dark:text-white/75">{activeTask.title}</span>
          </>
        ) : (
          'Bir görev kartındaki ▶ düğmesine basarak o görev için sayaç başlat.'
        )}
      </p>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => (running ? pause() : start())}
          className="btn-primary flex-1"
        >
          <Icon name={running ? 'pause' : 'play'} className="h-4 w-4" />
          {running ? 'Duraklat' : 'Başlat'}
        </button>
        <button type="button" onClick={reset} aria-label="Sayacı sıfırla" className="btn-ghost px-3">
          <Icon name="rotate" className="h-4 w-4" />
        </button>
        {activeTask && (
          <button
            type="button"
            onClick={stop}
            aria-label="Görev odağını bırak"
            className="btn-ghost px-3"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  )
}
