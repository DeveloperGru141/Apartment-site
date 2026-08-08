interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "sale" | "rent" | "featured"
  className?: string
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-bg-dark text-text-inverse",
  sale: "bg-red-600 text-white",
  rent: "bg-blue-600 text-white",
  featured: "bg-amber-500 text-white",
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

interface StatProps {
  value: string
  label: string
}

export function Stat({ value, label }: StatProps) {
  return (
    <div>
      <p className="font-heading font-bold text-3xl md:text-4xl text-text-primary">
        {value}
      </p>
      <p className="font-body text-sm text-text-muted mt-1">{label}</p>
    </div>
  )
}

interface ServiceItemProps {
  children: React.ReactNode
}

export function ServiceItem({ children }: ServiceItemProps) {
  return (
    <div className="flex items-start gap-3">
      <svg
        className="w-5 h-5 mt-0.5 shrink-0 text-green-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span className="text-text-body text-base leading-relaxed">
        {children}
      </span>
    </div>
  )
}
