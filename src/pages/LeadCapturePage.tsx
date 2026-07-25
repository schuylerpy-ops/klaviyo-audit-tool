import { useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { isValidEmail, isValidWebsiteUrl, normalizeWebsiteUrl } from '../utils/validation'
import type { LeadInfo } from '../audit/types'

interface LeadCapturePageProps {
  onSubmit: (lead: LeadInfo) => void
}

export function LeadCapturePage({ onSubmit }: LeadCapturePageProps) {
  const [email, setEmail] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [touched, setTouched] = useState(false)

  const emailError = !email.trim() ? 'Business email is required' : !isValidEmail(email) ? 'Enter a valid email address' : null
  const websiteError = !isValidWebsiteUrl(websiteUrl) ? 'Enter a valid website (e.g. yourbrand.com)' : null

  const isValid = !emailError && !websiteError

  function handleSubmit() {
    setTouched(true)
    if (!isValid) return
    onSubmit({
      email: email.trim(),
      websiteUrl: normalizeWebsiteUrl(websiteUrl),
    })
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo className="h-7 w-auto" />
        </div>

        <div className="rounded-2xl border border-line-soft bg-navy-soft p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]">
          <h1 className="text-2xl font-heading font-bold text-white text-center leading-snug">
            Where should we send your audit?
          </h1>
          <p className="mt-2 text-sm text-white/55 text-center leading-relaxed">
            Enter your email to unlock your Klaviyo Health Score, revenue gap, and top 3 opportunities.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <div>
              <label className="text-sm font-semibold text-white/85">Business Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@yourbrand.com"
                className="mt-2 w-full rounded-xl bg-navy border border-line-soft text-white placeholder:text-white/25 py-3 px-4 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
              {touched && emailError ? <p className="mt-1.5 text-xs text-bad">{emailError}</p> : null}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <label className="text-sm font-semibold text-white/85">Website URL</label>
                <span className="text-xs text-white/35">(optional)</span>
              </div>
              <input
                type="text"
                autoComplete="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="yourbrand.com"
                className="mt-2 w-full rounded-xl bg-navy border border-line-soft text-white placeholder:text-white/25 py-3 px-4 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
              {touched && websiteError ? <p className="mt-1.5 text-xs text-bad">{websiteError}</p> : null}
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" fullWidth icon={<ArrowRight size={18} />}>
                Show My Audit Results
              </Button>
            </div>
          </form>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-white/35">
            <ShieldCheck size={13} className="text-accent-soft" />
            Free &middot; Instant &middot; No Klaviyo Access Required
          </p>
        </div>
      </div>
    </div>
  )
}
