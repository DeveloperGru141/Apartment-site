import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get('limit') ?? '12'))
    )
    const offset = (page - 1) * limit

    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const propertyType = searchParams.get('property_type')
    const minRent = searchParams.get('min_rent')
    const maxRent = searchParams.get('max_rent')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const available = searchParams.get('available') !== 'false'

    let query = supabase
      .from('properties')
      .select(
        'id, title, slug, description, city, state, address, property_type, cover_image, amenities, created_at',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (city) query = query.ilike('city', `%${city}%`)
    if (state) query = query.eq('state', state)
    if (propertyType) query = query.eq('property_type', propertyType)
    if (available) query = query.eq('is_published', true)

    // Bedroom / bathroom / rent filters require joining the cheapest available unit.
    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Enrich with unit-based pricing + room filters.
    let properties = data ?? []

    if (bedrooms || bathrooms || minRent || maxRent) {
      const ids = properties.map((p) => p.id)
      const { data: units } = await supabase
        .from('units')
        .select('property_id, monthly_rent, bedrooms, bathrooms, is_available')
        .in('property_id', ids)

      const byProperty = new Map<string, typeof units>()
      for (const u of units ?? []) {
        const arr = byProperty.get(u.property_id) ?? []
        arr.push(u)
        byProperty.set(u.property_id, arr)
      }

      properties = properties.filter((p) => {
        const us = byProperty.get(p.id) ?? []
        if (bedrooms && !us.some((u) => u.bedrooms >= Number(bedrooms)))
          return false
        if (bathrooms && !us.some((u) => u.bathrooms >= Number(bathrooms)))
          return false
        if (minRent) {
          const min = Math.min(
            ...us.filter((u) => u.is_available).map((u) => u.monthly_rent)
          )
          if (Number.isNaN(min) || min < Number(minRent)) return false
        }
        if (maxRent) {
          const min = Math.min(
            ...us.filter((u) => u.is_available).map((u) => u.monthly_rent)
          )
          if (Number.isNaN(min) || min > Number(maxRent)) return false
        }
        return true
      })
    }

    return NextResponse.json({
      data: properties,
      pagination: {
        page,
        limit,
        total: count ?? properties.length,
        totalPages: Math.ceil((count ?? properties.length) / limit),
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { role } = profile
    if (role !== 'landlord' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Only landlords can create properties' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...body,
        landlord_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
