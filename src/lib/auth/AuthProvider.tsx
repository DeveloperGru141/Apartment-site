"use client"

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/browser"
import type { User } from "@supabase/supabase-js"

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
  handleLogout: () => Promise<void>
  fetchWithAuth: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  signOut: async () => {},
  handleLogout: async () => {},
  fetchWithAuth: async () => new Response(null, { status: 401 }),
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.clear()
    sessionStorage.clear()
    setUser(null)
  }

  const handleLogout = useCallback(async () => {
    await signOut()
    window.location.replace("/login?error=session_expired")
  }, [])

  const fetchWithAuth = useCallback(async (input: RequestInfo | URL, init?: RequestInit) => {
    const res = await fetch(input, init)
    if (res.status === 401) {
      await signOut()
      window.location.replace("/login?error=session_expired")
      throw new Error("Session expired")
    }
    return res
  }, [])

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setUser(data?.user ?? null)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut, handleLogout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
