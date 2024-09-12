# Backend Details: MMO RPG Daily Tasks Web App

## Project Overview
This document outlines the backend architecture and implementation details for the MMO RPG daily tasks web application, with a focus on team-based gameplay and team-specific leaderboards.

## Technology Stack
- Next.js 14 (API Routes for serverless functions)
- Supabase (PostgreSQL database)
- Clerk (Authentication)

## Database Schema (Supabase)

-- Step 1: Create Users Table
CREATE TABLE Users (
    id TEXT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_damage_dealt INTEGER DEFAULT 0
);

-- Step 2: Create Teams Table (without the current_boss_id for now)
CREATE TABLE Teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    admin_id TEXT REFERENCES Users(id)
);

-- Step 3: Create TeamMembers Table
CREATE TABLE TeamMembers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES Teams(id),
    user_id TEXT REFERENCES Users(id)
);

-- Step 4: Create Bosses Table
CREATE TABLE Bosses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    max_hp INTEGER NOT NULL,
    current_hp INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 1000
);

-- Step 5: Add current_boss_id to Teams Table
ALTER TABLE Teams
ADD COLUMN current_boss_id UUID REFERENCES Bosses(id);

-- Step 6: Create Tasks Table
CREATE TABLE Tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES Teams(id),
    assigned_to TEXT REFERENCES Users(id),
    description TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 100,
    date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE
);

## Features Requirements:

 1. Clerk Authentication has already been implemented. After a sigin via clerk is successful, using the userID from clerk, check if the user exists in the Users table. If the user does not exist, insert the user into the Users table. Then proceed to use the user_id to functions like getting the user's teams, tasks, level, xp, and total damage dealt, etc.
 2. The user fetches all the data of any teammates they have and their level, xp, total damage dealt, their tasks and the details of the tasks.
 3. Listen for any changes to any of the tables above and update the client side accordingly using Supabase real-time subscriptions.
 4. Add the ability for users to complete tasks. When a user completes a task, update the task as completed in the database. After that, update the user's xp, level, and total damage dealt.
