"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Task {
  id: string;
  description: string;
  completed: boolean;
}

interface MemberTasks {
  memberId: string;
  memberName: string;
  tasks: Task[];
}

interface DailyTasksProps {
  currentUserId: string;
  teamTasks: MemberTasks[];
  onTaskComplete: (taskId: string) => void;
}

export function DailyTasks({ currentUserId, teamTasks, onTaskComplete }: DailyTasksProps) {
  const currentUserTasks = teamTasks.find(member => member.memberId === currentUserId);
  const otherMemberTasks = teamTasks.filter(member => member.memberId !== currentUserId);

  const renderTaskList = (tasks: Task[], isCurrentUser: boolean) => (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className={`flex items-center p-2 rounded-md ${isCurrentUser ? 'hover:bg-accent' : ''}`}>
          <Checkbox
            id={task.id}
            checked={task.completed}
            onCheckedChange={() => isCurrentUser && onTaskComplete(task.id)}
            disabled={!isCurrentUser || task.completed}
            className={isCurrentUser ? '' : 'opacity-50 cursor-not-allowed'}
          />
          <label 
            htmlFor={task.id} 
            className={`ml-3 ${task.completed ? 'line-through text-muted-foreground' : ''} ${isCurrentUser ? '' : 'cursor-default'}`}
          >
            {task.description}
          </label>
        </li>
      ))}
    </ul>
  );

  const calculateProgress = (tasks: Task[]) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    return (completedTasks / tasks.length) * 100;
  };

  return (
    <div className="space-y-6">
      {currentUserTasks && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {renderTaskList(currentUserTasks.tasks, true)}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{currentUserTasks.tasks.filter(t => t.completed).length} / {currentUserTasks.tasks.length} completed</span>
              </div>
              <Progress value={calculateProgress(currentUserTasks.tasks)} className="progress-bar" />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Teammates' Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {otherMemberTasks.map((memberTasks) => (
            <div key={memberTasks.memberId} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold mb-2">{memberTasks.memberName}'s Tasks</h3>
              {renderTaskList(memberTasks.tasks, false)}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{memberTasks.tasks.filter(t => t.completed).length} / {memberTasks.tasks.length} completed</span>
                </div>
                <Progress value={calculateProgress(memberTasks.tasks)} className="progress-bar" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}