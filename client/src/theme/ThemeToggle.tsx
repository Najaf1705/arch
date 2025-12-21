import { useState } from 'react'
import { toggleTheme, isDark } from './theme'

export default function ThemeToggle() {
  const [dark, setDark] = useState(isDark())

  return (
    <button
      onClick={() => {
        toggleTheme()
        setDark(isDark())
      }}
      className="px-3 py-1 rounded border z-10
                 bg-gray-200 dark:bg-gray-800
                 text-black dark:text-white cursor-pointer"
    >
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
