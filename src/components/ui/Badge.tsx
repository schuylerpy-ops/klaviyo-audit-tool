import type { Severity } from '../../audit/types'

interface BadgeProps {
  severity: Severity
  label?: string
}

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: 'bg-critical/15 text-red-400 border-critical/30',
  high: 'bg-bad/15 text-red-300 border-bad/30',
  medium: 'bg-warn/15 text-amber-300 border-warn/30',
  low: 'bg-accent/15 text-accent-soft border-accent/30',
  healthy: 'bg-good/15 text-emerald-400 border-good/30',
}

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: 'Critical Priority',
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
  healthy: 'Healthy',
}

export function Badge({ severity, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${SEVERITY_STYLES[severity]}`}
    >
      {label ?? SEVERITY_LABELS[severity]}
    </span>
  )
}
