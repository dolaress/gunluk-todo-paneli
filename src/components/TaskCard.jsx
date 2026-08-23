import { useEffect, useRef, useState } from 'react'
import { getCategory, getEnergy, getPriority } from '../constants'
import { formatDuration } from '../utils/date'
import Icon from './Icon'

/**
 * Tek bir görev kartı. Sürükle-bırak sarmalayıcıları
 * `dragHandleProps` ve `setNodeRef` üzerinden bağlanır.
 *
 * @param {{
 *   task: import('../constants').Task,
 *   onToggle: (id: string) => void,
 *   onDelete: (id: string) => void,
 *   onEdit: (task: import('../constants').Task) => void,
 *   onUpdate: (id: string, patch: object) => void,
 *   onToggleSubtask: (taskId: string, subtaskId: string) => void,
 *   onStartPomodoro?: (task: import('../constants').Task) => void,
 *   isPomodoroActive?: boolean,
 *   compact?: boolean,
 *   dragHandleProps?: object,
 *   setNodeRef?: (node: HTMLElement | null) => void,
 *   style?: object,
 *   isDragging?: boolean,
 * }} props
 */
export default function TaskCard({
  task,
  onToggle,
  onDelete,
  onEdit,
  onUpdate,
  onToggleSubtask,
  onStartPomodoro,
  isPomodoroActive = false,
  compact = false,
  dragHandleProps,
  setNodeRef,
  style,
  isDragging = false,
}) {
  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(task.title)
  const [showSubtasks, setShowSubtasks] = useState(false)
  const inputRef = useRef(null)

  const category = getCategory(task.category)
  const priority = getPriority(task.priority)
  const energy = getEnergy(task.energyLevel)

  const doneSubtasks = task.subtasks.filter((s) => s.done).length
  const hasSubtasks = task.subtasks.length > 0

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const commitTitle = () => {
    const next = titleDraft.trim()
    if (next && next !== task.title) onUpdate(task.id, { title: next })
    else setTitleDraft(task.title)
    setEditing(false)
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`card group relative overflow-hidden transition-shadow ${
        isDragging ? 'z-20 opacity-90 shadow-xl' : ''
      } ${task.completed ? 'opacity-60' : ''}`}
    >
      {/* Sol kenardaki öncelik şeridi */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${priority.bar} ${
          task.completed ? 'opacity-40' : ''
        }`}
      />

      <div className={`flex gap-3 ${compact ? 'py-3 pr-3 pl-4' : 'py-4 pr-4 pl-5'}`}>
        {dragHandleProps && (
          <button
            type="button"
            {...dragHandleProps}
            aria-label={`${task.title} görevini taşı`}
            className="mt-0.5 hidden cursor-grab touch-none rounded-md p-1 text-muted opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing sm:block dark:text-white/35"
          >
            <Icon name="drag" className="h-4 w-4" strokeWidth={2.4} />
          </button>
        )}

        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-pressed={task.completed}
          aria-label={
            task.completed ? `${task.title} görevini geri al` : `${task.title} görevini tamamla`
          }
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
            task.completed
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-black/20 hover:border-brand-500 dark:border-white/25'
          }`}
        >
          {task.completed && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {editing ? (
              <input
                ref={inputRef}
                className="field py-1.5 text-sm font-medium"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitTitle()
                  if (e.key === 'Escape') {
                    setTitleDraft(task.title)
                    setEditing(false)
                  }
                }}
              />
            ) : (
              <h3
                onDoubleClick={() => setEditing(true)}
                title="Düzenlemek için çift tıkla"
                className={`min-w-0 flex-1 text-sm leading-snug font-medium break-words ${
                  task.completed ? 'text-muted line-through dark:text-white/40' : ''
                }`}
              >
                {task.isMIT && (
                  <span
                    title="Günün en önemli görevi"
                    className="mr-1.5 inline-block align-[-1px] text-amber-500"
                  >
                    <Icon name="star" className="inline h-3.5 w-3.5 fill-amber-400" />
                  </span>
                )}
                {task.title}
              </h3>
            )}

            {/* Eylemler: masaüstünde hover'da, dokunmatikte hep görünür */}
            <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
              {onStartPomodoro && !task.completed && (
                <button
                  type="button"
                  onClick={() => onStartPomodoro(task)}
                  aria-label={`${task.title} için pomodoro başlat`}
                  className={`rounded-lg p-1.5 transition-colors ${
                    isPomodoroActive
                      ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300'
                      : 'text-muted hover:bg-black/5 hover:text-brand-600 dark:text-white/40 dark:hover:bg-white/8'
                  }`}
                >
                  <Icon name="play" className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onUpdate(task.id, { isMIT: !task.isMIT })}
                aria-label={task.isMIT ? 'MIT işaretini kaldır' : 'MIT olarak işaretle'}
                className={`rounded-lg p-1.5 transition-colors ${
                  task.isMIT
                    ? 'text-amber-500'
                    : 'text-muted hover:bg-black/5 hover:text-amber-500 dark:text-white/40 dark:hover:bg-white/8'
                }`}
              >
                <Icon name="star" className={`h-3.5 w-3.5 ${task.isMIT ? 'fill-amber-400' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => onEdit(task)}
                aria-label={`${task.title} görevini düzenle`}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-black/5 hover:text-ink dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white"
              >
                <Icon name="pencil" className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                aria-label={`${task.title} görevini sil`}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-500 dark:text-white/40"
              >
                <Icon name="trash" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {task.description && !compact && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted dark:text-white/45">
              {task.description}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-black/5 px-1.5 py-0.5 font-medium tabular-nums text-muted dark:bg-white/8 dark:text-white/55">
              <Icon name="clock" className="h-3 w-3" />
              {task.time}
            </span>
            <span className="text-muted dark:text-white/35">{formatDuration(task.duration)}</span>
            <span className={`rounded-md px-1.5 py-0.5 font-medium ${category.chip}`}>
              {category.label}
            </span>
            <span className={`rounded-md px-1.5 py-0.5 font-medium ${priority.chip}`}>
              {priority.label}
            </span>
            <span
              title={energy.hint}
              className="text-muted dark:text-white/40"
              aria-label={`Enerji: ${energy.hint}`}
            >
              {energy.icon}
            </span>

            {hasSubtasks && (
              <button
                type="button"
                onClick={() => setShowSubtasks((v) => !v)}
                aria-expanded={showSubtasks}
                className="ml-auto rounded-md px-1.5 py-0.5 font-medium tabular-nums text-muted transition-colors hover:bg-black/5 dark:text-white/45 dark:hover:bg-white/8"
              >
                {doneSubtasks}/{task.subtasks.length} alt görev
              </button>
            )}
          </div>

          {hasSubtasks && showSubtasks && (
            <ul className="mt-2.5 space-y-1 border-t border-line pt-2.5 dark:border-white/8">
              {task.subtasks.map((s) => (
                <li key={s.id}>
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={s.done}
                      onChange={() => onToggleSubtask(task.id, s.id)}
                      className="h-3.5 w-3.5 rounded accent-brand-600"
                    />
                    <span
                      className={s.done ? 'text-muted line-through dark:text-white/35' : ''}
                    >
                      {s.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}
