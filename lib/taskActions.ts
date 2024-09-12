import { supabase } from '@/lib/supabase';
import { Task } from '@/lib/types';
import { User } from '@clerk/nextjs/server';
import { getBossDamage, calculateTaskXpReward, getXpToNextLevel } from '@/lib/gameLogic';

export async function completeTask(task: Task, user: User) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError) throw userError;

  const { xp, level, total_damage } = userData;
  const xpReward = calculateTaskXpReward(task.xp_difficulty_multiplier, level);
  const damageDealt = getBossDamage(level);

  const newXp = xp + xpReward;
  const newTotalDamage = total_damage + damageDealt;

  let newLevel = level;
  let remainingXp = newXp;

  while (remainingXp >= getXpToNextLevel(newLevel)) {
    remainingXp -= getXpToNextLevel(newLevel);
    newLevel++;
  }

  // Update task
  await supabase
    .from('tasks')
    .update({ is_completed: true })
    .eq('id', task.id);

  // Update user stats
  await supabase
    .from('users')
    .update({ xp: remainingXp, level: newLevel, total_damage: newTotalDamage })
    .eq('id', user.id);

  // Update boss HP
  const { data: bossData, error: bossError } = await supabase
    .from('bosses')
    .select('*')
    .eq('id', userData.team_id)
    .single();

  if (bossError) throw bossError;

  let { current_hp, max_hp } = bossData;
  current_hp -= damageDealt;

  if (current_hp <= 0) {
    await handleBossDefeat(userData.team_id, max_hp);
  } else {
    await supabase
      .from('bosses')
      .update({ current_hp })
      .eq('id', bossData.id);
  }
}

async function handleBossDefeat(teamId: string, maxHp: number) {
  const teamXpReward = 1000; // Adjust as needed

  // Reset boss HP
  await supabase
    .from('bosses')
    .update({ current_hp: maxHp })
    .eq('id', teamId);

  // Reward team XP
  const { data: teamData, error: teamError } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId);

  if (teamError) throw teamError;

  for (const { user_id } of teamData) {
    await supabase.rpc('add_user_xp', { user_id, xp_amount: teamXpReward });
  }
}