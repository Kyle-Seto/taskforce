export const GAME_CONSTANTS = {
  LEVELS: Array.from({ length: 100 }, (_, i) => i + 1).reduce((acc, level) => {
    acc[level] = {
      // Damage to boss increases with each level
      BOSS_DAMAGE: Math.floor(10 * Math.pow(1.1, level)),
      
      // XP reward multiplier increases slightly with each level
      XP_REWARD_MULTIPLIER: 1 + (level - 1) * 0.05,
      
      // XP needed to level up increases exponentially
      XP_TO_NEXT_LEVEL: Math.floor(100 * Math.pow(1.5, level)),
    };
    return acc;
  }, {} as Record<number, { BOSS_DAMAGE: number; XP_REWARD_MULTIPLIER: number; XP_TO_NEXT_LEVEL: number }>),

  // Base XP reward for completing a task
  BASE_TASK_XP_REWARD: 50,
};

