import { Progress } from "@/components/ui/progress";
import { Task } from '@/lib/types';

interface TaskProgressProps {
  tasks: Task[];
}

export function TaskProgress({ tasks }: TaskProgressProps) {
  const completedTasks = tasks.filter(task => task.is_completed).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;

  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm mb-1">
        <span>Progress</span>
        <span>{completedTasks} / {tasks.length} completed</span>
      </div>
      <Progress value={progressPercentage} className="progress-bar" />
    </div>
  );
}