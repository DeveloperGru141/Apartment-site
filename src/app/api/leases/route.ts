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
      `id, lease_status, start_date, end_date, monthly_rent,
       signed_at, created_at,
       listing:listings(id, price_monthly, bedrooms, bathrooms,
         title, location, image_urls)`
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

    if (!body.listing_id)
      return apiError('listing_id is required', 400)

    const { data: listing } = await supabase
      .from('listings')
      .select('id, landlord_id')
      .eq('id', body.listing_id)
      .single()

    if (!listing) return apiError('Listing not found', 404)
    if (listing.landlord_id !== user.id)
      return apiError('You do not own this listing', 403)

    const targetTenantId = body.tenant_id as string | undefined
    if (!targetTenantId)
      return apiError('tenant_id is required', 400)

    const allowed = {
      listing_id: listing.id,
      tenant_id: targetTenantId,
      landlord_id: user.id,
      start_date: body.start_date ?? null,
      end_date: body.end_date ?? null,
      monthly_rent: body.monthly_rent ?? null,
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
