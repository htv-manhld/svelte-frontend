// Dashboard business logic

import { userApi } from '$lib/api/users';
import type { User } from '$lib/api/generated/users/types';

export interface DashboardStats {
	userCount: number;
	activeUsers: number;
	newToday: number;
}

export interface RecentUsers {
	users: User[];
	total: number;
}

export class DashboardService {
	async getStats(): Promise<DashboardStats> {
		try {
			const users = await userApi.getAllUsersSimple(10);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const newToday = users.filter((user) => {
				const userDate = new Date(user.createdAt);
				userDate.setHours(0, 0, 0, 0);
				return userDate.getTime() === today.getTime();
			}).length;

			return {
				userCount: users.length,
				activeUsers: users.length, // Assuming all users are active
				newToday
			};
		} catch (error) {
			console.error('Failed to load dashboard stats:', error);
			throw new Error('Failed to load dashboard stats');
		}
	}

	async getRecentUsers(limit: number = 5): Promise<RecentUsers> {
		try {
			const users = await userApi.getAllUsersSimple(limit);
			return {
				users: users.slice(0, limit),
				total: users.length
			};
		} catch (error) {
			console.error('Failed to load recent users:', error);
			throw new Error('Failed to load recent users');
		}
	}
}

export const dashboardService = new DashboardService();
