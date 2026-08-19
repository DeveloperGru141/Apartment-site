"use client"

import { useEffect, useRef, useState } from "react"

export type RevealVariant =
  | "fade-up"
  | "fade-in"
  | "unblur"
  | "scale-up"
  | "slide-left"
  | "slide-right"
  | "from-tl"
  | "from-tr"
  | "from-bl"
  | "from-br"

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
  as?: "div" | "section" | "li" | "article"
  immediate?: boolean
}

const variantHidden: Record<RevealVariant, string> = {
  "fade-up": "opacity-0 translate-y-3",
  "fade-in": "opacity-0",
  unblur: "opacity-0 translate-y-2",
  "scale-up": "opacity-0 scale-[0.98]",
  "slide-left": "opacity-0 -translate-x-3",
  "slide-right": "opacity-0 translate-x-3",
  "from-tl": "opacity-0 -translate-x-4 -translate-y-4",
  "from-tr": "opacity-0 translate-x-4 -translate-y-4",
  "from-bl": "opacity-0 -translate-x-4 translate-y-4",
  "from-br": "opacity-0 translate-x-4 translate-y-4",
}

const variantVisible: Record<RevealVariant, string> = {
  "fade-up": "animate-slide-up",
  "fade-in": "animate-fadeIn",
  unblur: "animate-unblur",
  "scale-up": "animate-scale-in",
  "slide-left": "animate-slide-left",
  "slide-right": "animate-slide-right",
  "from-tl": "animate-from-tl",
  "from-tr": "animate-from-tr",
  "from-bl": "animate-from-bl",
  "from-br": "animate-from-br",
}

function useInViewOnce(delayMs: number, immediate = false) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(immediate)

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setVisible(true))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            const timer = setTimeout(() => setVisible(true), delayMs)
            observer.unobserve(el)
            return () => clearTimeout(timer)
          } else {
            setVisible(true)
            observer.unobserve(el)
          }
        }
      },
      { threshold: 0.04, rootMargin: "60px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delayMs, visible])

  return { ref, visible }
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "unblur",
  as: Tag = "div",
  immediate = false,
}: Props) {
  const { ref, visible } = useInViewOnce(delay, immediate)

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tag is dynamic (div/section/li/article), ref cast is intentional
      ref={ref as any}
      className={`transition-all duration-300 ease-out ${
        visible ? variantVisible[variant] : variantHidden[variant]
      } ${className}`}
      style={visible && delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

export function ScrollRevealItem({
  children,
  className = "",
  index = 0,
  variant = "unblur",
  as: Tag = "div",
  immediate = false,
}: {
  children: React.ReactNode
  className?: string
  index?: number
  variant?: RevealVariant
  as?: "div" | "section" | "li" | "article"
  immediate?: boolean
}) {
  const delay = Math.min(index * 30, 150)
  const { ref, visible } = useInViewOnce(delay, immediate)

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tag is dynamic (div/section/li/article), ref cast is intentional
      ref={ref as any}
      className={`transition-all duration-300 ease-out ${
        visible ? variantVisible[variant] : variantHidden[variant]
      } ${className}`}
      style={visible && delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}