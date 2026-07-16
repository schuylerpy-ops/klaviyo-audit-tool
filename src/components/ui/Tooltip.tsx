import { useState } from 'react'
import { Info } from 'lucide-react'

interface TooltipProps {
  text: string
}

export function Tooltip({ text }: TooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault()
          setOpen((v) => !v)
        }}
        className="text-white/35 hover:text-accent-soft transition-colors cursor-help"
        aria-label="More info"
      >
        <Info size={14} />
      </button>
      {open ? (
        <span className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg bg-ink-raised border border-line px-3 py-2 text-xs leading-relaxed text-white/80 shadow-xl">
          {text}
        </span>
      ) : null}
    </span>
  )
}
