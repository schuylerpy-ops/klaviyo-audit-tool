import { Badge } from '../ui/Badge'
import { FINDING_CATEGORY_LABELS } from '../../audit/types'
import { formatCurrency } from '../../utils/format'
import type { Finding, RevenueOpportunityDriver } from '../../audit/types'

interface TopOpportunitiesProps {
  opportunities: Finding[]
  drivers: RevenueOpportunityDriver[]
}

const RANK_LABELS = ['#1', '#2', '#3']

export function TopOpportunities({ opportunities, drivers }: TopOpportunitiesProps) {
  if (opportunities.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-heading font-bold text-white">Your Top {opportunities.length} Revenue Opportunities</h2>
      <p className="mt-1.5 text-white/55">The highest-leverage fixes, ranked by revenue impact, severity, and confidence.</p>

      <div className="mt-6 space-y-5">
        {opportunities.map((finding, index) => {
          const driver = drivers.find((d) => d.findingId === finding.id)
          return (
            <div key={finding.id} className="rounded-2xl border border-accent/25 bg-navy-soft p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-heading font-extrabold text-accent-soft">{RANK_LABELS[index] ?? `#${index + 1}`}</span>
                <h3 className="text-xl font-heading font-bold text-white">{finding.title}</h3>
                <Badge severity={finding.severity} />
                <span className="text-xs font-semibold text-white/35 uppercase tracking-wider">
                  {FINDING_CATEGORY_LABELS[finding.category]}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                <Block label="What We're Seeing" text={finding.whatWeAreSeeing} />
                <Block label="Why This Matters" text={finding.whyItMatters} />
                <Block label="Main Opportunity" text={finding.recommendation} />
              </div>

              {driver && driver.contribution > 0 ? (
                <div className="mt-5 pt-5 border-t border-line-soft flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Estimated Opportunity Contribution
                  </span>
                  <span className="text-lg font-heading font-bold text-accent-soft">
                    {formatCurrency(driver.contribution)}/month
                  </span>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/35 mb-1.5">{label}</p>
      <p className="text-sm text-white/70 leading-relaxed">{text}</p>
    </div>
  )
}
