import { createEmptyCompleteAuditAnswers } from '../audit/types'
import type { CompleteAuditAnswers } from '../audit/types'

/**
 * Sample account used by the "Load Demo Account" dev button. Deliberately
 * mixes a healthy-ish popup and open rate with a critical gap in campaign
 * frequency and two missing core flows, so the engine has real signal to
 * prioritize rather than a uniformly good or bad account.
 */
export function getDemoCompleteAuditAnswers(): CompleteAuditAnswers {
  const answers = createEmptyCompleteAuditAnswers()

  answers.step1 = {
    industry: 'general_ecommerce',
    monthlyRevenue: 500000,
    emailListSize: 200000,
    emailRevenuePercent: 20,
    klaviyoRevenue: 100000,
    flowRevenuePercent: 65,
    campaignRevenuePercent: 35,
  }

  answers.step2 = {
    hasPopup: 'yes',
    popupSubmitRate: 4.2,
    popupSubmitRateUnknown: false,
    newSubscribers30d: 6200,
    popupViews30d: 145000,
    popupDataCollection: 'email_only',
    welcomePersonalization: 'no',
  }

  answers.step3 = {
    campaignsPerWeek: '0',
    activeProfiles: 200000,
    avgCampaignRecipients: 50000,
    avgOpenRate: 55,
    avgClickRate: 2.4,
    sendConsistency: 'rarely',
    campaignTypes: [],
  }

  answers.step4 = {
    activeFlows: ['welcome', 'abandoned_cart', 'abandoned_checkout'],
    flowDetails: {
      welcome: {
        emailCount: 4,
        lastUpdated: '3_6m',
        welcomeRevenueInEmail1: 'no',
        lastEmailEngaged: null,
        postPurchaseContent: [],
      },
      abandoned_cart: {
        emailCount: 2,
        lastUpdated: 'lt_3m',
        welcomeRevenueInEmail1: null,
        lastEmailEngaged: 'yes',
        postPurchaseContent: [],
      },
      abandoned_checkout: {
        emailCount: 1,
        lastUpdated: '6_12m',
        welcomeRevenueInEmail1: null,
        lastEmailEngaged: 'no',
        postPurchaseContent: [],
      },
    },
  }

  answers.step5 = {
    segments: ['engaged_90d', 'past_purchasers'],
    listCleaningProcess: 'somewhat',
    expandsTargeting: 'no',
    dedicatedSendingDomain: 'not_sure',
    spamComplaintRate: null,
    unsubscribeRate: null,
    bounceRate: null,
  }

  return answers
}
