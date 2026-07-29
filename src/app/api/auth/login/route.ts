import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiError, requireCSRF } from '@/lib/api/response'
import { loginSchema } from '@/lib/validations/schemas'

export async function POST(request: Request) {
  try {
    const csrf = requireCSRF(request)
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
