import { supabase } from './supabase'

export async function checkAndInsertUser(id: string, email: string, firstname: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', id)
    .single()
  if (error && error.code !== 'PGRST116') {
    console.error('Error checking user:', error)
    return null
  }

  if (!data) {
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert({ id, email, firstname })
      .single()

    if (insertError) {
      console.error('Error inserting user:', insertError)
      return null
    }

    return insertedUser
  }

  return data
}

export async function getUserData(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user data:', error)
    return null
  }

  return data
}

export async function getUserTeams(userId: string) {
  const { data, error } = await supabase
    .from('team_members')
    .select('team_id, teams(id, name)')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user teams:', error)
    return null
  }

  return data
}

export async function getUserTasks(userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', userId)

  if (error) {
    console.error('Error fetching user tasks:', error)
    return null
  }

  return data
}