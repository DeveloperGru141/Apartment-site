import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiError } from '@/lib/api/response'

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Signed out successfully' })
    const supabase = await createClient(response)
    const { error } = await supabase.auth.signOut()

    if (error) return apiError(error)

    return response
  } catch (err) {
    return apiError(err)
  }
}
