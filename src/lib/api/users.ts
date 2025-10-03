import type {
	User,
	CreateUserRequest,
	UpdateUserRequest,
	ChangeEmailRequest,
	UserSuccessResponse,
	UsersSuccessResponse,
	PaginatedUsersResponse
} from '$lib/api/generated/users/types';
import { buildQueryParams } from '$lib/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api';

// Custom types for client usage
interface PaginationParams {
	page?: number;
	size?: number;
}

interface UserFilterParams extends PaginationParams {
	email?: string;
	name?: string;
	limit?: number;
}

// Return type for paginated endpoints
export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		page: number;
		size: number;
		total: number;
		totalPages: number;
	};
}

export class UserApiClient {
	async getAllUsers(params: UserFilterParams = {}): Promise<PaginatedResult<User>> {
		const { page = 0, size = 20, email, name, limit } = params;

		const queryParams = buildQueryParams({
			page,
			size,
			email,
			name,
			limit
		});

		const response = await fetch(`${API_BASE_URL}/users/paginated?${queryParams.toString()}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result = (await response.json()) as PaginatedUsersResponse;

		if (result.success && result.data && result.pagination) {
			return {
				data: result.data,
				pagination: result.pagination
			};
		}

		throw new Error('Failed to fetch users');
	}

	async getAllUsersSimple(limit: number = 10000): Promise<User[]> {
		const url = `${API_BASE_URL}/users?limit=${limit}`;
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const text = await response.text();

		if (!text) {
			throw new Error('Empty response from server');
		}

		const result = JSON.parse(text) as UsersSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to fetch users');
	}

	async getUserById(id: string): Promise<User> {
		const response = await fetch(`${API_BASE_URL}/users/${id}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to fetch user');
	}

	async getUserByEmail(email: string): Promise<User> {
		const response = await fetch(`${API_BASE_URL}/users/by-email/${email}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to fetch user');
	}

	async createUser(userData: CreateUserRequest): Promise<User> {
		const response = await fetch(`${API_BASE_URL}/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to create user');
	}

	async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
		const response = await fetch(`${API_BASE_URL}/users/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to update user');
	}

	async changeUserEmail(id: string, emailData: ChangeEmailRequest): Promise<User> {
		const response = await fetch(`${API_BASE_URL}/users/${id}/email`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(emailData)
		});

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to change user email');
	}

	async deleteUser(id: string): Promise<void> {
		const response = await fetch(`${API_BASE_URL}/users/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result = await response.json();

		if (!result.success) {
			throw new Error('Failed to delete user');
		}
	}
}

export const userApi = new UserApiClient();
