interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const percent = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-accent-soft">
          {stepLabels[currentStep - 1]}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-navy-soft overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-violet transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
