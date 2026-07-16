import type { ReactNode } from 'react'

interface StepShellProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function StepShell({ title, subtitle, children }: StepShellProps) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">{title}</h2>
      {subtitle ? <p className="mt-2 text-white/55 max-w-2xl">{subtitle}</p> : null}
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  )
}

interface QuestionBlockProps {
  label: string
  tooltip?: string
  optional?: boolean
  children: ReactNode
}

export function QuestionBlock({ label, optional, children }: QuestionBlockProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3">
        <h3 className="text-base font-semibold text-white">{label}</h3>
        {optional ? <span className="text-xs text-white/35">(optional)</span> : null}
      </div>
      {children}
    </div>
  )
}
