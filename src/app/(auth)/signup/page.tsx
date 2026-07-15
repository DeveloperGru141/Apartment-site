"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const reviews = [
  {
    quote:
      "The properties are breathtaking and the digital concierge service is flawlessly smooth.",
    name: "Sarah Jenkins",
    status: "Verified Guest",
    avatar: "https://i.pravatar.cc/64?img=47",
  },
  {
    quote:
      "Exquisite design and an effortless booking flow. HORIZON completely redefines luxury rentals.",
    name: "David K.",
    status: "Corporate Partner",
    avatar: "https://i.pravatar.cc/64?img=13",
  },
  {
    quote:
      "Unmatched residences and a concierge team that anticipates every need. Truly five-star.",
    name: "Micah Okoh",
    status: "CEO, Forge Labs",
    avatar:
      "https://pbs.twimg.com/profile_images/2011746068594323456/I8madg7A_400x400.jpg",
  },
]

function Star() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.367-2.448a1 1 0 00-1.176 0l-3.367 2.448c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.363-1.118L1.104 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.285-3.957z" />
    </svg>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false)
      const t = setTimeout(() => {
        setIdx((i) => (i + 1) % reviews.length)
        setVisible(true)
      }, 500)
      return () => clearTimeout(t)
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Unable to create account")
        return
      }

      setMessage(
        data.message ??
          "Account created. Please check your email to confirm your account."
      )
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const review = reviews[idx]

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
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-b border-[#111111]/20 focus:border-[#111111] pb-2 w-full bg-transparent outline-none transition-all placeholder-[#666666] text-[#111111] font-body text-sm"
                  placeholder="Jane Doe"
                />
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-b border-[#111111]/20 focus:border-[#111111] pb-2 w-full bg-transparent outline-none transition-all placeholder-[#666666] text-[#111111] font-body text-sm"
                  placeholder="you@example.com"
                />
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-b border-[#111111]/20 focus:border-[#111111] pb-2 w-full bg-transparent outline-none transition-all placeholder-[#666666] text-[#111111] font-body text-sm"
                  placeholder="At least 6 characters"
                />
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

          <div className="border-t border-[#111111]/10 pt-6 mt-6">
            <div
              className={
                "transition-opacity duration-500 " +
                (visible ? "opacity-100" : "opacity-0")
              }
            >
              <div className="text-amber-500 text-xs mb-2 flex gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="font-body italic text-xs leading-relaxed text-[#222222] mb-3">
                {review.quote}
              </p>
              <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
                <div>
                  <p className="font-body font-bold text-[9px] tracking-wider text-[#111111] uppercase leading-tight">
                    {review.name}
                  </p>
                  <p className="font-body font-bold text-[9px] tracking-wider text-[#111111]/60 uppercase leading-tight">
                    {review.status}
                  </p>
                </div>
              </div>
            </div>

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
    </div>
  )
}
