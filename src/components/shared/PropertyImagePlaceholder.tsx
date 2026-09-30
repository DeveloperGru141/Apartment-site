import { Building2 } from "lucide-react"

interface PropertyImagePlaceholderProps {
  className?: string
  label?: string
}

/** Designed fallback when a photo is missing or fails to load: warm gradient + building glyph. */
export default function PropertyImagePlaceholder({
  className = "",
  label = "Photo coming soon",
}: PropertyImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden bg-gradient-to-br from-paper-2 via-line to-paper-2 ${className}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-fg-muted/60">
        <Building2 className="h-10 w-10" strokeWidth={1.25} />
        <p className="type-caption font-semibold uppercase tracking-widest">{label}</p>
      </div>
    </div>
  )
}
