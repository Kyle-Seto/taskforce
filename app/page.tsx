"use client";

import { TeamInfo } from "@/components/TeamInfo";
import { BossInfo } from "@/components/BossInfo";
import { DailyTasks } from "@/components/DailyTasks";
import { useUser } from '@clerk/nextjs'
import { useEffect, useState, useCallback } from 'react'
import { checkAndInsertUser, getUserData, getUserTeams, getTeamTasks, getBossData } from '../lib/user'
import { getXpToNextLevel, calculateTaskXpReward, getBossDamage } from '../lib/constants';
import { supabase, createChannel } from '@/lib/supabase';

export default function Home() {
	const { user } = useUser()
	const [userData, setUserData] = useState(null)
	const [userTeams, setUserTeams] = useState(null)
	const [teamTasks, setTeamTasks] = useState(null)
	const [bossData, setBossData] = useState(null)

	const initializeUser = useCallback(async () => {
		if (user) {
			await checkAndInsertUser(user.id, user.emailAddresses[0].emailAddress, user.firstName ?? '')
			const data = await getUserData(user.id)
			const teams = await getUserTeams(user.id)
			setUserData(data)
			setUserTeams(teams)

			if (teams && teams.length > 0) {
				const tasks = await getTeamTasks(teams[0].teams.id)
				setTeamTasks(tasks)
				
				const boss = await getBossData(teams[0].teams.id)
				setBossData(boss)
			}
		}
	}, [user]);

	useEffect(() => {
		initializeUser();

		const channel = createChannel()
		const subscription = channel
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'tasks' },
				(payload) => {
					console.log('Tasks changed:', payload);
					initializeUser()
				}
			)
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'users' },
				(payload) => {
					console.log('Users changed:', payload);
					initializeUser()
				}
			)
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'bosses' },
				(payload) => {
					console.log('Boss changed:', payload);
					initializeUser()
				}
			)
			.subscribe()

		return () => {
			subscription.unsubscribe();
		};
	}, [user, userTeams, initializeUser]);

	const handleTaskComplete = async (taskId: string) => {
		if (!userData) return;

		const xpReward = calculateTaskXpReward(userData.level);
		const bossDamage = getBossDamage(userData.level);

		// TODO: Implement API call to update task completion, user XP, and boss health
		console.log(`Task ${taskId} completed. XP Reward: ${xpReward}, Boss Damage: ${bossDamage}`);
	};

	if (!user || !userData || !userTeams || !teamTasks || !bossData) {
		return (
			<div className="flex items-center justify-center h-screen w-full bg-background">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	// Assuming the first team is the current team
	const currentTeam = userTeams[0].teams;

	// Transform teamTasks into the format expected by TeamInfo component
	const teamMembers = currentTeam.team_members.map(member => ({
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
	}));

	// Transform teamTasks into the format expected by DailyTasks component
	const formattedTasks = teamMembers.map(member => ({
		memberId: member.id,
		memberName: member.name,
		tasks: member.tasks
	}));

	return (
		<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			{bossData && (
				<BossInfo
					name={bossData.name}
					subtitle={bossData.subtitle}
					currentHp={bossData.current_hp}
					maxHp={bossData.max_hp}
					imageUrl={bossData.image_url}
				/>
			)}
			<div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<TeamInfo 
						teamName={currentTeam.name} 
						members={teamMembers}
					/>
				</div>
				<div className="lg:col-span-2">
					<DailyTasks
						currentUserId={user.id}
						teamTasks={formattedTasks}
						onTaskComplete={handleTaskComplete}
					/>
				</div>
			</div>
		</div>
	);
}
