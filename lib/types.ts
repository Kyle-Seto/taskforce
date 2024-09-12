export interface Task {
    id: string;
    description: string;
    is_completed: boolean;
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
  
  export interface User {
    id: string;
    emailAddress: string;
    firstname: string;
    level: number;
    xp: number;
    total_damage_dealt: number;
  }
  
  export interface Team {
    id: string;
    name: string;
    team_members: TeamMember[];
  }
  
  export interface TeamMember {
    users: User;
  }
  
  export interface Boss {
    name: string;
    subtitle: string;
    current_hp: number;
    max_hp: number;
    image_url: string;
  }