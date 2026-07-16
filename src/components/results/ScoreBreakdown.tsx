import type { CategoryScore } from '../../audit/types'

interface ScoreBreakdownProps {
  categoryScores: CategoryScore[]
}

function statusColor(score: number): string {
  if (score >= 85) return 'text-emerald-400'
  if (score >= 70) return 'text-accent-soft'
  if (score >= 55) return 'text-amber-300'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

function barColor(score: number): string {
  if (score >= 85) return 'bg-good'
  if (score >= 70) return 'bg-accent'
  if (score >= 55) return 'bg-warn'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-bad'
}

export function ScoreBreakdown({ categoryScores }: ScoreBreakdownProps) {
  return (
    <section>
      <h2 className="text-2xl font-heading font-bold text-white">Score Breakdown</h2>
      <p className="mt-1.5 text-white/55">How each part of your Klaviyo program is performing.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoryScores.map((cat) => (
          <div key={cat.category} className="rounded-2xl border border-line-soft bg-navy-soft p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-white">{cat.label}</h3>
              <span className="shrink-0 text-lg font-heading font-bold text-white">
                {cat.score}
                <span className="text-xs text-white/35">/100</span>
              </span>
            </div>
            <p className={`mt-1 text-xs font-bold uppercase tracking-wider ${statusColor(cat.score)}`}>{cat.status}</p>

            <div className="mt-3 h-1.5 w-full rounded-full bg-navy overflow-hidden">
              <div className={`h-full rounded-full ${barColor(cat.score)}`} style={{ width: `${cat.score}%` }} />
            </div>

            <p className="mt-3 text-sm text-white/60 leading-relaxed">{cat.diagnosis}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
