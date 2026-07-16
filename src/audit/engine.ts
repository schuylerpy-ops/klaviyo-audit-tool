import { OVERALL_STATUS_BANDS, statusFromScore } from './benchmarks'
import { diagnosisForCategory, generateAllFindings, selectTopOpportunities } from './findings'
import { buildRoadmap } from './roadmap'
import { computeRevenueOpportunity } from './revenueOpportunity'
import { buildCategoryScores, computeOverallScore, toCategoryScoreCards } from './scoring'
import { createEmptyCompleteAuditAnswers } from './types'
import type { AuditResult, CompleteAuditAnswers, FindingCategory, InstantAuditAnswers } from './types'

export const ALL_CATEGORIES: FindingCategory[] = [
  'revenue_performance',
  'list_growth',
  'automations',
  'campaigns',
  'list_health',
]

export interface RunAuditOptions {
  /** Categories with enough input data to be scored/weighted. Defaults to all five. */
  assessedCategories?: FindingCategory[]
}

export function runAudit(answers: CompleteAuditAnswers, options: RunAuditOptions = {}): AuditResult {
  const assessedCategories = options.assessedCategories ?? ALL_CATEGORIES
  const scores = buildCategoryScores(answers)
  const findings = generateAllFindings(answers, scores, assessedCategories)
  const topOpportunities = selectTopOpportunities(findings, 3)

  const diagnoses = Object.fromEntries(
    ALL_CATEGORIES.map((category) => [category, diagnosisForCategory(category, findings)]),
  ) as Record<FindingCategory, string>

  const categoryScores = toCategoryScoreCards(scores, diagnoses).filter((c) =>
    assessedCategories.includes(c.category),
  )

  const overallScore = computeOverallScore(scores, assessedCategories)
  const overallStatus = statusFromScore(OVERALL_STATUS_BANDS, overallScore)
  const revenueOpportunity = computeRevenueOpportunity(answers, topOpportunities)
  const roadmap = buildRoadmap(topOpportunities)

  return {
    overallScore,
    overallStatus,
    categoryScores,
    findings,
    topOpportunities,
    revenueOpportunity,
    roadmap,
  }
}

export const INSTANT_ASSESSED_CATEGORIES: FindingCategory[] = ['revenue_performance', 'campaigns', 'automations']

export function instantAnswersToCompleteAnswers(instant: InstantAuditAnswers): CompleteAuditAnswers {
  const answers = createEmptyCompleteAuditAnswers()
  answers.step1.monthlyRevenue = instant.monthlyRevenue
  answers.step1.emailListSize = instant.emailListSize
  answers.step1.emailRevenuePercent = instant.emailRevenuePercent
  answers.step3.campaignsPerWeek = instant.campaignsPerWeek
  answers.step4.activeFlows = instant.activeFlows
  return answers
}

export function runInstantAudit(instant: InstantAuditAnswers): AuditResult {
  const answers = instantAnswersToCompleteAnswers(instant)
  return runAudit(answers, { assessedCategories: INSTANT_ASSESSED_CATEGORIES })
}
