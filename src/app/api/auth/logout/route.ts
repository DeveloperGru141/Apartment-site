import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiError } from '@/lib/api/response'

export async function POST() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) return apiError(error)

    return NextResponse.json({ message: 'Signed out successfully' })
  } catch (err) {
    return apiError(err)
  }
}
