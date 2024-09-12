import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TeamMember = {
  id: string;
  name: string;
  level: number;
  xp: number;
};

type TeamInfoProps = {
  teamName: string;
  members: TeamMember[];
};

export function TeamInfo({ teamName, members }: TeamInfoProps) {
  const getXpForNextLevel = (level: number) => (level + 1) * 100; // Simple XP calculation, adjust as needed

  return (
    <Card>
      <CardHeader>
        <CardTitle>{teamName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {members.map((member) => {
            const xpForNextLevel = getXpForNextLevel(member.level);
            const xpProgress = (member.xp / xpForNextLevel) * 100;
            
            return (
              <li key={member.id} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-muted-foreground">Level {member.level}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>XP: {member.xp}</span>
                    <span>Next Level: {xpForNextLevel}</span>
                  </div>
                  <Progress value={xpProgress} className="w-full h-2" />
                  <p className="text-xs text-right text-muted-foreground">
                    {member.xp} / {xpForNextLevel} XP
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}