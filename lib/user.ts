import { supabase } from './supabase'
import { calculateTaskXpReward, getBossDamage, getXpToNextLevel } from './gameLogic'
import { Team } from './types'

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
      { description: 'Complete onboarding', xp_difficulty_multiplier: 2 },
      { description: 'Set up profile', xp_difficulty_multiplier: 1 },
      { description: 'Join team chat', xp_difficulty_multiplier: 1 },
      { description: 'Brush your teeth', xp_difficulty_multiplier: 1 },
      { description: 'Make your bed', xp_difficulty_multiplier: 1 },
      { description: 'Solve 3 Leetcode problems', xp_difficulty_multiplier: 1.5},
    ];

    for (const task of defaultTasks) {
      const { error: taskError } = await supabase
        .from('tasks')
        .insert({
          team_id: defaultTeamId,
          assigned_to: id,
          description: task.description,
          xp_difficulty_multiplier: task.xp_difficulty_multiplier,
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

  return data.map(item => item.teams) as unknown as Team[]
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

export async function completeTask(userId: string, taskId: string) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('Error fetching user data:', userError);
    return null;
  }

  const { data: taskData, error: taskError } = await supabase
    .from('tasks')
    .select('xp_difficulty_multiplier')
    .eq('id', taskId)
    .single();

  if (taskError) {
    console.error('Error fetching task data:', taskError);
    return null;
  }

  const xpReward = calculateTaskXpReward(taskData.xp_difficulty_multiplier, userData.level);
  const bossDamage = getBossDamage(userData.level);

  let newXp = userData.xp + xpReward;
  let newLevel = userData.level;
  let xpToNextLevel = getXpToNextLevel(newLevel);

  while (newXp >= xpToNextLevel) {
    newLevel++;
    newXp -= xpToNextLevel;
    xpToNextLevel = getXpToNextLevel(newLevel);
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      xp: newXp,
      level: newLevel,
      total_damage_dealt: userData.total_damage_dealt + bossDamage
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user data:', error);
    return null;
  }

  // Update task completion status
  const { error: taskUpdateError } = await supabase
    .from('tasks')
    .update({ is_completed: true })
    .eq('id', taskId);

  if (taskUpdateError) {
    console.error('Error updating task completion:', taskUpdateError);
  }

  // TODO: Update boss health in the database

  return data;
}

export async function getBossData(teamId: string) {
  // First, get the current boss ID for the team
  const { data: teamData, error: teamError } = await supabase
    .from('teams')
    .select('current_boss_id')
    .eq('id', teamId)
    .single()
  if (teamError) {
    console.error('Error fetching team data:', teamError)
    return null
  }

  if (!teamData || !teamData.current_boss_id) {
    console.error('No current boss found for the team')
    return null
  }

  // Now fetch the boss data using the current_boss_id
  const { data: bossData, error: bossError } = await supabase
    .from('bosses')
    .select('*')
    .eq('id', teamData.current_boss_id)
    .single()

  if (bossError) {
    console.error('Error fetching boss data:', bossError)
    return null
  }

  return bossData
}