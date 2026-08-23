import { useCallback, useMemo, useState } from 'react'
import AnalyticsPanel from '../components/AnalyticsPanel'
import FilterBar from '../components/FilterBar'
import ListView from '../components/ListView'
import MotivationCard from '../components/MotivationCard'
import PomodoroWidget from '../components/PomodoroWidget'
import TaskFormPanel from '../components/TaskFormPanel'
import TimelineView from '../components/TimelineView'
import UndoToast from '../components/UndoToast'
import { useTasks } from '../hooks/useTasks'
import { todayKey } from '../utils/date'
import { buildHeatmap, calculateStreak, categoryBreakdown, quoteOfTheDay, summarize } from '../utils/stats'

const initialFilters = { search: '', category: 'all', priority: 'all', status: 'all' }

/**
 * Ana panel: timeline/liste görünümleri, analitik, pomodoro ve motivasyon.
 *
 * @param {{
 *   dateKey: string,
 *   onDateChange: (date: string) => void,
 *   view: 'timeline' | 'list',
 *   formOpen: boolean,
 *   onFormOpenChange: (open: boolean) => void,
 *   pomodoro: object,
 * }} props
 */
export default function Dashboard({
  dateKey,
  onDateChange,
  view,
  formOpen,
  onFormOpenChange,
  pomodoro,
}) {
  const {
    tasks,
    sortedTasks,
    lastDeleted,
    addTask,
    updateTask,
    deleteTask,
    undoDelete,
    clearUndo,
    toggleComplete,
    toggleSubtask,
    moveTaskToTime,
    reorderTasks,
  } = useTasks(dateKey)

  const [editingTask, setEditingTask] = useState(null)
  const [defaultTime, setDefaultTime] = useState('09:00')
  const [filters, setFilters] = useState(initialFilters)

  // Silme/tamamlama sonrası istatistikler yeniden hesaplansın diye
  // localStorage okuyan hesaplar `tasks` uzunluğuna ve içeriğine bağlanır.
  const statsKey = useMemo(
    () => tasks.map((t) => `${t.id}:${t.completed}`).join('|'),
    [tasks],
  )

  const summary = useMemo(() => summarize(tasks), [tasks])
  const breakdown = useMemo(() => categoryBreakdown(tasks), [tasks])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const streak = useMemo(() => calculateStreak(), [statsKey, dateKey])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const heatmap = useMemo(() => buildHeatmap(30), [statsKey, dateKey])
  const quote = useMemo(() => quoteOfTheDay(dateKey), [dateKey])

  const mitTask = tasks.find((t) => t.isMIT) ?? null

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLocaleLowerCase('tr')
    return sortedTasks.filter((task) => {
      if (filters.category !== 'all' && task.category !== filters.category) return false
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false
      if (filters.status === 'active' && task.completed) return false
      if (filters.status === 'completed' && !task.completed) return false
      if (!term) return true
      return (
        task.title.toLocaleLowerCase('tr').includes(term) ||
        task.description.toLocaleLowerCase('tr').includes(term) ||
        task.subtasks.some((s) => s.title.toLocaleLowerCase('tr').includes(term))
      )
    })
  }, [sortedTasks, filters])

  const isFiltered =
    !!filters.search ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all'

  const openCreate = useCallback(
    (time) => {
      setEditingTask(null)
      if (time) setDefaultTime(time)
      onFormOpenChange(true)
    },
    [onFormOpenChange],
  )

  const openEdit = useCallback(
    (task) => {
      setEditingTask(task)
      onFormOpenChange(true)
    },
    [onFormOpenChange],
  )

  const handleSubmit = useCallback(
    (draft) => {
      if (editingTask) updateTask(editingTask.id, draft)
      else addTask(draft)
      setEditingTask(null)
    },
    [editingTask, addTask, updateTask],
  )

  const startPomodoro = useCallback(
    (task) => pomodoro.startForTask(task.id),
    [pomodoro],
  )

  const activePomodoroTask = tasks.find((t) => t.id === pomodoro.activeTaskId) ?? null

  const cardHandlers = {
    onToggle: toggleComplete,
    onDelete: deleteTask,
    onEdit: openEdit,
    onUpdate: updateTask,
    onToggleSubtask: toggleSubtask,
    onStartPomodoro: startPomodoro,
  }

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-8">
        {/* Ana kolon: görevler */}
        <main className="min-w-0 space-y-5">
          {view === 'list' && (
            <FilterBar filters={filters} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} resultCount={filtered.length} />
          )}

          {view === 'timeline' ? (
            <TimelineView
              tasks={sortedTasks}
              isToday={dateKey === todayKey()}
              onMoveTask={moveTaskToTime}
              onAddTask={openCreate}
              activePomodoroId={pomodoro.activeTaskId}
              {...cardHandlers}
            />
          ) : (
            <ListView
              tasks={filtered}
              isFiltered={isFiltered}
              onReorder={reorderTasks}
              onAddTask={() => openCreate()}
              activePomodoroId={pomodoro.activeTaskId}
              {...cardHandlers}
            />
          )}
        </main>

        {/* Yan kolon: analitik ve widget'lar */}
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <MotivationCard quote={quote} mitTask={mitTask} onFocusMIT={startPomodoro} />
          <PomodoroWidget pomodoro={pomodoro} activeTask={activePomodoroTask} />
          <AnalyticsPanel
            summary={summary}
            streak={streak}
            breakdown={breakdown}
            heatmap={heatmap}
            selectedDate={dateKey}
            onSelectDate={onDateChange}
          />
        </aside>
      </div>

      <TaskFormPanel
        open={formOpen}
        task={editingTask}
        defaultTime={defaultTime}
        onClose={() => {
          onFormOpenChange(false)
          setEditingTask(null)
        }}
        onSubmit={handleSubmit}
      />

      <UndoToast entry={lastDeleted} onUndo={undoDelete} onDismiss={clearUndo} />
    </>
  )
}
