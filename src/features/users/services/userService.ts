/**
 * Users business logic service
 * Service layer that sits between UI and API, managing state and notifications
 */

import * as userApi from '$lib/api/users';
import { usersStore } from '$features/users/stores/usersStore';
import { notificationStore } from '$lib/stores/notificationStore.svelte';
import { authStore } from '$features/auth/stores/authStore.svelte';
import { t } from '$lib/i18n';
import type { CreateUserRequest, UpdateUserRequest } from '$lib/api/generated/users/types';

export class UserService {
	async loadUsers(
		page: number = 0,
		size: number = 20,
		ignoreCurrentUser: boolean = true,
		orderBy?: 'id' | 'name' | 'email' | 'status' | 'createdAt' | 'updatedAt',
		orderDirection?: 'asc' | 'desc',
		search?: string,
		status?: 0 | 1,
		createdFrom?: string,
		createdTo?: string
	): Promise<void> {
		usersStore.setLoading(true);
		usersStore.setPage(page);
		usersStore.setPageSize(size);
		try {
			// Exclude current user from list if ignoreCurrentUser is true
			const ignoreId = ignoreCurrentUser && authStore.user ? authStore.user.id : undefined;
			const response = await userApi.getAllUsers({
				page,
				size,
				ignoreId,
				orderBy,
				orderDirection,
				search,
				status,
				createdFrom,
				createdTo
			});
			usersStore.setUsers(response.data, response.pagination.total);
			usersStore.setLoading(false);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to load users';
			usersStore.setError(message);
			usersStore.setLoading(false);
		}
	}

	async createUser(userData: CreateUserRequest): Promise<void> {
		try {
			const newUser = await userApi.createUser(userData);
			usersStore.addUser(newUser);
			notificationStore.success(t('users.messages.createSuccess'));
		} catch (error) {
			const message = error instanceof Error ? error.message : t('users.messages.createError');
			notificationStore.error(message);
			throw error;
		}
	}

	async updateUser(id: string, userData: UpdateUserRequest): Promise<void> {
		try {
			const updatedUser = await userApi.updateUser(id, userData);
			usersStore.updateUser(updatedUser);
			notificationStore.success(t('users.messages.updateSuccess'));
		} catch (error) {
			const message = error instanceof Error ? error.message : t('users.messages.updateError');
			notificationStore.error(message);
			throw error;
		}
	}

	async deleteUser(id: string): Promise<void> {
		try {
			await userApi.deleteUser(id);
			usersStore.deleteUser(id);
			notificationStore.success(t('users.messages.deleteSuccess'));
		} catch (error) {
			const message = error instanceof Error ? error.message : t('users.messages.deleteError');
			notificationStore.error(message);
			throw error;
		}
	}

	async getUserById(id: string) {
		return await userApi.getUserById(id);
	}
}

export const userService = new UserService();
