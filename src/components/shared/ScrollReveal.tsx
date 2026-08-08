"use client"

import { useEffect, useRef, useState } from "react"

export type RevealVariant = "fade-up" | "fade-in" | "unblur" | "scale-up" | "slide-left" | "slide-right"

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
  as?: "div" | "section"
}

const variantHidden: Record<RevealVariant, string> = {
  "fade-up": "opacity-0 translate-y-10",
  "fade-in": "opacity-0",
  unblur: "opacity-0 blur-xl translate-y-6",
  "scale-up": "opacity-0 scale-95",
  "slide-left": "opacity-0 -translate-x-12",
  "slide-right": "opacity-0 translate-x-12",
}

const variantVisible: Record<RevealVariant, string> = {
  "fade-up": "animate-slide-up",
  "fade-in": "animate-fadeIn",
  unblur: "animate-unblur",
  "scale-up": "animate-scale-in",
  "slide-left": "animate-slide-left",
  "slide-right": "animate-slide-right",
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "unblur",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? variantVisible[variant] : variantHidden[variant]
      } ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
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
}: {
  children: React.ReactNode
  className?: string
  index?: number
  variant?: RevealVariant
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const delay = index * 120

  return (
    <div
      ref={ref}
      className={`${
        visible
          ? `animate-unblur`
          : `opacity-0 blur-xl translate-y-6`
      } ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
