/* eslint-disable */
export type UserId = {
	/** User ID */
	id: string;
};

export type UserEmail = {
	/** User email address */
	email: string;
};

export type LimitQuery = {
	/** Maximum number of users to return */
	limit?: number | undefined;
};

export type PageQuery = {
	/** Page number (0-indexed) */
	page?: number | undefined;
};

export type SizeQuery = {
	/** Number of items per page */
	size?: number | undefined;
};

export type User = {
	/** User ID */
	id: string;
	/** User email address */
	email: string;
	/** User full name */
	name: string;

	/** User birthdate */
	birthdate?: string | null | undefined;

	/** User status (0 = Inactive, 1 = Active) */
	status: 0 | 1;

	/** Last login timestamp */
	lastLoginAt?: string | null | undefined;

	/** Email verification timestamp */
	verifiedAt?: string | null | undefined;

	/** Account creation timestamp */
	createdAt: string;
	/** Last update timestamp */
	updatedAt: string;
};

export type CreateUserRequest = {
	/** User email address */
	email: string;
	/** User full name */
	name: string;

	/** User password (optional) */
	password?: string | null | undefined;

	/** User birthdate (optional) */
	birthdate?: string | null | undefined;
};

export type UpdateUserRequest = {
	/** User full name */
	name: string;

	/** User birthdate (optional) */
	birthdate?: string | null | undefined;
};

export type ChangeEmailRequest = {
	/** New email address */
	email: string;
};

export type PaginationInfo = {
	/** Current page number (0-indexed) */
	page: number;
	/** Number of items per page */
	size: number;
	/** Total number of items */
	total: number;
	/** Total number of pages */
	totalPages: number;
};

export type UserSuccessResponse = {
	success: boolean;
	data: User;
	message: string;
};

export type UsersSuccessResponse = {
	success: boolean;
	data: User[];
	message: string;
};

export type PaginatedUsersResponse = {
	success: boolean;
	data: User[];
	pagination: PaginationInfo;
	message: string;
};

export type ErrorResponse = {
	success: boolean;
	/** Error message */
	error: string;
	/** Error code */
	code:
		| 'VALIDATION_ERROR'
		| 'NOT_FOUND'
		| 'INVALID_OPERATION'
		| 'DUPLICATE_ERROR'
		| 'INTERNAL_ERROR'
		| 'USER_NOT_FOUND';
};

export type GetUserResponse = UserSuccessResponse;

export type GetUsersResponse = UsersSuccessResponse;

export type GetUsersPaginatedResponse = PaginatedUsersResponse;

export type CreateUserResponse = UserSuccessResponse;

export type DeleteUserResponse = {
	success?: boolean | undefined;
	message?: string | undefined;
};

export type BadRequestErrorResponse = ErrorResponse;

export type NotFoundErrorResponse = ErrorResponse;

export type ConflictErrorResponse = ErrorResponse;

export type InternalServerErrorResponse = ErrorResponse;

export type HealthCheckApiResponse = {
	status?: string | undefined;
};
