import { z } from 'zod'
import { UUID_RE } from '@/lib/constants'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
})

export const applicationSchema = z.object({
  listing_id: z.string().regex(UUID_RE, 'Invalid listing_id format'),
  move_in_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'move_in_date must be YYYY-MM-DD'),
})

export const maintenanceSchema = z.object({
  listing_id: z.string().regex(UUID_RE, 'Invalid listing_id format'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  priority: z.enum(['low', 'medium', 'high', 'emergency']).optional(),
})
