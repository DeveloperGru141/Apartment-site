"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight, Loader2, MailCheck } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [checkInbox, setCheckInbox] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, role: "seller" },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push("/dashboard")
      router.refresh()
      return
    }

    setCheckInbox(true)
    setLoading(false)
  }

  if (checkInbox) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="block text-center mb-8">
            <span className="font-heading font-extrabold tracking-[0.3em] text-2xl">HORIZON</span>
          </Link>
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
            <MailCheck className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold text-white">Check your inbox</h1>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              We sent a confirmation link to <span className="text-white">{email}</span>. Click it to
              activate your seller account, then log in to start listing.
            </p>
            <Link
              href="/auth/login"
              className="shine-sweep mt-8 inline-flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-lg py-3.5 transition-colors"
            >
              Go to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          <span className="font-heading font-extrabold tracking-[0.3em] text-2xl">HORIZON</span>
        </Link>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="font-heading text-2xl font-bold text-white">Become a Seller</h1>
          <p className="text-sm text-slate-400 mt-2">
            List your property, get matched with one of our agents, and let HORIZON handle buyer
            inquiries.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="Ada Obi"
              />
            </div>

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
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="+234 800 000 0000"
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
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="At least 8 characters"
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
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Already a seller?{" "}
            <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 underline underline-offset-4">
              Log in
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