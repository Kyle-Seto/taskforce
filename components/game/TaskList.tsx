import { Checkbox } from "@/components/ui/checkbox";
import { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  isCurrentUser: boolean;
  onTaskClick: (task: Task) => void;
}

export function TaskList({ tasks, isCurrentUser, onTaskClick }: TaskListProps) {
  return (
    <ul className="space-y-2">
      {tasks
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((task) => (
          <li key={task.id} className={`flex items-center p-2 rounded-md ${isCurrentUser ? 'hover:bg-accent' : ''}`}>
            <Checkbox
              id={task.id}
              checked={task.is_completed}
              onCheckedChange={() => isCurrentUser && onTaskClick(task)}
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
}