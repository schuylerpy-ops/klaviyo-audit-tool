import {
  ADDITIONAL_FLOW_BONUS_CAP,
  ADDITIONAL_FLOW_BONUS_PER_FLOW,
  CATEGORY_STATUS_BANDS,
  CATEGORY_WEIGHTS,
  CORE_FLOW_MAX_POINTS,
  EMAIL_ATTRIBUTION_BANDS,
  ENGAGEMENT_WINDOW_SEGMENTS,
  FLOW_EMAIL_COUNT_TARGETS,
  NO_POPUP_SCORE,
  POPUP_SUBMIT_RATE_BANDS,
  POPUP_UNKNOWN_RATE_SCORE,
  PREFERENCE_DATA_BONUS,
  UNUSED_PERSONALIZATION_PENALTY,
  scoreFromBand,
  statusFromScore,
} from './benchmarks'
import { CORE_FLOW_KEYS, FINDING_CATEGORY_LABELS } from './types'
import type { CategoryScore, CompleteAuditAnswers, FindingCategory } from './types'

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}

export function scoreRevenuePerformance(answers: CompleteAuditAnswers): number {
  const { emailRevenuePercent } = answers.step1
  if (emailRevenuePercent == null) return 50
  return clamp(scoreFromBand(EMAIL_ATTRIBUTION_BANDS, emailRevenuePercent))
}

export function scoreListGrowth(answers: CompleteAuditAnswers): number {
  const { hasPopup, popupSubmitRate, popupSubmitRateUnknown, popupDataCollection, welcomePersonalization } =
    answers.step2

  let score: number
  if (hasPopup == null) {
    score = 50
  } else if (hasPopup === 'no') {
    score = NO_POPUP_SCORE
  } else if (hasPopup === 'not_sure') {
    score = 30
  } else if (popupSubmitRateUnknown || popupSubmitRate == null) {
    score = POPUP_UNKNOWN_RATE_SCORE
  } else {
    score = scoreFromBand(POPUP_SUBMIT_RATE_BANDS, popupSubmitRate)
  }

  const collectsPreferenceData =
    popupDataCollection === 'quiz_preference' || popupDataCollection === 'multi_step_personalization'

  if (collectsPreferenceData) {
    score += PREFERENCE_DATA_BONUS
    if (welcomePersonalization === 'no' || welcomePersonalization == null) {
      score -= UNUSED_PERSONALIZATION_PENALTY
    }
  }

  return clamp(Math.round(score))
}

export function scoreCampaigns(answers: CompleteAuditAnswers): number {
  const { campaignsPerWeek, activeProfiles, avgCampaignRecipients, sendConsistency } = answers.step3
  const { unsubscribeRate, spamComplaintRate } = answers.step5

  if (campaignsPerWeek == null) return 50

  const base: Record<string, number> = {
    '0': 10,
    '1': 38,
    '2': 62,
    '3': 85,
    '4': 90,
    '5+': 90,
    inconsistent: 32,
  }
  let score = base[campaignsPerWeek] ?? 50

  if (activeProfiles && avgCampaignRecipients && activeProfiles > 0) {
    const reachRatio = avgCampaignRecipients / activeProfiles
    if (reachRatio < 0.15) score -= 16
    else if (reachRatio < 0.3) score -= 9
  }

  if (sendConsistency) {
    const consistencyAdjustment: Record<string, number> = {
      structured: 4,
      somewhat_consistent: 0,
      promo_driven: -4,
      very_inconsistent: -10,
      rarely: -15,
    }
    score += consistencyAdjustment[sendConsistency] ?? 0
  }

  if (unsubscribeRate != null && unsubscribeRate > 0.5) score -= 8
  if (spamComplaintRate != null && spamComplaintRate > 0.1) score -= 12

  return clamp(Math.round(score))
}

export function scoreAutomations(answers: CompleteAuditAnswers): number {
  const { activeFlows, flowDetails } = answers.step4
  let score = 0

  for (const flowKey of CORE_FLOW_KEYS) {
    if (!activeFlows.includes(flowKey)) continue
    const detail = flowDetails[flowKey]
    const target = FLOW_EMAIL_COUNT_TARGETS[flowKey]
    let points = CORE_FLOW_MAX_POINTS

    if (detail?.emailCount != null && target) {
      if (detail.emailCount < target.minimal) points *= 0.55
      else if (detail.emailCount < target.healthy) points *= 0.8
    } else {
      points *= 0.85
    }

    if (detail?.lastUpdated === 'gt_12m') points *= 0.75
    else if (detail?.lastUpdated === '6_12m') points *= 0.9

    score += points
  }

  const additionalActive = activeFlows.filter((f) => !CORE_FLOW_KEYS.includes(f))
  score += Math.min(ADDITIONAL_FLOW_BONUS_CAP, additionalActive.length * ADDITIONAL_FLOW_BONUS_PER_FLOW)

  return clamp(Math.round(score))
}

export function scoreListHealth(answers: CompleteAuditAnswers): number {
  const { segments, listCleaningProcess, expandsTargeting, dedicatedSendingDomain } = answers.step5

  let score = 20

  const engagementWindows = segments.filter((s) =>
    (ENGAGEMENT_WINDOW_SEGMENTS as readonly string[]).includes(s),
  ).length
  score += Math.min(24, engagementWindows * 8)

  if (segments.includes('vip')) score += 8
  if (segments.includes('past_purchasers')) score += 8
  if (segments.includes('window_shoppers')) score += 6
  if (segments.includes('unengaged')) score += 8
  if (segments.includes('not_suppressed') || segments.includes('bounced')) score += 6

  if (listCleaningProcess === 'yes') score += 10
  else if (listCleaningProcess === 'somewhat') score += 5

  if (expandsTargeting === 'yes') score += 6
  else if (expandsTargeting === 'sometimes') score += 3

  if (dedicatedSendingDomain === 'yes') score += 4

  return clamp(Math.round(score))
}

const SCORERS: Record<FindingCategory, (answers: CompleteAuditAnswers) => number> = {
  revenue_performance: scoreRevenuePerformance,
  list_growth: scoreListGrowth,
  automations: scoreAutomations,
  campaigns: scoreCampaigns,
  list_health: scoreListHealth,
}

export function buildCategoryScores(answers: CompleteAuditAnswers): Record<FindingCategory, number> {
  const result = {} as Record<FindingCategory, number>
  for (const category of Object.keys(SCORERS) as FindingCategory[]) {
    result[category] = SCORERS[category](answers)
  }
  return result
}

export function toCategoryScoreCards(
  scores: Record<FindingCategory, number>,
  diagnoses: Record<FindingCategory, string>,
): CategoryScore[] {
  return (Object.keys(scores) as FindingCategory[]).map((category) => ({
    category,
    label: FINDING_CATEGORY_LABELS[category],
    weight: CATEGORY_WEIGHTS[category],
    score: scores[category],
    status: statusFromScore(CATEGORY_STATUS_BANDS, scores[category]),
    diagnosis: diagnoses[category] ?? '',
  }))
}

export function computeOverallScore(
  scores: Record<FindingCategory, number>,
  assessedCategories: FindingCategory[],
): number {
  const totalWeight = assessedCategories.reduce((sum, c) => sum + CATEGORY_WEIGHTS[c], 0)
  if (totalWeight === 0) return 0
  const weightedSum = assessedCategories.reduce((sum, c) => sum + scores[c] * CATEGORY_WEIGHTS[c], 0)
  return Math.round(weightedSum / totalWeight)
}
