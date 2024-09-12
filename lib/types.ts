export interface Task {
    id: string;
    description: string;
    is_completed: boolean;
    assigned_to: string;
    xp_difficulty_multiplier: number;
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
    email: string;
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
    id: string;
    name: string;
    image_url: string;
    max_hp: number;
    current_hp: number;
    xp_reward: number;
    subtitle: string;
  }