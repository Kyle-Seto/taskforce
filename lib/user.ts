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


    // Just for testing
    // Just for testing
    // Just for testing
    // Just for testing
    // Early development stage: Automatically add user to a default team
    // TODO: Remove this in production and implement proper team joining logic
    const defaultTeamId = '57c6ae57-200e-49b3-8983-e181d84440ce';
    const { error: teamMemberError } = await supabase
      .from('team_members')
      .insert({ team_id: defaultTeamId, user_id: id });

    if (teamMemberError) {
      console.error('Error adding user to default team:', teamMemberError);
      // Note: We're not returning null here to allow user creation to proceed
    }
    // Early development stage: Automatically add default tasks for the user
    // TODO: Remove this in production and implement proper task assignment logic
    const defaultTasks = [
      { description: 'Complete onboarding', xp_reward: 100 },
      { description: 'Set up profile', xp_reward: 50 },
      { description: 'Join team chat', xp_reward: 50 },
    ];

    for (const task of defaultTasks) {
      const { error: taskError } = await supabase
        .from('tasks')
        .insert({
          team_id: defaultTeamId,
          assigned_to: id,
          description: task.description,
          xp_reward: task.xp_reward,
          date: new Date().toISOString().split('T')[0], // Current date
        });

      if (taskError) {
        console.error('Error adding default task:', taskError);
        // Note: We're not returning null here to allow user creation to proceed
      }
    }
    // Just for testing
    // Just for testing
    // Just for testing
    // Just for testing





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
    .select(`
      team_id,
      teams (
        id,
        name,
        team_members (
          user_id,
          users (
            id,
            firstname,
            level,
            xp,
            total_damage_dealt
          )
        )
      )
    `)
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

export async function getTeamTasks(teamId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('team_id', teamId)

  if (error) {
    console.error('Error fetching team tasks:', error)
    return null
  }

  return data
}