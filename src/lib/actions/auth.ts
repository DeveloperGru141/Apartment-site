"use server"

import { createClient } from "@/lib/supabase/server"
import { loginSchema, signupSchema } from "@/lib/validations/schemas"
import { safeRedirectPath } from "@/lib/constants"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60_000
const attemptLog = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = attemptLog.get(key)
  if (!entry || now >= entry.resetAt) {
    attemptLog.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

export async function loginAction(prev: unknown, formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  if (isRateLimited(parsed.data.email.toLowerCase())) {
    return { error: "Too many attempts. Please try again in a minute." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    if (error.message === "Invalid login credentials") {
      return { error: "Invalid email or password" }
    }
    return { error: "Unable to log in. Please try again." }
  }

  const next = safeRedirectPath(formData.get("next") as string | null)
  revalidatePath("/", "layout")
  return { success: true, redirectTo: next }
}

export async function signupAction(prev: unknown, formData: FormData) {
  const raw = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = signupSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  if (isRateLimited(parsed.data.email.toLowerCase())) {
    return { error: "Too many attempts. Please try again in a minute." }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
        role: "tenant",
      },
    },
  })

  if (error) return { error: "Unable to create account. Please try again." }
  if (!data.user) return { error: "Failed to create user" }

  sendWelcomeEmail(parsed.data.email, parsed.data.full_name)

  return {
    message:
      "Account created. Please check your email (and spam folder) to confirm your account.",
  }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

const RESEND_API_KEY = process.env.RESEND_API_KEY

async function sendWelcomeEmail(email: string, fullName: string): Promise<void> {
  if (!RESEND_API_KEY) return

  const name = fullName || email.split("@")[0]

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Horizon <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Horizon — your space awaits",
        html: buildWelcomeHtml(name),
      }),
    })
  } catch {
    // best-effort
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function buildWelcomeHtml(name: string): string {
  const safeName = escapeHtml(name)
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Inter',sans-serif;background:#fafafa;padding:40px 20px;">
  <table align="center" style="max-width:480px;width:100%;background:white;border-radius:16px;padding:40px;">
    <tr><td style="text-align:center;padding-bottom:24px;">
      <h1 style="font-size:28px;letter-spacing:4px;color:#111;font-weight:800;margin:0;">HORIZON</h1>
    </td></tr>
    <tr><td style="padding-bottom:16px;">
      <h2 style="font-size:22px;color:#111;margin:0 0 8px;">Welcome, ${safeName}!</h2>
      <p style="font-size:14px;color:#555;line-height:1.6;margin:0;">
        You're officially part of Horizon — your portal to premium rentals and concierge services.
      </p>
    </td></tr>
    <tr><td style="padding:16px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:12px 0;border-top:1px solid #eee;">
          <p style="font-size:13px;color:#888;margin:0;">What's next?</p>
        </td></tr>
        <tr><td style="padding:8px 0;">
          <p style="font-size:14px;color:#333;margin:0;">Browse active listings and find your perfect space.</p>
        </td></tr>
        <tr><td style="padding:8px 0;">
          <p style="font-size:14px;color:#333;margin:0;">Save favorites, apply, and manage your lease — all in one place.</p>
        </td></tr>
        <tr><td style="padding:8px 0;">
          <p style="font-size:14px;color:#333;margin:0;">Need help? Your concierge team is a message away.</p>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding-top:24px;text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/listings"
         style="display:inline-block;background:#111;color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:13px;font-weight:600;letter-spacing:1px;">
        EXPLORE LISTINGS
      </a>
    </td></tr>
    <tr><td style="padding-top:32px;text-align:center;border-top:1px solid #eee;">
      <p style="font-size:11px;color:#aaa;margin:0;">Horizon Rentals &middot; Your premium rental platform</p>
    </td></tr>
  </table>
</body>
</html>`
}
