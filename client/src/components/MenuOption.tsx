import { useEffect, useRef, useState } from 'react'

export type MenuOption = {
  label: string
  onClick: () => void
}

type MenuProps = {
  buttonLabel: string
  options: MenuOption[]
}

export default function Menu({ buttonLabel, options }: MenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)


  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1 rounded bg-amber-500 text-black font-medium hover:bg-amber-400"
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-44 rounded border bg-gray-900 shadow-lg z-50">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                opt.onClick()
                setOpen(false)
              }}
              className="block w-full text-left px-3 py-2 text-amber-300 hover:bg-gray-800 rounded"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
