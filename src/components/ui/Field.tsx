import type { ReactNode } from 'react'
import { Tooltip } from './Tooltip'

interface FieldWrapperProps {
  label: string
  tooltip?: string
  optional?: boolean
  children: ReactNode
}

export function FieldWrapper({ label, tooltip, optional, children }: FieldWrapperProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <label className="text-sm font-semibold text-white/85">{label}</label>
        {optional ? <span className="text-xs text-white/35">(optional)</span> : null}
        {tooltip ? <Tooltip text={tooltip} /> : null}
      </div>
      {children}
    </div>
  )
}

interface NumericInputProps {
  value: number | null
  onChange: (value: number | null) => void
  placeholder?: string
  prefix?: string
  suffix?: string
  min?: number
  max?: number
  step?: number
}

function BaseNumericInput({ value, onChange, placeholder, prefix, suffix, min, max, step }: NumericInputProps) {
  return (
    <div className="relative">
      {prefix ? (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium pointer-events-none">
          {prefix}
        </span>
      ) : null}
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ''}
        min={min}
        max={max}
        step={step ?? 'any'}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value
          onChange(raw === '' ? null : Number(raw))
        }}
        className={`w-full rounded-xl bg-navy border border-line-soft text-white placeholder:text-white/25 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors ${
          prefix ? 'pl-8' : 'pl-4'
        } ${suffix ? 'pr-10' : 'pr-4'}`}
      />
      {suffix ? (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium pointer-events-none">
          {suffix}
        </span>
      ) : null}
    </div>
  )
}

export function CurrencyInput(props: Omit<NumericInputProps, 'prefix' | 'suffix'>) {
  return <BaseNumericInput {...props} prefix="$" placeholder={props.placeholder ?? '0'} />
}

export function PercentInput(props: Omit<NumericInputProps, 'prefix' | 'suffix'>) {
  return <BaseNumericInput {...props} suffix="%" placeholder={props.placeholder ?? '0'} />
}

export function NumberInput(props: NumericInputProps) {
  return <BaseNumericInput {...props} />
}
