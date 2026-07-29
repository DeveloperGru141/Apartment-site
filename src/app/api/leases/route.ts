import { createClient } from '@/lib/supabase/server'
import { apiError, apiData, requireCSRF } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const roleParam = searchParams.get('role') ?? 'tenant'

    if (!['tenant', 'landlord'].includes(roleParam))
      return apiError('Invalid role query param; use tenant or landlord', 400)

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) return apiError('Profile not found', 404)

    const effectiveRole = roleParam === 'landlord' && profile.role !== 'landlord' && profile.role !== 'admin'
      ? 'tenant'
      : roleParam

    let query = supabase.from('leases').select(
      `id, status, start_date, end_date, rent_amount, deposit_amount,
       signed_by_tenant_at, signed_by_landlord_at, created_at,
       unit:units(id, rent_price, bedrooms, bathrooms,
         property:properties(title, city, state, images))`
    )

    if (effectiveRole === 'landlord') {
      query = query.eq('landlord_id', user.id)
    } else {
      query = query.eq('tenant_id', user.id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

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

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    if (!body.unit_id || !body.tenant_id)
      return apiError('unit_id and tenant_id are required', 400)

    const allowed = {
      unit_id: body.unit_id,
      tenant_id: body.tenant_id,
      start_date: body.start_date ?? null,
      end_date: body.end_date ?? null,
      rent_amount: body.rent_amount ?? null,
      deposit_amount: body.deposit_amount ?? null,
      rent_due_day: body.rent_due_day ?? null,
      terms: body.terms ?? null,
      landlord_id: user.id,
    }

    const { data, error } = await supabase
      .from('leases')
      .insert(allowed)
      .select()
      .single()

    if (error) return apiError(error)

    return apiData(data, 201)
  } catch (err) {
    return apiError(err, 401)
  }
}
