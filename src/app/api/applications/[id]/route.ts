import { createClient } from '@/lib/supabase/server'
import { apiError, apiData } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('applications')
      .select('*, unit:units(id, rent_price, bedrooms, bathrooms, square_feet, images, property:properties(title, city, state, address_line1))')
      .eq('id', id)
      .single()

    if (error) return apiError('Application not found', 404)

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'tenant' && data.applicant_id !== user.id) {
      return apiError('Application not found', 404)
    }

    return apiData(data)
  } catch (err) {
    return apiError(err, 401)
  }
}
