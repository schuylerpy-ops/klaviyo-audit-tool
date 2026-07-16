import { TARGET_EMAIL_ATTRIBUTION_PERCENT } from './benchmarks'
import type { CompleteAuditAnswers, Finding, RevenueOpportunity, RevenueOpportunityDriver } from './types'

/**
 * Revenue gap is calculated once, top-down, from current vs. target email
 * attribution. Individual "drivers" are an allocation of that single gap
 * across the top opportunities (weighted by priority score) — they are
 * explanatory, not independently additive. See section 13 of the product
 * spec for why this matters.
 */
export function computeRevenueOpportunity(
  answers: CompleteAuditAnswers,
  topOpportunities: Finding[],
): RevenueOpportunity {
  const revenue = answers.step1.monthlyRevenue ?? 0
  const currentAttribution = answers.step1.emailRevenuePercent ?? 0
  const targetAttribution = Math.max(TARGET_EMAIL_ATTRIBUTION_PERCENT, currentAttribution)

  const currentMonthlyEmailRevenue = (revenue * currentAttribution) / 100
  const targetMonthlyEmailRevenue = (revenue * targetAttribution) / 100
  const monthlyGap = Math.max(0, targetMonthlyEmailRevenue - currentMonthlyEmailRevenue)
  const annualGap = monthlyGap * 12

  const totalWeight = topOpportunities.reduce((sum, f) => sum + f.priorityScore, 0)
  const drivers: RevenueOpportunityDriver[] = []

  if (monthlyGap > 0 && topOpportunities.length > 0 && totalWeight > 0) {
    let allocated = 0
    topOpportunities.forEach((finding, index) => {
      const isLast = index === topOpportunities.length - 1
      const amount = isLast ? monthlyGap - allocated : Math.round((finding.priorityScore / totalWeight) * monthlyGap)
      allocated += amount
      drivers.push({
        findingId: finding.id,
        label: finding.title,
        category: finding.category,
        contribution: Math.max(0, Math.round(amount)),
      })
    })
  }

  return {
    currentMonthlyEmailRevenue,
    targetMonthlyEmailRevenue,
    monthlyGap,
    annualGap,
    currentAttributionPercent: currentAttribution,
    targetAttributionPercent: targetAttribution,
    drivers,
  }
}
