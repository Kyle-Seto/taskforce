"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { useUser } from '@clerk/nextjs';
import { Task, MemberTasks, DailyTasksProps } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export function DailyTasks({ currentUserId, teamTasks, onTaskComplete }: DailyTasksProps) {
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
      console.log(selectedTask);
      const { data, error } = await supabase
        .from('tasks')
        .upsert({ 
          id: selectedTask.id, 
          assigned_to: user.id, 
          is_completed: true, 
          description: selectedTask.description,
          date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('Task updated:', data);
      onTaskComplete(selectedTask.id);
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const renderTaskList = (tasks: Task[], isCurrentUser: boolean) => (
    <ul className="space-y-2">
      {tasks
        .sort((a, b) => a.id.localeCompare(b.id)) // Sort tasks by ID to maintain original order
        .map((task) => (
          <li key={task.id} className={`flex items-center p-2 rounded-md ${isCurrentUser ? 'hover:bg-accent' : ''}`}>
            <Checkbox
              id={task.id}
              checked={task.is_completed}
              onCheckedChange={() => {
                if (isCurrentUser && !task.is_completed) {
                  setSelectedTask(task);
                  setIsModalOpen(true);
                }
              }}
              disabled={!isCurrentUser || task.is_completed}
              className={isCurrentUser ? '' : 'opacity-50 cursor-not-allowed'}
            />
            <label 
              htmlFor={task.id} 
              className={`ml-3 ${task.is_completed ? 'line-through text-muted-foreground' : ''} ${isCurrentUser ? '' : 'cursor-default'}`}
            >
              {task.description}
            </label>
          </li>
        ))}
    </ul>
  );

  const calculateProgress = (tasks: Task[]) => {
    const completedTasks = tasks.filter(task => task.is_completed).length;
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
                <span>{currentUserTasks.tasks.filter(t => t.is_completed).length} / {currentUserTasks.tasks.length} completed</span>
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
                  <span>{memberTasks.tasks.filter(t => t.is_completed).length} / {memberTasks.tasks.length} completed</span>
                </div>
                <Progress value={calculateProgress(memberTasks.tasks)} className="progress-bar" />
              </div>
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