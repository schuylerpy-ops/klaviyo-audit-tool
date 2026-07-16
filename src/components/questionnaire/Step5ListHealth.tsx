import { StepShell, QuestionBlock } from './StepShell'
import { SelectableCard } from '../ui/SelectableCard'
import { PercentInput, FieldWrapper } from '../ui/Field'
import { EXPANDS_TARGETING_OPTIONS, LIST_CLEANING_OPTIONS, SEGMENT_OPTIONS, YES_NO_UNSURE_OPTIONS } from '../../audit/questions'
import type { Step5Answers } from '../../audit/types'

interface Step5Props {
  value: Step5Answers
  onChange: (patch: Partial<Step5Answers>) => void
}

export function Step5ListHealth({ value, onChange }: Step5Props) {
  function toggleSegment(segment: Step5Answers['segments'][number]) {
    const exists = value.segments.includes(segment)
    onChange({
      segments: exists ? value.segments.filter((s) => s !== segment) : [...value.segments, segment],
    })
  }

  return (
    <StepShell
      title="How Healthy Is Your Klaviyo Database?"
      subtitle="This isn't about having segments with the exact right names — it's about whether you can act on engagement, purchase history, and list quality."
    >
      <QuestionBlock label="Which segments currently exist in your account?" optional>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SEGMENT_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.segments.includes(opt.value)}
              onClick={() => toggleSegment(opt.value)}
              multi
              compact
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock label="Do you have a regular list-cleaning or suppression process?">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LIST_CLEANING_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.listCleaningProcess === opt.value}
              onClick={() => onChange({ listCleaningProcess: opt.value })}
              compact
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock label="Do you gradually expand campaign targeting across different engagement windows?">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EXPANDS_TARGETING_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.expandsTargeting === opt.value}
              onClick={() => onChange({ expandsTargeting: opt.value })}
              compact
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock label="Are you currently using a dedicated sending domain?">
        <div className="grid grid-cols-3 gap-3 max-w-xl">
          {YES_NO_UNSURE_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.dedicatedSendingDomain === opt.value}
              onClick={() => onChange({ dedicatedSendingDomain: opt.value })}
              compact
            />
          ))}
        </div>
      </QuestionBlock>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <FieldWrapper label="Spam Complaint Rate" optional>
          <PercentInput value={value.spamComplaintRate} onChange={(v) => onChange({ spamComplaintRate: v })} placeholder="0.03" step={0.01} />
        </FieldWrapper>
        <FieldWrapper label="Unsubscribe Rate" optional>
          <PercentInput value={value.unsubscribeRate} onChange={(v) => onChange({ unsubscribeRate: v })} placeholder="0.2" step={0.01} />
        </FieldWrapper>
        <FieldWrapper label="Bounce Rate" optional>
          <PercentInput value={value.bounceRate} onChange={(v) => onChange({ bounceRate: v })} placeholder="0.5" step={0.01} />
        </FieldWrapper>
      </div>
    </StepShell>
  )
}

export function isStep5Valid(value: Step5Answers): boolean {
  return value.listCleaningProcess != null && value.expandsTargeting != null && value.dedicatedSendingDomain != null
}
