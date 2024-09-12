# Frontend Details: MMO RPG Daily Tasks Web App

## Project Overview

Use this guide to create a web application that allows users to complete tasks with other users. Users are assigned to teams where they can view their teams tasks and progress on the tasks. They can also see their teams xp and level. All team members will fight the same monster. Each user gains xp for defeating the monster and completing tasks.

## Technology Stack
- Next.js 14
- Supabase
- Lucid
- Clerk
- Tailwind CSS
- shadcn

## Feature Requirements
1. Users are able to see their team this includes the team name, all team members and levels, xp of each team member
2. Users are able to see the current boss the health and the max health
3. Users are able to see and update their daily tasks to be complete rewarding them with xp and leveling up if they reach the required xp for the level, they also deal damage to the boss for completing tasks
4. Users are able to view the daily tasks of all team members and if they are completed or not with a progress bar for how many of the total tasks are completed for each team member

## Current File Structure (You have to follow this structure)
TASKFORCE
├── .next
├── app
│   ├── fonts
│   ├── favicon.ico
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib
│   └── utils.ts
├── node_modules
├── requirements
│   ├── backend-reqs.md
│   └── frontend-reqs.md
├── .env.local
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json

## Rules
All new components must be created in the /components folder
All new pages must be created in the /app folder

