import { z } from 'zod'
import { UUID_RE } from '@/lib/constants'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
})

export const applicationSchema = z.object({
  unit_id: z.string().regex(UUID_RE, 'Invalid unit_id format'),
  move_in_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'move_in_date must be YYYY-MM-DD'),
})

export const maintenanceSchema = z.object({
  unit_id: z.string().regex(UUID_RE, 'Invalid unit_id format'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  priority: z.enum(['low', 'medium', 'high', 'emergency']).optional(),
})

export const reviewSchema = z.object({
  property_id: z.string().regex(UUID_RE, 'Invalid property_id format'),
  lease_id: z.string().regex(UUID_RE, 'Invalid lease_id format'),
  overall_rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().max(5000).optional(),
})

export const profileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  avatar_url: z.string().url().max(500).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
export type MaintenanceInput = z.infer<typeof maintenanceSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ProfileInput = z.infer<typeof profileSchema>
