import { GAME_CONSTANTS } from '@/lib/constants';

export function getBossDamage(level: number): number {
  const baseDamage = GAME_CONSTANTS.LEVELS[level]?.BOSS_DAMAGE || GAME_CONSTANTS.LEVELS[1].BOSS_DAMAGE;
  const variationPercentage = 0.2; // 20% variation
  const randomFactor = 1 + (Math.random() * 2 - 1) * variationPercentage;
  return Math.floor(baseDamage * randomFactor);
}

export function getXpRewardMultiplier(level: number): number {
  return GAME_CONSTANTS.LEVELS[level]?.XP_REWARD_MULTIPLIER || GAME_CONSTANTS.LEVELS[1].XP_REWARD_MULTIPLIER;
}

export function getXpToNextLevel(level: number): number {
  return GAME_CONSTANTS.LEVELS[level]?.XP_TO_NEXT_LEVEL || GAME_CONSTANTS.LEVELS[1].XP_TO_NEXT_LEVEL;
}

export function calculateTaskXpReward(xpDifficultyMultiplier: number, level: number): number {
  const baseXp = GAME_CONSTANTS.BASE_TASK_XP_REWARD;
  const levelMultiplier = getXpRewardMultiplier(level);
  return Math.floor(baseXp * xpDifficultyMultiplier * levelMultiplier);
}

export function calculateLevelUp(currentXp: number, currentLevel: number): { xp: number, level: number } {
  let xp = currentXp;
  let level = currentLevel;

  while (xp >= getXpToNextLevel(level)) {
    xp -= getXpToNextLevel(level);
    level++;
  }

  return { xp, level };
}