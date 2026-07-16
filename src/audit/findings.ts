import {
  CONFIDENCE_WEIGHTS,
  ENGAGEMENT_WINDOW_SEGMENTS,
  HIGH_OPEN_RATE_THRESHOLD,
  NARROW_CAMPAIGN_REACH_RATIO,
  REVENUE_IMPACT_WEIGHTS,
  SCORE_IMPACT_PRIORITY_MULTIPLIER,
  SEVERITY_WEIGHTS,
  VERY_NARROW_CAMPAIGN_REACH_RATIO,
} from './benchmarks'
import { CORE_FLOW_KEYS, FINDING_CATEGORY_LABELS } from './types'
import type {
  CompleteAuditAnswers,
  Finding,
  FindingCategory,
  FlowKey,
  RevenueImpact,
  Severity,
} from './types'
import { FLOW_LABELS } from './questions'
import { formatCurrency } from '../utils/format'

type DraftFinding = Omit<Finding, 'priorityScore'>

function draft(f: DraftFinding): DraftFinding {
  return f
}

export function computePriorityScore(finding: DraftFinding): number {
  return (
    SEVERITY_WEIGHTS[finding.severity] +
    REVENUE_IMPACT_WEIGHTS[finding.revenueImpact] +
    CONFIDENCE_WEIGHTS[finding.confidence] +
    finding.scoreImpact * SCORE_IMPACT_PRIORITY_MULTIPLIER
  )
}

function weakCategories(
  categoryScores: Record<FindingCategory, number>,
  excluding: FindingCategory,
  threshold = 60,
): { category: FindingCategory; label: string; score: number }[] {
  return (Object.keys(categoryScores) as FindingCategory[])
    .filter((c) => c !== excluding && categoryScores[c] < threshold)
    .map((c) => ({ category: c, label: FINDING_CATEGORY_LABELS[c], score: categoryScores[c] }))
    .sort((a, b) => a.score - b.score)
}

// ---------------------------------------------------------------------------
// Revenue Performance
// ---------------------------------------------------------------------------

export function generateRevenueFindings(
  answers: CompleteAuditAnswers,
  categoryScores: Record<FindingCategory, number>,
): DraftFinding[] {
  const { emailRevenuePercent, monthlyRevenue } = answers.step1
  if (emailRevenuePercent == null) return []

  const pctLabel = `${emailRevenuePercent}%`
  const dollarContext =
    monthlyRevenue != null
      ? ` (roughly ${formatCurrency((monthlyRevenue * emailRevenuePercent) / 100)}/month)`
      : ''
  const weakOthers = weakCategories(categoryScores, 'revenue_performance')

  if (emailRevenuePercent < 10) {
    return [
      draft({
        id: 'revenue-attribution-severe',
        category: 'revenue_performance',
        title: 'Email Is A Minor Revenue Channel',
        severity: 'critical',
        scoreImpact: 90,
        revenueImpact: 'very_high',
        confidence: 'high',
        whatWeAreSeeing: `Email currently generates ${pctLabel} of total store revenue${dollarContext}.`,
        whyItMatters:
          'At this level, email is essentially untapped. Ecommerce brands with a functioning flow and campaign program typically see 25-35% of revenue from email — this account is leaving the majority of that on the table.',
        recommendation:
          'Prioritize foundational flows and consistent campaign sending before investing further in paid acquisition. The fastest path to revenue here is capturing demand you already have, not finding more of it.',
        supportingMetrics: [`Email attribution: ${pctLabel}`],
        isHealthy: false,
      }),
    ]
  }

  if (emailRevenuePercent < 20) {
    return [
      draft({
        id: 'revenue-attribution-opportunity',
        category: 'revenue_performance',
        title: 'Email Revenue Is Below Benchmark',
        severity: 'high',
        scoreImpact: 65,
        revenueImpact: 'very_high',
        confidence: 'high',
        whatWeAreSeeing: `Email currently generates ${pctLabel} of total store revenue${dollarContext}.`,
        whyItMatters:
          'This is meaningfully below the 25-35% range we typically see once flows and campaigns are built out properly. That gap represents recurring, high-margin revenue the business is not yet capturing.',
        recommendation:
          'This is likely a combination of underdeveloped flows and inconsistent campaign sending rather than one single fix — the automation and campaign findings below point to the specific gaps.',
        supportingMetrics: [`Email attribution: ${pctLabel}`],
        isHealthy: false,
      }),
    ]
  }

  if (emailRevenuePercent < 30) {
    const weakNote = weakOthers.length
      ? ` The bigger constraint appears to be ${weakOthers.map((w) => w.label).join(' and ')}.`
      : ''
    return [
      draft({
        id: 'revenue-attribution-growth',
        category: 'revenue_performance',
        title: 'Solid Foundation, Real Room To Grow',
        severity: weakOthers.length ? 'medium' : 'low',
        scoreImpact: 35,
        revenueImpact: 'high',
        confidence: 'medium',
        whatWeAreSeeing: `Email currently generates ${pctLabel} of total store revenue${dollarContext}.`,
        whyItMatters: `This is a workable foundation, but it is not yet at the 30%+ level we see from accounts with mature flows and campaign cadence.${weakNote}`,
        recommendation:
          'This is not a foundation problem. Close the specific gaps identified elsewhere in this audit and attribution should move up without needing to rebuild anything from scratch.',
        supportingMetrics: [`Email attribution: ${pctLabel}`],
        isHealthy: false,
      }),
    ]
  }

  // 30%+
  const weakNote = weakOthers.length
    ? `That said, ${weakOthers.map((w) => w.label).join(' and ')} still show real opportunity — a strong attribution number does not mean every part of the program is optimized.`
    : 'Every other category in this audit is also performing well, which is a genuinely strong position.'

  return [
    draft({
      id: 'revenue-attribution-strong',
      category: 'revenue_performance',
      title: emailRevenuePercent >= 40 ? 'Very Strong Email Revenue Share' : 'Strong Email Revenue Share',
      severity: weakOthers.length ? 'low' : 'healthy',
      scoreImpact: weakOthers.length ? 15 : 0,
      revenueImpact: 'low',
      confidence: 'medium',
      whatWeAreSeeing: `Email currently generates ${pctLabel} of total store revenue${dollarContext}.`,
      whyItMatters: weakNote,
      recommendation: weakOthers.length
        ? `Shift focus toward ${weakOthers[0].label.toLowerCase()} — that is where the next dollar of opportunity is sitting.`
        : 'Treat this as an optimization and scaling phase: testing, refinement, and expansion rather than foundational fixes.',
      supportingMetrics: [`Email attribution: ${pctLabel}`],
      isHealthy: weakOthers.length === 0,
    }),
  ]
}

// ---------------------------------------------------------------------------
// List Growth
// ---------------------------------------------------------------------------

function inferPopupShareOfNewSubs(step2: CompleteAuditAnswers['step2']): number | null {
  const { newSubscribers30d, popupViews30d, popupSubmitRate } = step2
  if (!newSubscribers30d || !popupViews30d || popupSubmitRate == null || newSubscribers30d <= 0) return null
  const popupSubs = popupViews30d * (popupSubmitRate / 100)
  return popupSubs / newSubscribers30d
}

export function generateListGrowthFindings(answers: CompleteAuditAnswers): DraftFinding[] {
  const { step2 } = answers
  const { hasPopup, popupSubmitRate, popupSubmitRateUnknown, popupDataCollection, welcomePersonalization, newSubscribers30d } =
    step2
  const findings: DraftFinding[] = []

  if (hasPopup === 'no') {
    return [
      draft({
        id: 'list-growth-no-popup',
        category: 'list_growth',
        title: 'No Active Signup Capture',
        severity: 'critical',
        scoreImpact: 90,
        revenueImpact: 'very_high',
        confidence: 'high',
        whatWeAreSeeing: 'There is currently no active website signup form or popup capturing email addresses.',
        whyItMatters:
          'Every visitor who leaves without converting and without subscribing is a lead the business has no way to follow up with. This is typically the single highest-leverage fix available in an email program.',
        recommendation:
          'Launch a popup or embedded signup form with a clear incentive. Even a basic single-field form typically converts at 3-5%+ and starts feeding every downstream flow.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    ]
  }

  if (hasPopup === 'not_sure' || hasPopup == null) {
    findings.push(
      draft({
        id: 'list-growth-status-unclear',
        category: 'list_growth',
        title: 'Signup Capture Status Is Unclear',
        severity: 'high',
        scoreImpact: 55,
        revenueImpact: 'high',
        confidence: 'low',
        whatWeAreSeeing: 'It is unclear whether an active signup form or popup is currently live on the site.',
        whyItMatters:
          'List growth is foundational — if this cannot be confirmed, it should be the first thing checked in Klaviyo.',
        recommendation: 'Confirm the popup or signup form is live, published, and displaying to new visitors.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
    return findings
  }

  // hasPopup === 'yes'
  if (popupSubmitRateUnknown || popupSubmitRate == null) {
    findings.push(
      draft({
        id: 'list-growth-rate-unknown',
        category: 'list_growth',
        title: 'Popup Conversion Rate Is Not Being Tracked',
        severity: 'medium',
        scoreImpact: 40,
        revenueImpact: 'medium',
        confidence: 'low',
        whatWeAreSeeing: 'A popup is live, but the submit rate is not currently being tracked or is unknown.',
        whyItMatters:
          "Without this number, it is impossible to know whether the popup is a strength or a liability — a 2% and an 8% submit rate call for completely different actions.",
        recommendation:
          "Pull the popup's submit rate from Klaviyo's sign-up form analytics and re-run this audit with that number for a sharper read.",
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  } else {
    let title: string
    let severity: Severity
    let scoreImpact: number
    let revenueImpact: RevenueImpact
    let whyItMatters: string
    let recommendation: string

    if (popupSubmitRate < 3) {
      title = 'Popup Conversion Is Critically Low'
      severity = 'critical'
      scoreImpact = 75
      revenueImpact = 'very_high'
      whyItMatters =
        'A sub-3% submit rate means the vast majority of site visitors leave without becoming a contactable lead. This directly caps every downstream flow and campaign.'
      recommendation =
        'Test a stronger incentive, simplify the form to one field, and revisit popup timing and design. This is usually a fast, high-leverage fix.'
    } else if (popupSubmitRate < 5) {
      title = 'Popup Conversion Needs Improvement'
      severity = 'high'
      scoreImpact = 50
      revenueImpact = 'high'
      whyItMatters =
        'This is below the range we typically consider healthy. Incremental gains here compound through every flow the popup feeds.'
      recommendation = 'Test offer strength, copy, and timing. Small creative changes at this stage often move the needle quickly.'
    } else if (popupSubmitRate < 7) {
      title = 'Popup Conversion Is Healthy'
      severity = 'low'
      scoreImpact = 15
      revenueImpact = 'low'
      whyItMatters = 'This is a healthy range. There is still some room to optimize, but this is not a priority fix.'
      recommendation = 'Run incremental tests on offer and design, but focus attention on higher-impact areas first.'
    } else {
      title = 'Popup Conversion Is Strong'
      severity = 'healthy'
      scoreImpact = 0
      revenueImpact = 'low'
      whyItMatters = 'This is a strong submit rate, well above typical ecommerce benchmarks.'
      recommendation = 'Maintain the current approach and prioritize other areas of the account.'
    }

    findings.push(
      draft({
        id: 'list-growth-popup-rate',
        category: 'list_growth',
        title,
        severity,
        scoreImpact,
        revenueImpact,
        confidence: 'high',
        whatWeAreSeeing: `The popup currently converts at ${popupSubmitRate}%.`,
        whyItMatters,
        recommendation,
        supportingMetrics: [`Popup submit rate: ${popupSubmitRate}%`],
        isHealthy: severity === 'healthy',
      }),
    )
  }

  const collectsPreferenceData =
    popupDataCollection === 'quiz_preference' || popupDataCollection === 'multi_step_personalization'

  if (collectsPreferenceData && (welcomePersonalization === 'no' || welcomePersonalization == null)) {
    findings.push(
      draft({
        id: 'list-growth-unused-personalization',
        category: 'list_growth',
        title: 'Signup Data Is Collected But Not Used',
        severity: 'medium',
        scoreImpact: 30,
        revenueImpact: 'medium',
        confidence: 'medium',
        whatWeAreSeeing:
          'The signup form collects preference or quiz data, but the Welcome Flow does not personalize messaging based on it.',
        whyItMatters:
          'Preference data is one of the highest-leverage personalization inputs available, and it is being collected without being acted on — a missed opportunity in the highest-intent flow in the account.',
        recommendation:
          'Segment the Welcome Flow by the signup answer (product interest, use case, etc.) so the first emails a subscriber sees are relevant to what they told you.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  } else if (popupDataCollection === 'email_only') {
    findings.push(
      draft({
        id: 'list-growth-email-only',
        category: 'list_growth',
        title: 'Signup Form Collects Minimal Data',
        severity: 'low',
        scoreImpact: 15,
        revenueImpact: 'medium',
        confidence: 'medium',
        whatWeAreSeeing: 'The popup currently collects only an email address.',
        whyItMatters:
          'Collecting even one additional data point (SMS, product interest, or use case) unlocks personalization in the Welcome Flow and future segmentation.',
        recommendation:
          'Test adding a single preference question or an SMS field before asking for more — small additions convert better than long forms.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  const popupShare = inferPopupShareOfNewSubs(step2)
  if (popupShare != null && popupShare < 0.4) {
    findings.push(
      draft({
        id: 'list-growth-checkout-capture',
        category: 'list_growth',
        title: 'Most Subscribers Are Captured At Checkout, Not Before',
        severity: 'medium',
        scoreImpact: 35,
        revenueImpact: 'high',
        confidence: 'medium',
        whatWeAreSeeing: `Based on popup views and submit rate, the popup appears to account for only a portion of the ~${newSubscribers30d} new subscribers added in the last 30 days.`,
        whyItMatters:
          'When most subscribers are entering through Shopify checkout rather than the popup, the brand is capturing many of them only after they already reached checkout or purchased. That limits the ability to influence the first purchase decision earlier in the journey, where email and SMS are most effective.',
        recommendation:
          'Increase popup visibility and test offer and timing to pull more subscribers in pre-purchase, rather than relying primarily on checkout opt-ins.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  return findings
}

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export function generateCampaignFindings(answers: CompleteAuditAnswers): DraftFinding[] {
  const { campaignsPerWeek, activeProfiles, avgCampaignRecipients, avgOpenRate, sendConsistency, campaignTypes } =
    answers.step3
  if (campaignsPerWeek == null) return []

  const findings: DraftFinding[] = []
  const reachRatio =
    activeProfiles && avgCampaignRecipients && activeProfiles > 0 ? avgCampaignRecipients / activeProfiles : null

  let flaggedUnderutilized = false
  if (avgOpenRate != null && avgOpenRate >= HIGH_OPEN_RATE_THRESHOLD && reachRatio != null && reachRatio < NARROW_CAMPAIGN_REACH_RATIO) {
    flaggedUnderutilized = true
    findings.push(
      draft({
        id: 'campaigns-underutilized',
        category: 'campaigns',
        title: 'Strong Engagement, Narrow Reach',
        severity: reachRatio < VERY_NARROW_CAMPAIGN_REACH_RATIO ? 'high' : 'medium',
        scoreImpact: 45,
        revenueImpact: 'high',
        confidence: 'medium',
        whatWeAreSeeing: `Campaigns average a ${avgOpenRate}% open rate, but a typical send only reaches ~${Math.round(reachRatio * 100)}% of active profiles (${Math.round(avgCampaignRecipients!).toLocaleString()} of ${Math.round(activeProfiles!).toLocaleString()}).`,
        whyItMatters:
          'Your campaign performance appears strong but potentially underutilized. The current targeting strategy may be protecting engagement while also leaving revenue on the table — a high open rate on a narrow send is not the same as a high open rate across the full list.',
        recommendation:
          'Gradually test wider 60, 90, 120, and 180-day engaged audiences while monitoring opens, clicks, revenue, unsubscribes, and spam complaints. Expand in stages rather than sending to the full list at once.',
        supportingMetrics: [`Open rate: ${avgOpenRate}%`, `Reach: ~${Math.round(reachRatio * 100)}% of active profiles`],
        isHealthy: false,
      }),
    )
  }

  if (campaignsPerWeek === '0') {
    findings.push(
      draft({
        id: 'campaigns-zero',
        category: 'campaigns',
        title: 'No Regular Campaign Sending',
        severity: 'critical',
        scoreImpact: 85,
        revenueImpact: 'very_high',
        confidence: 'high',
        whatWeAreSeeing:
          sendConsistency === 'rarely'
            ? 'Campaigns are rarely sent — the account is not currently sending unique campaigns on a weekly basis.'
            : 'The account is not currently sending unique campaigns on a weekly basis.',
        whyItMatters:
          'Flows only reach subscribers who trigger a specific behavior. Without regular campaigns, the rest of the list — including engaged, ready-to-buy subscribers — gets no consistent revenue-driving touchpoints. This is a consistency problem, not proof that campaigns do not work for this list.',
        recommendation:
          'Stand up a baseline cadence of 2-3 unique campaigns per week mixing promotions with product education, social proof, and brand content.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  } else if (campaignsPerWeek === 'inconsistent' || sendConsistency === 'very_inconsistent') {
    findings.push(
      draft({
        id: 'campaigns-inconsistent',
        category: 'campaigns',
        title: 'Campaign Cadence Is Inconsistent',
        severity: 'high',
        scoreImpact: 50,
        revenueImpact: 'high',
        confidence: 'medium',
        whatWeAreSeeing: 'Campaign volume varies significantly week to week rather than following a set cadence.',
        whyItMatters:
          'Inconsistent sending makes revenue unpredictable and makes it hard to tell whether underperformance is a list problem, a content problem, or simply a gap in sending. The issue here is consistency, not proof of performance.',
        recommendation: 'Commit to a fixed weekly send calendar for the next 60 days before changing anything else about campaign strategy.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  } else if (campaignsPerWeek === '1') {
    findings.push(
      draft({
        id: 'campaigns-low-frequency',
        category: 'campaigns',
        title: 'Campaign Volume Is Low',
        severity: 'high',
        scoreImpact: 55,
        revenueImpact: 'very_high',
        confidence: 'high',
        whatWeAreSeeing: 'The account currently sends about 1 unique campaign per week.',
        whyItMatters:
          'At this frequency, the list receives very few regular touchpoints outside of automated flows, which caps how much additional revenue campaigns can generate.',
        recommendation:
          'Build toward a structured cadence of 2-3 campaigns per week using a content mix of education, social proof, customer stories, product benefits, launches, and promotions — not just discounts.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  } else if (campaignsPerWeek === '2') {
    findings.push(
      draft({
        id: 'campaigns-moderate',
        category: 'campaigns',
        title: 'Campaign Volume Has Room To Grow',
        severity: 'medium',
        scoreImpact: 30,
        revenueImpact: 'medium',
        confidence: 'medium',
        whatWeAreSeeing: 'The account sends about 2 unique campaigns per week.',
        whyItMatters:
          'This is a workable cadence, but most accounts at this stage still have headroom before engagement fatigue becomes a real risk.',
        recommendation: 'Test increasing to 3 campaigns per week while watching unsubscribe and spam rates. If they stay stable, that volume is sustainable.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  } else if (!flaggedUnderutilized) {
    findings.push(
      draft({
        id: 'campaigns-healthy-frequency',
        category: 'campaigns',
        title: 'Healthy Campaign Frequency',
        severity: 'healthy',
        scoreImpact: 0,
        revenueImpact: 'low',
        confidence: 'medium',
        whatWeAreSeeing: `The account sends ${campaignsPerWeek} unique campaigns per week.`,
        whyItMatters: 'This is a strong, sustainable cadence assuming engagement and list health hold up at this volume.',
        recommendation: 'Maintain this cadence and shift focus to content mix and targeting refinement rather than volume.',
        supportingMetrics: [],
        isHealthy: true,
      }),
    )
  }

  if (campaignTypes.length > 0) {
    const nonPromoTypes = campaignTypes.filter((t) => t !== 'promotions' && t !== 'mostly_promotions')
    if (nonPromoTypes.length === 0) {
      findings.push(
        draft({
          id: 'campaigns-promo-heavy',
          category: 'campaigns',
          title: 'Campaign Content Is Discount-Dependent',
          severity: 'medium',
          scoreImpact: 25,
          revenueImpact: 'medium',
          confidence: 'medium',
          whatWeAreSeeing: 'Campaign content is currently built almost entirely around promotions and discounts.',
          whyItMatters:
            'A promotion-only cadence trains the list to wait for a deal, compresses margin, and gives subscribers no reason to open outside of a sale.',
          recommendation:
            'Introduce non-discount sends: product education, customer stories, founder emails, and brand storytelling. Aim for roughly 1 in 3 sends to carry no offer at all.',
          supportingMetrics: [],
          isHealthy: false,
        }),
      )
    }
  }

  return findings
}

// ---------------------------------------------------------------------------
// Automations
// ---------------------------------------------------------------------------

const ABANDON_FLOW_CONFIG: Partial<
  Record<FlowKey, { missingSeverity: Severity; missingScoreImpact: number; missingRevenueImpact: RevenueImpact }>
> = {
  abandoned_cart: { missingSeverity: 'critical', missingScoreImpact: 75, missingRevenueImpact: 'very_high' },
  abandoned_checkout: { missingSeverity: 'high', missingScoreImpact: 60, missingRevenueImpact: 'very_high' },
  browse_abandonment: { missingSeverity: 'medium', missingScoreImpact: 40, missingRevenueImpact: 'medium' },
}

export function generateAutomationFindings(answers: CompleteAuditAnswers): DraftFinding[] {
  const { activeFlows, flowDetails } = answers.step4
  const { industry } = answers.step1
  const findings: DraftFinding[] = []

  // Welcome
  if (!activeFlows.includes('welcome')) {
    findings.push(
      draft({
        id: 'automation-welcome-missing',
        category: 'automations',
        title: 'No Welcome Flow',
        severity: 'critical',
        scoreImpact: 90,
        revenueImpact: 'very_high',
        confidence: 'high',
        whatWeAreSeeing: 'There is currently no active Welcome Flow.',
        whyItMatters:
          'The Welcome Flow typically converts at the highest rate of any flow in the account because it reaches people at peak interest, right after they opt in. Without it, that window closes with no structured follow-up.',
        recommendation: 'Build a 3-5 email Welcome Flow covering brand story, best-sellers, social proof, and a clear offer.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  } else {
    const detail = flowDetails.welcome
    const count = detail?.emailCount ?? null

    if (count != null && count <= 2) {
      findings.push(
        draft({
          id: 'automation-welcome-depth',
          category: 'automations',
          title: 'Welcome Flow Is Too Short',
          severity: 'high',
          scoreImpact: 45,
          revenueImpact: 'high',
          confidence: 'high',
          whatWeAreSeeing: `The Welcome Flow currently has ${count} email${count === 1 ? '' : 's'}.`,
          whyItMatters:
            'A 1-2 email welcome series usually covers an offer and a brand intro, but misses the space to build trust, handle objections, and convert subscribers who were not ready to buy on email one.',
          recommendation:
            'Expand to 3-5 emails covering brand story, social proof, best-sellers, and a clear offer, spaced over 5-7 days.',
          supportingMetrics: [],
          isHealthy: false,
        }),
      )
    } else if (count === 3 && detail?.welcomeRevenueInEmail1 === 'no') {
      findings.push(
        draft({
          id: 'automation-welcome-extend',
          category: 'automations',
          title: 'Welcome Flow Has Room To Extend',
          severity: 'medium',
          scoreImpact: 25,
          revenueImpact: 'medium',
          confidence: 'medium',
          whatWeAreSeeing: 'The Welcome Flow has 3 emails, and revenue is not overly concentrated in email 1 — later emails are still contributing.',
          whyItMatters: 'When later emails are still converting, that is a signal the audience is receptive to more content, not fatigued by it.',
          recommendation: 'Test extending to 4-5 emails, adding social proof or an objection-handling email before the series ends.',
          supportingMetrics: [],
          isHealthy: false,
        }),
      )
    } else if (count != null && count >= 5 && detail?.welcomeRevenueInEmail1 === 'yes') {
      findings.push(
        draft({
          id: 'automation-welcome-creative',
          category: 'automations',
          title: 'Welcome Flow Revenue Is Concentrated In Email 1',
          severity: 'medium',
          scoreImpact: 30,
          revenueImpact: 'medium',
          confidence: 'medium',
          whatWeAreSeeing: `The Welcome Flow has ${count} emails, but most of the revenue is concentrated in email 1.`,
          whyItMatters:
            'This is not a foundation problem — the flow is long enough. Content and creative performance in emails 2 onward is more likely the bigger issue than the number of emails.',
          recommendation:
            'Review product visibility, offer placement, social proof, and mobile design in emails 2-5 rather than adding more emails to the sequence.',
          supportingMetrics: [],
          isHealthy: false,
        }),
      )
    }

    if (detail?.lastUpdated === 'gt_12m') {
      findings.push(
        draft({
          id: 'automation-welcome-stale',
          category: 'automations',
          title: 'Welcome Flow Has Not Been Updated Recently',
          severity: 'medium',
          scoreImpact: 20,
          revenueImpact: 'medium',
          confidence: 'medium',
          whatWeAreSeeing: 'The Welcome Flow has not been updated in over 12 months.',
          whyItMatters: 'Offers, best-sellers, and brand positioning shift over time. A flow this old is likely referencing outdated products or promotions.',
          recommendation: 'Audit the flow for outdated content, broken links, and stale offers, then refresh copy and creative.',
          supportingMetrics: [],
          isHealthy: false,
        }),
      )
    }

    if (findings.filter((f) => f.id.startsWith('automation-welcome')).length === 0) {
      findings.push(
        draft({
          id: 'automation-welcome-healthy',
          category: 'automations',
          title: 'Welcome Flow Foundation Is Solid',
          severity: 'healthy',
          scoreImpact: 0,
          revenueImpact: 'low',
          confidence: 'medium',
          whatWeAreSeeing: `The Welcome Flow is active${count != null ? ` with ${count} emails` : ''}.`,
          whyItMatters: 'This is one of the highest-value flows in the account, and it is in reasonable shape.',
          recommendation: 'Prioritize other gaps in this audit before revisiting the Welcome Flow.',
          supportingMetrics: [],
          isHealthy: true,
        }),
      )
    }
  }

  // Abandoned cart / checkout / browse abandonment
  for (const flowKey of ['abandoned_cart', 'abandoned_checkout', 'browse_abandonment'] as FlowKey[]) {
    const label = FLOW_LABELS[flowKey]
    const config = ABANDON_FLOW_CONFIG[flowKey]!

    if (!activeFlows.includes(flowKey)) {
      findings.push(
        draft({
          id: `automation-${flowKey}-missing`,
          category: 'automations',
          title: `No ${label}`,
          severity: config.missingSeverity,
          scoreImpact: config.missingScoreImpact,
          revenueImpact: config.missingRevenueImpact,
          confidence: 'high',
          whatWeAreSeeing: `There is currently no active ${label}.`,
          whyItMatters:
            flowKey === 'browse_abandonment'
              ? 'Browse abandonment reaches shoppers who showed intent but never added to cart — a large segment that cart and checkout flows never touch.'
              : `This flow targets shoppers with the highest purchase intent in the account. Without it, that intent goes unaddressed.`,
          recommendation: `Build a ${label.toLowerCase()} with 2-3 emails covering a reminder, social proof or objection handling, and a final incentive or urgency push.`,
          supportingMetrics: [],
          isHealthy: false,
        }),
      )
      continue
    }

    const detail = flowDetails[flowKey]
    const count = detail?.emailCount ?? null
    if (count != null && count <= 2) {
      if (detail?.lastEmailEngaged === 'yes') {
        findings.push(
          draft({
            id: `automation-${flowKey}-depth`,
            category: 'automations',
            title: `${label} Has Room To Expand`,
            severity: 'medium',
            scoreImpact: 35,
            revenueImpact: 'high',
            confidence: 'high',
            whatWeAreSeeing: `${label} currently has ${count} email${count === 1 ? '' : 's'}, and shoppers are still engaged through the last email.`,
            whyItMatters:
              'Continued engagement at the end of a short sequence is a strong signal the audience will respond to more — this is a depth gap, not a performance problem.',
            recommendation:
              'Add emails covering product education, social proof, reviews, objection handling, or urgency. SKU-based personalization is worth testing if the catalog supports it.',
            supportingMetrics: [],
            isHealthy: false,
          }),
        )
      } else {
        findings.push(
          draft({
            id: `automation-${flowKey}-depth`,
            category: 'automations',
            title: `${label} Is Short And Engagement Drops Off`,
            severity: 'medium',
            scoreImpact: 35,
            revenueImpact: 'medium',
            confidence: 'medium',
            whatWeAreSeeing: `${label} currently has ${count} email${count === 1 ? '' : 's'}, and engagement is not holding through the final email.`,
            whyItMatters:
              'Before adding more emails, the existing ones likely need work — offer strength, urgency, and social proof in the current sequence are the more likely fix than sequence length.',
            recommendation: 'Review and strengthen the existing emails first, then test extending the sequence once engagement improves.',
            supportingMetrics: [],
            isHealthy: false,
          }),
        )
      }
    }
  }

  // Post-purchase
  if (!activeFlows.includes('post_purchase')) {
    findings.push(
      draft({
        id: 'automation-post-purchase-missing',
        category: 'automations',
        title: 'No Post-Purchase Flow',
        severity: 'high',
        scoreImpact: 60,
        revenueImpact: 'high',
        confidence: 'high',
        whatWeAreSeeing: 'There is currently no active Post-Purchase flow.',
        whyItMatters:
          'The period right after purchase is when customers are most engaged with the brand. Without a post-purchase sequence, there is no structured effort to educate, retain, or drive a second purchase.',
        recommendation:
          'Build a post-purchase flow covering order confirmation, product education, review request, and a cross-sell or replenishment offer timed to typical usage.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  } else {
    const content = flowDetails.post_purchase?.postPurchaseContent ?? []
    const isEducationHeavy = industry === 'high_ticket' || industry === 'supplements_wellness' || industry === 'beauty_skincare'
    const substantiveContent = content.filter((c) => c !== 'thank_you' && c !== 'none_limited')

    if (content.includes('none_limited') || substantiveContent.length <= 2) {
      findings.push(
        draft({
          id: 'automation-post-purchase-underdeveloped',
          category: 'automations',
          title: 'Post-Purchase Flow Is Underdeveloped',
          severity: isEducationHeavy ? 'high' : 'medium',
          scoreImpact: isEducationHeavy ? 55 : 40,
          revenueImpact: 'high',
          confidence: 'high',
          whatWeAreSeeing: content.includes('none_limited')
            ? 'The Post-Purchase flow is live but covers very little beyond the basics.'
            : `The Post-Purchase flow currently covers order confirmation and little else beyond that.`,
          whyItMatters: isEducationHeavy
            ? "For a considered or education-heavy purchase like this, the post-purchase window is where buyer's remorse gets reversed and product usage gets established. A thin sequence here leaves both retention and reviews on the table."
            : 'A thank-you-and-discount sequence misses the bigger opportunity: using the post-purchase window to educate, build loyalty, and set up the next purchase.',
          recommendation:
            'Add product education, usage instructions, and customer success stories before the review request, then layer in cross-sell and replenishment timed to the product.',
          supportingMetrics: [],
          isHealthy: false,
        }),
      )
    } else {
      findings.push(
        draft({
          id: 'automation-post-purchase-healthy',
          category: 'automations',
          title: 'Post-Purchase Flow Is Well-Developed',
          severity: 'healthy',
          scoreImpact: 0,
          revenueImpact: 'low',
          confidence: 'medium',
          whatWeAreSeeing: 'The Post-Purchase flow covers multiple stages beyond a basic thank-you.',
          whyItMatters: 'This is a frequently underbuilt flow, and it is in solid shape here.',
          recommendation: 'Keep testing cross-sell and replenishment timing against actual usage cycles.',
          supportingMetrics: [],
          isHealthy: true,
        }),
      )
    }
  }

  // Additional / retention-stage flows
  const additionalActive = activeFlows.filter((f) => !CORE_FLOW_KEYS.includes(f))
  if (additionalActive.length === 0) {
    findings.push(
      draft({
        id: 'automation-additional-flows-missing',
        category: 'automations',
        title: 'No Retention-Stage Flows Beyond The Core Five',
        severity: 'low',
        scoreImpact: 12,
        revenueImpact: 'low',
        confidence: 'low',
        whatWeAreSeeing: 'No additional flows (winback, VIP, replenishment, sunset, etc.) are currently active.',
        whyItMatters:
          'These are lower priority than the five core flows, but they typically become worthwhile once the foundation is solid — especially winback and sunset flows, which protect list health and re-engage lapsed customers.',
        recommendation: 'Once the core five flows are in good shape, add a winback flow and a sunset/unengaged flow next.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  return findings
}

// ---------------------------------------------------------------------------
// List Health & Segmentation
// ---------------------------------------------------------------------------

export function generateListHealthFindings(answers: CompleteAuditAnswers): DraftFinding[] {
  const { segments, listCleaningProcess, expandsTargeting, dedicatedSendingDomain, spamComplaintRate } = answers.step5
  const findings: DraftFinding[] = []

  const hasEngagementSegmentation = segments.some((s) =>
    (ENGAGEMENT_WINDOW_SEGMENTS as readonly string[]).includes(s),
  )
  if (!hasEngagementSegmentation) {
    findings.push(
      draft({
        id: 'list-health-no-engagement-segments',
        category: 'list_health',
        title: 'No Engagement-Based Segmentation',
        severity: 'high',
        scoreImpact: 50,
        revenueImpact: 'high',
        confidence: 'high',
        whatWeAreSeeing: 'There is no segment identifying recently engaged subscribers (e.g. 30/60/90-day engaged).',
        whyItMatters:
          'Without engagement segmentation, campaigns are either sent to the full list, risking deliverability, or to a single static group with no ability to expand targeting deliberately or protect sender reputation.',
        recommendation:
          'Build at least a 30, 60, and 90-day engaged segment. This is also the foundation for the gradual reach-expansion strategy referenced in the campaigns findings.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  if (!segments.includes('unengaged')) {
    findings.push(
      draft({
        id: 'list-health-no-unengaged-strategy',
        category: 'list_health',
        title: 'No Defined Unengaged Segment',
        severity: 'medium',
        scoreImpact: 35,
        revenueImpact: 'medium',
        confidence: 'medium',
        whatWeAreSeeing: 'There is no segment isolating unengaged or sunset-stage profiles.',
        whyItMatters: 'Sending to unengaged profiles indefinitely drags down open rates, increases spam risk, and can affect inbox placement for the entire list.',
        recommendation: 'Create an unengaged segment (e.g. no opens or clicks in 90-180 days) and route it into a dedicated sunset flow or suppress it from regular campaigns.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  if (!segments.includes('past_purchasers')) {
    findings.push(
      draft({
        id: 'list-health-no-purchaser-segment',
        category: 'list_health',
        title: 'No Purchaser Segmentation',
        severity: 'medium',
        scoreImpact: 30,
        revenueImpact: 'medium',
        confidence: 'medium',
        whatWeAreSeeing: 'There is no segment distinguishing past purchasers from non-purchasers.',
        whyItMatters:
          'Customers and prospects need different messaging — customers respond to replenishment, cross-sell, and loyalty content, while prospects need more convincing. Treating them the same caps relevance.',
        recommendation: 'Build a past-purchaser segment and use it to personalize campaigns and post-purchase flow logic.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  if (!segments.includes('vip')) {
    findings.push(
      draft({
        id: 'list-health-no-vip',
        category: 'list_health',
        title: 'No VIP Identification',
        severity: 'low',
        scoreImpact: 15,
        revenueImpact: 'low',
        confidence: 'low',
        whatWeAreSeeing: 'There is no segment identifying top-spending or repeat customers.',
        whyItMatters: 'VIPs are typically a small share of the list responsible for an outsized share of revenue. Without identifying them, there is no way to reward or retain them differently.',
        recommendation: 'Define a VIP segment (e.g. top 10% by lifetime spend or 3+ orders) and layer in early access, loyalty perks, or dedicated content.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  if (listCleaningProcess === 'no' || listCleaningProcess == null) {
    findings.push(
      draft({
        id: 'list-health-no-cleaning',
        category: 'list_health',
        title: 'No Regular List-Cleaning Process',
        severity: 'medium',
        scoreImpact: 35,
        revenueImpact: 'medium',
        confidence: 'medium',
        whatWeAreSeeing: 'There is no regular process for suppressing or cleaning unengaged and invalid profiles.',
        whyItMatters: 'A stale list drags down deliverability over time, which quietly suppresses inbox placement for engaged subscribers too — the people you most want to reach.',
        recommendation: 'Set a recurring (monthly or quarterly) suppression process for long-term unengaged and bounced profiles.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  if (expandsTargeting === 'no' || expandsTargeting == null) {
    findings.push(
      draft({
        id: 'list-health-no-expansion',
        category: 'list_health',
        title: 'Campaign Targeting Does Not Expand Over Time',
        severity: 'low',
        scoreImpact: 20,
        revenueImpact: 'medium',
        confidence: 'low',
        whatWeAreSeeing: 'Campaign targeting does not gradually expand across engagement windows.',
        whyItMatters: 'Sticking to one static audience caps reach permanently, even as deliverability trust is established. This connects directly to the campaign reach findings elsewhere in this audit.',
        recommendation: 'Introduce a quarterly cadence of testing wider engagement windows, monitoring deliverability at each step.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  if (dedicatedSendingDomain === 'no') {
    findings.push(
      draft({
        id: 'list-health-no-dedicated-domain',
        category: 'list_health',
        title: 'Not Using A Dedicated Sending Domain',
        severity: 'medium',
        scoreImpact: 30,
        revenueImpact: 'medium',
        confidence: 'high',
        whatWeAreSeeing: 'Email is not currently sent from a dedicated sending domain.',
        whyItMatters: 'A dedicated domain isolates sender reputation from any other tool or team sending under the same domain, and is standard practice at meaningful list sizes.',
        recommendation: 'Set up a dedicated sending domain in Klaviyo and warm it up properly before shifting full volume.',
        supportingMetrics: [],
        isHealthy: false,
      }),
    )
  }

  if (spamComplaintRate != null && spamComplaintRate > 0.1) {
    findings.push(
      draft({
        id: 'list-health-high-spam',
        category: 'list_health',
        title: 'Spam Complaint Rate Is Elevated',
        severity: 'high',
        scoreImpact: 50,
        revenueImpact: 'high',
        confidence: 'high',
        whatWeAreSeeing: `Spam complaint rate is currently ${spamComplaintRate}%.`,
        whyItMatters: 'Spam complaints above ~0.1% put inbox placement at risk across the entire program, not just for the campaign that triggered them.',
        recommendation: 'Tighten targeting to more engaged segments immediately and review opt-in sources for quality.',
        supportingMetrics: [`Spam rate: ${spamComplaintRate}%`],
        isHealthy: false,
      }),
    )
  }

  if (findings.length === 0) {
    findings.push(
      draft({
        id: 'list-health-healthy',
        category: 'list_health',
        title: 'List Health Fundamentals Are In Place',
        severity: 'healthy',
        scoreImpact: 0,
        revenueImpact: 'low',
        confidence: 'medium',
        whatWeAreSeeing: 'Core segmentation, list-cleaning, and deliverability practices are in place.',
        whyItMatters: 'This is frequently the weakest category we see — it is in good shape here.',
        recommendation: 'Maintain current practices and revisit quarterly as the list grows.',
        supportingMetrics: [],
        isHealthy: true,
      }),
    )
  }

  return findings
}

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

export function generateAllFindings(
  answers: CompleteAuditAnswers,
  categoryScores: Record<FindingCategory, number>,
  assessedCategories: FindingCategory[],
): Finding[] {
  const byCategory: Record<FindingCategory, DraftFinding[]> = {
    revenue_performance: generateRevenueFindings(answers, categoryScores),
    list_growth: generateListGrowthFindings(answers),
    automations: generateAutomationFindings(answers),
    campaigns: generateCampaignFindings(answers),
    list_health: generateListHealthFindings(answers),
  }

  const assessedSet = new Set(assessedCategories)
  const drafts = (Object.keys(byCategory) as FindingCategory[])
    .filter((c) => assessedSet.has(c))
    .flatMap((c) => byCategory[c])

  return drafts
    .map((f) => ({ ...f, priorityScore: computePriorityScore(f) }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
}

export function selectTopOpportunities(findings: Finding[], count = 3): Finding[] {
  return findings.filter((f) => !f.isHealthy).slice(0, count)
}

export function diagnosisForCategory(category: FindingCategory, findings: Finding[]): string {
  const inCategory = findings.filter((f) => f.category === category)
  if (inCategory.length === 0) return 'No significant issues identified in this category.'
  return inCategory[0].whatWeAreSeeing
}
