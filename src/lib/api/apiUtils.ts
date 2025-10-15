/**
 * Shared API utilities for making HTTP requests
 * Provides common functions for headers, error handling, and request execution
 */

// Use relative URL in development to leverage Vite proxy, absolute URL in production
export const API_BASE_URL = import.meta.env.DEV
	? '/api' // Vite proxy will forward to backend
	: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api';

/**
 * Get authentication headers with token from localStorage
 */
export const getAuthHeaders = (): HeadersInit => {
	const token = localStorage.getItem('accessToken');
	return {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
};

/**
 * Handle API error responses with multiple error message field fallbacks
 */
export const handleApiError = async (response: Response, defaultMessage: string): Promise<void> => {
	if (!response.ok) {
		let errorMessage = defaultMessage;
		try {
			const error = await response.json();
			// Try multiple possible error message fields
			errorMessage = error.message || error.error || error.detail || error.msg || errorMessage;
		} catch (parseError) {
			// If JSON parsing fails, use default message
			console.error('Failed to parse error response:', parseError);
		}
		throw new Error(errorMessage);
	}
};

/**
 * Handle network errors with user-friendly messages
 */
export const handleNetworkError = (error: unknown): never => {
	if (error instanceof TypeError && error.message === 'Failed to fetch') {
		throw new Error('Cannot connect to server. Please check if the backend is running.');
	}
	throw error;
};

/**
 * Execute API request with standard error handling
 */
export const executeApiRequest = async <T>(requestFn: () => Promise<Response>, errorMessage: string): Promise<T> => {
	try {
		const response = await requestFn();
		await handleApiError(response, errorMessage);
		return (await response.json()) as T;
	} catch (error) {
		return handleNetworkError(error);
	}
};
