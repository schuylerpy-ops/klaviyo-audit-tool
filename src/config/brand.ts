export const BRAND = {
  name: 'InfluxLabz',
  productName: 'Klaviyo Health Audit',
  tagline: 'Ecommerce email & SMS retention strategy',
} as const

/**
 * Mirrors the Tailwind @theme tokens in src/index.css.
 * Use these when a raw hex value is needed outside of Tailwind classes
 * (e.g. inline SVG, chart fills).
 */
export const COLORS = {
  ink: '#05060c',
  inkRaised: '#0b0d18',
  navy: '#10121f',
  navySoft: '#151830',
  line: '#23274a',
  lineSoft: '#1a1d38',
  accent: '#536dfe',
  accentSoft: '#7c8cff',
  violet: '#8b5cf6',
  good: '#22c55e',
  warn: '#f59e0b',
  bad: '#ef4444',
  critical: '#dc2626',
} as const
