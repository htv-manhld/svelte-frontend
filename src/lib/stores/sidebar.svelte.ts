import { browser } from '$app/environment';
import { isDesktop } from '$lib/utils/breakpoints';

const STORAGE_KEY = 'sidebarOpen';

export function useSidebar() {
	let isOpen = $state(false);
	let isReady = $state(false);

	if (browser) {
		if (isDesktop()) {
			const saved = sessionStorage.getItem(STORAGE_KEY);
			if (saved !== null) {
				isOpen = saved === 'true';
			} else {
				isOpen = false;
			}
		} else {
			isOpen = false;
		}
		isReady = true;
	}

	function toggle() {
		isOpen = !isOpen;
		if (browser && isDesktop()) {
			sessionStorage.setItem(STORAGE_KEY, String(isOpen));
		}
	}

	return {
		get isOpen() {
			return isOpen;
		},
		get isReady() {
			return isReady;
		},
		toggle
	};
}
