// Global Svelte stores

import { writable } from 'svelte/store';
import type { User } from '$lib/types';

// User store
export const currentUser = writable<User | null>(null);

// UI state stores
export const isLoading = writable(false);
export const error = writable<string | null>(null);

// Theme store
export const theme = writable<'light' | 'dark'>('light');

// Sidebar state
export const sidebarOpen = writable(false);

// Notification store
export const notifications = writable<
	Array<{
		id: string;
		type: 'success' | 'error' | 'warning' | 'info';
		message: string;
		duration?: number;
	}>
>([]);
