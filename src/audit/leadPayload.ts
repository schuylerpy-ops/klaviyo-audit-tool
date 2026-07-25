import type { AuditLeadPayload } from '../utils/submitLead'
import type { UtmParams } from '../utils/utm'
import { FLOW_LABELS } from './questions'
import type { AuditResult, CompleteAuditAnswers, FlowKey, InstantAuditAnswers, LeadInfo } from './types'

interface BuildAuditLeadPayloadArgs {
  lead: LeadInfo
  mode: 'instant' | 'complete'
  instantAnswers: InstantAuditAnswers
  completeAnswers: CompleteAuditAnswers
  result: AuditResult
  utm: UtmParams
}

function flowsToLabel(flows: FlowKey[]): string {
  return flows.map((f) => FLOW_LABELS[f] ?? f).join(', ')
}

function numberOrEmpty(value: number | null | undefined): string {
  return value == null ? '' : String(value)
}

export function buildAuditLeadPayload({
  lead,
  mode,
  instantAnswers,
  completeAnswers,
  result,
  utm,
}: BuildAuditLeadPayloadArgs): AuditLeadPayload {
  const auditInputs =
    mode === 'instant'
      ? {
          monthlyRevenue: instantAnswers.monthlyRevenue,
          emailListSize: instantAnswers.emailListSize,
          currentEmailAttribution: instantAnswers.emailRevenuePercent,
          weeklyCampaignVolume: instantAnswers.campaignsPerWeek,
          selectedFlows: flowsToLabel(instantAnswers.activeFlows),
        }
      : {
          monthlyRevenue: completeAnswers.step1.monthlyRevenue,
          emailListSize: completeAnswers.step1.emailListSize,
          currentEmailAttribution: completeAnswers.step1.emailRevenuePercent,
          weeklyCampaignVolume: completeAnswers.step3.campaignsPerWeek,
          selectedFlows: flowsToLabel(completeAnswers.step4.activeFlows),
        }

  return {
    email: lead.email,
    websiteUrl: lead.websiteUrl,

    monthlyRevenue: numberOrEmpty(auditInputs.monthlyRevenue),
    emailListSize: numberOrEmpty(auditInputs.emailListSize),
    currentEmailAttribution: numberOrEmpty(auditInputs.currentEmailAttribution),
    weeklyCampaignVolume: auditInputs.weeklyCampaignVolume ?? '',
    selectedFlows: auditInputs.selectedFlows,

    healthScore: numberOrEmpty(result.overallScore),
    currentMonthlyEmailRevenue: numberOrEmpty(result.revenueOpportunity.currentMonthlyEmailRevenue),
    potentialMonthlyEmailRevenue: numberOrEmpty(result.revenueOpportunity.targetMonthlyEmailRevenue),
    monthlyRevenueGap: numberOrEmpty(result.revenueOpportunity.monthlyGap),
    annualRevenueOpportunity: numberOrEmpty(result.revenueOpportunity.annualGap),
    topThreeOpportunities: result.topOpportunities.map((o) => o.title).join(', '),

    createdAt: new Date().toISOString(),
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_term: utm.utm_term,
  }
}
