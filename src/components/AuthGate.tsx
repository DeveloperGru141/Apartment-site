"use client"

import { useAuthProtection } from '@/lib/auth/useAuthProtection'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthProtection()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse font-['Inter'] text-sm text-[#707070]">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
