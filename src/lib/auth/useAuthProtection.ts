"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthProvider"
import { isPublicRoute, isAuthRoute } from "@/lib/constants"

export function useAuthProtection() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, handleLogout, fetchWithAuth } = useAuth()

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
    fetchWithAuth,
  }
}
