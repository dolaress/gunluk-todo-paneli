/**
 * Uygulama genelinde kullanılan sabitler.
 * (Yönergedeki "Interfaces" klasörünün JS karşılığı.)
 */

/** @typedef {"high" | "medium" | "low"} Priority */
/** @typedef {"high" | "low"} EnergyLevel */

/**
 * @typedef {Object} Subtask
 * @property {string} id
 * @property {string} title
 * @property {boolean} done
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} time         "09:00" formatında saatlik blok
 * @property {number} duration     dakika cinsinden tahmini süre
 * @property {string} category
 * @property {Priority} priority
 * @property {EnergyLevel} energyLevel
 * @property {Subtask[]} subtasks
 * @property {boolean} completed
 * @property {boolean} isMIT       günün en önemli görevi
 */

export const CATEGORIES = [
  { id: 'is', label: 'İş', dot: 'bg-indigo-500', chip: 'bg-indigo-500/12 text-indigo-600 dark:text-indigo-300', hex: '#6366f1' },
  { id: 'kisisel', label: 'Kişisel', dot: 'bg-amber-500', chip: 'bg-amber-500/12 text-amber-700 dark:text-amber-300', hex: '#f59e0b' },
  { id: 'saglik', label: 'Sağlık', dot: 'bg-emerald-500', chip: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300', hex: '#10b981' },
  { id: 'ogrenme', label: 'Öğrenme', dot: 'bg-sky-500', chip: 'bg-sky-500/12 text-sky-700 dark:text-sky-300', hex: '#0ea5e9' },
  { id: 'sosyal', label: 'Sosyal', dot: 'bg-pink-500', chip: 'bg-pink-500/12 text-pink-600 dark:text-pink-300', hex: '#ec4899' },
]

export const DEFAULT_CATEGORY = CATEGORIES[0].id

/** @param {string} id */
export const getCategory = (id) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]

export const PRIORITIES = [
  { id: 'high', label: 'Yüksek', chip: 'bg-rose-500/12 text-rose-600 dark:text-rose-300', bar: 'bg-rose-500', order: 0 },
  { id: 'medium', label: 'Orta', chip: 'bg-amber-500/12 text-amber-700 dark:text-amber-300', bar: 'bg-amber-500', order: 1 },
  { id: 'low', label: 'Düşük', chip: 'bg-slate-500/12 text-slate-600 dark:text-slate-300', bar: 'bg-slate-400', order: 2 },
]

/** @param {string} id */
export const getPriority = (id) =>
  PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[1]

export const ENERGY_LEVELS = [
  { id: 'high', label: 'Yoğun', hint: 'Yoğun odak gerektiren iş', icon: '⚡' },
  { id: 'low', label: 'Hafif', hint: 'Hafif, düşük enerjili iş', icon: '🍃' },
]

/** @param {string} id */
export const getEnergy = (id) =>
  ENERGY_LEVELS.find((e) => e.id === id) ?? ENERGY_LEVELS[1]

/** Günü dört zaman bloğuna ayırır; timeline görünümünün iskeleti. */
export const TIME_BLOCKS = [
  { id: 'morning', label: 'Sabah', hint: '06:00 – 12:00', startHour: 6, endHour: 12, icon: '🌅' },
  { id: 'afternoon', label: 'Öğlen', hint: '12:00 – 17:00', startHour: 12, endHour: 17, icon: '☀️' },
  { id: 'evening', label: 'Akşam', hint: '17:00 – 22:00', startHour: 17, endHour: 22, icon: '🌇' },
  { id: 'night', label: 'Gece', hint: '22:00 – 06:00', startHour: 22, endHour: 30, icon: '🌙' },
]

/** Her gün için sabit bir söz seçilir (tarihe göre deterministik). */
export const QUOTES = [
  { text: 'Bir işi ertelemenin en pahalı bedeli, onu düşünmeye harcadığın zamandır.', author: 'Anonim' },
  { text: 'Küçük ama tutarlı adımlar, büyük ama düzensiz sıçramaları her zaman geçer.', author: 'James Clear' },
  { text: 'Yapılacaklar listesi bir niyet değil, bir sözdür.', author: 'Anonim' },
  { text: 'Zamanı yönetemezsin; yalnızca dikkatini yönetebilirsin.', author: 'Anonim' },
  { text: 'En zor işi güne değil, günün en enerjik saatine yerleştir.', author: 'Cal Newport' },
  { text: 'Mükemmel plan diye bir şey yoktur; başlanmış plan vardır.', author: 'Anonim' },
  { text: 'Odaklanmak, "hayır" demenin başka bir adıdır.', author: 'Steve Jobs' },
  { text: 'Yarın yapacağın en iyi şey, bugün bitirdiğin şeydir.', author: 'Anonim' },
  { text: 'Enerjini değil, önceliklerini yönet; enerji peşinden gelir.', author: 'Anonim' },
  { text: 'Bir gün içinde yapabileceğini abartır, bir yılda yapabileceğini küçümsersin.', author: 'Bill Gates' },
]

export const POMODORO_MINUTES = 25
export const POMODORO_BREAK_MINUTES = 5

export const STORAGE_KEYS = {
  taskPrefix: 'todos-',
  theme: 'todo-theme',
  view: 'todo-view',
  pomodoroSessions: 'todo-pomodoro-sessions',
}
