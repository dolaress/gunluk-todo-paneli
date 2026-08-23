/**
 * localStorage erişimi tek noktadan geçer.
 * Anahtarlar tarih bazlıdır: `todos-2026-08-22`
 */
import { STORAGE_KEYS } from '../constants'

const { taskPrefix } = STORAGE_KEYS

const hasStorage = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

/** @param {string} dateKey */
export const taskStorageKey = (dateKey) => `${taskPrefix}${dateKey}`

/**
 * Bir anahtarı güvenli okur; bozuk JSON varsa fallback döner.
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
export function readJSON(key, fallback) {
  if (!hasStorage()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
export function writeJSON(key, value) {
  if (!hasStorage()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Kota dolduysa sessizce geç — uygulama çalışmaya devam etsin.
  }
}

/** @param {string} key */
export function removeKey(key) {
  if (!hasStorage()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* yoksay */
  }
}

/**
 * Belirli bir günün görevleri.
 * @param {string} dateKey
 * @returns {import('../constants').Task[]}
 */
export function loadTasks(dateKey) {
  const tasks = readJSON(taskStorageKey(dateKey), [])
  return Array.isArray(tasks) ? tasks : []
}

/**
 * @param {string} dateKey
 * @param {import('../constants').Task[]} tasks
 */
export function saveTasks(dateKey, tasks) {
  if (!tasks.length) {
    // Boş günler için anahtar bırakma — ısı haritası temiz kalsın.
    removeKey(taskStorageKey(dateKey))
    return
  }
  writeJSON(taskStorageKey(dateKey), tasks)
}

/**
 * localStorage'daki tüm görev günleri (artan sırada).
 * @returns {string[]}
 */
export function getAllTaskDates() {
  if (!hasStorage()) return []
  const keys = []
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i)
    if (key && key.startsWith(taskPrefix)) {
      keys.push(key.slice(taskPrefix.length))
    }
  }
  return keys.sort()
}

/**
 * Geçmiş günler dahil tüm görevleri {tarih: görevler} olarak döner.
 * @returns {Record<string, import('../constants').Task[]>}
 */
export function loadAllTasks() {
  return Object.fromEntries(getAllTaskDates().map((d) => [d, loadTasks(d)]))
}

/** Tüm görev verisini dışa aktarılabilir bir nesneye toplar. */
export function exportAllData() {
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    days: loadAllTasks(),
  }
}

/** Tüm görev anahtarlarını siler (ayarlar sayfasındaki sıfırlama). */
export function clearAllTaskData() {
  getAllTaskDates().forEach((d) => removeKey(taskStorageKey(d)))
}
