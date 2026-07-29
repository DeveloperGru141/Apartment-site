import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiError, requireCSRF } from '@/lib/api/response'
import { signupSchema } from '@/lib/validations/schemas'

const RESEND_API_KEY = process.env.RESEND_API_KEY

function buildWelcomeHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Inter',sans-serif;background:#fafafa;padding:40px 20px;">
  <table align="center" style="max-width:480px;width:100%;background:white;border-radius:16px;padding:40px;">
    <tr><td style="text-align:center;padding-bottom:24px;">
      <h1 style="font-size:28px;letter-spacing:4px;color:#111;font-weight:800;margin:0;">HORIZON</h1>
    </td></tr>
    <tr><td style="padding-bottom:16px;">
      <h2 style="font-size:22px;color:#111;margin:0 0 8px;">Welcome, ${name}!</h2>
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
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/listings"
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

async function sendWelcomeEmail(email: string, fullName: string | null): Promise<void> {
  if (!RESEND_API_KEY) return

  const name = fullName || email.split('@')[0]

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Horizon <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to Horizon — your space awaits',
        html: buildWelcomeHtml(name),
      }),
    })

    if (!res.ok) {
      await res.text()
    }
  } catch {
    // Welcome email is best-effort; do not block signup
  }
}

export async function POST(request: Request) {
  try {
    const csrf = requireCSRF(request)
    if (csrf) return csrf

    const supabase = await createClient()

    let raw: unknown
    try {
      raw = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    const parsed = signupSchema.safeParse(raw)
    if (!parsed.success)
      return apiError(parsed.error.issues[0].message, 400)

    const { full_name, email, password } = parsed.data

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role: 'tenant',
        },
      },
    })

    if (authError) return apiError(authError)
    if (!authData.user) return apiError('Failed to create user', 400)

    sendWelcomeEmail(String(email), full_name as string | null)

    return NextResponse.json(
      {
        user: authData.user,
        message: 'Account created. Please check your email (and spam folder) to confirm your account.',
      },
      { status: 201 }
    )
  } catch (err) {
    return apiError(err)
  }
}
