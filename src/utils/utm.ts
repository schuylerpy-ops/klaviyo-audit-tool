export interface UtmParams {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
}

/** Reads UTM params from the current URL. Call once on app load, before any client-side navigation drops the query string. */
export function getUtmParams(): UtmParams {
  const search = new URLSearchParams(window.location.search)
  return {
    utm_source: search.get('utm_source') ?? '',
    utm_medium: search.get('utm_medium') ?? '',
    utm_campaign: search.get('utm_campaign') ?? '',
    utm_content: search.get('utm_content') ?? '',
    utm_term: search.get('utm_term') ?? '',
  }
}
