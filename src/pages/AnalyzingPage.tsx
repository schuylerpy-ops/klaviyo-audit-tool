import { useEffect, useState } from 'react'
import { BarChart3 } from 'lucide-react'

const MESSAGES = [
  'Analyzing your revenue performance...',
  'Reviewing list growth...',
  'Checking core automations...',
  'Evaluating campaign strategy...',
  'Prioritizing your biggest opportunities...',
]

const TOTAL_DURATION_MS = 2200

interface AnalyzingPageProps {
  onComplete: () => void
}

export function AnalyzingPage({ onComplete }: AnalyzingPageProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1))
    }, TOTAL_DURATION_MS / MESSAGES.length)

    const timeout = setTimeout(onComplete, TOTAL_DURATION_MS)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="text-center">
        <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-ring" />
          <div className="relative h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center text-accent-soft">
            <BarChart3 size={26} />
          </div>
        </div>
        <p className="mt-8 text-lg font-medium text-white/85 transition-all duration-300">{MESSAGES[messageIndex]}</p>
        <p className="mt-2 text-sm text-white/35">Building your audit</p>
      </div>
    </div>
  )
}
