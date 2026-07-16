import { StepShell, QuestionBlock } from './StepShell'
import { SelectableCard } from '../ui/SelectableCard'
import { NumberInput, PercentInput, FieldWrapper } from '../ui/Field'
import { CAMPAIGNS_PER_WEEK_OPTIONS, CAMPAIGN_TYPE_OPTIONS, SEND_CONSISTENCY_OPTIONS } from '../../audit/questions'
import type { Step3Answers } from '../../audit/types'

interface Step3Props {
  value: Step3Answers
  onChange: (patch: Partial<Step3Answers>) => void
}

export function Step3Campaigns({ value, onChange }: Step3Props) {
  function toggleCampaignType(type: Step3Answers['campaignTypes'][number]) {
    const exists = value.campaignTypes.includes(type)
    onChange({
      campaignTypes: exists ? value.campaignTypes.filter((t) => t !== type) : [...value.campaignTypes, type],
    })
  }

  return (
    <StepShell title="How Are You Using Campaigns?" subtitle="Flows only reach subscribers who take an action. Campaigns are what reach everyone else.">
      <QuestionBlock label="How many unique email campaigns do you typically send per week?">
        <p className="text-xs text-white/40 -mt-2 mb-3">Resends to non-openers don't count as a separate unique campaign.</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {CAMPAIGNS_PER_WEEK_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.campaignsPerWeek === opt.value}
              onClick={() => onChange({ campaignsPerWeek: opt.value })}
              compact
            />
          ))}
        </div>
      </QuestionBlock>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FieldWrapper label="Active Profiles In Klaviyo" optional>
          <NumberInput value={value.activeProfiles} onChange={(v) => onChange({ activeProfiles: v })} placeholder="200,000" />
        </FieldWrapper>
        <FieldWrapper
          label="Typical Recipients Per Campaign"
          optional
          tooltip="We use this alongside active profiles to estimate what share of your list a typical campaign actually reaches."
        >
          <NumberInput
            value={value.avgCampaignRecipients}
            onChange={(v) => onChange({ avgCampaignRecipients: v })}
            placeholder="50,000"
          />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FieldWrapper label="Average Campaign Open Rate" optional>
          <PercentInput value={value.avgOpenRate} onChange={(v) => onChange({ avgOpenRate: v })} placeholder="45" max={100} />
        </FieldWrapper>
        <FieldWrapper label="Average Campaign Click Rate" optional>
          <PercentInput value={value.avgClickRate} onChange={(v) => onChange({ avgClickRate: v })} placeholder="2.5" max={100} step={0.1} />
        </FieldWrapper>
      </div>

      <QuestionBlock label="Are campaigns sent consistently throughout the month?">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SEND_CONSISTENCY_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.sendConsistency === opt.value}
              onClick={() => onChange({ sendConsistency: opt.value })}
              compact
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock label="What types of campaigns do you regularly send?" optional>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CAMPAIGN_TYPE_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.campaignTypes.includes(opt.value)}
              onClick={() => toggleCampaignType(opt.value)}
              multi
              compact
            />
          ))}
        </div>
      </QuestionBlock>
    </StepShell>
  )
}

export function isStep3Valid(value: Step3Answers): boolean {
  return value.campaignsPerWeek != null && value.sendConsistency != null
}
