<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { User, CreateUserRequest, UpdateUserRequest } from '$lib/types';

	interface Props {
		isOpen?: boolean;
		mode?: 'create' | 'edit';
		user?: User | null;
		onsubmit?: (event: CustomEvent) => void;
		onclose?: () => void;
	}

	interface UserFormData {
		email?: string;
		name: string;
		age: number;
	}

	let { isOpen = $bindable(false), mode = 'create', user = null, onsubmit, onclose }: Props = $props();

	let formData = $state<UserFormData>({
		email: '',
		name: '',
		age: 18
	});

	$effect(() => {
		if (isOpen) {
			if (mode === 'edit' && user) {
				formData = {
					name: user.name,
					age: user.age
				};
			} else {
				formData = {
					email: '',
					name: '',
					age: 18
				};
			}
		}
	});

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (onsubmit) {
			// Build the correct payload based on mode
			const payload: CreateUserRequest | UpdateUserRequest = {
				email: formData.email!,
				name: formData.name,
				age: formData.age
			};

			onsubmit(new CustomEvent('submit', { detail: { mode, data: payload } }));
		}
	}

	function handleClose() {
		if (onclose) {
			onclose();
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
		onclick={(e) => e.target === e.currentTarget && handleClose()}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		transition:fade={{ duration: 300, easing: cubicOut }}
	>
		<div class="mx-4 w-full max-w-md" transition:scale={{ duration: 300, easing: cubicOut, start: 0.8 }}>
			<div class="overflow-hidden rounded-2xl bg-white shadow-2xl">
				<div class="px-8 pt-8 pb-4">
					<h2 id="modal-title" class="mb-2 text-2xl font-bold text-gray-800">
						{mode === 'create' ? 'Create New User' : 'Edit User'}
					</h2>
					<p class="text-sm text-gray-600">
						{mode === 'create' ? 'Add a new user to the system' : 'Update user information'}
					</p>
				</div>

				<form onsubmit={handleSubmit} class="px-8 pb-8">
					{#if mode === 'create'}
						<div class="mb-5">
							<label for="email" class="mb-2 block text-sm font-semibold text-gray-700"> Email Address </label>
							<input
								id="email"
								type="email"
								bind:value={formData.email}
								class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
								placeholder="user@example.com"
								required
							/>
						</div>
					{/if}

					<div class="mb-5">
						<label for="name" class="mb-2 block text-sm font-semibold text-gray-700"> Full Name </label>
						<input
							id="name"
							type="text"
							bind:value={formData.name}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
							placeholder="John Doe"
							required
						/>
					</div>

					<div class="mb-6">
						<label for="age" class="mb-2 block text-sm font-semibold text-gray-700"> Age </label>
						<input
							id="age"
							type="number"
							bind:value={formData.age}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
							placeholder="25"
							min="1"
							required
						/>
					</div>

					<div class="flex justify-end gap-3">
						<button
							type="button"
							onclick={handleClose}
							class="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
						>
							{mode === 'create' ? 'Create User' : 'Save Changes'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
