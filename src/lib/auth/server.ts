import { createClient } from '@/lib/supabase/server'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  
  return user
}

export async function getProfile() {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) return null
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('Error getting profile:', error)
    return null
  }
  
  return profile
}

export async function getUserRole() {
  const profile = await getProfile()
  return profile?.role ?? 'tenant'
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireRole(roles: string | string[]) {
  const user = await requireAuth()
  const profile = await getProfile()
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  if (!profile || !allowedRoles.includes(profile.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return { user, profile }
}

