import type {
  CampaignsPerWeek,
  Confidence,
  FindingCategory,
  RevenueImpact,
  Severity,
} from './types'

/**
 * Every tunable number and decision threshold for the audit engine lives in
 * this file. Adjust bands/weights here rather than in scoring.ts or
 * findings.ts so the "judgment" encoded in the tool stays in one place.
 */

// ---------------------------------------------------------------------------
// Category weights — must sum to 1
// ---------------------------------------------------------------------------

export const CATEGORY_WEIGHTS: Record<FindingCategory, number> = {
  revenue_performance: 0.25,
  list_growth: 0.2,
  automations: 0.25,
  campaigns: 0.2,
  list_health: 0.1,
}

// ---------------------------------------------------------------------------
// Revenue opportunity model
// ---------------------------------------------------------------------------

export const TARGET_EMAIL_ATTRIBUTION_PERCENT = 33

// ---------------------------------------------------------------------------
// Generic banding helpers
// ---------------------------------------------------------------------------

export interface Band {
  min: number
  /** Exclusive upper bound. Use Infinity for open-ended top band. */
  max: number
  scoreMin: number
  scoreMax: number
  label: string
}

export interface ScoreStatusBand {
  min: number
  max: number
  status: string
}

/** Linearly interpolates a 0-100 score for `value` inside the matching band. */
export function scoreFromBand(bands: Band[], value: number): number {
  const sorted = bands
  for (const band of sorted) {
    if (value >= band.min && value < band.max) {
      if (band.max === Infinity) return band.scoreMax
      const position = (value - band.min) / (band.max - band.min)
      return Math.round(band.scoreMin + position * (band.scoreMax - band.scoreMin))
    }
  }
  if (value < sorted[0].min) return sorted[0].scoreMin
  return sorted[sorted.length - 1].scoreMax
}

export function labelFromBand(bands: Band[], value: number): string {
  for (const band of bands) {
    if (value >= band.min && value < band.max) return band.label
  }
  if (value < bands[0].min) return bands[0].label
  return bands[bands.length - 1].label
}

export function statusFromScore(bands: ScoreStatusBand[], score: number): string {
  for (const band of bands) {
    if (score >= band.min && score < band.max) return band.status
  }
  return bands[bands.length - 1].status
}

// ---------------------------------------------------------------------------
// Category + overall status labels
// ---------------------------------------------------------------------------

export const CATEGORY_STATUS_BANDS: ScoreStatusBand[] = [
  { min: 0, max: 40, status: 'Critical Priority' },
  { min: 40, max: 55, status: 'High Opportunity' },
  { min: 55, max: 70, status: 'Moderate Opportunity' },
  { min: 70, max: 85, status: 'Healthy' },
  { min: 85, max: 101, status: 'Strong' },
]

export const OVERALL_STATUS_BANDS: ScoreStatusBand[] = [
  { min: 0, max: 40, status: 'Severe Revenue Leak' },
  { min: 40, max: 55, status: 'Significant Revenue Opportunity' },
  { min: 55, max: 70, status: 'Moderate Revenue Opportunity' },
  { min: 70, max: 85, status: 'Healthy Foundation, Room To Scale' },
  { min: 85, max: 101, status: 'Strong Program, Optimization Mode' },
]

// ---------------------------------------------------------------------------
// Revenue performance — email attribution bands
// ---------------------------------------------------------------------------

export const EMAIL_ATTRIBUTION_BANDS: Band[] = [
  { min: 0, max: 10, scoreMin: 15, scoreMax: 35, label: 'Severe underperformance' },
  { min: 10, max: 20, scoreMin: 35, scoreMax: 60, label: 'Significant opportunity' },
  { min: 20, max: 30, scoreMin: 60, scoreMax: 80, label: 'Healthy foundation with growth opportunity' },
  { min: 30, max: 40, scoreMin: 80, scoreMax: 95, label: 'Strong performance' },
  { min: 40, max: Infinity, scoreMin: 85, scoreMax: 95, label: 'Very strong' },
]

// ---------------------------------------------------------------------------
// List growth — popup submit rate bands
// ---------------------------------------------------------------------------

export const POPUP_SUBMIT_RATE_BANDS: Band[] = [
  { min: 0, max: 3, scoreMin: 10, scoreMax: 35, label: 'Severe underperformance' },
  { min: 3, max: 5, scoreMin: 35, scoreMax: 55, label: 'Needs improvement' },
  { min: 5, max: 7, scoreMin: 55, scoreMax: 75, label: 'Healthy' },
  { min: 7, max: 10, scoreMin: 75, scoreMax: 90, label: 'Strong' },
  { min: 10, max: Infinity, scoreMin: 90, scoreMax: 100, label: 'Excellent' },
]

export const NO_POPUP_SCORE = 10
export const POPUP_UNKNOWN_RATE_SCORE = 45
export const PREFERENCE_DATA_BONUS = 8
export const UNUSED_PERSONALIZATION_PENALTY = 10

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export const CAMPAIGN_FREQUENCY_BASE_SCORE: Record<CampaignsPerWeek, number> = {
  '0': 10,
  '1': 38,
  '2': 62,
  '3': 85,
  '4': 90,
  '5+': 90,
  inconsistent: 32,
}

/** Open rate at/above this, combined with narrow reach, triggers the "underutilized" diagnosis. */
export const HIGH_OPEN_RATE_THRESHOLD = 45
export const HIGH_CLICK_RATE_THRESHOLD = 3.5

/** recipients / active profiles */
export const NARROW_CAMPAIGN_REACH_RATIO = 0.3
export const VERY_NARROW_CAMPAIGN_REACH_RATIO = 0.15

export const HIGH_UNSUBSCRIBE_RATE = 0.5
export const HIGH_SPAM_RATE = 0.1

// ---------------------------------------------------------------------------
// Automations / flows
// ---------------------------------------------------------------------------

export const CORE_FLOW_MAX_POINTS = 16 // 5 core flows x 16 = 80
export const ADDITIONAL_FLOW_BONUS_PER_FLOW = 3
export const ADDITIONAL_FLOW_BONUS_CAP = 20

export const FLOW_EMAIL_COUNT_TARGETS: Record<string, { minimal: number; healthy: number }> = {
  welcome: { minimal: 2, healthy: 3 },
  abandoned_cart: { minimal: 2, healthy: 3 },
  abandoned_checkout: { minimal: 2, healthy: 3 },
  browse_abandonment: { minimal: 1, healthy: 2 },
  post_purchase: { minimal: 3, healthy: 5 },
}

export const STALE_FLOW_MONTHS_WARNING = '6_12m'
export const STALE_FLOW_MONTHS_CRITICAL = 'gt_12m'

// ---------------------------------------------------------------------------
// List health / segmentation
// ---------------------------------------------------------------------------

export const ENGAGEMENT_WINDOW_SEGMENTS = [
  'engaged_30d',
  'engaged_60d',
  'engaged_90d',
  'engaged_120d',
  'engaged_180d',
] as const

// ---------------------------------------------------------------------------
// Priority engine weights
// ---------------------------------------------------------------------------

export const SEVERITY_WEIGHTS: Record<Severity, number> = {
  critical: 40,
  high: 30,
  medium: 18,
  low: 8,
  healthy: 0,
}

export const REVENUE_IMPACT_WEIGHTS: Record<RevenueImpact, number> = {
  very_high: 30,
  high: 22,
  medium: 12,
  low: 5,
}

export const CONFIDENCE_WEIGHTS: Record<Confidence, number> = {
  high: 15,
  medium: 9,
  low: 4,
}

/** How much a finding's raw scoreImpact (0-100) factors into its priority rank. */
export const SCORE_IMPACT_PRIORITY_MULTIPLIER = 0.3
