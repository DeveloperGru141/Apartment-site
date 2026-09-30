import { NEIGHBORHOODS } from "@/lib/images"

export default function LocationMarquee() {
  const items = [...NEIGHBORHOODS, ...NEIGHBORHOODS]
  return (
    <div className="overflow-hidden border-y border-line-dark bg-ink-2 py-3">
      <div className="animate-scroll flex w-max items-center" aria-hidden="true">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="flex items-center gap-8 pr-8 text-[13px] font-medium uppercase tracking-[0.16em] text-fg-on-dark-muted whitespace-nowrap"
          >
            {name}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}