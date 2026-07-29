import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiError } from '@/lib/api/response'
import { loginSchema } from '@/lib/validations/schemas'

function csrfCheck(request: Request): NextResponse | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  if (origin && !origin.startsWith(siteUrl)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (referer && !referer.startsWith(siteUrl)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return null
}

export async function POST(request: Request) {
  try {
    const csrf = csrfCheck(request)
    if (csrf) return csrf

    let raw: unknown
    try {
      raw = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    const parsed = loginSchema.safeParse(raw)
    if (!parsed.success)
      return apiError(parsed.error.issues[0].message, 400)

    const { email, password } = parsed.data

    const response = NextResponse.json({ success: true })
    const supabase = await createClient(response)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return apiError(error.message, 401)

    if (!data.session || !data.user)
      return apiError('Sign in succeeded but no session was created', 500)

    return response
  } catch (err) {
    return apiError(err)
  }
}
