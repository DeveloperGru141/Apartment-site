import { createClient } from '@/lib/supabase/server'
import { apiError, apiData, requireCSRF } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'
import { applicationSchema } from '@/lib/validations/schemas'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const unitId = searchParams.get('unit_id')

    let query = supabase
      .from('applications')
      .select(
        '*, unit:units(id, rent_price, bedrooms, bathrooms, property:properties(title, city, state))'
      )
      .order('created_at', { ascending: false })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'tenant') {
      query = query.eq('applicant_id', user.id)
    }

    if (unitId) query = query.eq('unit_id', unitId)

    const { data, error } = await query

    if (error) return apiError(error)

    return apiData(data ?? [])
  } catch (err) {
    return apiError(err, 401)
  }
}

export async function POST(request: Request) {
  try {
    const csrf = requireCSRF(request)
    if (csrf) return csrf

    const user = await requireAuth()
    const supabase = await createClient()

    let raw: unknown
    try {
      raw = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    const parsed = applicationSchema.safeParse(raw)
    if (!parsed.success)
      return apiError(parsed.error.issues[0].message, 400)

    const { data, error } = await supabase
      .from('applications')
      .insert({ ...parsed.data, applicant_id: user.id })
      .select()
      .single()

    if (error) return apiError(error)

    return apiData(data, 201)
  } catch (err) {
    return apiError(err, 401)
  }
}
