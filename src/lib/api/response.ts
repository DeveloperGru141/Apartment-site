import { NextResponse } from 'next/server'

export function redirect(url: string) {
  return NextResponse.redirect(url)
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
