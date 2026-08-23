import { useCallback, useState } from 'react'
import Header from './components/Header'
import { useLocalStorage } from './hooks/useLocalStorage'
import { usePomodoro } from './hooks/usePomodoro'
import { useTheme } from './hooks/useTheme'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import { STORAGE_KEYS } from './constants'
import { todayKey } from './utils/date'

export default function App() {
  const { theme, toggle, setTheme } = useTheme()
  const [view, setView] = useLocalStorage(STORAGE_KEYS.view, 'timeline')
  const [dateKey, setDateKey] = useState(todayKey)
  const [page, setPage] = useState('dashboard')
  const [formOpen, setFormOpen] = useState(false)

  // Pomodoro state'i sayfa değişse de korunsun diye App seviyesinde tutulur.
  const pomodoro = usePomodoro()

  const goToday = useCallback(() => setDateKey(todayKey()), [])

  const handleDateChange = useCallback((next) => {
    setDateKey(next)
    setPage('dashboard')
  }, [])

  return (
    <div className="min-h-screen">
      <Header
        dateKey={dateKey}
        onDateChange={handleDateChange}
        onToday={goToday}
        view={view}
        onViewChange={setView}
        theme={theme}
        onToggleTheme={toggle}
        onAddTask={() => {
          setPage('dashboard')
          setFormOpen(true)
        }}
        page={page}
        onNavigate={setPage}
      />

      {page === 'dashboard' ? (
        <Dashboard
          dateKey={dateKey}
          onDateChange={handleDateChange}
          view={view}
          formOpen={formOpen}
          onFormOpenChange={setFormOpen}
          pomodoro={pomodoro}
        />
      ) : (
        <Settings
          theme={theme}
          onThemeChange={setTheme}
          onBack={() => setPage('dashboard')}
        />
      )}

      <footer className="border-t border-line py-6 text-center text-xs text-muted dark:border-white/8 dark:text-white/35">
        Veriler tarayıcının localStorage'ında saklanır · React + Vite + Tailwind CSS
      </footer>
    </div>
  )
}
