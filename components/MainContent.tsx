import { TeamInfo } from "@/components/game/TeamInfo";
import { BossInfo } from "@/components/game/BossInfo";
import { DailyTasks } from "@/components/game/DailyTasks";
import { getXpToNextLevel } from '@/lib/gameLogic';
import { User, Team, Boss, Task, MemberTasks } from '@/lib/types';

type MainContentProps = {
	user: any;
	userData: User;
	userTeams: Team[];
	teamTasks: Task[];
	bossData: Boss;
	onTaskComplete: (taskId: string) => void;
}

export function MainContent({ userData, userTeams, teamTasks, bossData, onTaskComplete }: MainContentProps) {
	const currentTeam = userTeams[0];

	const teamMembers = Array.isArray(currentTeam.team_members)
		? currentTeam.team_members.map(member => ({
				id: member.users.id,
				name: member.users.firstname,
				level: member.users.level,
				xp: member.users.xp,
				totalDamageDealt: member.users.total_damage_dealt,
				xpToNextLevel: getXpToNextLevel(member.users.level),
				tasks: teamTasks.filter(task => task.assigned_to === member.users.id).map(task => ({
					id: task.id,
					description: task.description,
					is_completed: task.is_completed
				}))
			}))
		: [];

	const formattedTasks = teamMembers.map(member => ({
		memberId: member.id,
		memberName: member.name,
		tasks: member.tasks
	}));

	return (
		<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<BossInfo
				name={bossData.name}
				subtitle={bossData.subtitle}
				currentHp={bossData.current_hp}
				maxHp={bossData.max_hp}
				imageUrl={bossData.image_url}
			/>
			<div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<TeamInfo 
						teamName={currentTeam.name} 
						members={teamMembers}
					/>
				</div>
				<div className="lg:col-span-2">
					<DailyTasks
						currentUserId={userData.id}
						teamTasks={formattedTasks as MemberTasks[]}
						onTaskComplete={onTaskComplete}
					/>
				</div>
			</div>
		</div>
	);
}