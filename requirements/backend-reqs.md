# Backend Details: MMO RPG Daily Tasks Web App

## Project Overview
This document outlines the backend architecture and implementation details for the MMO RPG daily tasks web application, with a focus on team-based gameplay and team-specific leaderboards.

## Technology Stack
- Next.js 14 (API Routes for serverless functions)
- Supabase (PostgreSQL database)
- Clerk (Authentication)

## Database Schema (Supabase)

-- Step 1: Create users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_damage_dealt INTEGER DEFAULT 0
);

-- Step 2: Create teams Table (without the current_boss_id for now)
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    admin_id TEXT REFERENCES users(id)
);

-- Step 3: Create team_members Table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id),
    user_id TEXT REFERENCES users(id)
);

-- Step 4: Create bosses Table
CREATE TABLE bosses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    max_hp INTEGER NOT NULL,
    current_hp INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 1000
);

-- Step 5: Add current_boss_id to teams Table
ALTER TABLE teams
ADD COLUMN current_boss_id UUID REFERENCES bosses(id);

-- Step 6: Create tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id),
    assigned_to TEXT REFERENCES users(id),
    description TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 100,
    date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE
);

## Features Requirements:

 1. Clerk Authentication has already been implemented. After a sigin via clerk is successful, using the userID from clerk, check if the user exists in the Users table. If the user does not exist, insert the user into the Users table. Then proceed to use the user_id to functions like getting the user's teams, tasks, level, xp, and total damage dealt, etc.
 2. The user fetches all the data of any teammates they have and their level, xp, total damage dealt, their tasks and the details of the tasks.
 3. Add the ability for users to complete tasks with comfirmation modal. When a user completes a task, update the task as completed in the database. After that, update the user's xp, level, and total damage dealt and the boss's current health.
 4. Listen for any changes to any of the tables above and update the client side accordingly using Supabase real-time subscriptions.


## Game Mechanics

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