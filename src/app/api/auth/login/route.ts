import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiError } from '@/lib/api/response'
import { loginSchema } from '@/lib/validations/schemas'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return apiError(error.message, 401)

    if (!data.session || !data.user)
      return apiError('Sign in succeeded but no session was created', 500)

    return NextResponse.json({ session: data.session, user: data.user })
  } catch (err) {
    return apiError(err)
  }
}
