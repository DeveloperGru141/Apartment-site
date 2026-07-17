"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ReviewRotator from "@/components/auth/ReviewRotator"
import { signupSchema } from "@/lib/validations/schemas"

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setFieldErrors({})
    setLoading(true)

    const parsed = signupSchema.safeParse({ full_name: fullName, email, password })
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string
        if (!errs[key]) errs[key] = issue.message
      }
      setFieldErrors(errs)
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Unable to create account")
        return
      }

      setMessage(
        data.message ??
          "Account created. Please check your email (and spam folder) to confirm your account."
      )
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (message) {
    return (
      <div className="relative z-10 min-h-screen w-full md:flex md:items-center md:justify-center">
        <div className="w-full px-6 md:px-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <div className="w-full max-w-[420px] h-auto my-8 mx-auto p-6 sm:p-8 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="font-heading font-extrabold text-[#111111] uppercase tracking-widest text-base"
              >
                HORIZON
              </Link>
              <Link
                href="/"
                className="text-xs text-[#666666] hover:text-[#111111] transition-colors"
              >
                &larr; Home
              </Link>
            </div>
            <h1 className="font-heading font-bold text-3xl text-[#111111] tracking-tight mb-2">
              Check your inbox
            </h1>
            <p className="font-body text-xs text-[#555555] mb-8 leading-relaxed">
              {message}
            </p>
            <Link
              href="/login"
              className="font-body text-xs text-[#111111] hover:underline"
            >
              &larr; Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-10 min-h-screen w-full md:flex md:items-center md:justify-center">
      <div className="w-full px-6 md:px-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        <div className="w-full max-w-[420px] h-auto my-8 mx-auto p-6 sm:p-8 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="font-heading font-extrabold text-[#111111] uppercase tracking-widest text-base"
              >
                HORIZON
              </Link>
              <Link
                href="/"
                className="text-xs text-[#666666] hover:text-[#111111] transition-colors"
              >
                &larr; Home
              </Link>
            </div>

            <h1 className="font-heading font-bold text-3xl text-[#111111] tracking-tight mb-2">
              Create your space
            </h1>
            <p className="font-body text-xs text-[#555555] mb-8 leading-relaxed">
              Join HORIZON and unlock premium rentals and concierge services.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-red-500/90 text-white text-xs px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="full_name"
                  className="font-body font-bold text-[10px] tracking-widest text-[#111111] uppercase mb-1.5 block"
                >
                  Full Name
                </label>
                <input
                  id="full_name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setFieldErrors((p) => ({ ...p, full_name: '' })) }}
                  className={`border-b pb-2 w-full bg-transparent outline-none transition-all placeholder-[#666666] text-[#111111] font-body text-sm ${fieldErrors.full_name ? 'border-red-400' : 'border-[#111111]/20 focus:border-[#111111]'}`}
                  placeholder="Jane Doe"
                />
                {fieldErrors.full_name && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.full_name}</p>}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="font-body font-bold text-[10px] tracking-widest text-[#111111] uppercase mb-1.5 block"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })) }}
                  className={`border-b pb-2 w-full bg-transparent outline-none transition-all placeholder-[#666666] text-[#111111] font-body text-sm ${fieldErrors.email ? 'border-red-400' : 'border-[#111111]/20 focus:border-[#111111]'}`}
                  placeholder="you@example.com"
                />
                {fieldErrors.email && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="font-body font-bold text-[10px] tracking-widest text-[#111111] uppercase mb-1.5 block"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })) }}
                  className={`border-b pb-2 w-full bg-transparent outline-none transition-all placeholder-[#666666] text-[#111111] font-body text-sm ${fieldErrors.password ? 'border-red-400' : 'border-[#111111]/20 focus:border-[#111111]'}`}
                  placeholder="At least 6 characters"
                />
                {fieldErrors.password && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111111] text-white font-body font-semibold text-xs tracking-widest uppercase py-4 rounded-xl hover:bg-neutral-800 active:scale-[0.99] transition-all duration-300 mt-6 shadow-sm disabled:opacity-60"
              >
                {loading ? "Creating account…" : "CREATE ACCOUNT"}
              </button>
            </form>
          </div>

          <ReviewRotator />
          <p className="text-xs font-body text-[#555555] text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline text-[#111111] font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
