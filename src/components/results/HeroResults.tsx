import { CalendarCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { formatCurrency, formatCurrencyFull } from '../../utils/format'
import { CALENDLY_URL } from '../../config/links'
import type { AuditResult } from '../../audit/types'

interface HeroResultsProps {
  result: AuditResult
}

function scoreColor(score: number): string {
  if (score >= 85) return '#22c55e'
  if (score >= 70) return '#7c8cff'
  if (score >= 55) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

export function HeroResults({ result }: HeroResultsProps) {
  const { overallScore, overallStatus, revenueOpportunity } = result
  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference * (1 - overallScore / 100)

  return (
    <div className="rounded-3xl bg-white text-ink p-8 sm:p-10 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 items-center">
        <div className="flex flex-col items-center">
          <div className="relative h-40 w-40">
            <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#e8e9f0" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={scoreColor(overallScore)}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-heading font-extrabold text-ink">{overallScore}</span>
              <span className="text-xs font-semibold text-ink/40">/ 100</span>
            </div>
          </div>
          <span className="mt-3 text-xs font-bold uppercase tracking-wider text-ink/45">Klaviyo Health Score</span>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{overallStatus}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-ink leading-tight">
            Your Klaviyo Audit Results
          </h1>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-5">
            <Stat label="Current Attribution" value={`${revenueOpportunity.currentAttributionPercent}%`} />
            <Stat label="Potential Target" value={`${revenueOpportunity.targetAttributionPercent}%`} />
            <Stat label="Monthly Revenue Gap" value={formatCurrency(revenueOpportunity.monthlyGap)} accent />
            <Stat label="Annual Opportunity" value={formatCurrency(revenueOpportunity.annualGap)} accent />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={<CalendarCheck size={18} />}
              onClick={() => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')}
            >
              Book A Strategy Call
            </Button>
            <p className="text-xs text-ink/45 max-w-xs">
              Current: {formatCurrencyFull(revenueOpportunity.currentMonthlyEmailRevenue)}/mo &rarr; Target:{' '}
              {formatCurrencyFull(revenueOpportunity.targetMonthlyEmailRevenue)}/mo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink/40">{label}</p>
      <p className={`mt-1 text-xl font-heading font-bold ${accent ? 'text-accent' : 'text-ink'}`}>{value}</p>
    </div>
  )
}
