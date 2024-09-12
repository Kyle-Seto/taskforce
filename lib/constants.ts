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

export function getBossDamage(level: number): number {
  return GAME_CONSTANTS.LEVELS[level]?.BOSS_DAMAGE || GAME_CONSTANTS.LEVELS[1].BOSS_DAMAGE;
}

export function getXpRewardMultiplier(level: number): number {
  return GAME_CONSTANTS.LEVELS[level]?.XP_REWARD_MULTIPLIER || GAME_CONSTANTS.LEVELS[1].XP_REWARD_MULTIPLIER;
}

export function getXpToNextLevel(level: number): number {
  return GAME_CONSTANTS.LEVELS[level]?.XP_TO_NEXT_LEVEL || GAME_CONSTANTS.LEVELS[1].XP_TO_NEXT_LEVEL;
}

export function calculateTaskXpReward(level: number): number {
  return Math.floor(GAME_CONSTANTS.BASE_TASK_XP_REWARD * getXpRewardMultiplier(level));
}