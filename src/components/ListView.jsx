import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import EmptyState from './EmptyState'
import TaskCard from './TaskCard'

/** Sortable sarmalayıcı — sürükleme davranışını TaskCard'a bağlar. */
function SortableTaskCard({ task, ...rest }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  return (
    <TaskCard
      task={task}
      setNodeRef={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      dragHandleProps={{ ...attributes, ...listeners }}
      isDragging={isDragging}
      {...rest}
    />
  )
}

/**
 * Düz liste görünümü — filtrelenebilir ve sürükle-bırak ile sıralanabilir.
 *
 * @param {{
 *   tasks: import('../constants').Task[],
 *   isFiltered: boolean,
 *   onReorder: (fromId: string, toId: string) => void,
 *   onAddTask: () => void,
 * }} props
 */
export default function ListView({
  tasks,
  isFiltered,
  onReorder,
  onAddTask,
  activePomodoroId,
  ...handlers
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) onReorder(active.id, over.id)
  }

  if (!tasks.length) {
    return isFiltered ? (
      <EmptyState
        title="Filtreye uyan görev yok"
        description="Arama terimini değiştir veya filtreleri temizle."
      />
    ) : (
      <EmptyState
        title="Bugün için henüz görev yok"
        description="İlk görevini ekleyerek gününü planlamaya başla."
        actionLabel="Görev ekle"
        onAction={onAddTask}
      />
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2.5">
          {tasks.map((task) => (
            <li key={task.id}>
              <SortableTaskCard
                task={task}
                isPomodoroActive={task.id === activePomodoroId}
                {...handlers}
              />
            </li>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
