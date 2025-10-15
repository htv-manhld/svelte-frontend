<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { User, CreateUserRequest, UpdateUserRequest } from '$lib/api/generated/users/types';
	import { createUserSchema, updateUserSchema } from '$features/users/validation/schemas';
	import { validate } from '$lib/utils/validation';

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
		birthdate?: string;
	}

	let { isOpen = $bindable(false), mode = 'create', user = null, onsubmit, onclose }: Props = $props();

	let formData = $state<UserFormData>({
		email: '',
		name: '',
		birthdate: ''
	});

	let fieldErrors = $state<Record<string, string>>({});

	$effect(() => {
		if (isOpen) {
			// Reset errors when modal opens
			fieldErrors = {};

			if (mode === 'edit' && user) {
				formData = {
					name: user.name,
					birthdate: user.birthdate || ''
				};
			} else {
				formData = {
					email: '',
					name: '',
					birthdate: ''
				};
			}
		}
	});

	function handleSubmit(event: Event) {
		event.preventDefault();
		fieldErrors = {};

		if (onsubmit) {
			// Validate based on mode (trim/transform handled in Valibot schema)
			if (mode === 'create') {
				const validationResult = validate(createUserSchema, formData);
				if (!validationResult.success) {
					fieldErrors = validationResult.errors;
					return;
				}

				const payload: CreateUserRequest = {
					email: validationResult.data.email,
					name: validationResult.data.name,
					birthdate: validationResult.data.birthdate || null
				};

				onsubmit(new CustomEvent('submit', { detail: { mode, data: payload } }));
			} else {
				const validationResult = validate(updateUserSchema, formData);
				if (!validationResult.success) {
					fieldErrors = validationResult.errors;
					return;
				}

				const payload: UpdateUserRequest = {
					name: validationResult.data.name,
					birthdate: validationResult.data.birthdate || null
				};

				onsubmit(new CustomEvent('submit', { detail: { mode, data: payload } }));
			}
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
								class="w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
								class:border-red-300={fieldErrors.email}
								class:border-gray-300={!fieldErrors.email}
								class:focus:border-blue-500={!fieldErrors.email}
								class:focus:ring-blue-200={!fieldErrors.email}
								class:focus:border-red-500={fieldErrors.email}
								class:focus:ring-red-200={fieldErrors.email}
								placeholder="user@example.com"
							/>
							{#if fieldErrors.email}
								<p class="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
							{/if}
						</div>
					{/if}

					<div class="mb-5">
						<label for="name" class="mb-2 block text-sm font-semibold text-gray-700"> Full Name </label>
						<input
							id="name"
							type="text"
							bind:value={formData.name}
							class="w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
							class:border-red-300={fieldErrors.name}
							class:border-gray-300={!fieldErrors.name}
							class:focus:border-blue-500={!fieldErrors.name}
							class:focus:ring-blue-200={!fieldErrors.name}
							class:focus:border-red-500={fieldErrors.name}
							class:focus:ring-red-200={fieldErrors.name}
							placeholder="John Doe"
						/>
						{#if fieldErrors.name}
							<p class="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
						{/if}
					</div>

					<div class="mb-5">
						<label for="birthdate" class="mb-2 block text-sm font-semibold text-gray-700"> Birthdate (Optional) </label>
						<input
							id="birthdate"
							type="date"
							bind:value={formData.birthdate}
							class="w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
							class:border-red-300={fieldErrors.birthdate}
							class:border-gray-300={!fieldErrors.birthdate}
							class:focus:border-blue-500={!fieldErrors.birthdate}
							class:focus:ring-blue-200={!fieldErrors.birthdate}
							class:focus:border-red-500={fieldErrors.birthdate}
							class:focus:ring-red-200={fieldErrors.birthdate}
						/>
						{#if fieldErrors.birthdate}
							<p class="mt-1 text-sm text-red-600">{fieldErrors.birthdate}</p>
						{/if}
					</div>

					<div class="mt-6 flex justify-end gap-3">
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
