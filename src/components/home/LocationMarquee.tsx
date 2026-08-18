import { NEIGHBORHOODS } from "@/lib/images"

export default function LocationMarquee() {
  const items = [...NEIGHBORHOODS, ...NEIGHBORHOODS]
  return (
    <div className="overflow-hidden border-y border-gray-100 bg-bg-alt py-4">
      <div className="animate-scroll flex w-max items-center">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="flex items-center gap-8 pr-8 text-xs font-semibold uppercase tracking-[0.3em] text-text-muted whitespace-nowrap"
          >
            {name}
            <span className="text-amber-500">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}