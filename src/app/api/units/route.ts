import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = await createClient()
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit
    
    let query = supabase
      .from('active_listings')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('rent_price', { ascending: true })

    // Filters
    const city = searchParams.get('city')
    if (city) query = query.ilike('city', `%${city}%`)
    
    const state = searchParams.get('state')
    if (state) query = query.eq('state', state)
    
    const minPrice = searchParams.get('minPrice')
    if (minPrice) query = query.gte('rent_price', parseInt(minPrice))
    
    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) query = query.lte('rent_price', parseInt(maxPrice))
    
    const bedrooms = searchParams.get('bedrooms')
    if (bedrooms) query = query.gte('bedrooms', parseFloat(bedrooms))
    
    const propertyType = searchParams.get('propertyType')
    if (propertyType) query = query.eq('property_type', propertyType)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}