/**
 * API endpoint paths
 */
export const API_PATHS = {
	AUTH: {
		LOGIN: '/auth/login',
		LOGOUT: '/auth/logout',
		VERIFY: '/auth/verify',
		REFRESH: '/auth/refresh',
		CHANGE_PASSWORD: '/auth/change-password',
		FORGOT_PASSWORD: '/auth/forgot-password',
		RESET_PASSWORD: '/auth/reset-password'
	}
} as const;
