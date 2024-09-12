"use client";

import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

type Task = {
  id: string;
  description: string;
  completed: boolean;
};

type TeamMemberTasks = {
  memberId: string;
  memberName: string;
  tasks: Task[];
};

type DailyTasksProps = {
  currentUserId: string;
  teamTasks: TeamMemberTasks[];
  onTaskComplete: (taskId: string) => void;
};

export function DailyTasks({ currentUserId, teamTasks, onTaskComplete }: DailyTasksProps) {
  const [tasks, setTasks] = useState(teamTasks);

  const handleTaskToggle = (memberId: string, taskId: string) => {
    if (memberId === currentUserId) {
      setTasks(prevTasks =>
        prevTasks.map(member =>
          member.memberId === memberId
            ? {
                ...member,
                tasks: member.tasks.map(task =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                ),
              }
            : member
        )
      );
      onTaskComplete(taskId);
    }
  };

  const calculateProgress = (memberTasks: Task[]) => {
    const completedTasks = memberTasks.filter(task => task.completed).length;
    return (completedTasks / memberTasks.length) * 100;
  };

  return (
    <div className="space-y-6">
      {tasks.map(member => (
        <Card key={member.memberId} className={member.memberId === currentUserId ? "border-primary" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {member.memberId === currentUserId ? (
                <div className="flex items-center space-x-2">
                  <UserCircle className="h-5 w-5" />
                  <span>Your Tasks</span>
                </div>
              ) : (
                `${member.memberName}'s Tasks`
              )}
            </CardTitle>
            <Progress value={calculateProgress(member.tasks)} className="w-1/3" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {member.tasks.map(task => (
                <li key={task.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(member.memberId, task.id)}
                    disabled={member.memberId !== currentUserId}
                  />
                  <label
                    htmlFor={task.id}
                    className={`${task.completed ? 'line-through text-muted-foreground' : ''} ${member.memberId === currentUserId ? 'font-medium' : ''}`}
                  >
                    {task.description}
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}