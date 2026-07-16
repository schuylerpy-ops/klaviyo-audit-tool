// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export type YesNoUnsure = 'yes' | 'no' | 'not_sure'
export type Confidence = 'high' | 'medium' | 'low'
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'healthy'
export type RevenueImpact = 'very_high' | 'high' | 'medium' | 'low'

export type Industry =
  | 'general_ecommerce'
  | 'apparel_fashion'
  | 'beauty_skincare'
  | 'supplements_wellness'
  | 'food_beverage'
  | 'subscription'
  | 'home_lifestyle'
  | 'jewelry_accessories'
  | 'high_ticket'
  | 'other'

export type CampaignsPerWeek = '0' | '1' | '2' | '3' | '4' | '5+' | 'inconsistent'

export type PopupDataCollection =
  | 'email_only'
  | 'email_sms'
  | 'quiz_preference'
  | 'multi_step_personalization'
  | 'not_sure'

export type WelcomePersonalization = 'yes' | 'partial' | 'no' | 'not_sure'

export type SendConsistency =
  | 'structured'
  | 'somewhat_consistent'
  | 'promo_driven'
  | 'very_inconsistent'
  | 'rarely'

export type CampaignType =
  | 'promotions'
  | 'product_education'
  | 'social_proof'
  | 'brand_storytelling'
  | 'blog_educational'
  | 'product_launches'
  | 'founder_emails'
  | 'replenishment'
  | 'mostly_promotions'
  | 'other'

export type FlowKey =
  | 'welcome'
  | 'abandoned_cart'
  | 'abandoned_checkout'
  | 'browse_abandonment'
  | 'post_purchase'
  | 'review_request'
  | 'winback'
  | 'vip'
  | 'sunset_unengaged'
  | 'replenishment'
  | 'back_in_stock'
  | 'subscription_welcome'
  | 'subscription_dunning'
  | 'cross_sell'
  | 'order_anniversary'
  | 'other'

export const CORE_FLOW_KEYS: FlowKey[] = [
  'welcome',
  'abandoned_cart',
  'abandoned_checkout',
  'browse_abandonment',
  'post_purchase',
]

export type FlowRecency = 'lt_3m' | '3_6m' | '6_12m' | 'gt_12m' | 'not_sure'

export type PostPurchaseContent =
  | 'thank_you'
  | 'product_education'
  | 'usage_instructions'
  | 'customer_success_stories'
  | 'review_request'
  | 'cross_sell'
  | 'replenishment'
  | 'upgrade_offers'
  | 'none_limited'

export interface FlowDetail {
  emailCount: number | null
  lastUpdated: FlowRecency | null
  /** Welcome flow only */
  welcomeRevenueInEmail1: YesNoUnsure | null
  /** Cart / checkout / browse abandonment only */
  lastEmailEngaged: YesNoUnsure | null
  /** Post-purchase only */
  postPurchaseContent: PostPurchaseContent[]
}

export type SegmentKey =
  | 'engaged_30d'
  | 'engaged_60d'
  | 'engaged_90d'
  | 'engaged_120d'
  | 'engaged_180d'
  | 'vip'
  | 'past_purchasers'
  | 'window_shoppers'
  | 'unengaged'
  | 'not_suppressed'
  | 'bounced'
  | 'winback_potential'
  | 'other'

export type ListCleaningProcess = 'yes' | 'somewhat' | 'no' | 'not_sure'
export type ExpandsTargeting = 'yes' | 'sometimes' | 'no' | 'not_sure'

// ---------------------------------------------------------------------------
// Complete audit — step answers
// ---------------------------------------------------------------------------

export interface Step1Answers {
  industry: Industry | null
  monthlyRevenue: number | null
  emailListSize: number | null
  emailRevenuePercent: number | null
  klaviyoRevenue: number | null
  flowRevenuePercent: number | null
  campaignRevenuePercent: number | null
}

export interface Step2Answers {
  hasPopup: YesNoUnsure | null
  popupSubmitRate: number | null
  popupSubmitRateUnknown: boolean
  newSubscribers30d: number | null
  popupViews30d: number | null
  popupDataCollection: PopupDataCollection | null
  welcomePersonalization: WelcomePersonalization | null
}

export interface Step3Answers {
  campaignsPerWeek: CampaignsPerWeek | null
  activeProfiles: number | null
  avgCampaignRecipients: number | null
  avgOpenRate: number | null
  avgClickRate: number | null
  sendConsistency: SendConsistency | null
  campaignTypes: CampaignType[]
}

export interface Step4Answers {
  activeFlows: FlowKey[]
  flowDetails: Partial<Record<FlowKey, FlowDetail>>
}

export interface Step5Answers {
  segments: SegmentKey[]
  listCleaningProcess: ListCleaningProcess | null
  expandsTargeting: ExpandsTargeting | null
  dedicatedSendingDomain: YesNoUnsure | null
  spamComplaintRate: number | null
  unsubscribeRate: number | null
  bounceRate: number | null
}

export interface CompleteAuditAnswers {
  step1: Step1Answers
  step2: Step2Answers
  step3: Step3Answers
  step4: Step4Answers
  step5: Step5Answers
}

// ---------------------------------------------------------------------------
// Instant audit
// ---------------------------------------------------------------------------

export interface InstantAuditAnswers {
  monthlyRevenue: number | null
  emailListSize: number | null
  emailRevenuePercent: number | null
  campaignsPerWeek: CampaignsPerWeek | null
  activeFlows: FlowKey[]
}

// ---------------------------------------------------------------------------
// Scoring / findings / results
// ---------------------------------------------------------------------------

export type FindingCategory =
  | 'revenue_performance'
  | 'list_growth'
  | 'automations'
  | 'campaigns'
  | 'list_health'

export const FINDING_CATEGORY_LABELS: Record<FindingCategory, string> = {
  revenue_performance: 'Revenue Performance',
  list_growth: 'List Growth',
  automations: 'Automations',
  campaigns: 'Campaigns',
  list_health: 'List Health & Segmentation',
}

export interface Finding {
  id: string
  category: FindingCategory
  title: string
  severity: Severity
  /** Magnitude (0-100) this issue drags down its category score. 0 for healthy findings. */
  scoreImpact: number
  revenueImpact: RevenueImpact
  confidence: Confidence
  whatWeAreSeeing: string
  whyItMatters: string
  recommendation: string
  supportingMetrics: string[]
  isHealthy: boolean
  /** Computed by the priority engine. */
  priorityScore: number
}

export interface CategoryScore {
  category: FindingCategory
  label: string
  weight: number
  score: number
  status: string
  diagnosis: string
}

export interface RevenueOpportunityDriver {
  findingId: string
  label: string
  category: FindingCategory
  contribution: number
}

export interface RevenueOpportunity {
  currentMonthlyEmailRevenue: number
  targetMonthlyEmailRevenue: number
  monthlyGap: number
  annualGap: number
  currentAttributionPercent: number
  targetAttributionPercent: number
  drivers: RevenueOpportunityDriver[]
}

export interface RoadmapWeek {
  week: number
  title: string
  items: string[]
}

export interface AuditResult {
  overallScore: number
  overallStatus: string
  categoryScores: CategoryScore[]
  findings: Finding[]
  topOpportunities: Finding[]
  revenueOpportunity: RevenueOpportunity
  roadmap: RoadmapWeek[]
}

// ---------------------------------------------------------------------------
// Default / empty factories
// ---------------------------------------------------------------------------

export function createEmptyFlowDetail(): FlowDetail {
  return {
    emailCount: null,
    lastUpdated: null,
    welcomeRevenueInEmail1: null,
    lastEmailEngaged: null,
    postPurchaseContent: [],
  }
}

export function createEmptyCompleteAuditAnswers(): CompleteAuditAnswers {
  return {
    step1: {
      industry: null,
      monthlyRevenue: null,
      emailListSize: null,
      emailRevenuePercent: null,
      klaviyoRevenue: null,
      flowRevenuePercent: null,
      campaignRevenuePercent: null,
    },
    step2: {
      hasPopup: null,
      popupSubmitRate: null,
      popupSubmitRateUnknown: false,
      newSubscribers30d: null,
      popupViews30d: null,
      popupDataCollection: null,
      welcomePersonalization: null,
    },
    step3: {
      campaignsPerWeek: null,
      activeProfiles: null,
      avgCampaignRecipients: null,
      avgOpenRate: null,
      avgClickRate: null,
      sendConsistency: null,
      campaignTypes: [],
    },
    step4: {
      activeFlows: [],
      flowDetails: {},
    },
    step5: {
      segments: [],
      listCleaningProcess: null,
      expandsTargeting: null,
      dedicatedSendingDomain: null,
      spamComplaintRate: null,
      unsubscribeRate: null,
      bounceRate: null,
    },
  }
}

export function createEmptyInstantAuditAnswers(): InstantAuditAnswers {
  return {
    monthlyRevenue: null,
    emailListSize: null,
    emailRevenuePercent: null,
    campaignsPerWeek: null,
    activeFlows: [],
  }
}
