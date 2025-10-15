/**
 * User API - Functional approach
 * All functions are pure and stateless, making them easy to test and tree-shake
 */

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
import { API_BASE_URL, getAuthHeaders, handleApiError, handleNetworkError } from './apiUtils';

// Custom types for client usage
interface PaginationParams {
	page?: number;
	size?: number;
}

interface UserFilterParams extends PaginationParams {
	email?: string;
	name?: string;
	limit?: number;
	ignoreId?: string; // Exclude specific user ID from results
	orderBy?: 'id' | 'name' | 'email' | 'status' | 'createdAt' | 'updatedAt'; // Field to sort by
	orderDirection?: 'asc' | 'desc'; // Sort direction
	search?: string; // Search term to filter users by ID, name, or email
	status?: 0 | 1; // Filter by status (0 = Inactive, 1 = Active)
	createdFrom?: string; // Filter users created from this date
	createdTo?: string; // Filter users created up to this date
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

/**
 * Get all users with pagination and filters
 */
export const getAllUsers = async (params: UserFilterParams = {}): Promise<PaginatedResult<User>> => {
	const {
		page = 0,
		size = 20,
		email,
		name,
		limit,
		ignoreId,
		orderBy,
		orderDirection,
		search,
		status,
		createdFrom,
		createdTo
	} = params;

	const queryParams = buildQueryParams({
		page,
		size,
		email,
		name,
		limit,
		ignoreId,
		orderBy,
		orderDirection,
		search,
		status,
		createdFrom,
		createdTo
	});

	try {
		const response = await fetch(`${API_BASE_URL}/users/paginated?${queryParams.toString()}`, {
			headers: getAuthHeaders()
		});

		await handleApiError(response, 'Failed to fetch users');

		const result = (await response.json()) as PaginatedUsersResponse;

		if (result.success && result.data && result.pagination) {
			return {
				data: result.data,
				pagination: result.pagination
			};
		}

		throw new Error('Failed to fetch users');
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Get all users without pagination (simple list)
 */
export const getAllUsersSimple = async (limit: number = 10000, ignoreId?: string): Promise<User[]> => {
	try {
		const queryParams = buildQueryParams({ limit, ignoreId });
		const url = `${API_BASE_URL}/users?${queryParams.toString()}`;
		const response = await fetch(url, {
			headers: getAuthHeaders()
		});

		await handleApiError(response, 'Failed to fetch users');

		const text = await response.text();

		if (!text) {
			throw new Error('Empty response from server');
		}

		const result = JSON.parse(text) as UsersSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to fetch users');
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
	try {
		const response = await fetch(`${API_BASE_URL}/users/${id}`, {
			headers: getAuthHeaders()
		});

		await handleApiError(response, 'Failed to fetch user');

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to fetch user');
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<User> => {
	try {
		const response = await fetch(`${API_BASE_URL}/users/by-email/${email}`, {
			headers: getAuthHeaders()
		});

		await handleApiError(response, 'Failed to fetch user');

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to fetch user');
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Create a new user
 */
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
	try {
		const response = await fetch(`${API_BASE_URL}/users`, {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify(userData)
		});

		await handleApiError(response, 'Failed to create user');

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to create user');
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Update an existing user
 */
export const updateUser = async (id: string, userData: UpdateUserRequest): Promise<User> => {
	try {
		const response = await fetch(`${API_BASE_URL}/users/${id}`, {
			method: 'PUT',
			headers: getAuthHeaders(),
			body: JSON.stringify(userData)
		});

		await handleApiError(response, 'Failed to update user');

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to update user');
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Change user email
 */
export const changeUserEmail = async (id: string, emailData: ChangeEmailRequest): Promise<User> => {
	try {
		const response = await fetch(`${API_BASE_URL}/users/${id}/email`, {
			method: 'PUT',
			headers: getAuthHeaders(),
			body: JSON.stringify(emailData)
		});

		await handleApiError(response, 'Failed to change user email');

		const result = (await response.json()) as UserSuccessResponse;

		if (result.success && result.data) {
			return result.data;
		}

		throw new Error('Failed to change user email');
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Delete a user
 */
export const deleteUser = async (id: string): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE_URL}/users/${id}`, {
			method: 'DELETE',
			headers: getAuthHeaders()
		});

		await handleApiError(response, 'Failed to delete user');

		const result = await response.json();

		if (!result.success) {
			throw new Error('Failed to delete user');
		}
	} catch (error) {
		return handleNetworkError(error);
	}
};

// Deprecated: Keep for backward compatibility, will be removed in next version
/** @deprecated Use named imports instead: import { getAllUsers, getUserById, ... } */
export const userApi = {
	getAllUsers,
	getAllUsersSimple,
	getUserById,
	getUserByEmail,
	createUser,
	updateUser,
	changeUserEmail,
	deleteUser
};
