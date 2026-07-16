import { ArrowLeft, ArrowRight, Sparkles, Zap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { SelectableCard } from '../components/ui/SelectableCard'
import { CurrencyInput, NumberInput, PercentInput } from '../components/ui/Field'
import { QuestionBlock } from '../components/questionnaire/StepShell'
import { CAMPAIGNS_PER_WEEK_OPTIONS, CORE_FLOW_OPTIONS } from '../audit/questions'
import type { InstantAuditAnswers } from '../audit/types'

interface InstantAuditPageProps {
  answers: InstantAuditAnswers
  onChangeAnswers: (answers: InstantAuditAnswers) => void
  onSubmit: () => void
  onExit: () => void
  onLoadDemo: () => void
}

function isInstantValid(a: InstantAuditAnswers): boolean {
  return (
    a.monthlyRevenue != null &&
    a.monthlyRevenue > 0 &&
    a.emailListSize != null &&
    a.emailRevenuePercent != null &&
    a.campaignsPerWeek != null
  )
}

export function InstantAuditPage({ answers, onChangeAnswers, onSubmit, onExit, onLoadDemo }: InstantAuditPageProps) {
  function patch(p: Partial<InstantAuditAnswers>) {
    onChangeAnswers({ ...answers, ...p })
  }

  function toggleFlow(flowKey: InstantAuditAnswers['activeFlows'][number]) {
    const exists = answers.activeFlows.includes(flowKey)
    patch({ activeFlows: exists ? answers.activeFlows.filter((f) => f !== flowKey) : [...answers.activeFlows, flowKey] })
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-accent/15 flex items-center justify-center text-accent-soft">
            <Zap size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/45">Free Instant Audit</span>
        </div>

        <h1 className="text-3xl font-heading font-bold text-white">Get Your Estimated Revenue Opportunity</h1>
        <p className="mt-2 text-white/55">Five quick questions. Takes under a minute.</p>

        <div className="mt-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <QuestionBlock label="Monthly Store Revenue">
              <CurrencyInput value={answers.monthlyRevenue} onChange={(v) => patch({ monthlyRevenue: v })} placeholder="500,000" />
            </QuestionBlock>
            <QuestionBlock label="Email List Size">
              <NumberInput value={answers.emailListSize} onChange={(v) => patch({ emailListSize: v })} placeholder="200,000" />
            </QuestionBlock>
          </div>

          <QuestionBlock label="Current Email Attribution %">
            <div className="w-40">
              <PercentInput value={answers.emailRevenuePercent} onChange={(v) => patch({ emailRevenuePercent: v })} placeholder="20" max={100} />
            </div>
          </QuestionBlock>

          <QuestionBlock label="Weekly Campaign Volume">
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
              {CAMPAIGNS_PER_WEEK_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.value}
                  label={opt.label}
                  selected={answers.campaignsPerWeek === opt.value}
                  onClick={() => patch({ campaignsPerWeek: opt.value })}
                  compact
                />
              ))}
            </div>
          </QuestionBlock>

          <QuestionBlock label="Which Core Flows Are Currently Active?" optional>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CORE_FLOW_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.value}
                  label={opt.label}
                  helper={opt.helper}
                  selected={answers.activeFlows.includes(opt.value)}
                  onClick={() => toggleFlow(opt.value)}
                  multi
                />
              ))}
            </div>
          </QuestionBlock>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-line-soft pt-6">
          <Button variant="ghost" icon={<ArrowLeft size={16} />} iconPosition="left" onClick={onExit}>
            Back
          </Button>
          <div className="flex items-center gap-3">
            {import.meta.env.DEV ? (
              <Button variant="ghost" icon={<Sparkles size={15} />} iconPosition="left" onClick={onLoadDemo}>
                Load Demo Account
              </Button>
            ) : null}
            <Button variant="primary" icon={<ArrowRight size={18} />} disabled={!isInstantValid(answers)} onClick={onSubmit}>
              Run My Instant Audit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
