export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** Accepts example.com, www.example.com, https://example.com, etc. Empty string is valid (field is optional). */
export function isValidWebsiteUrl(raw: string): boolean {
  const value = raw.trim()
  if (!value) return true
  const stripped = value.replace(/^https?:\/\//i, '').replace(/^www\./i, '')
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+([/?#].*)?$/i.test(stripped)
}

/** Normalizes a loosely-formatted website into a full URL without asking the user to fix minor formatting. */
export function normalizeWebsiteUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}
