import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, DEFAULT_CATEGORY, ENERGY_LEVELS, PRIORITIES } from '../constants'
import Icon from './Icon'

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120]

const emptyDraft = () => ({
  title: '',
  description: '',
  time: '09:00',
  duration: 30,
  category: DEFAULT_CATEGORY,
  priority: 'medium',
  energyLevel: 'high',
  subtasks: [],
  isMIT: false,
})

const newSubtaskId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

/**
 * Sağdan açılan görev formu — hem Ekle hem Güncelle için kullanılır.
 *
 * @param {{
 *   open: boolean,
 *   task?: import('../constants').Task | null,
 *   defaultTime?: string,
 *   onClose: () => void,
 *   onSubmit: (draft: object) => void,
 * }} props
 */
export default function TaskFormPanel({ open, task, defaultTime, onClose, onSubmit }) {
  const [draft, setDraft] = useState(emptyDraft)
  const [subtaskInput, setSubtaskInput] = useState('')
  const [error, setError] = useState('')
  const titleRef = useRef(null)

  const isEditing = !!task

  // Panel her açılışında formu tazele.
  useEffect(() => {
    if (!open) return undefined
    setDraft(task ? { ...task } : { ...emptyDraft(), time: defaultTime ?? '09:00' })
    setSubtaskInput('')
    setError('')
    const focusTimer = setTimeout(() => titleRef.current?.focus(), 120)
    return () => clearTimeout(focusTimer)
  }, [open, task, defaultTime])

  // Esc ile kapat + arkadaki sayfayı kilitle.
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const set = (patch) => setDraft((prev) => ({ ...prev, ...patch }))

  const addSubtask = () => {
    const title = subtaskInput.trim()
    if (!title) return
    set({ subtasks: [...draft.subtasks, { id: newSubtaskId(), title, done: false }] })
    setSubtaskInput('')
  }

  const removeSubtask = (id) => {
    set({ subtasks: draft.subtasks.filter((s) => s.id !== id) })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!draft.title.trim()) {
      setError('Görev başlığı boş bırakılamaz.')
      titleRef.current?.focus()
      return
    }
    onSubmit({ ...draft, title: draft.title.trim() })
    onClose()
  }

  const optionClass = (active) =>
    active
      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/12 dark:text-brand-300'
      : 'border-line text-muted hover:bg-black/4 dark:border-white/10 dark:text-white/55 dark:hover:bg-white/8'

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Paneli kapat"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? 'Görevi düzenle' : 'Yeni görev ekle'}
        className="animate-slide-in-right relative flex h-full w-full max-w-md flex-col bg-surface shadow-2xl dark:bg-[#15181d]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 dark:border-white/8">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {isEditing ? 'Görevi düzenle' : 'Yeni görev'}
            </h2>
            <p className="mt-0.5 text-sm text-muted dark:text-white/45">
              {isEditing
                ? 'Değişiklikler anında kaydedilir.'
                : 'Gününe yeni bir zaman bloğu ekle.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="-mr-2 rounded-lg p-2 text-muted transition-colors hover:bg-black/5 hover:text-ink dark:text-white/45 dark:hover:bg-white/8 dark:hover:text-white"
          >
            <Icon name="close" />
          </button>
        </header>

        <form
          id="task-form"
          onSubmit={handleSubmit}
          className="thin-scroll flex-1 space-y-6 overflow-y-auto px-6 py-6"
        >
          <div>
            <label className="label" htmlFor="task-title">
              Başlık
            </label>
            <input
              id="task-title"
              ref={titleRef}
              className="field"
              placeholder="Örn. Proje sunumunu hazırla"
              value={draft.title}
              onChange={(e) => {
                set({ title: e.target.value })
                if (error) setError('')
              }}
              aria-invalid={!!error}
            />
            {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
          </div>

          <div>
            <label className="label" htmlFor="task-desc">
              Açıklama <span className="normal-case opacity-60">(opsiyonel)</span>
            </label>
            <textarea
              id="task-desc"
              rows={2}
              className="field resize-none"
              placeholder="Kısa bir not…"
              value={draft.description}
              onChange={(e) => set({ description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="task-time">
                Saat
              </label>
              <input
                id="task-time"
                type="time"
                step={900}
                className="field"
                value={draft.time}
                onChange={(e) => set({ time: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor="task-duration">
                Süre (dk)
              </label>
              <input
                id="task-duration"
                type="number"
                min={5}
                max={600}
                step={5}
                className="field"
                value={draft.duration}
                onChange={(e) => set({ duration: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="-mt-3 flex flex-wrap gap-1.5">
            {DURATION_PRESETS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => set({ duration: minutes })}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  draft.duration === minutes
                    ? 'bg-brand-600 text-white'
                    : 'bg-black/5 text-muted hover:bg-black/10 dark:bg-white/8 dark:text-white/55 dark:hover:bg-white/12'
                }`}
              >
                {minutes}dk
              </button>
            ))}
          </div>

          <div>
            <span className="label">Kategori</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => set({ category: cat.id })}
                  aria-pressed={draft.category === cat.id}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${optionClass(
                    draft.category === cat.id,
                  )}`}
                >
                  <span className={`h-2 w-2 rounded-full ${cat.dot}`} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="label">Öncelik</span>
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set({ priority: p.id })}
                    aria-pressed={draft.priority === p.id}
                    className={`flex-1 rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${optionClass(
                      draft.priority === p.id,
                    )}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="label">Enerji</span>
              <div className="flex gap-1.5">
                {ENERGY_LEVELS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => set({ energyLevel: e.id })}
                    aria-pressed={draft.energyLevel === e.id}
                    title={e.hint}
                    className={`flex-1 rounded-xl border px-2 py-2 text-xs font-medium whitespace-nowrap transition-colors ${optionClass(
                      draft.energyLevel === e.id,
                    )}`}
                  >
                    <span className="mr-1">{e.icon}</span>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="label">Alt görevler</span>
            <div className="flex gap-2">
              <input
                className="field"
                placeholder="Alt görev ekle…"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSubtask()
                  }
                }}
              />
              <button
                type="button"
                onClick={addSubtask}
                aria-label="Alt görev ekle"
                className="btn-ghost shrink-0 px-3"
              >
                <Icon name="plus" className="h-4 w-4" />
              </button>
            </div>

            {draft.subtasks.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {draft.subtasks.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-2 rounded-lg bg-black/4 px-3 py-2 text-sm dark:bg-white/6"
                  >
                    <span className="min-w-0 flex-1 truncate">{s.title}</span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(s.id)}
                      aria-label={`${s.title} alt görevini kaldır`}
                      className="rounded p-1 text-muted transition-colors hover:text-rose-500 dark:text-white/45"
                    >
                      <Icon name="close" className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 p-4">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-amber-500"
              checked={draft.isMIT}
              onChange={(e) => set({ isMIT: e.target.checked })}
            />
            <span className="text-sm">
              <span className="font-medium">Günün en önemli görevi (MIT)</span>
              <span className="mt-0.5 block text-xs text-muted dark:text-white/45">
                Aynı anda yalnızca bir görev MIT olabilir.
              </span>
            </span>
          </label>
        </form>

        <footer className="flex gap-3 border-t border-line px-6 py-4 dark:border-white/8">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">
            Vazgeç
          </button>
          <button type="submit" form="task-form" className="btn-primary flex-1">
            <Icon name={isEditing ? 'check' : 'plus'} className="h-4 w-4" />
            {isEditing ? 'Kaydet' : 'Görevi ekle'}
          </button>
        </footer>
      </aside>
    </div>
  )
}
