interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  bgColor?: string
  containerClass?: string
}

export function Section({
  children,
  className = "",
  id,
  bgColor = "bg-bg-primary",
  containerClass = "",
}: SectionProps) {
  return (
    <section id={id} className={`${bgColor} ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 ${containerClass}`}>
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  action?: React.ReactNode
  center?: boolean
}

export function SectionHeader({
  label,
  title,
  description,
  action,
  center = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 md:mb-14 ${center ? "text-center" : ""}`}>
      {label && (
        <p className="text-xs tracking-widest uppercase text-text-muted mb-3">
          {label}
        </p>
      )}
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
        {title}
      </h2>
      {description && (
        <p className="text-text-muted text-base mt-3 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
