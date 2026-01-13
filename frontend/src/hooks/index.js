import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'

// Custom hook for managing flashcard study sessions
export const useStudySession = (cards) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    startTime: Date.now()
  })

  const currentCard = cards[currentIndex]
  const isLastCard = currentIndex === cards.length - 1
  const progress = ((currentIndex + 1) / cards.length) * 100

  const nextCard = useCallback(() => {
    if (!isLastCard) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }, [isLastCard])

  const previousCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }, [currentIndex])

  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev)
  }, [])

  const recordAnswer = useCallback((isCorrect) => {
    setSessionStats(prev => ({
      ...prev,
      [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1
    }))
  }, [])

  const resetSession = useCallback(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionStats({
      correct: 0,
      incorrect: 0,
      startTime: Date.now()
    })
  }, [])

  return {
    currentCard,
    currentIndex,
    isFlipped,
    isLastCard,
    progress,
    sessionStats,
    nextCard,
    previousCard,
    flipCard,
    recordAnswer,
    resetSession
  }
}

// Custom hook for local storage management
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

// Custom hook for debounced search
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Custom hook for keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase()
      const shortcut = shortcuts[key]
      
      if (shortcut && typeof shortcut === 'function') {
        event.preventDefault()
        shortcut()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [shortcuts])
}

// Custom hook for online/offline status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Custom hook for theme management
export const useTheme = () => {
  const { user } = useSelector(state => state.auth)
  const [theme, setTheme] = useLocalStorage('theme', user?.preferences?.theme || 'light')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [setTheme])

  return { theme, setTheme, toggleTheme }
}