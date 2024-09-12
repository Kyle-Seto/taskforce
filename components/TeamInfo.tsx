import { Progress } from "@/components/ui/progress";
import { getXpToNextLevel } from '@/lib/gameLogic';

interface TeamMember {
  id: string;
  name: string;
  level: number;
  xp: number;
  totalDamageDealt: number;
  xpToNextLevel: number;
}

interface TeamInfoProps {
  teamName: string;
  members: TeamMember[];
}

export function TeamInfo({ teamName, members }: TeamInfoProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-2xl font-bold">{teamName}</h2>
      </div>
      <ul className="divide-y divide-border">
        {members.map((member) => (
          <li key={member.id} className="card-content">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <span className="text-sm font-medium">Level {member.level}</span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>XP: {member.xp}</span>
                <span>{getXpToNextLevel(member.level) - member.xp} to next level</span>
              </div>
              <Progress 
                value={(member.xp / getXpToNextLevel(member.level)) * 100} 
                className="progress-bar" 
              />
            </div>
            <p className="text-sm text-muted-foreground">{member.totalDamageDealt} Damage Dealt</p>
          </li>
        ))}
      </ul>
    </div>
  );
}