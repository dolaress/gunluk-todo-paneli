import { useCallback, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../constants'

/**
 * Dark/Light mode. Tercih localStorage'da saklanır,
 * <html> üzerindeki `dark` sınıfı Tailwind'in `dark:` varyantını tetikler.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem(STORAGE_KEYS.theme)
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme)
    } catch {
      /* yoksay */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle, setTheme }
}
