import { createClient } from '@/lib/supabase/server'
import { apiError, apiData, apiPaginated, getPagination, buildPagination } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'

const VALID_TYPES = ['apartment', 'condo', 'house', 'townhouse', 'loft', 'studio']

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const { page, limit, offset } = getPagination(searchParams)

    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const propertyType = searchParams.get('property_type')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')

    let query = supabase
      .from('properties')
      .select(
        'id, title, description, city, state, address_line1, property_type, images, amenities, status, created_at',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (city) query = query.ilike('city', `%${city}%`)
    if (state) query = query.eq('state', state)
    if (propertyType) query = query.eq('property_type', propertyType)

    query = query.in('status', ['active'])

    let { data, error, count } = await query

    if (error) return apiError(error)

    let properties = data ?? []

    if (bedrooms || bathrooms) {
      const ids = properties.map((p) => p.id)
      const { data: units, error: unitsErr } = await supabase
        .from('units')
        .select('property_id, rent_price, bedrooms, bathrooms, status')
        .in('property_id', ids)

      if (unitsErr) return apiError(unitsErr)

      const byProperty = new Map<string, typeof units>()
      for (const u of units ?? []) {
        const arr = byProperty.get(u.property_id) ?? []
        arr.push(u)
        byProperty.set(u.property_id, arr)
      }

      properties = properties.filter((p) => {
        const us = byProperty.get(p.id) ?? []
        const available = us.filter((u) => u.status === 'active')
        if (bedrooms && !available.some((u) => u.bedrooms >= Number(bedrooms)))
          return false
        if (bathrooms && !available.some((u) => u.bathrooms >= Number(bathrooms)))
          return false
        return true
      })

      count = properties.length
    }

    return apiPaginated(properties, buildPagination(page, limit, count ?? 0))
  } catch (err) {
    return apiError(err)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'landlord' && profile.role !== 'admin'))
      return apiError('Only landlords can create properties', 403)

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    if (!body.title || !body.property_type || !body.address_line1 || !body.city || !body.state || !body.zip_code)
      return apiError('title, property_type, address_line1, city, state, and zip_code are required', 400)

    if (body.property_type && !VALID_TYPES.includes(String(body.property_type)))
      return apiError(`property_type must be one of: ${VALID_TYPES.join(', ')}`, 400)

    const { data, error } = await supabase
      .from('properties')
      .insert({ ...body, landlord_id: user.id })
      .select()
      .single()

    if (error) return apiError(error)

    return apiData(data, 201)
  } catch (err) {
    return apiError(err)
  }
}
