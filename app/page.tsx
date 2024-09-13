"use client";

import { useUser } from '@clerk/nextjs'
import { useEffect, useState, useCallback } from 'react'
import { checkAndInsertUser, getUserData, getUserTeams, getTeamTasks, getBossData } from '../lib/user'
import { createChannel } from '@/lib/supabase';
import { User, Team, Boss, Task } from '@/lib/types';
import { completeTask } from '@/lib/taskActions';
import { MainContent } from '@/components/MainContent';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
	const { user } = useUser()
	const [userData, setUserData] = useState<User | null>(null)
	const [userTeams, setUserTeams] = useState<Team[] | null>(null)
	const [teamTasks, setTeamTasks] = useState<Task[] | null>(null)
	const [bossData, setBossData] = useState<Boss | null>(null)

	const initializeUser = useCallback(async () => {
		if (user) {
			await checkAndInsertUser(user.id, user.emailAddresses[0].emailAddress, user.firstName ?? '')
			const data = await getUserData(user.id)
			const teams = await getUserTeams(user.id)
			setUserData(data)
			setUserTeams(teams)

			if (teams && teams.length > 0) {
				const tasks = await getTeamTasks(teams[0].id)
				setTeamTasks(tasks)
				
				const boss = await getBossData(teams[0].id)
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
		if (!userData || !user) return;

		const task = teamTasks?.find(t => t.id === taskId);
		if (!task) return;

		try {
			await completeTask(task, userData, bossData, userTeams[0]);
			console.log(`Task ${taskId} completed successfully.`);
			initializeUser();
		} catch (error) {
			console.error('Error completing task:', error);
		}
	};

	if (!user || !userData || !userTeams || !teamTasks || !bossData) {
		return <LoadingSpinner />;
	}

	return (
		<MainContent
			user={user}
			userData={userData}
			userTeams={userTeams}
			teamTasks={teamTasks}
			bossData={bossData}
			onTaskComplete={handleTaskComplete}
		/>
	);
}
