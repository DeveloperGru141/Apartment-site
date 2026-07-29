import { createClient } from '@/lib/supabase/server'
import { apiData, apiError } from '@/lib/api/response'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        id, title, description, price_monthly, currency, location,
        bedrooms, bathrooms, sqft, amenities, image_urls, status,
        is_verified, created_at, updated_at,
        landlord:profiles (id, full_name, avatar_url)
      `)
      .eq('id', id)
      .single()

    if (error) return apiError('Listing not found', 404)

    return apiData(listing)
  } catch (err) {
    return apiError(err)
  }
}
