import { createClient } from '@/lib/supabase/server'
import { apiError, apiData, requireCSRF } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'
import { UUID_RE } from '@/lib/constants'

interface LeaseListing {
  id: string
  title: string
  description: string | null
  price_monthly: string | number
  currency: string
  location: string | null
  bedrooms: number
  bathrooms: number
  image_urls: string[] | null
}

interface LeaseRow {
  id: string
  listing_id: string
  tenant_id: string
  landlord_id: string
  lease_status: 'pending' | 'active' | 'terminated' | 'expired'
  start_date: string | null
  end_date: string | null
  monthly_rent: string | number | null
  signed_at: string | null
  created_at: string
  listing: LeaseListing | LeaseListing[] | null
}

function toListing(listing: LeaseListing | LeaseListing[] | null) {
  const l = Array.isArray(listing) ? listing[0] ?? null : listing
  if (!l) return null
  return {
    id: l.id,
    price_monthly: Number(l.price_monthly),
    bedrooms: Number(l.bedrooms),
    bathrooms: Number(l.bathrooms),
    title: l.title,
    location: l.location,
    image_urls: l.image_urls ?? [],
  }
}

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
      .maybeSingle()

    if (!profile) return apiError('Profile not found', 404)

    const effectiveRole = roleParam === 'landlord' && profile.role !== 'landlord' && profile.role !== 'admin'
      ? 'tenant'
      : roleParam

    let query = supabase.from('leases').select(`
      id, listing_id, tenant_id, landlord_id, lease_status, start_date, end_date,
      monthly_rent, signed_at, created_at,
      listing:listing_id (
        id, title, description, price_monthly, currency, location, bedrooms, bathrooms, image_urls
      )
    `)

    if (effectiveRole === 'landlord') {
      query = query.eq('landlord_id', user.id)
    } else {
      query = query.eq('tenant_id', user.id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) return apiError(error)

    const mapped = (data ?? []).map((lease: LeaseRow) => ({
      id: lease.id,
      lease_status: lease.lease_status,
      start_date: lease.start_date,
      end_date: lease.end_date,
      monthly_rent: lease.monthly_rent != null ? Number(lease.monthly_rent) : null,
      signed_at: lease.signed_at,
      created_at: lease.created_at,
      listing: toListing(lease.listing),
    }))

    return apiData(mapped)
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

    const listingId = body.listing_id
    if (typeof listingId !== 'string' || !listingId)
      return apiError('listing_id is required', 400)
    if (!UUID_RE.test(listingId))
      return apiError('Invalid listing_id format', 400)

    const tenantId = body.tenant_id
    if (typeof tenantId !== 'string' || !tenantId)
      return apiError('tenant_id is required', 400)
    if (!UUID_RE.test(tenantId))
      return apiError('Invalid tenant_id format', 400)

    const monthlyRent = body.monthly_rent
    if (typeof monthlyRent !== 'number' || !Number.isFinite(monthlyRent))
      return apiError('monthly_rent is required', 400)

    const { data: listing } = await supabase
      .from('listings')
      .select('landlord_id')
      .eq('id', listingId)
      .maybeSingle()

    if (!listing || listing.landlord_id !== user.id)
      return apiError('You do not own this listing', 403)

    const { data, error } = await supabase
      .from('leases')
      .insert({
        listing_id: listingId,
        tenant_id: tenantId,
        landlord_id: user.id,
        start_date: body.start_date ?? null,
        end_date: body.end_date ?? null,
        monthly_rent: monthlyRent,
      })
      .select()
      .single()

    if (error) return apiError(error)

    return apiData(data, 201)
  } catch (err) {
    return apiError(err, 401)
  }
}