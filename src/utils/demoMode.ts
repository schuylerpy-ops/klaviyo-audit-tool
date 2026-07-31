/**
 * Demo mode (for screen-recording ad assets only) skips lead capture and Netlify
 * Forms submission, going straight from audit inputs to results. Enabled via
 * /demo or ?demo=true — never linked from the live funnel. Read once on load,
 * same pattern as getUtmParams, before any client-side navigation drops the URL.
 */
export function isDemoMode(): boolean {
  if (window.location.pathname === '/demo') return true
  return new URLSearchParams(window.location.search).get('demo') === 'true'
}
