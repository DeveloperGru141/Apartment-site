import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { email, password, full_name, role = 'tenant' } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name ?? '',
          role: role,
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 400 }
      )
    }

    // Profile is created via DB trigger or needs explicit insert.
    // Insert profile row (trigger may also handle this; use upsert to be safe).
    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: authData.user.id,
        email: authData.user.email ?? email,
        full_name: full_name ?? null,
        role: role,
      },
      { onConflict: 'id' }
    )

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        user: authData.user,
        message:
          'Account created. Please check your email to confirm your account.',
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
