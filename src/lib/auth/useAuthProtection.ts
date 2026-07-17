"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthProvider"
import { isPublicRoute, isAuthRoute } from "@/lib/constants"

export function useAuthProtection() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, handleLogout, fetchWithAuth } = useAuth()

  // Mutation Locks: guarantee form button tracking variables completely disable
  // CTA click execution triggers while remote queries process.
  const [isMutating, setIsMutating] = useState(false)

  const withMutationLock = async <T,>(fn: () => Promise<T>): Promise<T> => {
    if (isMutating) {
      throw new Error("Mutation in progress")
    }

    setIsMutating(true)
    try {
      return await fn()
    } finally {
      setIsMutating(false)
    }
  }

  // Prevent form submissions when mutations are in progress.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const trigger = target.closest('button[type="submit"], a[href]')

      if (trigger && isMutating) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [isMutating])

  // Route protection
  useEffect(() => {
    if (isLoading) return

    if (!user && !isPublicRoute(pathname)) {
      router.replace("/login?redirect=" + encodeURIComponent(pathname))
    }

    if (user && isAuthRoute(pathname)) {
      router.replace("/dashboard")
    }
  }, [user, isLoading, pathname, router])

  return {
    user,
    isLoading,
    handleLogout,
    isMutating,
    withMutationLock,
    fetchWithAuth,
  }
}
