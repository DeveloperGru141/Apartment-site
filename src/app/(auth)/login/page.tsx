"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import Link from "next/link"
import ReviewRotator from "@/components/auth/ReviewRotator"
import { loginAction } from "@/lib/actions/auth"

function LoginForm() {
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next") || "/dashboard"
  const [state, formAction, pending] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.success && state.redirectTo) {
      window.location.assign(state.redirectTo)
    }
  }, [state])

  return (
    <div className="relative z-10 min-h-screen w-full md:flex md:items-center md:justify-center">
      <div className="w-full px-6 md:px-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        <div className="w-full max-w-[420px] h-auto my-8 mx-auto p-6 sm:p-8 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="font-heading font-extrabold text-text-primary uppercase tracking-widest text-base"
              >
                HORIZON
              </Link>
              <Link
                href="/"
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                &larr; Home
              </Link>
            </div>

            <h1 className="font-heading font-bold text-3xl text-text-primary tracking-tight mb-2">
              Sign in to your space
            </h1>
            <p className="font-body text-xs text-text-body mb-8 leading-relaxed">
              Welcome back to your HORIZON concierge dashboard.
            </p>

            <form action={formAction} className="space-y-5">
              <input type="hidden" name="next" value={nextUrl} />

              {state?.error && (
                <div className="rounded-xl bg-red-500/90 text-white text-xs px-4 py-3">
                  {state.error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="font-body font-bold text-[10px] tracking-widest text-text-primary uppercase mb-1.5 block"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="border-b pb-2 w-full bg-transparent outline-none transition-all placeholder-text-muted text-text-primary font-body text-sm border-accent/20 focus:border-accent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="font-body font-bold text-[10px] tracking-widest text-text-primary uppercase mb-1.5 block"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="border-b pb-2 w-full bg-transparent outline-none transition-all placeholder-text-muted text-text-primary font-body text-sm border-accent/20 focus:border-accent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-accent text-white font-body font-semibold text-xs tracking-widest uppercase py-4 rounded-xl hover:bg-neutral-800 active:scale-[0.99] transition-all duration-300 mt-6 shadow-sm disabled:opacity-60"
              >
                {pending ? "Signing in\u2026" : "SIGN IN"}
              </button>
            </form>
          </div>

          <ReviewRotator />
          <p className="text-xs font-body text-text-body text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="underline text-text-primary font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
