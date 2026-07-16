import { StepShell, QuestionBlock } from './StepShell'
import { SelectableCard } from '../ui/SelectableCard'
import { NumberInput, PercentInput, FieldWrapper } from '../ui/Field'
import {
  POPUP_DATA_COLLECTION_OPTIONS,
  WELCOME_PERSONALIZATION_OPTIONS,
  YES_NO_UNSURE_OPTIONS,
} from '../../audit/questions'
import type { Step2Answers } from '../../audit/types'

interface Step2Props {
  value: Step2Answers
  onChange: (patch: Partial<Step2Answers>) => void
}

export function Step2ListGrowth({ value, onChange }: Step2Props) {
  const popupActive = value.hasPopup === 'yes'

  return (
    <StepShell
      title="How Effectively Are You Growing Your List?"
      subtitle="List growth compounds — a weak popup caps every flow and campaign downstream of it."
    >
      <QuestionBlock label="Do you currently have an active website signup form or popup?">
        <div className="grid grid-cols-3 gap-3 max-w-xl">
          {YES_NO_UNSURE_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              label={opt.label}
              selected={value.hasPopup === opt.value}
              onClick={() => onChange({ hasPopup: opt.value })}
              compact
            />
          ))}
        </div>
      </QuestionBlock>

      {popupActive ? (
        <>
          <QuestionBlock label="What is your current popup submit rate?">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-40">
                <PercentInput
                  value={value.popupSubmitRate}
                  onChange={(v) => onChange({ popupSubmitRate: v, popupSubmitRateUnknown: false })}
                  placeholder="4.2"
                  max={100}
                  step={0.1}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-white/55 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={value.popupSubmitRateUnknown}
                  onChange={(e) => onChange({ popupSubmitRateUnknown: e.target.checked, popupSubmitRate: null })}
                  className="h-4 w-4 rounded border-line-soft accent-[#536dfe]"
                />
                I don't know
              </label>
            </div>
          </QuestionBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FieldWrapper label="New Subscribers Added (Last 30 Days)" optional>
              <NumberInput
                value={value.newSubscribers30d}
                onChange={(v) => onChange({ newSubscribers30d: v })}
                placeholder="6,200"
              />
            </FieldWrapper>
            <FieldWrapper label="Popup Views (Last 30 Days)" optional>
              <NumberInput
                value={value.popupViews30d}
                onChange={(v) => onChange({ popupViews30d: v })}
                placeholder="145,000"
              />
            </FieldWrapper>
          </div>

          <QuestionBlock label="Does your popup collect only an email address, or additional preference data?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POPUP_DATA_COLLECTION_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.value}
                  label={opt.label}
                  selected={value.popupDataCollection === opt.value}
                  onClick={() => onChange({ popupDataCollection: opt.value })}
                  compact
                />
              ))}
            </div>
          </QuestionBlock>

          <QuestionBlock label="Does your Welcome Flow personalize messaging based on information collected through the signup form?">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WELCOME_PERSONALIZATION_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.value}
                  label={opt.label}
                  selected={value.welcomePersonalization === opt.value}
                  onClick={() => onChange({ welcomePersonalization: opt.value })}
                  compact
                />
              ))}
            </div>
          </QuestionBlock>
        </>
      ) : null}
    </StepShell>
  )
}

export function isStep2Valid(value: Step2Answers): boolean {
  if (value.hasPopup == null) return false
  if (value.hasPopup !== 'yes') return true
  return value.popupDataCollection != null && value.welcomePersonalization != null
}
