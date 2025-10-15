import { authStore } from '$features/auth/stores/authStore.svelte';
import { browser } from '$app/environment';

export const ssr = false;

export async function load() {
	if (browser) {
		// Initialize auth store on app startup
		await authStore.initialize();
	}

	return {};
}
