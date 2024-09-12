"use client";

import Image from "next/image";
import { TeamInfo } from "@/components/TeamInfo";
import { BossInfo } from "@/components/BossInfo";
import { DailyTasks } from "@/components/DailyTasks";

// Mock data (replace with actual data fetching later)
const teamData = {
  teamName: "Dragon Slayers",
  members: [
    { id: "1", name: "Alice", level: 5, xp: 75, avatarUrl: "" },
    { id: "2", name: "Bob", level: 4, xp: 50, avatarUrl: "" },
    { id: "3", name: "Charlie", level: 6, xp: 90, avatarUrl: "" },
  ],
};

const bossData = {
  name: "Azure Tempest",
  currentHealth: 750,
  maxHealth: 1000,
};

const taskData = [
  {
    memberId: "1",
    memberName: "Alice",
    tasks: [
      { id: "t1", description: "Complete 5 quests", completed: false },
      { id: "t2", description: "Defeat 10 monsters", completed: true },
    ],
  },
  {
    memberId: "2",
    memberName: "Bob",
    tasks: [
      { id: "t3", description: "Craft 3 potions", completed: false },
      { id: "t4", description: "Explore a new area", completed: false },
    ],
  },
  {
    memberId: "3",
    memberName: "Charlie",
    tasks: [
      { id: "t5", description: "Upgrade equipment", completed: true },
      { id: "t6", description: "Join a raid", completed: false },
    ],
  },
];

export default function Home() {
  const handleTaskComplete = (taskId: string) => {
    // TODO: Implement XP reward and boss damage logic
    console.log(`Task ${taskId} completed`);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-4 space-y-8">
        <Image
          src="/images/taskforce-logo.jpg"
          alt="TaskForce MMO"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
        <BossInfo
          name={bossData.name}
          currentHealth={bossData.currentHealth}
          maxHealth={bossData.maxHealth}
        />
        <div className="flex-grow grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <TeamInfo teamName={teamData.teamName} members={teamData.members} />
          </div>
          <div className="lg:col-span-2 flex flex-col">
            <DailyTasks
              currentUserId="1" // Replace with actual current user ID
              teamTasks={taskData}
              onTaskComplete={handleTaskComplete}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
