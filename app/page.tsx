"use client";

import Image from "next/image";
import { TeamInfo } from "@/components/TeamInfo";
import { BossInfo } from "@/components/BossInfo";
import { DailyTasks } from "@/components/DailyTasks";
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { checkAndInsertUser, getUserData, getUserTeams, getTeamTasks } from '../lib/user'

export default function Home() {
	const { user } = useUser()
	const [userData, setUserData] = useState(null)
	const [userTeams, setUserTeams] = useState(null)
	const [teamTasks, setTeamTasks] = useState(null)

	useEffect(() => {
		async function initializeUser() {
			if (user) {
				await checkAndInsertUser(user.id, user.emailAddresses[0].emailAddress, user.firstName ?? '')
				const data = await getUserData(user.id)
				const teams = await getUserTeams(user.id)
				setUserData(data)
				setUserTeams(teams)

				if (teams && teams.length > 0) {
					const tasks = await getTeamTasks(teams[0].teams.id)
					setTeamTasks(tasks)
				}
			}
		}

		initializeUser()
	}, [user])

	const handleTaskComplete = (taskId: string) => {
		// TODO: Implement XP reward and boss damage logic
		console.log(`Task ${taskId} completed`);
	};

	if (!user || !userData || !userTeams || !teamTasks) {
		return <div>Loading...</div>
	}

	// Assuming the first team is the current team
	const currentTeam = userTeams[0].teams;

	// Mock boss data (replace with actual data fetching later)
	const bossData = {
		name: "Azure Tempest",
		currentHealth: 750,
		maxHealth: 1000,
	};

	// Transform teamTasks into the format expected by TeamInfo component
	const teamMembers = currentTeam.team_members.map(member => ({
		id: member.users.id,
		name: member.users.firstname,
		level: member.users.level,
		xp: member.users.xp,
		totalDamageDealt: member.users.total_damage_dealt,
		tasks: teamTasks.filter(task => task.assigned_to === member.users.id).map(task => ({
			id: task.id,
			description: task.description,
			completed: task.is_completed
		}))
	}));

	// Transform teamTasks into the format expected by DailyTasks component
	const formattedTasks = teamMembers.map(member => ({
		memberId: member.id,
		memberName: member.name,
		tasks: member.tasks
	}));

	return (
		<main className="min-h-screen flex flex-col">
			<div className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-4 space-y-8">
				<Image
					src="/images/taskforce-logo.jpg"
					alt="TaskForce MMO"
					width={1920}
					height={1080}
					className="w-full h-auto object-cover rounded-lg shadow-lg"
				/>
				<BossInfo
					name={bossData.name}
					currentHealth={bossData.currentHealth}
					maxHealth={bossData.maxHealth}
				/>
				<div className="flex-grow grid gap-8 grid-cols-1 lg:grid-cols-3">
					<div className="lg:col-span-1">
						<TeamInfo 
							teamName={currentTeam.name} 
							members={teamMembers}
						/>
					</div>
					<div className="lg:col-span-2 flex flex-col">
						<DailyTasks
							currentUserId={user.id}
							teamTasks={formattedTasks}
							onTaskComplete={handleTaskComplete}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
