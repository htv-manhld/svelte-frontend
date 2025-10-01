// Users business logic

import { userApi } from '$lib/api/users';
import { usersStore } from '$features/users/stores/usersStore';
import { notificationStore } from '$lib/stores/notificationStore.svelte';
import { t } from '$lib/i18n';
import type { CreateUserRequest, UpdateUserRequest } from '$lib/types';

export class UserService {
	async loadUsers(page: number = 0, size: number = 20): Promise<void> {
		usersStore.setLoading(true);
		usersStore.setPage(page);
		usersStore.setPageSize(size);
		try {
			const response = await userApi.getAllUsers({ page, size });
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
