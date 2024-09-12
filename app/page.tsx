"use client";

import Image from "next/image";
import { TeamInfo } from "@/components/TeamInfo";
import { BossInfo } from "@/components/BossInfo";
import { DailyTasks } from "@/components/DailyTasks";
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { checkAndInsertUser, getUserData, getUserTeams, getUserTasks } from '../lib/user'

export default function Home() {
	const { user } = useUser()
	const [userData, setUserData] = useState(null)
	const [userTeams, setUserTeams] = useState(null)
	const [userTasks, setUserTasks] = useState(null)

	useEffect(() => {
		async function initializeUser() {
			if (user) {
				await checkAndInsertUser(user.id, user.emailAddresses[0].emailAddress, user.firstName)
				const data = await getUserData(user.id)
				const teams = await getUserTeams(user.id)
				const tasks = await getUserTasks(user.id)
				setUserData(data)
				setUserTeams(teams)
				setUserTasks(tasks)
			}
		}

		initializeUser()
	}, [user])

	const handleTaskComplete = (taskId: string) => {
		// TODO: Implement XP reward and boss damage logic
		console.log(`Task ${taskId} completed`);
	};

	if (!user || !userData) {
		return <div>Loading...</div>
	}

	// Assuming the first team is the current team
	const currentTeam = userTeams && userTeams[0] ? userTeams[0].teams : null;

	// Mock boss data (replace with actual data fetching later)
	const bossData = {
		name: "Azure Tempest",
		currentHealth: 750,
		maxHealth: 1000,
	};

	// Transform userTasks into the format expected by DailyTasks component
	const formattedTasks = userTasks ? [
		{
			memberId: user.id,
			memberName: userData.firstname,
			tasks: userTasks.map(task => ({
				id: task.id,
				description: task.description,
				completed: task.is_completed
			}))
		}
	] : [];

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
						{currentTeam && (
							<TeamInfo 
								teamName={currentTeam.name} 
								members={[
									{ 
										id: user.id, 
										name: userData.firstname, 
										level: userData.level, 
										xp: userData.xp,
									}
									// Add other team members here when available
								]} 
							/>
						)}
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
