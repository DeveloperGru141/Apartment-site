import { NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[]

export function requireCSRF(request: Request): Response | null {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  if (origin && !ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (referer && !ALLOWED_ORIGINS.some(o => referer.startsWith(o))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

export function apiError(error: unknown, status?: number) {
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: status || 400 })
  }
  return NextResponse.json({ error: String(error) }, { status: status || 400 })
}

export function apiData(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status })
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function getPagination(searchParams: URLSearchParams): {
  page: number
  limit: number
  offset: number
} {
  const page = Math.max(1, Number(searchParams.get('page'))) || 1
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit'))) || 12)
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

export function buildPagination(page: number, limit: number, total: number): Pagination {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  return { page, limit, total, totalPages }
}

export function apiPaginated(data: unknown, pagination: Pagination) {
  return NextResponse.json({ data, pagination })
}
