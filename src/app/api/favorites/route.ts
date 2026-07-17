import { createClient } from '@/lib/supabase/server'
import { apiError, apiData } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('favorites')
      .select(
        'id, created_at, unit:units(id, rent_price, bedrooms, bathrooms, images, property:properties(id, title, city, state, images, property_type))'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return apiError(error)

    return apiData(data ?? [])
  } catch (err) {
    return apiError(err, 401)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    if (!body.unit_id) return apiError('unit_id is required', 400)

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, unit_id: body.unit_id })
      .select()
      .single()

    if (error) {
      if (error.message?.includes('duplicate') || error.code === '23505')
        return apiError('Already in favorites', 409)
      if (error.code === '23503')
        return apiError('Unit not found', 404)
      return apiError(error)
    }

    return apiData(data, 201)
  } catch (err) {
    return apiError(err, 401)
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    if (!body.unit_id) return apiError('unit_id is required', 400)

    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('unit_id', body.unit_id)
      .maybeSingle()

    if (!existing) return apiError('Favorite not found', 404)

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('unit_id', body.unit_id)

    if (error) return apiError(error)

    return apiData({ message: 'Removed from favorites' })
  } catch (err) {
    return apiError(err, 401)
  }
}
