import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BossInfoProps = {
  name: string;
  currentHealth: number;
  maxHealth: number;
};

export function BossInfo({ name, currentHealth, maxHealth }: BossInfoProps) {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Health: {currentHealth} / {maxHealth}
          </p>
          <Progress value={healthPercentage} className="w-full h-4" />
        </div>
      </CardContent>
    </Card>
  );
}