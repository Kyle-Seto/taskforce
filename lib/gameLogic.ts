import { GAME_CONSTANTS } from '@/lib/constants';

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