import { ArrowRight, Zap, ClipboardList } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { BRAND } from '../config/brand'

interface LandingPageProps {
  onStartInstant: () => void
  onStartComplete: () => void
}

const COMPLETE_CATEGORIES = ['Revenue Performance', 'List Growth', 'Automations', 'Campaigns', 'List Health & Segmentation']

export function LandingPage({ onStartInstant, onStartComplete }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-violet flex items-center justify-center font-heading font-extrabold text-sm">
            IL
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">{BRAND.name}</span>
        </div>
        <span className="hidden sm:block text-xs font-semibold uppercase tracking-widest text-white/35">
          Klaviyo Health Audit
        </span>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="max-w-3xl">
          <p className="text-accent-soft font-semibold text-sm uppercase tracking-widest mb-4">
            Ecommerce Email &amp; SMS Revenue Audit
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.05] text-white">
            Find Out Where Your Klaviyo Account Is Leaving Revenue On The Table
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-2xl leading-relaxed">
            Get a personalized email revenue audit based on the same framework used to evaluate hundreds of
            ecommerce email programs.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instant Audit */}
          <div className="relative rounded-2xl border border-line-soft bg-navy-soft p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-9 w-9 rounded-lg bg-accent/15 flex items-center justify-center text-accent-soft">
                <Zap size={18} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/45">30-60 Seconds</span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-white">Free Instant Audit</h2>
            <p className="mt-2 text-white/60 leading-relaxed">
              Get your estimated email revenue opportunity in under 60 seconds.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-white/55">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent-soft" /> Monthly store revenue
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent-soft" /> Email list size
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent-soft" /> Current email attribution %
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent-soft" /> Weekly campaign volume
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent-soft" /> Active core flows
              </li>
            </ul>

            <div className="mt-8 pt-2">
              <Button variant="secondary" size="lg" fullWidth icon={<ArrowRight size={18} />} onClick={onStartInstant}>
                Run My Instant Audit
              </Button>
            </div>
          </div>

          {/* Complete Audit */}
          <div className="relative rounded-2xl border border-accent/40 bg-gradient-to-b from-navy-soft to-navy p-8 flex flex-col shadow-[0_0_0_1px_rgba(83,109,254,0.15),0_20px_60px_-20px_rgba(83,109,254,0.35)]">
            <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              Recommended
            </span>
            <div className="flex items-center gap-2 mb-5">
              <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center text-accent-soft">
                <ClipboardList size={18} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/45">5 Minutes</span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-white">Complete Klaviyo Audit</h2>
            <p className="mt-2 text-white/60 leading-relaxed">
              Get a full health score, category breakdown, top 3 priorities, and a personalized action plan.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-white/70">
              {COMPLETE_CATEGORIES.map((cat) => (
                <li key={cat} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent-soft" /> {cat}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-2">
              <Button variant="primary" size="lg" fullWidth icon={<ArrowRight size={18} />} onClick={onStartComplete}>
                Start My Complete Audit
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
