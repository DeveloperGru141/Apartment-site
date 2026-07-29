import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiError, requireCSRF } from '@/lib/api/response'

export async function POST(request: Request) {
  try {
    const csrf = requireCSRF(request)
    if (csrf) return csrf

    const response = NextResponse.json({ message: 'Signed out successfully' })
    const supabase = await createClient(response)
    const { error } = await supabase.auth.signOut()

    if (error) return apiError(error)

    return response
  } catch (err) {
    return apiError(err)
  }
}
