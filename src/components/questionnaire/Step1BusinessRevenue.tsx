import { StepShell, QuestionBlock } from './StepShell'
import { SelectableCard } from '../ui/SelectableCard'
import { CurrencyInput, NumberInput, PercentInput, FieldWrapper } from '../ui/Field'
import { INDUSTRY_OPTIONS } from '../../audit/questions'
import type { Step1Answers } from '../../audit/types'

interface Step1Props {
  value: Step1Answers
  onChange: (patch: Partial<Step1Answers>) => void
}

export function Step1BusinessRevenue({ value, onChange }: Step1Props) {
  return (
    <StepShell
      title="Let's Start With The Big Picture"
      subtitle="These numbers anchor everything else in this audit — how much revenue email should be generating for a business like yours."
    >
      <QuestionBlock label="Industry">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INDUSTRY_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.industry === opt.value}
              onClick={() => onChange({ industry: opt.value })}
              compact
            />
          ))}
        </div>
      </QuestionBlock>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <QuestionBlock label="Monthly Store Revenue">
          <CurrencyInput
            value={value.monthlyRevenue}
            onChange={(v) => onChange({ monthlyRevenue: v })}
            placeholder="500,000"
          />
        </QuestionBlock>

        <QuestionBlock label="Email List Size">
          <NumberInput
            value={value.emailListSize}
            onChange={(v) => onChange({ emailListSize: v })}
            placeholder="200,000"
          />
        </QuestionBlock>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <QuestionBlock label="What % Of Total Revenue Currently Comes From Email?">
          <PercentInput
            value={value.emailRevenuePercent}
            onChange={(v) => onChange({ emailRevenuePercent: v })}
            placeholder="20"
            max={100}
          />
        </QuestionBlock>

        <FieldWrapper
          label="Monthly Revenue From Klaviyo"
          optional
          tooltip="If you know this number, we'll use it to sanity-check the percentage above."
        >
          <CurrencyInput
            value={value.klaviyoRevenue}
            onChange={(v) => onChange({ klaviyoRevenue: v })}
            placeholder="100,000"
          />
        </FieldWrapper>
      </div>

      <QuestionBlock label="What % Of Email-Attributed Revenue Comes From Flows vs. Campaigns?" optional>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FieldWrapper label="Flow Revenue %" optional>
            <PercentInput
              value={value.flowRevenuePercent}
              onChange={(v) => onChange({ flowRevenuePercent: v })}
              placeholder="65"
              max={100}
            />
          </FieldWrapper>
          <FieldWrapper label="Campaign Revenue %" optional>
            <PercentInput
              value={value.campaignRevenuePercent}
              onChange={(v) => onChange({ campaignRevenuePercent: v })}
              placeholder="35"
              max={100}
            />
          </FieldWrapper>
        </div>
      </QuestionBlock>
    </StepShell>
  )
}

export function isStep1Valid(value: Step1Answers): boolean {
  return (
    value.industry != null &&
    value.monthlyRevenue != null &&
    value.monthlyRevenue > 0 &&
    value.emailListSize != null &&
    value.emailListSize >= 0 &&
    value.emailRevenuePercent != null
  )
}
