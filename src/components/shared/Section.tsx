import type { ReactNode } from "react"

export type SectionTone = "ink" | "paper" | "paper-2"

const tones: Record<SectionTone, string> = {
  ink: "bg-ink text-fg-on-dark",
  paper: "bg-paper text-fg",
  "paper-2": "bg-paper-2 text-fg",
}

interface SectionProps {
  children: ReactNode
  tone?: SectionTone
  id?: string
  className?: string
}

/** Single section wrapper: tone + vertical rhythm 56/80/112. */
export default function Section({ children, tone = "paper", id, className = "" }: SectionProps) {
  return (
    <section id={id} className={`${tones[tone]} py-14 md:py-20 lg:py-28 ${className}`}>
      {children}
    </section>
  )
}
