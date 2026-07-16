import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { Step1BusinessRevenue, isStep1Valid } from '../components/questionnaire/Step1BusinessRevenue'
import { Step2ListGrowth, isStep2Valid } from '../components/questionnaire/Step2ListGrowth'
import { Step3Campaigns, isStep3Valid } from '../components/questionnaire/Step3Campaigns'
import { Step4Automations, isStep4Valid } from '../components/questionnaire/Step4Automations'
import { Step5ListHealth, isStep5Valid } from '../components/questionnaire/Step5ListHealth'
import type { CompleteAuditAnswers } from '../audit/types'

const STEP_LABELS = ['Revenue', 'List Growth', 'Campaigns', 'Automations', 'List Health']
const TOTAL_STEPS = 5

interface CompleteAuditPageProps {
  step: number
  onStepChange: (step: number) => void
  answers: CompleteAuditAnswers
  onChangeAnswers: (answers: CompleteAuditAnswers) => void
  onSubmit: () => void
  onExit: () => void
  onLoadDemo: () => void
}

export function CompleteAuditPage({
  step,
  onStepChange,
  answers,
  onChangeAnswers,
  onSubmit,
  onExit,
  onLoadDemo,
}: CompleteAuditPageProps) {
  const isValid = {
    1: isStep1Valid(answers.step1),
    2: isStep2Valid(answers.step2),
    3: isStep3Valid(answers.step3),
    4: isStep4Valid(),
    5: isStep5Valid(answers.step5),
  }[step]

  function goBack() {
    if (step === 1) {
      onExit()
    } else {
      onStepChange(step - 1)
    }
  }

  function goNext() {
    if (step === TOTAL_STEPS) {
      onSubmit()
    } else {
      onStepChange(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="sticky top-0 z-10 bg-ink/90 backdrop-blur border-b border-line-soft">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} stepLabels={STEP_LABELS} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {step === 1 ? (
          <Step1BusinessRevenue value={answers.step1} onChange={(patch) => onChangeAnswers({ ...answers, step1: { ...answers.step1, ...patch } })} />
        ) : null}
        {step === 2 ? (
          <Step2ListGrowth value={answers.step2} onChange={(patch) => onChangeAnswers({ ...answers, step2: { ...answers.step2, ...patch } })} />
        ) : null}
        {step === 3 ? (
          <Step3Campaigns value={answers.step3} onChange={(patch) => onChangeAnswers({ ...answers, step3: { ...answers.step3, ...patch } })} />
        ) : null}
        {step === 4 ? (
          <Step4Automations value={answers.step4} onChange={(patch) => onChangeAnswers({ ...answers, step4: { ...answers.step4, ...patch } })} />
        ) : null}
        {step === 5 ? (
          <Step5ListHealth value={answers.step5} onChange={(patch) => onChangeAnswers({ ...answers, step5: { ...answers.step5, ...patch } })} />
        ) : null}

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-line-soft pt-6">
          <Button variant="ghost" icon={<ArrowLeft size={16} />} iconPosition="left" onClick={goBack}>
            Back
          </Button>

          <div className="flex items-center gap-3">
            {import.meta.env.DEV ? (
              <Button variant="ghost" size="md" icon={<Sparkles size={15} />} iconPosition="left" onClick={onLoadDemo}>
                Load Demo Account
              </Button>
            ) : null}
            <Button variant="primary" icon={<ArrowRight size={18} />} disabled={!isValid} onClick={goNext}>
              {step === TOTAL_STEPS ? 'See My Results' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
