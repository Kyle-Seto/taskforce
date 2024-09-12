export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

export interface MemberTasks {
  memberId: string;
  memberName: string;
  tasks: Task[];
}

export interface DailyTasksProps {
  currentUserId: string;
  teamTasks: MemberTasks[];
  onTaskComplete: (taskId: string) => void;
}