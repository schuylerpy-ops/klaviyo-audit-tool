import type { RoadmapWeek } from '../../audit/types'

interface ActionPlanSectionProps {
  roadmap: RoadmapWeek[]
}

export function ActionPlanSection({ roadmap }: ActionPlanSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-heading font-bold text-white">Your 30-Day Action Plan</h2>
      <p className="mt-1.5 text-white/55">Built from your top opportunities above — sequenced so early wins fund the later work.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {roadmap.map((week) => (
          <div key={week.week} className="rounded-2xl border border-line-soft bg-navy-soft p-5 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-soft">Week {week.week}</span>
            <h3 className="mt-1.5 font-heading font-bold text-white leading-snug">{week.title}</h3>
            <ul className="mt-4 space-y-2.5 flex-1">
              {week.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-white/60 leading-relaxed">
                  <span className="mt-2 h-1 w-1 rounded-full bg-accent-soft shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
