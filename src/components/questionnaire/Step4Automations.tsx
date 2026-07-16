import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { StepShell, QuestionBlock } from './StepShell'
import { SelectableCard } from '../ui/SelectableCard'
import { NumberInput } from '../ui/Field'
import {
  ADDITIONAL_FLOW_OPTIONS,
  CORE_FLOW_OPTIONS,
  FLOW_RECENCY_OPTIONS,
  POST_PURCHASE_CONTENT_OPTIONS,
  YES_NO_UNSURE_OPTIONS,
} from '../../audit/questions'
import { createEmptyFlowDetail } from '../../audit/types'
import type { FlowKey, Step4Answers } from '../../audit/types'

interface Step4Props {
  value: Step4Answers
  onChange: (patch: Partial<Step4Answers>) => void
}

export function Step4Automations({ value, onChange }: Step4Props) {
  const [expandedFlow, setExpandedFlow] = useState<FlowKey | null>(null)

  function toggleFlow(flowKey: FlowKey) {
    const active = value.activeFlows.includes(flowKey)
    onChange({
      activeFlows: active ? value.activeFlows.filter((f) => f !== flowKey) : [...value.activeFlows, flowKey],
    })
    if (active && expandedFlow === flowKey) setExpandedFlow(null)
  }

  function updateDetail(flowKey: FlowKey, patch: Partial<Step4Answers['flowDetails'][FlowKey]>) {
    const current = value.flowDetails[flowKey] ?? createEmptyFlowDetail()
    onChange({
      flowDetails: { ...value.flowDetails, [flowKey]: { ...current, ...patch } },
    })
  }

  return (
    <StepShell
      title="Which Automations Are Currently Live?"
      subtitle="Select every flow that is currently active and sending. Core flows carry the most weight in your score."
    >
      <QuestionBlock label="Core Flows">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CORE_FLOW_OPTIONS.map((opt) => {
            const active = value.activeFlows.includes(opt.value)
            const expanded = expandedFlow === opt.value
            return (
              <div key={opt.value} className="space-y-2">
                <SelectableCard
                  label={opt.label}
                  helper={opt.helper}
                  selected={active}
                  onClick={() => toggleFlow(opt.value)}
                  multi
                />
                {active ? (
                  <button
                    type="button"
                    onClick={() => setExpandedFlow(expanded ? null : opt.value)}
                    className="flex items-center gap-1 text-xs font-semibold text-accent-soft hover:text-accent pl-1 cursor-pointer"
                  >
                    {expanded ? 'Hide details' : 'Add more details'}
                    {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                ) : null}
                {active && expanded ? (
                  <FlowDetailPanel
                    flowKey={opt.value}
                    detail={value.flowDetails[opt.value] ?? createEmptyFlowDetail()}
                    onUpdate={(patch) => updateDetail(opt.value, patch)}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </QuestionBlock>

      <QuestionBlock label="Additional Flows">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ADDITIONAL_FLOW_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.activeFlows.includes(opt.value)}
              onClick={() => toggleFlow(opt.value)}
              multi
              compact
            />
          ))}
        </div>
      </QuestionBlock>
    </StepShell>
  )
}

interface FlowDetailPanelProps {
  flowKey: FlowKey
  detail: NonNullable<Step4Answers['flowDetails'][FlowKey]>
  onUpdate: (patch: Partial<Step4Answers['flowDetails'][FlowKey]>) => void
}

function FlowDetailPanel({ flowKey, detail, onUpdate }: FlowDetailPanelProps) {
  const isAbandonFlow = flowKey === 'abandoned_cart' || flowKey === 'abandoned_checkout' || flowKey === 'browse_abandonment'

  return (
    <div className="rounded-xl border border-line-soft bg-navy p-4 space-y-4 animate-fade-in-up">
      <div>
        <label className="block text-xs font-semibold text-white/60 mb-2">Number Of Emails</label>
        <div className="w-32">
          <NumberInput value={detail.emailCount} onChange={(v) => onUpdate({ emailCount: v })} placeholder="3" min={0} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-white/60 mb-2">Last Updated</label>
        <div className="flex flex-wrap gap-2">
          {FLOW_RECENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onUpdate({ lastUpdated: opt.value })}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                detail.lastUpdated === opt.value
                  ? 'border-accent bg-accent/15 text-accent-soft'
                  : 'border-line-soft text-white/50 hover:border-white/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {flowKey === 'welcome' ? (
        <div>
          <label className="block text-xs font-semibold text-white/60 mb-2">Is Most Of The Revenue Concentrated In Email 1?</label>
          <div className="flex flex-wrap gap-2">
            {YES_NO_UNSURE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate({ welcomeRevenueInEmail1: opt.value })}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                  detail.welcomeRevenueInEmail1 === opt.value
                    ? 'border-accent bg-accent/15 text-accent-soft'
                    : 'border-line-soft text-white/50 hover:border-white/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {isAbandonFlow ? (
        <div>
          <label className="block text-xs font-semibold text-white/60 mb-2">
            Are Shoppers Still Highly Engaged In The Last Email Of The Sequence?
          </label>
          <div className="flex flex-wrap gap-2">
            {YES_NO_UNSURE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate({ lastEmailEngaged: opt.value })}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                  detail.lastEmailEngaged === opt.value
                    ? 'border-accent bg-accent/15 text-accent-soft'
                    : 'border-line-soft text-white/50 hover:border-white/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {flowKey === 'post_purchase' ? (
        <div>
          <label className="block text-xs font-semibold text-white/60 mb-2">What Does Your Post-Purchase Flow Currently Include?</label>
          <div className="flex flex-wrap gap-2">
            {POST_PURCHASE_CONTENT_OPTIONS.map((opt) => {
              const selected = detail.postPurchaseContent.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      postPurchaseContent: selected
                        ? detail.postPurchaseContent.filter((c) => c !== opt.value)
                        : [...detail.postPurchaseContent, opt.value],
                    })
                  }
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                    selected ? 'border-accent bg-accent/15 text-accent-soft' : 'border-line-soft text-white/50 hover:border-white/30'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function isStep4Valid(): boolean {
  return true
}
