import { useState } from 'react'
import { toggleTheme, isDark } from './theme'

export default function ThemeToggle() {
  const [dark, setDark] = useState(isDark())

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleTheme()
        setDark(isDark())
      }}
      className="
        w-9 h-9
        rounded-full
        border border-border
        flex items-center justify-center
        bg-background/70
        backdrop-blur-md
        cursor-pointer
        select-none
        focus:outline-none
        hover:bg-background/90
        transition
        active:rotate-180

      "
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className="
    transition-all duration-300 ease-out
    rotate-0
    dark:rotate-12
  "
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </span>

    </button>
  )
}

/* ---------------- Icons ---------------- */

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-400"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-indigo-400"
    >
      <path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z" />
    </svg>
  )
}

