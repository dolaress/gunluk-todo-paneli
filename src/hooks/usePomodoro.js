import { useCallback, useEffect, useRef, useState } from 'react'
import { POMODORO_BREAK_MINUTES, POMODORO_MINUTES } from '../constants'

/**
 * 25 dakikalık pomodoro sayacı.
 * Sayaç, sekme arka plana alınsa da doğru kalsın diye
 * kalan saniyeyi her tick'te bitiş zaman damgasından yeniden hesaplar.
 *
 * @param {(taskId: string | null) => void} [onComplete]
 */
export function usePomodoro(onComplete) {
  const [mode, setMode] = useState('focus') // 'focus' | 'break'
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_MINUTES * 60)
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [completedRounds, setCompletedRounds] = useState(0)

  const deadlineRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const totalSeconds =
    (mode === 'focus' ? POMODORO_MINUTES : POMODORO_BREAK_MINUTES) * 60

  useEffect(() => {
    if (!running) return undefined

    const tick = () => {
      const remaining = Math.round((deadlineRef.current - Date.now()) / 1000)
      if (remaining <= 0) {
        setSecondsLeft(0)
        setRunning(false)
        deadlineRef.current = null
        setMode((prev) => {
          if (prev === 'focus') {
            setCompletedRounds((r) => r + 1)
            onCompleteRef.current?.(activeTaskId)
            setSecondsLeft(POMODORO_BREAK_MINUTES * 60)
            return 'break'
          }
          setSecondsLeft(POMODORO_MINUTES * 60)
          return 'focus'
        })
        return
      }
      setSecondsLeft(remaining)
    }

    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [running, activeTaskId])

  const start = useCallback(
    (taskId = null) => {
      setActiveTaskId((prev) => (taskId === null ? prev : taskId))
      setSecondsLeft((current) => {
        const seconds = current > 0 ? current : totalSeconds
        deadlineRef.current = Date.now() + seconds * 1000
        return seconds
      })
      setRunning(true)
    },
    [totalSeconds],
  )

  const pause = useCallback(() => {
    setRunning(false)
    deadlineRef.current = null
  }, [])

  const reset = useCallback(() => {
    setRunning(false)
    deadlineRef.current = null
    setMode('focus')
    setSecondsLeft(POMODORO_MINUTES * 60)
  }, [])

  const stop = useCallback(() => {
    reset()
    setActiveTaskId(null)
  }, [reset])

  /** Bir göreve tıklandığında sayacı o görev için baştan başlatır. */
  const startForTask = useCallback((taskId) => {
    setActiveTaskId(taskId)
    setMode('focus')
    const seconds = POMODORO_MINUTES * 60
    setSecondsLeft(seconds)
    deadlineRef.current = Date.now() + seconds * 1000
    setRunning(true)
  }, [])

  const progress = totalSeconds ? 1 - secondsLeft / totalSeconds : 0

  return {
    mode,
    running,
    secondsLeft,
    totalSeconds,
    progress,
    activeTaskId,
    completedRounds,
    start,
    pause,
    reset,
    stop,
    startForTask,
  }
}
