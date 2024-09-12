import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Task {
  id: string;
  description: string;
  completed: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  level: number;
  xp: number;
  totalDamageDealt: number;
  tasks: Task[];
}

interface TeamInfoProps {
  teamName: string;
  members: TeamMember[];
}

export function TeamInfo({ teamName, members }: TeamInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{teamName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {members.map((member) => {
            const completedTasks = member.tasks.filter(task => task.completed).length;
            const totalTasks = member.tasks.length;
            const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return (
              <li key={member.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>{member.name}</span>
                      <span className="text-sm text-gray-500">Level: {member.level}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-500">
                      <p>XP: {member.xp}</p>
                      <p>Total Damage: {member.totalDamageDealt}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tasks Progress</span>
                        <span>{completedTasks}/{totalTasks}</span>
                      </div>
                      <Progress value={completionPercentage} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}