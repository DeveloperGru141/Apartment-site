"use client"

import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import { useRef } from "react"

type SectionVariant = "default" | "parallax" | "fade" | "zoom"

interface ScrollBlurProps {
  children: React.ReactNode
  className?: string
  variant?: SectionVariant
}

const offsets: Record<SectionVariant, { opacity: number[]; blur: string[]; scale: number[]; y: number[] }> = {
  default: {
    opacity: [0.2, 1, 1, 0.2],
    blur: ["blur(16px)", "blur(0px)", "blur(0px)", "blur(16px)"],
    scale: [0.96, 1, 1, 0.92],
    y: [40, 0, 0, -30],
  },
  parallax: {
    opacity: [0.3, 1, 1, 0.3],
    blur: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"],
    scale: [1.05, 1, 1, 0.98],
    y: [80, 0, 0, -60],
  },
  fade: {
    opacity: [0, 1, 1, 0],
    blur: ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"],
    scale: [1, 1, 1, 1],
    y: [0, 0, 0, 0],
  },
  zoom: {
    opacity: [0.15, 1, 1, 0.15],
    blur: ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
    scale: [0.9, 1, 1, 0.95],
    y: [20, 0, 0, -20],
  },
}

export function ScrollBlurSection({ children, className = "", variant = "default" }: ScrollBlurProps) {
  const ref = useRef<HTMLDivElement>(null)
  const o = offsets[variant]

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], o.opacity)
  const blurFilter = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], o.blur)
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], o.scale)
  const y = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], o.y)

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        filter: blurFilter,
        scale,
        y,
      }}
      className={`will-change-[transform,filter,opacity] ${className}`}
    >
      {children}
    </motion.div>
  )
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export { containerVariants, itemVariants }
