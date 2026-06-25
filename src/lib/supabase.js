import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://rpjmqmmjujvqomiqoacz.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_cFVkpyPFB3mwgt1ZGS1Vjw_q-I-yRMw"
const SUPABASE_BUCKET = "MMJ Pictures"

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

export const ADMIN_EMAILS = ["righteouswebdev@gmail.com", "test@gmail.com"]

// Check if user has a specific role
export async function hasRole(userId, role) {
  const { data, error } = await supabase.rpc('has_role', {
    _user_id: userId,
    _role: role
  })
  if (error) {
    console.error('Error checking role:', error)
    return false
  }
  return data
}

// Get user roles
export async function getUserRoles(userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error fetching user roles:', error)
    return []
  }
  
  return data?.map(r => r.role) || []
}

export { SUPABASE_BUCKET, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY }
