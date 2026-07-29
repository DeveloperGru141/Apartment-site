import { createClient } from '@/lib/supabase/server'
import { apiData, apiError } from '@/lib/api/response'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        *,
        landlord:profiles (
          id, full_name, avatar_url, phone
        )
      `)
      .eq('id', id)
      .single()

    if (error) return apiError('Listing not found', 404)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && listing.landlord) {
      listing.landlord = {
        id: listing.landlord.id,
        full_name: listing.landlord.full_name,
        avatar_url: listing.landlord.avatar_url,
      }
    }

    return apiData(listing)
  } catch (err) {
    return apiError(err)
  }
}
