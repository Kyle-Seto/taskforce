import { supabase } from '@/lib/supabase';
import { Task, User, Boss, Team } from '@/lib/types';
import { getBossDamage, calculateTaskXpReward, calculateLevelUp } from '@/lib/gameLogic';
import { toast } from "@/hooks/use-toast";

export async function completeTask(task: Task, user: User, boss: Boss, team: Team) {

  const xpReward = calculateTaskXpReward(task.xp_difficulty_multiplier, user.level);
  const damageDealt = getBossDamage(user.level);

  const updatedXp = user.xp + xpReward;
  const newTotalDamage = user.total_damage_dealt + damageDealt;

  const { xp: newXp, level: newLevel } = calculateLevelUp(updatedXp, user.level);

  // Update task
  const { data: updatedTask, error: taskError } = await supabase
    .from('tasks')
    .upsert({ 
      id: task.id,
      assigned_to: user.id,
      is_completed: true,
      description: task.description,
      date: new Date().toISOString().split('T')[0]
    })
    .select();

  if (taskError) throw taskError;

  // Update user stats
  const { data: updatedUser, error: userUpdateError } = await supabase
    .from('users')
    .upsert({ 
      id: user.id,
      xp: newXp, 
      level: newLevel, 
      total_damage_dealt: newTotalDamage 
    })
    .select();

  if (userUpdateError) throw userUpdateError;

  const updated_current_hp = boss.current_hp - damageDealt;
  if (updated_current_hp <= 0) {
    await handleBossDefeat(team, boss);
  } else {
    const { data: updatedBoss, error: updateBossError } = await supabase
      .from('bosses')
      .upsert({ 
        id: boss.id,
        current_hp: updated_current_hp,
        max_hp: boss.max_hp,
        name: boss.name,
        subtitle: boss.subtitle,
        image_url: boss.image_url
      })
      .select();

    if (updateBossError) throw updateBossError;
  }

  // Show toast notification for damage dealt and XP gained
  toast({
    title: "Task Completed!",
    description: `You dealt ${damageDealt} damage and gained ${xpReward} XP.`,
  });

  // If the user leveled up, show another toast
  if (newLevel > user.level) {
    toast({
      title: "Level Up!",
      description: `Congratulations! You've reached level ${newLevel}!`,
    });
  }

  return;
}

async function handleBossDefeat(team: any, boss: Boss) {
  const teamXpReward = 1000; // Adjust as needed

  // Reset boss HP
  const { data: updatedBoss, error: resetBossError } = await supabase
    .from('bosses')
    .upsert({ 
      id: boss.id,
      current_hp: boss.max_hp,
      max_hp: boss.max_hp,
      name: boss.name,
      subtitle: boss.subtitle,
      image_url: boss.image_url
    })
    .select();

  if (resetBossError) throw resetBossError;
  const updatedUsers = team.team_members.map((member: any) => {
    const { xp, level } = calculateLevelUp(member.users.xp + teamXpReward, member.users.level);
    return { 
      id: member.users.id, 
      xp, 
      level, 
      email: member.users.email, 
      firstname: member.users.firstname,
      total_damage_dealt: member.users.total_damage_dealt
    };
  });

  const { data: updatedTeamUsers, error: upsertError } = await supabase
    .from('users')
    .upsert(updatedUsers)
    .select();

  if (upsertError) throw upsertError;
}