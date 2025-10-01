import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types';

interface UsersState {
	users: User[];
	loading: boolean;
	error: string | null;
	pagination: {
		page: number;
		size: number;
		total: number;
		totalPages: number;
	};
}

const initialState: UsersState = {
	users: [],
	loading: true, // Start with loading to prevent flash of empty state
	error: null,
	pagination: {
		page: 0,
		size: 20,
		total: 0,
		totalPages: 0
	}
};

function createUsersStore() {
	const { subscribe, set, update } = writable<UsersState>(initialState);

	return {
		subscribe,
		setLoading: (loading: boolean) => update((state) => ({ ...state, loading })),
		setUsers: (users: User[], total: number) =>
			update((state) => ({
				...state,
				users,
				error: null,
				pagination: {
					...state.pagination,
					total,
					totalPages: Math.ceil(total / state.pagination.size)
				}
			})),
		setError: (error: string) => update((state) => ({ ...state, error, loading: false })),
		setPage: (page: number) => update((state) => ({ ...state, pagination: { ...state.pagination, page } })),
		setPageSize: (size: number) => update((state) => ({ ...state, pagination: { ...state.pagination, size } })),
		addUser: (user: User) =>
			update((state) => ({
				...state,
				users: [user, ...state.users],
				pagination: { ...state.pagination, total: state.pagination.total + 1 }
			})),
		updateUser: (updatedUser: User) =>
			update((state) => ({
				...state,
				users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
			})),
		deleteUser: (userId: string) =>
			update((state) => ({
				...state,
				users: state.users.filter((u) => u.id !== userId),
				pagination: { ...state.pagination, total: state.pagination.total - 1 }
			})),
		reset: () => set(initialState)
	};
}

export const usersStore = createUsersStore();

// Derived stores
export const users = derived(usersStore, ($state) => $state.users);
export const loading = derived(usersStore, ($state) => $state.loading);
export const error = derived(usersStore, ($state) => $state.error);
export const pagination = derived(usersStore, ($state) => $state.pagination);
