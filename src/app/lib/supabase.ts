import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Profile {
  id: string
  onboarding_step: string
  onboarding_complete: boolean
  interests: string[]
  sub_interests: string[]
  dealbreakers: string[]
  created_at: string
}

export interface Taxonomy {
  id: string
  name: string
  parent_id?: string
  level: number
  created_at: string
}

export interface UserTaxonomy {
  id: string
  user_id: string
  taxonomy_id: string
  type: 'interest' | 'sub_interest' | 'dealbreaker'
  created_at: string
}

// Database helper functions
export const createProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        onboarding_step: 'interests',
        onboarding_complete: false,
        interests: [],
        sub_interests: [],
        dealbreakers: []
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getInterests = async () => {
  const { data, error } = await supabase
    .from('v_interests')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export const getSubInterests = async (parentIds?: string[]) => {
  let query = supabase
    .from('v_sub_interests')
    .select('*')
    .order('name', { ascending: true })

  if (parentIds && parentIds.length > 0) {
    query = query.in('parent_id', parentIds)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export const saveUserSelections = async (
  userId: string,
  selections: { id: string; type: 'interest' | 'sub_interest' | 'dealbreaker' }[]
) => {
  // First, clear existing selections
  await supabase
    .from('user_taxonomies')
    .delete()
    .eq('user_id', userId)

  // Then insert new selections
  if (selections.length > 0) {
    const { error } = await supabase
      .from('user_taxonomies')
      .insert(
        selections.map(selection => ({
          user_id: userId,
          taxonomy_id: selection.id,
          type: selection.type
        }))
      )

    if (error) throw error
  }
}