import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'white'
type Size = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-soft shadow-[0_0_0_1px_rgba(83,109,254,0.4),0_8px_24px_-8px_rgba(83,109,254,0.6)]',
  secondary:
    'bg-transparent text-white border border-line hover:border-accent hover:bg-navy-soft',
  ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-navy-soft',
  white: 'bg-white text-ink hover:bg-white/90 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.25)]',
}

const SIZE_CLASSES: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-4 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon && iconPosition === 'left' ? icon : null}
      {children}
      {icon && iconPosition === 'right' ? icon : null}
    </button>
  )
}
