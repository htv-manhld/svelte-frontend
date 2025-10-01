// Global TypeScript types and interfaces

export interface User {
	id: string;
	email: string;
	name: string;
	age: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateUserRequest {
	email: string;
	name: string;
	age: number;
}

export interface UpdateUserRequest {
	email: string;
	name: string;
	age: number;
}

export interface ChangeEmailRequest {
	email: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	code?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
	pagination: {
		page: number;
		size: number;
		total: number;
		totalPages: number;
	};
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		size: number;
		total: number;
		totalPages: number;
	};
}

export interface PaginationParams {
	page?: number;
	size?: number;
}

export interface UserFilterParams extends PaginationParams {
	email?: string;
	name?: string;
	minAge?: number;
	maxAge?: number;
}

// Common UI types
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ModalMode = 'create' | 'edit';
