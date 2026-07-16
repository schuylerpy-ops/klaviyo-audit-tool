import type { Finding, FindingCategory, RoadmapWeek } from './types'

const SUPPORTING_TASK_BY_CATEGORY: Record<FindingCategory, string> = {
  revenue_performance: 'Re-baseline current email revenue share so progress is measurable against this audit.',
  list_growth: 'Confirm the popup or form displays correctly on both mobile and desktop.',
  automations: 'Map out email-by-email content and offers before building anything in Klaviyo.',
  campaigns: 'Build a content calendar for the next several sends before writing any copy.',
  list_health: 'Pull current segment membership counts as a baseline to measure against.',
}

function itemsForFinding(finding: Finding): string[] {
  return [finding.recommendation, SUPPORTING_TASK_BY_CATEGORY[finding.category]]
}

/**
 * The plan is built directly from the account's actual top opportunities —
 * a different account with different weak spots gets a different plan.
 */
export function buildRoadmap(topOpportunities: Finding[]): RoadmapWeek[] {
  const weeks: RoadmapWeek[] = topOpportunities.slice(0, 3).map((finding, index) => ({
    week: index + 1,
    title: finding.title,
    items: itemsForFinding(finding),
  }))

  while (weeks.length < 3) {
    weeks.push({
      week: weeks.length + 1,
      title: 'Optimization & Testing',
      items: [
        'Run incremental tests across existing flows and campaigns rather than large rebuilds.',
        'Document current benchmarks so future changes can be measured against a baseline.',
      ],
    })
  }

  weeks.push({
    week: 4,
    title: 'QA, Test, And Monitor',
    items: [
      'QA every new or updated flow and campaign on mobile and desktop before it goes live.',
      'Monitor opens, clicks, revenue, unsubscribes, and spam complaints daily for the first two weeks after changes ship.',
      'Document what changed each week so results can be attributed to a specific fix.',
    ],
  })

  return weeks
}
