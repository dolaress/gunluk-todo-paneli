import { useEffect, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { TIME_BLOCKS } from '../constants'
import { minutesSinceMidnight, minutesToTime, normalizedHour } from '../utils/date'
import EmptyState from './EmptyState'
import Icon from './Icon'
import TaskCard from './TaskCard'

/** Sürüklenebilir kart sarmalayıcısı — timeline'da blok değiştirmek için. */
function DraggableTaskCard({ task, ...rest }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  return (
    <TaskCard
      task={task}
      setNodeRef={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.4 : 1,
      }}
      dragHandleProps={{ ...attributes, ...listeners }}
      isDragging={isDragging}
      compact
      {...rest}
    />
  )
}

/** Bir zaman bloğu — üzerine görev bırakılabilen alan. */
function TimeBlock({ block, tasks, isCurrent, nowLabel, onAddAt, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: block.id })
  const doneCount = tasks.filter((t) => t.completed).length

  return (
    <section
      ref={setNodeRef}
      aria-label={`${block.label} bloğu`}
      className={`rounded-2xl border p-4 transition-colors ${
        isOver
          ? 'border-brand-500 bg-brand-50/60 dark:border-brand-500 dark:bg-brand-500/8'
          : 'border-line bg-black/[0.015] dark:border-white/8 dark:bg-white/[0.02]'
      }`}
    >
      <header className="mb-3 flex items-center gap-2.5">
        <span aria-hidden="true" className="text-base">
          {block.icon}
        </span>
        <h3 className="text-sm font-semibold tracking-tight">{block.label}</h3>
        <span className="text-xs tabular-nums text-muted dark:text-white/40">{block.hint}</span>

        {isCurrent && (
          <span className="inline-flex items-center gap-1 rounded-md bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
            Şu an
          </span>
        )}

        <span className="ml-auto flex items-center gap-2">
          {tasks.length > 0 && (
            <span className="text-xs tabular-nums text-muted dark:text-white/40">
              {doneCount}/{tasks.length}
            </span>
          )}
          <button
            type="button"
            onClick={() => onAddAt(block)}
            aria-label={`${block.label} bloğuna görev ekle`}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-black/5 hover:text-brand-600 dark:text-white/40 dark:hover:bg-white/8"
          >
            <Icon name="plus" className="h-4 w-4" />
          </button>
        </span>
      </header>

      {isCurrent && (
        <div className="mb-3 flex items-center gap-2" aria-hidden="true">
          <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
          <span className="h-px flex-1 bg-rose-500/50" />
          <span className="shrink-0 text-[11px] font-medium tabular-nums text-rose-500">
            {nowLabel}
          </span>
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs text-muted dark:border-white/10 dark:text-white/35">
          Bu blok boş — görev sürükleyip bırakabilirsin.
        </p>
      ) : (
        <div className="space-y-2.5">{children}</div>
      )}
    </section>
  )
}

/**
 * Saatlik/zaman bloklu gün görünümü.
 *
 * @param {{
 *   tasks: import('../constants').Task[],
 *   isToday: boolean,
 *   onMoveTask: (id: string, time: string) => void,
 *   onAddTask: (time?: string) => void,
 * }} props
 */
export default function TimelineView({
  tasks,
  isToday,
  onMoveTask,
  onAddTask,
  activePomodoroId,
  ...handlers
}) {
  const [activeId, setActiveId] = useState(null)
  const [nowMinutes, setNowMinutes] = useState(() => minutesSinceMidnight())

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  // "Şu an" göstergesini dakikada bir tazele.
  useEffect(() => {
    const id = setInterval(() => setNowMinutes(minutesSinceMidnight()), 60_000)
    return () => clearInterval(id)
  }, [])

  const currentHour = Math.floor(nowMinutes / 60)
  const currentNormalized = currentHour < 6 ? currentHour + 24 : currentHour

  /** @param {import('../constants').Task} task */
  const blockOf = (task) => {
    const hour = normalizedHour(task.time)
    return (
      TIME_BLOCKS.find((b) => hour >= b.startHour && hour < b.endHour) ??
      TIME_BLOCKS[TIME_BLOCKS.length - 1]
    )
  }

  const grouped = TIME_BLOCKS.map((block) => ({
    block,
    tasks: tasks.filter((t) => blockOf(t).id === block.id),
    isCurrent:
      isToday && currentNormalized >= block.startHour && currentNormalized < block.endHour,
  }))

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return
    const target = TIME_BLOCKS.find((b) => b.id === over.id)
    const task = tasks.find((t) => t.id === active.id)
    if (!target || !task) return
    if (blockOf(task).id === target.id) return
    // Bloğun başlangıç saatine yerleştir (gece bloğu 22:00'dan başlar).
    const hour = target.startHour % 24
    onMoveTask(task.id, `${String(hour).padStart(2, '0')}:00`)
  }

  if (!tasks.length) {
    return (
      <EmptyState
        title="Gün henüz planlanmadı"
        description="Görev ekleyerek gününü sabah, öğlen, akşam ve gece bloklarına dağıt."
        actionLabel="Görev ekle"
        onAction={() => onAddTask()}
      />
    )
  }

  const activeTask = tasks.find((t) => t.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {grouped.map(({ block, tasks: blockTasks, isCurrent }) => (
          <TimeBlock
            key={block.id}
            block={block}
            tasks={blockTasks}
            isCurrent={isCurrent}
            nowLabel={minutesToTime(nowMinutes)}
            onAddAt={(b) => onAddTask(`${String(b.startHour % 24).padStart(2, '0')}:00`)}
          >
            {blockTasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                isPomodoroActive={task.id === activePomodoroId}
                {...handlers}
              />
            ))}
          </TimeBlock>
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask && (
          <div className="w-full max-w-md rotate-1 cursor-grabbing">
            <TaskCard
              task={activeTask}
              compact
              onToggle={() => {}}
              onDelete={() => {}}
              onEdit={() => {}}
              onUpdate={() => {}}
              onToggleSubtask={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
