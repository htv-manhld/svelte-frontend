import type {
	User,
	CreateUserRequest,
	UpdateUserRequest,
	ChangeEmailRequest,
	ApiResponse,
	PaginatedResponse,
	PaginatedApiResponse,
	UserFilterParams
} from '$lib/types';
import { buildQueryParams } from '$lib/utils';

const API_BASE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:9001/api';

export class UserApiClient {
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			}
		});

		const data = await response.json();
		return data as ApiResponse<T>;
	}

	async getAllUsers(params: UserFilterParams = {}): Promise<PaginatedResponse<User>> {
		const { page = 0, size = 20, email, name, minAge, maxAge } = params;

		const queryParams = buildQueryParams({
			page,
			size,
			email,
			name,
			minAge,
			maxAge
		});

		const response = await fetch(`${API_BASE_URL}/users/paginated?${queryParams.toString()}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result = (await response.json()) as PaginatedApiResponse<User>;

		// Check if response has pagination metadata
		if (result.success && result.data && result.pagination) {
			return {
				data: result.data,
				pagination: result.pagination
			};
		}

		throw new Error(result.error || 'Failed to fetch users');
	}

	async getAllUsersSimple(limit: number = 10000): Promise<User[]> {
		const result = await this.request<User[]>(`/users?limit=${limit}`);

		if (Array.isArray(result)) {
			return result;
		}
		if (result.success && result.data) {
			return result.data;
		}
		throw new Error(result.error || 'Failed to fetch users');
	}

	async getUserById(id: string): Promise<User> {
		const result = await this.request<User>(`/users/${id}`);
		if (result.success && result.data) {
			return result.data;
		}
		throw new Error(result.error || 'Failed to fetch user');
	}

	async getUserByEmail(email: string): Promise<User> {
		const result = await this.request<User>(`/users/by-email/${email}`);
		if (result.success && result.data) {
			return result.data;
		}
		throw new Error(result.error || 'Failed to fetch user');
	}

	async createUser(userData: CreateUserRequest): Promise<User> {
		const result = await this.request<User>('/users', {
			method: 'POST',
			body: JSON.stringify(userData)
		});
		if (result.success && result.data) {
			return result.data;
		}
		throw new Error(result.error || 'Failed to create user');
	}

	async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
		const result = await this.request<User>(`/users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(userData)
		});
		if (result.success && result.data) {
			return result.data;
		}
		throw new Error(result.error || 'Failed to update user');
	}

	async changeUserEmail(id: string, emailData: ChangeEmailRequest): Promise<User> {
		const result = await this.request<User>(`/users/${id}/email`, {
			method: 'PUT',
			body: JSON.stringify(emailData)
		});
		if (result.success && result.data) {
			return result.data;
		}
		throw new Error(result.error || 'Failed to change user email');
	}

	async deleteUser(id: string): Promise<void> {
		const result = await this.request<void>(`/users/${id}`, {
			method: 'DELETE'
		});
		if (!result.success) {
			throw new Error(result.error || 'Failed to delete user');
		}
	}
}

export const userApi = new UserApiClient();
