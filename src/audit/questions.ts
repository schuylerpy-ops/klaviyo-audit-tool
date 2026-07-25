import type {
  CampaignType,
  CampaignsPerWeek,
  ExpandsTargeting,
  FlowKey,
  FlowRecency,
  Industry,
  ListCleaningProcess,
  PopupDataCollection,
  PostPurchaseContent,
  SegmentKey,
  SendConsistency,
  WelcomePersonalization,
  YesNoUnsure,
} from './types'

export interface Option<T extends string> {
  value: T
  label: string
  description?: string
}

export const INDUSTRY_OPTIONS: Option<Industry>[] = [
  { value: 'general_ecommerce', label: 'General Ecommerce' },
  { value: 'apparel_fashion', label: 'Apparel / Fashion' },
  { value: 'beauty_skincare', label: 'Beauty / Skincare' },
  { value: 'supplements_wellness', label: 'Supplements / Wellness' },
  { value: 'food_beverage', label: 'Food / Beverage' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'home_lifestyle', label: 'Home / Lifestyle' },
  { value: 'jewelry_accessories', label: 'Jewelry / Accessories' },
  { value: 'high_ticket', label: 'High-Ticket Ecommerce' },
  { value: 'other', label: 'Other' },
]

export const YES_NO_UNSURE_OPTIONS: Option<YesNoUnsure>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not Sure' },
]

export const CAMPAIGNS_PER_WEEK_OPTIONS: Option<CampaignsPerWeek>[] = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' },
  { value: 'inconsistent', label: 'Inconsistent / varies significantly' },
]

/** The numeric options render as a compact card row; "inconsistent" needs its own wider card — see CAMPAIGNS_PER_WEEK_INCONSISTENT_OPTION. */
export const CAMPAIGNS_PER_WEEK_NUMERIC_OPTIONS: Option<CampaignsPerWeek>[] = CAMPAIGNS_PER_WEEK_OPTIONS.filter(
  (opt) => opt.value !== 'inconsistent',
)

export const CAMPAIGNS_PER_WEEK_INCONSISTENT_OPTION: Option<CampaignsPerWeek> = CAMPAIGNS_PER_WEEK_OPTIONS.find(
  (opt) => opt.value === 'inconsistent',
)!

export const POPUP_DATA_COLLECTION_OPTIONS: Option<PopupDataCollection>[] = [
  { value: 'email_only', label: 'Email only' },
  { value: 'email_sms', label: 'Email + SMS' },
  { value: 'quiz_preference', label: 'Quiz / preference data' },
  { value: 'multi_step_personalization', label: 'Multiple steps with personalization' },
  { value: 'not_sure', label: 'Not sure' },
]

export const WELCOME_PERSONALIZATION_OPTIONS: Option<WelcomePersonalization>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'partial', label: 'Partially' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
]

export const SEND_CONSISTENCY_OPTIONS: Option<SendConsistency>[] = [
  { value: 'structured', label: 'Yes, on a structured schedule' },
  { value: 'somewhat_consistent', label: 'Somewhat consistent' },
  { value: 'promo_driven', label: 'Mostly promotion-driven' },
  { value: 'very_inconsistent', label: 'Very inconsistent' },
  { value: 'rarely', label: 'We rarely send campaigns' },
]

export const CAMPAIGN_TYPE_OPTIONS: Option<CampaignType>[] = [
  { value: 'promotions', label: 'Promotions / Discounts' },
  { value: 'product_education', label: 'Product Education' },
  { value: 'social_proof', label: 'Customer Stories / Social Proof' },
  { value: 'brand_storytelling', label: 'Brand Storytelling' },
  { value: 'blog_educational', label: 'Blog / Educational Content' },
  { value: 'product_launches', label: 'Product Launches' },
  { value: 'founder_emails', label: 'Founder Emails' },
  { value: 'replenishment', label: 'Replenishment / Product Usage' },
  { value: 'mostly_promotions', label: 'Mostly Promotions' },
  { value: 'other', label: 'Other' },
]

export const CORE_FLOW_OPTIONS: (Option<FlowKey> & { helper?: string })[] = [
  { value: 'welcome', label: 'Welcome Flow' },
  { value: 'abandoned_cart', label: 'Abandoned Cart Flow', helper: 'Added to Cart trigger' },
  { value: 'abandoned_checkout', label: 'Abandoned Checkout Flow', helper: 'Started Checkout trigger' },
  { value: 'browse_abandonment', label: 'Browse Abandonment Flow' },
  { value: 'post_purchase', label: 'Post-Purchase Flow' },
]

export const ADDITIONAL_FLOW_OPTIONS: Option<FlowKey>[] = [
  { value: 'review_request', label: 'Review Request' },
  { value: 'winback', label: 'Winback' },
  { value: 'vip', label: 'VIP' },
  { value: 'sunset_unengaged', label: 'Sunset / Unengaged' },
  { value: 'replenishment', label: 'Replenishment' },
  { value: 'back_in_stock', label: 'Back In Stock' },
  { value: 'subscription_welcome', label: 'Subscription Welcome' },
  { value: 'subscription_dunning', label: 'Subscription Dunning / Failed Payment' },
  { value: 'cross_sell', label: 'Cross-Sell' },
  { value: 'order_anniversary', label: 'Order Anniversary' },
  { value: 'other', label: 'Other' },
]

export const FLOW_LABELS: Record<FlowKey, string> = Object.fromEntries(
  [...CORE_FLOW_OPTIONS, ...ADDITIONAL_FLOW_OPTIONS].map((o) => [o.value, o.label]),
) as Record<FlowKey, string>

export const FLOW_RECENCY_OPTIONS: Option<FlowRecency>[] = [
  { value: 'lt_3m', label: 'Less than 3 months' },
  { value: '3_6m', label: '3-6 months' },
  { value: '6_12m', label: '6-12 months' },
  { value: 'gt_12m', label: 'More than 12 months' },
  { value: 'not_sure', label: 'Not sure' },
]

export const POST_PURCHASE_CONTENT_OPTIONS: Option<PostPurchaseContent>[] = [
  { value: 'thank_you', label: 'Thank You / Order Confirmation' },
  { value: 'product_education', label: 'Product Education' },
  { value: 'usage_instructions', label: 'Usage Instructions' },
  { value: 'customer_success_stories', label: 'Customer Success Stories' },
  { value: 'review_request', label: 'Review Request' },
  { value: 'cross_sell', label: 'Cross-Sell' },
  { value: 'replenishment', label: 'Replenishment' },
  { value: 'upgrade_offers', label: 'Upgrade Offers' },
  { value: 'none_limited', label: 'None / Very Limited' },
]

export const SEGMENT_OPTIONS: Option<SegmentKey>[] = [
  { value: 'engaged_30d', label: '30-Day Engaged' },
  { value: 'engaged_60d', label: '60-Day Engaged' },
  { value: 'engaged_90d', label: '90-Day Engaged' },
  { value: 'engaged_120d', label: '120-Day Engaged' },
  { value: 'engaged_180d', label: '180-Day Engaged' },
  { value: 'vip', label: 'VIP Customers' },
  { value: 'past_purchasers', label: 'Past Purchasers' },
  { value: 'window_shoppers', label: 'Window Shoppers' },
  { value: 'unengaged', label: 'Unengaged Profiles' },
  { value: 'not_suppressed', label: 'Not Suppressed' },
  { value: 'bounced', label: 'Bounced Profiles' },
  { value: 'winback_potential', label: 'Winback Potential Customers' },
  { value: 'other', label: 'Other' },
]

export const LIST_CLEANING_OPTIONS: Option<ListCleaningProcess>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
]

export const EXPANDS_TARGETING_OPTIONS: Option<ExpandsTargeting>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
]
