import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_CATEGORY } from '../constants'
import { loadTasks, saveTasks, taskStorageKey } from '../utils/storage'
import { sortTasks } from '../utils/stats'

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

/**
 * Form verisini tam bir Task nesnesine dönüştürür.
 * @param {Partial<import('../constants').Task>} draft
 * @returns {import('../constants').Task}
 */
export function makeTask(draft = {}) {
  return {
    id: draft.id ?? createId(),
    title: (draft.title ?? '').trim(),
    description: (draft.description ?? '').trim(),
    time: draft.time ?? '09:00',
    duration: Number(draft.duration) || 30,
    category: draft.category ?? DEFAULT_CATEGORY,
    priority: draft.priority ?? 'medium',
    energyLevel: draft.energyLevel ?? 'high',
    subtasks: (draft.subtasks ?? [])
      .filter((s) => s.title?.trim())
      .map((s) => ({ id: s.id ?? createId(), title: s.title.trim(), done: !!s.done })),
    completed: !!draft.completed,
    isMIT: !!draft.isMIT,
  }
}

/**
 * Seçili günün görevlerini yöneten CRUD hook'u.
 * Her gün ayrı localStorage anahtarında tutulur: `todos-2026-08-22`
 *
 * @param {string} dateKey
 */
export function useTasks(dateKey) {
  const [tasks, setTasks] = useState(() => loadTasks(dateKey))
  /** @type {[{task: import('../constants').Task, index: number, dateKey: string} | null, Function]} */
  const [lastDeleted, setLastDeleted] = useState(null)

  // Gün değişince o güne ait kayıtları yükle.
  useEffect(() => {
    setTasks(loadTasks(dateKey))
    setLastDeleted(null)
  }, [dateKey])

  // Her değişiklikte diske yaz.
  useEffect(() => {
    saveTasks(dateKey, tasks)
  }, [dateKey, tasks])

  // Başka bir sekmede yapılan değişiklikleri yansıt.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === taskStorageKey(dateKey)) {
        setTasks(loadTasks(dateKey))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [dateKey])

  /** CREATE */
  const addTask = useCallback((draft) => {
    const task = makeTask(draft)
    setTasks((prev) => {
      // Aynı anda yalnızca bir MIT olabilir.
      const cleared = task.isMIT ? prev.map((t) => ({ ...t, isMIT: false })) : prev
      return [...cleared, task]
    })
    return task
  }, [])

  /** UPDATE — kısmi güncelleme (inline düzenleme dahil) */
  const updateTask = useCallback((id, patch) => {
    setTasks((prev) => {
      const makesMIT = patch.isMIT === true
      return prev.map((t) => {
        if (t.id === id) return { ...t, ...patch }
        return makesMIT && t.isMIT ? { ...t, isMIT: false } : t
      })
    })
  }, [])

  /**
   * DELETE — geri alınabilir.
   * setState güncelleyicileri saf tutulur: React (StrictMode dahil) bir
   * güncelleyiciyi birden fazla kez çalıştırabildiği için içeride başka bir
   * setState çağırmak silme/geri alma işlemini ikiye katlardı.
   */
  const deleteTask = useCallback(
    (id) => {
      const index = tasks.findIndex((t) => t.id === id)
      if (index === -1) return
      setLastDeleted({ task: tasks[index], index, dateKey })
      setTasks((prev) => prev.filter((t) => t.id !== id))
    },
    [tasks, dateKey],
  )

  /** Silineni eski sırasına geri koyar. */
  const undoDelete = useCallback(() => {
    if (!lastDeleted || lastDeleted.dateKey !== dateKey) return
    const { task, index } = lastDeleted
    setTasks((prev) => {
      // Güncelleyici iki kez çalışsa bile görev tek kez eklensin.
      if (prev.some((t) => t.id === task.id)) return prev
      const next = [...prev]
      next.splice(Math.min(index, next.length), 0, task)
      return next
    })
    setLastDeleted(null)
  }, [lastDeleted, dateKey])

  const clearUndo = useCallback(() => setLastDeleted(null), [])

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }, [])

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, done: !s.done } : s,
              ),
            }
          : t,
      ),
    )
  }, [])

  /** Sürükle-bırak: görevi başka bir saat bloğuna taşır. */
  const moveTaskToTime = useCallback((id, time) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, time } : t)))
  }, [])

  /** Sürükle-bırak: liste görünümünde sıra değiştirir. */
  const reorderTasks = useCallback((fromId, toId) => {
    setTasks((prev) => {
      const from = prev.findIndex((t) => t.id === fromId)
      const to = prev.findIndex((t) => t.id === toId)
      if (from === -1 || to === -1 || from === to) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

  const sorted = useMemo(() => sortTasks(tasks), [tasks])

  return {
    tasks,
    sortedTasks: sorted,
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
  }
}
