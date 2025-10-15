import * as authApi from '$lib/api/auth';
import type { User } from '$lib/api/generated/users/types';

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: true
};

class AuthStore {
	private state = $state<AuthState>(initialState);

	get user() {
		return this.state.user;
	}

	get isAuthenticated() {
		return this.state.isAuthenticated;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	async initialize() {
		this.state.isLoading = true;
		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				this.state.user = null;
				this.state.isAuthenticated = false;
				return;
			}

			const user = await authApi.verify();
			if (user) {
				this.state.user = user;
				this.state.isAuthenticated = true;
			} else {
				// Token invalid, try to refresh
				const newToken = await authApi.refresh();
				if (newToken) {
					const refreshedUser = await authApi.verify();
					if (refreshedUser) {
						this.state.user = refreshedUser;
						this.state.isAuthenticated = true;
					} else {
						this.clearAuth();
					}
				} else {
					this.clearAuth();
				}
			}
		} catch (error) {
			console.error('Failed to initialize auth:', error);
			this.clearAuth();
		} finally {
			this.state.isLoading = false;
		}
	}

	setUser(user: User) {
		this.state.user = user;
		this.state.isAuthenticated = true;
		this.state.isLoading = false;
	}

	clearAuth() {
		this.state.user = null;
		this.state.isAuthenticated = false;
		this.state.isLoading = false;
		localStorage.removeItem('accessToken');
		localStorage.removeItem('tokenExpiresAt');
	}

	async logout() {
		try {
			await authApi.logout();
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			this.clearAuth();
		}
	}
}

export const authStore = new AuthStore();
