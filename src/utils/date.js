/** Tarih yardımcıları — localStorage anahtarları yerel saate göre üretilir. */

const TR_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const TR_DAYS_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
const TR_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]

/**
 * Date -> "2026-08-22". UTC'ye çevirmeden yerel gün sınırlarını korur.
 * @param {Date} date
 * @returns {string}
 */
export function toDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * "2026-08-22" -> Date (yerel gece yarısı)
 * @param {string} key
 */
export function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayKey = () => toDateKey(new Date())

/**
 * Bir tarih anahtarına gün ekler/çıkarır.
 * @param {string} key
 * @param {number} days
 */
export function addDays(key, days) {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

/** @param {string} key */
export function formatLongDate(key) {
  const d = fromDateKey(key)
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${TR_DAYS[d.getDay()]}`
}

/** @param {string} key */
export function formatShortDate(key) {
  const d = fromDateKey(key)
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]}`
}

/** @param {string} key */
export function dayNameShort(key) {
  return TR_DAYS_SHORT[fromDateKey(key).getDay()]
}

/** Bugüne göre "Bugün / Dün / Yarın" etiketi, yoksa null. */
export function relativeDayLabel(key) {
  const today = todayKey()
  if (key === today) return 'Bugün'
  if (key === addDays(today, -1)) return 'Dün'
  if (key === addDays(today, 1)) return 'Yarın'
  return null
}

/** "09:30" -> 570 (dakika) */
export function timeToMinutes(time) {
  if (!time) return 0
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

/** 570 -> "09:30" */
export function minutesToTime(total) {
  const clamped = ((total % 1440) + 1440) % 1440
  const h = String(Math.floor(clamped / 60)).padStart(2, '0')
  const m = String(clamped % 60).padStart(2, '0')
  return `${h}:${m}`
}

/** Görev süresini "1s 30dk" biçiminde okunur hale getirir. */
export function formatDuration(minutes) {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}s ${m}dk`
  if (h) return `${h}s`
  return `${m}dk`
}

/** Gecenin bir yarısını timeline'da doğru bloğa yerleştirmek için. */
export function normalizedHour(time) {
  const hour = Math.floor(timeToMinutes(time) / 60)
  return hour < 6 ? hour + 24 : hour
}

/** Bugünün geçen dakikası — timeline "şu an" çizgisi için. */
export function minutesSinceMidnight(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes()
}

/** Bugünden geriye doğru `count` günlük tarih anahtarı dizisi (eskiden yeniye). */
export function lastNDays(count, endKey = todayKey()) {
  return Array.from({ length: count }, (_, i) => addDays(endKey, i - count + 1))
}

/** Saniyeyi "24:05" biçimine çevirir (pomodoro sayacı). */
export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = String(Math.floor(s / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${m}:${sec}`
}
