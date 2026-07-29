import { createClient } from '@/lib/supabase/server'
import { apiError, apiPaginated, getPagination, buildPagination } from '@/lib/api/response'

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
      .select('id, title, description, price_monthly, currency, location, bedrooms, bathrooms, sqft, amenities, image_urls, status, created_at', { count: 'exact' })
      .in('status', ['active'])
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (location) query = query.ilike('location', `%${location}%`)
    if (bedrooms) query = query.gte('bedrooms', Number(bedrooms))
    if (bathrooms) query = query.gte('bathrooms', Number(bathrooms))
    if (minPrice) query = query.gte('price_monthly', Number(minPrice))
    if (maxPrice) query = query.lte('price_monthly', Number(maxPrice))

    const { data, error, count } = await query

    if (error) return apiError(error)

    return apiPaginated(data ?? [], buildPagination(page, limit, count ?? 0))
  } catch (err) {
    return apiError(err)
  }
}
