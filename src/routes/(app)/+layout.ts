import { authStore } from '$features/auth/stores/authStore.svelte';
import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	if (browser) {
		// Wait for auth initialization with timeout
		let attempts = 0;
		const maxAttempts = 100; // 5 seconds max (100 * 50ms)

		while (authStore.isLoading && attempts < maxAttempts) {
			await new Promise((resolve) => setTimeout(resolve, 50));
			attempts++;
		}

		// Redirect to login if not authenticated
		if (!authStore.isAuthenticated) {
			const redirectTo = url.pathname + url.search;
			throw redirect(302, `/login?redirect=${encodeURIComponent(redirectTo)}`);
		}
	}

	return {};
};
