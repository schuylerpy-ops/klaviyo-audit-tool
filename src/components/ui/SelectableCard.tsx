import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

interface SelectableCardProps {
  label: string
  description?: string
  helper?: string
  selected: boolean
  onClick: () => void
  icon?: ReactNode
  multi?: boolean
  compact?: boolean
}

export function SelectableCard({
  label,
  description,
  helper,
  selected,
  onClick,
  icon,
  multi = false,
  compact = false,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative w-full text-left rounded-xl border transition-all duration-150 cursor-pointer ${
        compact ? 'p-3.5' : 'p-4'
      } ${
        selected
          ? 'border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(83,109,254,0.5)]'
          : 'border-line-soft bg-navy hover:border-accent/50 hover:bg-navy-soft'
      }`}
    >
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5 shrink-0 text-accent-soft">{icon}</div> : null}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-white ${compact ? 'text-sm' : 'text-base'}`}>{label}</span>
          </div>
          {description ? <p className="mt-0.5 text-sm text-white/55">{description}</p> : null}
          {helper ? <p className="mt-1 text-xs text-white/35 italic">{helper}</p> : null}
        </div>
        <div
          className={`shrink-0 flex items-center justify-center w-5 h-5 border-2 transition-colors ${
            multi ? 'rounded-md' : 'rounded-full'
          } ${selected ? 'bg-accent border-accent' : 'border-white/25 group-hover:border-white/50'}`}
        >
          {selected ? <Check size={13} strokeWidth={3} className="text-white" /> : null}
        </div>
      </div>
    </button>
  )
}
