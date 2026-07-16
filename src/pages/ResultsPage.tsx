import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { HeroResults } from '../components/results/HeroResults'
import { ScoreBreakdown } from '../components/results/ScoreBreakdown'
import { TopOpportunities } from '../components/results/TopOpportunities'
import { FindingsAccordion } from '../components/results/FindingsAccordion'
import { ActionPlanSection } from '../components/results/ActionPlanSection'
import { BookCallSection } from '../components/results/BookCallSection'
import { Button } from '../components/ui/Button'
import { BRAND } from '../config/brand'
import type { AuditResult } from '../audit/types'

interface ResultsPageProps {
  result: AuditResult
  mode: 'instant' | 'complete'
  onBackToLanding: () => void
  onStartCompleteAudit: () => void
}

export function ResultsPage({ result, mode, onBackToLanding, onStartCompleteAudit }: ResultsPageProps) {
  return (
    <div className="min-h-screen bg-ink pb-24">
      <header className="max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} /> Start Over
        </button>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-accent to-violet flex items-center justify-center font-heading font-extrabold text-xs">
            IL
          </div>
          <span className="font-heading font-bold text-sm tracking-tight">{BRAND.name}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-16">
        <HeroResults result={result} />

        {mode === 'instant' ? (
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-white/75 max-w-xl">
              This is a directional estimate based on 5 data points. The Complete Audit scores five categories,
              surfaces your top 3 priorities, and builds a 30-day action plan.
            </p>
            <Button variant="primary" icon={<ArrowRight size={16} />} onClick={onStartCompleteAudit}>
              Get The Complete Audit
            </Button>
          </div>
        ) : null}

        <ScoreBreakdown categoryScores={result.categoryScores} />

        <TopOpportunities opportunities={result.topOpportunities} drivers={result.revenueOpportunity.drivers} />

        <FindingsAccordion findings={result.findings} categoryScores={result.categoryScores} />

        <ActionPlanSection roadmap={result.roadmap} />

        <BookCallSection />

        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw size={14} /> Run another audit
          </button>
          <p className="text-xs text-white/25 max-w-2xl text-center leading-relaxed">
            Revenue estimates are directional opportunities based on the inputs provided, ecommerce benchmarks, and
            the audit framework above. Actual results vary based on traffic quality, offer strength, margins,
            attribution settings, execution, industry, and other factors.
          </p>
        </div>
      </main>
    </div>
  )
}
