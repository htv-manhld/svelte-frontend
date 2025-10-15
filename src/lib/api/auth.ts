/**
 * Auth API - Functional approach
 * All functions are pure and stateless, making them easy to test and tree-shake
 */

import type {
	LoginRequest,
	LoginSuccessResponse,
	VerifyTokenResponse,
	LogoutSuccessResponse,
	ChangePasswordRequest,
	ChangePasswordSuccessResponse,
	ForgotPasswordRequest,
	ForgotPasswordSuccessResponse,
	ResetPasswordRequest,
	ResetPasswordSuccessResponse,
	User
} from '$lib/api/generated/users/types';
import { API_PATHS } from '$lib/constants/apiPaths';
import { API_BASE_URL, getAuthHeaders, handleApiError, handleNetworkError } from './apiUtils';

/**
 * Login with credentials
 */
export const login = async (credentials: LoginRequest): Promise<LoginSuccessResponse> => {
	try {
		const response = await fetch(`${API_BASE_URL}${API_PATHS.AUTH.LOGIN}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(credentials)
		});

		await handleApiError(response, 'Login failed');

		const result = (await response.json()) as LoginSuccessResponse;

		if (result.success && result.data) {
			// Store token in localStorage
			localStorage.setItem('accessToken', result.data.token);
			localStorage.setItem('tokenExpiresAt', result.data.expiresAt);
			return result;
		}

		throw new Error('Login failed');
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Verify authentication token
 */
export const verify = async (): Promise<User | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}${API_PATHS.AUTH.VERIFY}`, {
			method: 'GET',
			headers: getAuthHeaders()
		});

		if (!response.ok) {
			return null;
		}

		const result = (await response.json()) as VerifyTokenResponse;

		if (result.success && result.data) {
			return result.data;
		}

		return null;
	} catch (error) {
		console.error('Token verification failed:', error);
		return null;
	}
};

/**
 * Refresh authentication token
 */
export const refresh = async (): Promise<string | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}${API_PATHS.AUTH.REFRESH}`, {
			method: 'POST',
			headers: getAuthHeaders()
		});

		if (!response.ok) {
			return null;
		}

		const result = await response.json();

		if (result.success && result.data?.token) {
			localStorage.setItem('accessToken', result.data.token);
			localStorage.setItem('tokenExpiresAt', result.data.expiresAt);
			return result.data.token;
		}

		return null;
	} catch (error) {
		console.error('Token refresh failed:', error);
		return null;
	}
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE_URL}${API_PATHS.AUTH.LOGOUT}`, {
			method: 'POST',
			headers: getAuthHeaders()
		});

		await handleApiError(response, 'Logout failed');

		const result = (await response.json()) as LogoutSuccessResponse;

		if (!result.success) {
			throw new Error('Logout failed');
		}
	} catch (error) {
		// Log error but don't throw - we still want to clear local storage
		console.error('Logout error:', error);
	} finally {
		// Always clear local storage
		localStorage.removeItem('accessToken');
		localStorage.removeItem('tokenExpiresAt');
	}
};

/**
 * Change user password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE_URL}${API_PATHS.AUTH.CHANGE_PASSWORD}`, {
			method: 'PUT',
			headers: getAuthHeaders(),
			body: JSON.stringify(data)
		});

		await handleApiError(response, 'Failed to change password');

		const result = (await response.json()) as ChangePasswordSuccessResponse;

		if (!result.success) {
			throw new Error('Failed to change password');
		}
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Send forgot password email
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE_URL}${API_PATHS.AUTH.FORGOT_PASSWORD}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		await handleApiError(response, 'Failed to send reset email');

		const result = (await response.json()) as ForgotPasswordSuccessResponse;

		if (!result.success) {
			throw new Error('Failed to send reset email');
		}
	} catch (error) {
		return handleNetworkError(error);
	}
};

/**
 * Reset password with token
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE_URL}${API_PATHS.AUTH.RESET_PASSWORD}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		await handleApiError(response, 'Failed to reset password');

		const result = (await response.json()) as ResetPasswordSuccessResponse;

		if (!result.success) {
			throw new Error('Failed to reset password');
		}
	} catch (error) {
		return handleNetworkError(error);
	}
};

// Deprecated: Keep for backward compatibility, will be removed in next version
/** @deprecated Use named imports instead: import { login, verify, logout, ... } */
export const authApi = {
	login,
	verify,
	refresh,
	logout,
	changePassword,
	forgotPassword,
	resetPassword
};
