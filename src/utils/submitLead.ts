/** Flat, string-only payload — Netlify Forms (and most webhook/CRM targets) expect form-encoded string fields. */
export interface AuditLeadPayload {
  email: string
  websiteUrl: string
  monthlyRevenue: string
  emailListSize: string
  currentEmailAttribution: string
  weeklyCampaignVolume: string
  selectedFlows: string
  healthScore: string
  currentMonthlyEmailRevenue: string
  potentialMonthlyEmailRevenue: string
  monthlyRevenueGap: string
  annualRevenueOpportunity: string
  topThreeOpportunities: string
  createdAt: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
}

const NETLIFY_FORM_NAME = 'audit-lead'

function encodeFormData(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * Submits a completed audit lead to Netlify Forms.
 *
 * Netlify intercepts POSTs to "/" whose body includes a "form-name" field matching
 * a form it discovered at deploy time (see the hidden `audit-lead` form in index.html).
 *
 * To fan this out to another destination — Zapier, Make, Google Sheets, Airtable,
 * HubSpot, Klaviyo, Beehiiv, a custom webhook, etc. — either:
 *   (a) add a Netlify Forms outgoing webhook/notification in the Netlify dashboard
 *       (no code change needed), or
 *   (b) add another fetch() call below, e.g.:
 *
 *       await fetch('https://hooks.zapier.com/hooks/catch/xxx/yyy', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify(payload),
 *       })
 *
 * Throws on network/HTTP failure — callers should catch and continue rather than
 * blocking the results screen on this.
 */
export async function submitLead(payload: AuditLeadPayload): Promise<void> {
  const body = encodeFormData({ 'form-name': NETLIFY_FORM_NAME, ...payload })

  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    throw new Error(`Netlify Forms submission failed with status ${response.status}`)
  }

  // Future webhook/CRM integration point — see comment above.
}
