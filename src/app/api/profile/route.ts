import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/server'
import { apiData, apiError, requireCSRF } from '@/lib/api/response'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) return apiError(error)

    if (!profile) return apiError('Profile not found', 404)

    return apiData(profile)
  } catch (err) {
    return apiError(err, 401)
  }
}

export async function PATCH(request: Request) {
  try {
    const csrf = requireCSRF(request)
    if (csrf) return csrf

    const user = await requireAuth()
    const supabase = await createClient()

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    const allowedFields = [
      'full_name', 'phone', 'avatar_url', 'date_of_birth',
      'emergency_contact_name', 'emergency_contact_phone',
      'employer', 'annual_income',
    ] as const

    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0)
      return apiError('No valid fields to update', 400)

    updates.updated_at = new Date().toISOString()

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .maybeSingle()

    if (error) return apiError(error)
    if (!profile) return apiError('Profile not found', 404)

    return apiData(profile)
  } catch (err) {
    return apiError(err, 401)
  }
}
