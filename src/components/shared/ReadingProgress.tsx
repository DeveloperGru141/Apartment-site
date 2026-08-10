"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion"

interface ReadingProgressProps {
  children: React.ReactNode
}

export default function ReadingProgress({ children }: ReadingProgressProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <div ref={ref}>
      {!reduced && (
        <motion.div
          aria-hidden
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-1 z-[60] bg-amber-500 origin-left"
        />
      )}
      {children}
    </div>
  )
}