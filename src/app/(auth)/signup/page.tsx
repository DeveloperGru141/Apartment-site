"use client"

import { useActionState } from "react"
import Link from "next/link"
import ReviewRotator from "@/components/auth/ReviewRotator"
import { signupAction } from "@/lib/actions/auth"

function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, null)

  if (state?.message) {
    return (
      <div className="relative z-10 min-h-screen w-full md:flex md:items-center md:justify-center">
        <div className="w-full px-6 md:px-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <div className="w-full max-w-[420px] h-auto my-8 mx-auto p-6 sm:p-8 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl">
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
              Check your inbox
            </h1>
            <p className="font-body text-xs text-text-body mb-8 leading-relaxed">
              {state.message}
            </p>
            <Link
              href="/login"
              className="font-body text-xs text-text-primary hover:underline"
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
              Create your space
            </h1>
            <p className="font-body text-xs text-text-body mb-8 leading-relaxed">
              Join HORIZON and unlock premium rentals and concierge services.
            </p>

            <form action={formAction} className="space-y-5">
              {state?.error && (
                <div className="rounded-xl bg-red-500/90 text-white text-xs px-4 py-3">
                  {state.error}
                </div>
              )}

              <div>
                <label
                  htmlFor="full_name"
                  className="font-body font-bold text-[10px] tracking-widest text-text-primary uppercase mb-1.5 block"
                >
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  className="border-b pb-2 w-full bg-transparent outline-none transition-all placeholder-text-muted text-text-primary font-body text-sm border-accent/20 focus:border-accent"
                  placeholder="Jane Doe"
                />
              </div>

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
                  minLength={8}
                  className="border-b pb-2 w-full bg-transparent outline-none transition-all placeholder-text-muted text-text-primary font-body text-sm border-accent/20 focus:border-accent"
                  placeholder="At least 8 characters"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-accent text-white font-body font-semibold text-xs tracking-widest uppercase py-4 rounded-xl hover:bg-neutral-800 active:scale-[0.99] transition-all duration-300 mt-6 shadow-sm disabled:opacity-60"
              >
                {pending ? "Creating account\u2026" : "CREATE ACCOUNT"}
              </button>
            </form>
          </div>

          <ReviewRotator />
          <p className="text-xs font-body text-text-body text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline text-text-primary font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <SignupForm />
}
