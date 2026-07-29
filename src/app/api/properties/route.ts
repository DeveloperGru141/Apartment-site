import { createClient } from '@/lib/supabase/server'
import { apiError, apiData, apiPaginated, getPagination, buildPagination, requireCSRF } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const { page, limit, offset } = getPagination(searchParams)

    const location = searchParams.get('location')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')

    let query = supabase
      .from('listings')
      .select(
        'id, title, description, price_monthly, currency, location, bedrooms, bathrooms, sqft, amenities, image_urls, status, created_at',
        { count: 'exact' }
      )
      .in('status', ['active'])
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (location) query = query.ilike('location', `%${location}%`)
    if (bedrooms) query = query.gte('bedrooms', Number(bedrooms))
    if (bathrooms) query = query.gte('bathrooms', Number(bathrooms))
    if (minPrice) query = query.gte('price_monthly', Number(minPrice))
    if (maxPrice) query = query.lte('price_monthly', Number(maxPrice))

    let { data, error, count } = await query

    if (error) return apiError(error)

    return apiPaginated(data ?? [], buildPagination(page, limit, count ?? 0))
  } catch (err) {
    return apiError(err)
  }
}

export async function POST(request: Request) {
  try {
    const csrf = requireCSRF(request)
    if (csrf) return csrf

    const user = await requireAuth()
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'landlord' && profile.role !== 'admin'))
      return apiError('Only landlords can create listings', 403)

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    if (!body.title || !body.price_monthly)
      return apiError('title and price_monthly are required', 400)

    const allowed = {
      title: body.title,
      description: body.description ?? null,
      price_monthly: body.price_monthly,
      currency: body.currency ?? 'USD',
      location: body.location ?? null,
      bedrooms: body.bedrooms ?? 0,
      bathrooms: body.bathrooms ?? 0,
      sqft: body.sqft ?? null,
      amenities: body.amenities ?? [],
      image_urls: body.image_urls ?? [],
      status: 'draft',
      landlord_id: user.id,
    }

    const { data, error } = await supabase
      .from('listings')
      .insert(allowed)
      .select()
      .single()

    if (error) return apiError(error)

    return apiData(data, 201)
  } catch (err) {
    return apiError(err)
  }
}
