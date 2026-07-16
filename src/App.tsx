import { useMemo, useState } from 'react'
import { LandingPage } from './pages/LandingPage'
import { InstantAuditPage } from './pages/InstantAuditPage'
import { CompleteAuditPage } from './pages/CompleteAuditPage'
import { AnalyzingPage } from './pages/AnalyzingPage'
import { ResultsPage } from './pages/ResultsPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { runAudit, runInstantAudit } from './audit/engine'
import { createEmptyCompleteAuditAnswers, createEmptyInstantAuditAnswers } from './audit/types'
import { getDemoCompleteAuditAnswers } from './data/demoAccount'
import type { CompleteAuditAnswers, InstantAuditAnswers } from './audit/types'

type Screen = 'landing' | 'instant-form' | 'complete-form' | 'analyzing' | 'results'
type AuditMode = 'instant' | 'complete'

const STORAGE_PREFIX = 'influx-audit'

export default function App() {
  const [screen, setScreen] = useLocalStorage<Screen>(`${STORAGE_PREFIX}:screen`, 'landing')
  const [mode, setMode] = useLocalStorage<AuditMode>(`${STORAGE_PREFIX}:mode`, 'complete')
  const [completeStep, setCompleteStep] = useLocalStorage<number>(`${STORAGE_PREFIX}:completeStep`, 1)

  const [instantAnswers, setInstantAnswers] = useLocalStorage<InstantAuditAnswers>(
    `${STORAGE_PREFIX}:instantAnswers`,
    createEmptyInstantAuditAnswers,
  )
  const [completeAnswers, setCompleteAnswers] = useLocalStorage<CompleteAuditAnswers>(
    `${STORAGE_PREFIX}:completeAnswers`,
    createEmptyCompleteAuditAnswers,
  )

  // Recomputed on read rather than persisted — deterministic from the stored answers,
  // so a page refresh on the results screen just re-derives the same output.
  const [analyzingTarget, setAnalyzingTarget] = useState<AuditMode | null>(null)

  const result = useMemo(() => {
    if (screen !== 'results') return null
    return mode === 'instant' ? runInstantAudit(instantAnswers) : runAudit(completeAnswers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, mode])

  function goToLanding() {
    setScreen('landing')
  }

  function startInstant() {
    setMode('instant')
    setScreen('instant-form')
  }

  function startComplete() {
    setMode('complete')
    setCompleteStep(1)
    setScreen('complete-form')
  }

  function submitInstant() {
    setAnalyzingTarget('instant')
    setMode('instant')
    setScreen('analyzing')
  }

  function submitComplete() {
    setAnalyzingTarget('complete')
    setMode('complete')
    setScreen('analyzing')
  }

  function finishAnalyzing() {
    if (analyzingTarget) setMode(analyzingTarget)
    setScreen('results')
  }

  function loadDemoAccount() {
    setCompleteAnswers(getDemoCompleteAuditAnswers())
    setCompleteStep(5)
  }

  if (screen === 'landing') {
    return <LandingPage onStartInstant={startInstant} onStartComplete={startComplete} />
  }

  if (screen === 'instant-form') {
    return (
      <InstantAuditPage
        answers={instantAnswers}
        onChangeAnswers={setInstantAnswers}
        onSubmit={submitInstant}
        onExit={goToLanding}
        onLoadDemo={() =>
          setInstantAnswers({
            monthlyRevenue: 500000,
            emailListSize: 200000,
            emailRevenuePercent: 20,
            campaignsPerWeek: '0',
            activeFlows: ['welcome', 'abandoned_cart', 'abandoned_checkout'],
          })
        }
      />
    )
  }

  if (screen === 'complete-form') {
    return (
      <CompleteAuditPage
        step={completeStep}
        onStepChange={setCompleteStep}
        answers={completeAnswers}
        onChangeAnswers={setCompleteAnswers}
        onSubmit={submitComplete}
        onExit={goToLanding}
        onLoadDemo={loadDemoAccount}
      />
    )
  }

  if (screen === 'analyzing') {
    return <AnalyzingPage onComplete={finishAnalyzing} />
  }

  if (result) {
    return (
      <ResultsPage
        result={result}
        mode={mode}
        onBackToLanding={goToLanding}
        onStartCompleteAudit={startComplete}
      />
    )
  }

  return <LandingPage onStartInstant={startInstant} onStartComplete={startComplete} />
}
