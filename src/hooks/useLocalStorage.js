import { useCallback, useEffect, useRef, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'

/**
 * State'i localStorage ile senkron tutan hook.
 * `key` değişirse yeni anahtarın değeri okunur (tarih değiştirme senaryosu).
 *
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readJSON(key, initialValue))

  // Anahtar değişince ilk render'da tekrar yazmayı engelle.
  const keyRef = useRef(key)

  useEffect(() => {
    if (keyRef.current === key) return
    keyRef.current = key
    setValue(readJSON(key, initialValue))
    // initialValue kasıtlı olarak dışarıda: her render'da yeni referans olabilir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    writeJSON(key, value)
  }, [key, value])

  const update = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next))
  }, [])

  return [value, update]
}
