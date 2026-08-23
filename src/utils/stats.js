/** İstatistik hesaplamaları — analitik panelini besler. */
import { CATEGORIES, QUOTES, getCategory } from '../constants'
import { addDays, lastNDays, todayKey } from './date'
import { loadTasks } from './storage'

/**
 * Bir günün özeti.
 * @param {import('../constants').Task[]} tasks
 */
export function summarize(tasks) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const plannedMinutes = tasks.reduce((sum, t) => sum + (Number(t.duration) || 0), 0)
  const doneMinutes = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (Number(t.duration) || 0), 0)

  return {
    total,
    completed,
    remaining: total - completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
    plannedMinutes,
    doneMinutes,
  }
}

/**
 * Kategori bazlı görev ve süre dağılımı (yüzdeler dahil).
 * @param {import('../constants').Task[]} tasks
 */
export function categoryBreakdown(tasks) {
  const totalMinutes = tasks.reduce((sum, t) => sum + (Number(t.duration) || 0), 0)

  return CATEGORIES.map((cat) => {
    const items = tasks.filter((t) => t.category === cat.id)
    const minutes = items.reduce((sum, t) => sum + (Number(t.duration) || 0), 0)
    return {
      ...cat,
      count: items.length,
      completed: items.filter((t) => t.completed).length,
      minutes,
      percent: totalMinutes ? Math.round((minutes / totalMinutes) * 100) : 0,
    }
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.minutes - a.minutes || b.count - a.count)
}

/**
 * Bugünden geriye doğru kesintisiz "en az bir görev tamamlanmış" gün sayısı.
 * Bugün henüz boşsa seri dünden itibaren sayılır (gün bitmedi, seri kırılmasın).
 * @returns {number}
 */
export function calculateStreak() {
  const today = todayKey()
  const dayHasProgress = (key) => loadTasks(key).some((t) => t.completed)

  let cursor = today
  if (!dayHasProgress(today)) {
    cursor = addDays(today, -1)
  }

  let streak = 0
  // 365 günden uzun seriler için üst sınır — sonsuz döngü koruması.
  while (streak < 365 && dayHasProgress(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

/**
 * GitHub katkı ızgarası mantığında ısı haritası verisi.
 * @param {number} days
 */
export function buildHeatmap(days = 30) {
  return lastNDays(days).map((key) => {
    const tasks = loadTasks(key)
    const { total, completed, percent } = summarize(tasks)
    let level = 0
    if (completed > 0) {
      if (percent >= 100) level = 4
      else if (percent >= 66) level = 3
      else if (percent >= 33) level = 2
      else level = 1
    }
    return { date: key, total, completed, percent, level }
  })
}

/**
 * Son N günün tamamlanan görev sayısı — mini bar grafik için.
 * @param {number} days
 */
export function weeklyTrend(days = 7) {
  return lastNDays(days).map((key) => {
    const tasks = loadTasks(key)
    const { completed, total } = summarize(tasks)
    return { date: key, completed, total }
  })
}

/** Tarihe göre deterministik günün sözü — aynı gün hep aynı sözü verir. */
export function quoteOfTheDay(dateKey) {
  const seed = dateKey.split('-').join('')
  const index = Number(seed) % QUOTES.length
  return QUOTES[Number.isFinite(index) ? index : 0]
}

/**
 * Görevleri sıralar: MIT önce, sonra saat, sonra öncelik.
 * @param {import('../constants').Task[]} tasks
 */
export function sortTasks(tasks) {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return [...tasks].sort((a, b) => {
    if (a.isMIT !== b.isMIT) return a.isMIT ? -1 : 1
    if (a.time !== b.time) return (a.time || '').localeCompare(b.time || '')
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/** Analitik başlığındaki "en çok zaman ayrılan alan" cümlesi. */
export function topCategoryLabel(tasks) {
  const breakdown = categoryBreakdown(tasks)
  if (!breakdown.length) return null
  return getCategory(breakdown[0].id).label
}
