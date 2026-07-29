import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code)
    return NextResponse.redirect(`${origin}/login?error=missing_code`)

  try {
    const response = NextResponse.redirect(`${origin}${next}`)
    const supabase = await createClient(response)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error)
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)

    const userId = data.user?.id

    if (userId) {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('id', userId)

      if (count === 0) {
        await supabase.from('profiles').insert({
          id: userId,
          full_name: data.user?.user_metadata?.full_name ?? null,
          role: data.user?.user_metadata?.role ?? 'tenant',
        })
      }
    }

    return response
  } catch {
    return NextResponse.redirect(`${origin}/login?error=callback_exception`)
  }
}
