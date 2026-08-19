"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface ScrollBlurProps {
  children: ReactNode
  className?: string
}

export function ScrollBlurSection({ children, className = "" }: ScrollBlurProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [sharp, setSharp] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setSharp(entry.isIntersecting),
      { rootMargin: "-6% 0px -6% 0px", threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out ${
        sharp ? "opacity-100" : "opacity-75"
      } ${className}`}
    >
      {children}
    </div>
  )
}