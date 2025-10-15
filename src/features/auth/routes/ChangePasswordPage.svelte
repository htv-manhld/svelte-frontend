<script lang="ts">
	import { goto } from '$app/navigation';
	import * as authApi from '$lib/api/auth';
	import { authStore } from '$features/auth/stores/authStore.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import FormError from '$lib/components/forms/FormError.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import MetaHead from '$lib/components/common/MetaHead.svelte';
	import { PAGE_METADATA } from '$lib/constants/metadata';
	import { t } from '$lib/i18n';
	import { notificationStore } from '$lib/stores/notificationStore.svelte';
	import { changePasswordSchema } from '$features/auth/validation/schemas';
	import { validate } from '$lib/utils/validation';

	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state(false);
	let fieldErrors = $state<Record<string, string>>({});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		success = false;
		fieldErrors = {};

		// Validate using Valibot schema (password matching handled in schema)
		const validationResult = validate(changePasswordSchema, {
			oldPassword,
			newPassword,
			confirmPassword
		});

		if (!validationResult.success) {
			// Use errors directly as they come from validation
			fieldErrors = validationResult.errors;
			return;
		}

		isLoading = true;

		try {
			await authApi.changePassword({
				oldPassword: validationResult.data.oldPassword,
				newPassword: validationResult.data.newPassword
			});

			// Show success notification
			notificationStore.success(t('auth.changePassword.success.message'));

			// Logout immediately and redirect to login
			await authStore.logout();
			goto('/login');
		} catch (err) {
			error = err instanceof Error ? err.message : t('auth.changePassword.failedToChange');
			isLoading = false;
		}
	}
</script>

<MetaHead {...PAGE_METADATA.changePassword} />

<div class="container mx-auto px-4 py-8">
	<PageHeader title={t('auth.changePassword.title')} />

	<div class="mx-auto mt-8 max-w-2xl">
		{#if success}
			<div class="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700" role="alert">
				<p class="text-sm">{t('auth.changePassword.success.message')}</p>
			</div>
		{/if}

		<form class="rounded-lg bg-white p-8 shadow" onsubmit={handleSubmit}>
			<FormError message={error} />

			<Input
				type="password"
				id="oldPassword"
				name="oldPassword"
				label={t('auth.changePassword.currentPasswordLabel')}
				bind:value={oldPassword}
				placeholder={t('auth.changePassword.currentPasswordPlaceholder')}
				error={fieldErrors.oldPassword}
				disabled={isLoading}
				autocomplete="current-password"
			/>

			<Input
				type="password"
				id="newPassword"
				name="newPassword"
				label={t('auth.changePassword.newPasswordLabel')}
				bind:value={newPassword}
				placeholder={t('auth.changePassword.newPasswordPlaceholder')}
				error={fieldErrors.newPassword}
				disabled={isLoading}
				autocomplete="new-password"
			/>

			<Input
				type="password"
				id="confirmPassword"
				name="confirmPassword"
				label={t('auth.changePassword.confirmPasswordLabel')}
				bind:value={confirmPassword}
				placeholder={t('auth.changePassword.confirmPasswordPlaceholder')}
				error={fieldErrors.confirmPassword}
				disabled={isLoading}
				autocomplete="new-password"
			/>

			<div class="mt-6 flex gap-4">
				<Button type="submit" variant="primary" disabled={isLoading}>
					{isLoading ? t('auth.changePassword.submitting') : t('auth.changePassword.submitButton')}
				</Button>
				<Button type="button" variant="secondary" onclick={() => goto('/')} disabled={isLoading}>
					{t('common.cancel')}
				</Button>
			</div>
		</form>
	</div>
</div>
