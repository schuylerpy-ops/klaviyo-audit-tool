import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  tone?: 'navy' | 'white'
  padding?: 'sm' | 'md' | 'lg'
}

const PADDING_CLASSES = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, tone = 'navy', padding = 'md', className = '', ...rest }: CardProps) {
  const toneClasses =
    tone === 'white' ? 'bg-white text-ink border border-white/10' : 'bg-navy-soft text-white border border-line-soft'

  return (
    <div className={`rounded-2xl ${toneClasses} ${PADDING_CLASSES[padding]} ${className}`} {...rest}>
      {children}
    </div>
  )
}
