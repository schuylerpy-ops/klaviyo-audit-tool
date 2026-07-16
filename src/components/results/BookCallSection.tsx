import { CalendarCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { CALENDLY_URL } from '../../config/links'
import { BRAND } from '../../config/brand'

export function BookCallSection() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-accent/20 via-navy-soft to-navy border border-accent/30 p-8 sm:p-12 text-center">
      <h2 className="text-3xl font-heading font-extrabold text-white">Want Us To Fix It For You?</h2>
      <p className="mt-3 text-white/65 max-w-xl mx-auto leading-relaxed">
        Book a strategy call and we&apos;ll break down the highest-impact opportunities in your email and SMS backend —
        no generic playbook, just what applies to your account.
      </p>
      <div className="mt-8 flex justify-center">
        <Button
          variant="primary"
          size="lg"
          icon={<CalendarCheck size={18} />}
          onClick={() => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')}
        >
          Book A Strategy Call
        </Button>
      </div>
      <p className="mt-6 text-xs text-white/30">{BRAND.name} &middot; {BRAND.tagline}</p>
    </section>
  )
}
