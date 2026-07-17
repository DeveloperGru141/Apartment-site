import { z } from 'zod'
import { apiError } from '@/lib/api/response'

export async function parseBody<T>(request: Request, schema: z.ZodSchema<T>): Promise<T> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    throw { _zod: true, status: 400, message: 'Invalid JSON body' }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const first = result.error.issues[0]
    throw { _zod: true, status: 400, message: first.message }
  }

  return result.data
}

export function zodError(err: unknown) {
  if (err && typeof err === 'object' && '_zod' in err) {
    const e = err as Record<string, unknown>
    return apiError(String(e.message), Number(e.status))
  }
  return null
}
