"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      const message =
        error.message.toLowerCase().includes("email not confirmed")
          ? "Please confirm your email address before logging in. Check your inbox for the confirmation link."
          : "Invalid email or password. Please try again."
      setError(message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          <span className="font-heading font-extrabold tracking-[0.3em] text-2xl">HORIZON</span>
        </Link>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="font-heading text-2xl font-bold text-white">Seller Login</h1>
          <p className="text-sm text-slate-400 mt-2">
            Welcome back — manage your listings and agent connections.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="shine-sweep w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-lg py-3.5 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? "Signing in…" : "Log In"}
            </button>
          </form>

          <p className="text-sm text-slate-400 mt-6 text-center">
            New to HORIZON?{" "}
            <Link href="/auth/sign-up" className="text-amber-400 hover:text-amber-300 underline underline-offset-4">
              Create a seller account
            </Link>
          </p>
        </div>

        <Link href="/" className="block text-center text-xs text-slate-500 hover:text-slate-300 mt-6 transition-colors">
          ← Back to site
        </Link>
      </div>
    </main>
  )
}