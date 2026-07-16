import { AccordionItem } from '../ui/Accordion'
import { Badge } from '../ui/Badge'
import { FINDING_CATEGORY_LABELS } from '../../audit/types'
import type { CategoryScore, Finding, FindingCategory } from '../../audit/types'

interface FindingsAccordionProps {
  findings: Finding[]
  categoryScores: CategoryScore[]
}

export function FindingsAccordion({ findings, categoryScores }: FindingsAccordionProps) {
  const categories = categoryScores.map((c) => c.category)

  return (
    <section>
      <h2 className="text-2xl font-heading font-bold text-white">All Findings</h2>
      <p className="mt-1.5 text-white/55">The full breakdown behind your score, organized by category.</p>

      <div className="mt-6 space-y-4">
        {categories.map((category) => (
          <CategorySection key={category} category={category} findings={findings.filter((f) => f.category === category)} />
        ))}
      </div>
    </section>
  )
}

function CategorySection({ category, findings }: { category: FindingCategory; findings: Finding[] }) {
  const issueCount = findings.filter((f) => !f.isHealthy).length

  return (
    <AccordionItem
      title={
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-white text-lg">{FINDING_CATEGORY_LABELS[category]}</span>
          <span className="text-xs font-semibold text-white/35">
            {issueCount > 0 ? `${issueCount} opportunit${issueCount === 1 ? 'y' : 'ies'}` : 'Healthy'}
          </span>
        </div>
      }
    >
      <div className="space-y-4 mt-1">
        {findings.map((finding) => (
          <div key={finding.id} className="rounded-xl border border-line-soft bg-navy p-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge severity={finding.severity} />
              <h4 className="font-semibold text-white">{finding.title}</h4>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <FindingBlock label="What We're Seeing" text={finding.whatWeAreSeeing} />
              <FindingBlock label="Why This Matters" text={finding.whyItMatters} />
              <FindingBlock label="Main Opportunity" text={finding.recommendation} />
            </div>
            {finding.supportingMetrics.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {finding.supportingMetrics.map((m) => (
                  <span key={m} className="rounded-full bg-navy-soft border border-line-soft px-2.5 py-1 text-[11px] text-white/50">
                    {m}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </AccordionItem>
  )
}

function FindingBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-1">{label}</p>
      <p className="text-sm text-white/65 leading-relaxed">{text}</p>
    </div>
  )
}
