import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItemProps {
  title: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}

export function AccordionItem({ title, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-line-soft rounded-2xl bg-navy-soft overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
      >
        {title}
        <ChevronDown
          size={18}
          className={`shrink-0 text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? <div className="px-5 pb-5 animate-fade-in-up">{children}</div> : null}
    </div>
  )
}
