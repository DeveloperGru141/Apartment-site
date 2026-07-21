"use client"

import { useEffect, useRef } from "react"

export default function ViewTransition({ children }: { children: React.ReactNode }) {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    if (!document.startViewTransition) return

    let pending = false

    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function wrappedPush(...args) {
      if (pending) {
        originalPushState.apply(this, args)
        return
      }
      pending = true
      document.startViewTransition(() =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              resolve()
              pending = false
            })
          )
        })
      )
      originalPushState.apply(this, args)
    }

    history.replaceState = function wrappedReplace(...args) {
      if (pending) {
        originalReplaceState.apply(this, args)
        return
      }
      pending = true
      document.startViewTransition(() =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              resolve()
              pending = false
            })
          )
        })
      )
      originalReplaceState.apply(this, args)
    }

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [])

  return <>{children}</>
}
