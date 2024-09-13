"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task, MemberTasks, DailyTasksProps } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { TaskList } from './TaskList';
import { TaskProgress } from './TaskProgress';

export function DailyTasks({ currentUserId, teamTasks, onTaskComplete }: DailyTasksProps) {
	console.log("teamTasks", teamTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();

  const currentUserTasks = teamTasks.find(member => member.memberId === currentUserId);
  const otherMemberTasks = teamTasks.filter(member => member.memberId !== currentUserId);

  const handleCompleteTask = async () => {
    if (!selectedTask || !user) {
      console.error('No task selected or user not authenticated');
      return;
    }

    try {
      onTaskComplete(selectedTask.id);
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    if (!task.is_completed) {
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {currentUserTasks && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={currentUserTasks.tasks} isCurrentUser={true} onTaskClick={handleTaskClick} />
            <TaskProgress tasks={currentUserTasks.tasks} />
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
              <TaskList tasks={memberTasks.tasks} isCurrentUser={false} onTaskClick={() => {}} />
              <TaskProgress tasks={memberTasks.tasks} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Task Completion</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete this task?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCompleteTask}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}