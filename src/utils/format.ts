export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return '$0'
  const rounded = Math.round(value)
  if (Math.abs(rounded) >= 1_000_000) {
    return `$${(rounded / 1_000_000).toFixed(rounded % 1_000_000 === 0 ? 0 : 1)}M`
  }
  return rounded.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function formatCurrencyFull(value: number): string {
  if (!Number.isFinite(value)) return '$0'
  return Math.round(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0'
  return Math.round(value).toLocaleString('en-US')
}

export function formatPercent(value: number, fractionDigits = 0): string {
  if (!Number.isFinite(value)) return '0%'
  return `${value.toFixed(fractionDigits)}%`
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}
