import { createClient } from '@/lib/supabase/server'
import { apiData, apiError } from '@/lib/api/response'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
        units (
          id, unit_number, floor, bedrooms, bathrooms,
          square_feet, rent_price, deposit_amount,
          available_from, status, amenities, images
        ),
        landlord:profiles (
          id, full_name, avatar_url, phone, email
        )
      `)
      .eq('id', id)
      .single()

    if (error) return apiError('Property not found', 404)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && property.landlord) {
      property.landlord = {
        id: property.landlord.id,
        full_name: property.landlord.full_name,
        avatar_url: property.landlord.avatar_url,
      }
    }

    return apiData(property)
  } catch (err) {
    return apiError(err)
  }
}
