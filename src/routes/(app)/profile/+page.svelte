<script lang="ts">
	import { authStore } from '$features/auth/stores/authStore.svelte';
	import * as userApi from '$lib/api/users';
	import Input from '$lib/components/forms/Input.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import FormError from '$lib/components/forms/FormError.svelte';
	import MetaHead from '$lib/components/common/MetaHead.svelte';
	import { notificationStore } from '$lib/stores/notificationStore.svelte';
	import { updateUserSchema } from '$features/users/validation/schemas';
	import { validate } from '$lib/utils/validation';
	import type { UpdateUserRequest } from '$lib/api/generated/users/types';

	const currentUser = $derived(authStore.user);

	let name = $state('');
	let birthdate = $state('');
	let email = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let fieldErrors = $state<Record<string, string>>({});

	// Update form when user changes
	$effect(() => {
		if (currentUser) {
			name = currentUser.name;
			birthdate = currentUser.birthdate || '';
			email = currentUser.email;
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		fieldErrors = {};

		if (!currentUser) {
			error = 'User not found';
			return;
		}

		// Validate using Valibot schema
		const validationResult = validate(updateUserSchema, { name, birthdate });

		if (!validationResult.success) {
			fieldErrors = validationResult.errors;
			return;
		}

		isLoading = true;

		try {
			const payload: UpdateUserRequest = {
				name: validationResult.data.name,
				birthdate: validationResult.data.birthdate || null
			};

			const updatedUser = await userApi.updateUser(currentUser.id, payload);

			// Update user in auth store
			authStore.setUser(updatedUser);

			notificationStore.success('Profile updated successfully');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update profile';
		} finally {
			isLoading = false;
		}
	}
</script>

<MetaHead title="My Profile" description="View and edit your profile information" />

<div class="container mx-auto px-4 py-8">
	<PageHeader title="My Profile" subtitle="Manage your personal information" />

	<div class="mx-auto mt-8 max-w-2xl">
		<!-- Profile Info Card -->
		<div class="mb-6 rounded-lg bg-white p-6 shadow">
			<div class="mb-4 flex items-center">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white"
				>
					{currentUser?.name?.charAt(0).toUpperCase() || 'U'}
				</div>
				<div class="ml-4">
					<h2 class="text-xl font-bold text-gray-900">{currentUser?.name}</h2>
					<p class="text-sm text-gray-600">{currentUser?.email}</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4 border-t pt-4">
				<div>
					<p class="text-sm font-medium text-gray-500">Status</p>
					<p class="mt-1 text-sm text-gray-900">
						{#if currentUser?.status === 1}
							<span
								class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
							>
								Active
							</span>
						{:else}
							<span
								class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
							>
								Inactive
							</span>
						{/if}
					</p>
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500">Member Since</p>
					<p class="mt-1 text-sm text-gray-900">
						{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
					</p>
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500">Last Login</p>
					<p class="mt-1 text-sm text-gray-900">
						{currentUser?.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleDateString() : 'N/A'}
					</p>
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500">Email Verified</p>
					<p class="mt-1 text-sm text-gray-900">
						{#if currentUser?.verifiedAt}
							<span
								class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
							>
								Verified
							</span>
						{:else}
							<span
								class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"
							>
								Not Verified
							</span>
						{/if}
					</p>
				</div>
			</div>
		</div>

		<!-- Edit Profile Form -->
		<div class="rounded-lg bg-white p-8 shadow">
			<h3 class="mb-6 text-lg font-semibold text-gray-900">Edit Profile</h3>

			<form onsubmit={handleSubmit}>
				<FormError message={error} />

				<div class="mb-5">
					<Input
						type="email"
						id="email"
						name="email"
						label="Email Address"
						bind:value={email}
						disabled={true}
						class="bg-gray-50"
					/>
					<p class="mt-1 text-xs text-gray-500">Email cannot be changed. Contact support if you need to update it.</p>
				</div>

				<Input
					type="text"
					id="name"
					name="name"
					label="Full Name"
					bind:value={name}
					placeholder="John Doe"
					error={fieldErrors.name}
					disabled={isLoading}
				/>

				<Input
					type="date"
					id="birthdate"
					name="birthdate"
					label="Birthdate (Optional)"
					bind:value={birthdate}
					error={fieldErrors.birthdate}
					disabled={isLoading}
				/>

				<div class="mt-6 flex gap-4">
					<Button type="submit" variant="primary" disabled={isLoading}>
						{isLoading ? 'Saving...' : 'Save Changes'}
					</Button>
					<a
						href="/change-password"
						class="inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
					>
						Change Password
					</a>
				</div>
			</form>
		</div>
	</div>
</div>
