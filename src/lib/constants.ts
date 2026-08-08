export const PUBLIC_ROUTES = ['/', '/login', '/signup', '/legal', '/listings'] as const

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || (route !== '/' && pathname.startsWith(`${route}/`))
  )
}

export function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/signup'
}

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function safeRedirectPath(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next) return fallback
  if (!next.startsWith("/")) return fallback
  if (next.startsWith("//")) return fallback
  if (next.includes("\\")) return fallback
  if (next.includes("://")) return fallback
  return next
}
