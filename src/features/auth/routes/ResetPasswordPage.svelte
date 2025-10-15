<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as authApi from '$lib/api/auth';
	import Input from '$lib/components/forms/Input.svelte';
	import FormError from '$lib/components/forms/FormError.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import MetaHead from '$lib/components/common/MetaHead.svelte';
	import { PAGE_METADATA } from '$lib/constants/metadata';
	import { t } from '$lib/i18n';
	import { resetPasswordSchema } from '$features/auth/validation/schemas';
	import { validate } from '$lib/utils/validation';

	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state(false);
	let fieldErrors = $state<Record<string, string>>({});

	// Get token from URL query params
	let token = $derived($page.url.searchParams.get('token') || '');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		success = false;
		fieldErrors = {};

		if (!token) {
			error = t('auth.resetPassword.invalidToken');
			return;
		}

		// Validate using Valibot schema (password matching handled in schema)
		const validationResult = validate(resetPasswordSchema, { password, confirmPassword });

		if (!validationResult.success) {
			fieldErrors = validationResult.errors;
			return;
		}

		isLoading = true;

		try {
			await authApi.resetPassword({ token, newPassword: validationResult.data.password });
			success = true;
			setTimeout(() => {
				goto('/login');
			}, 2000);
		} catch (err) {
			error = err instanceof Error ? err.message : t('auth.resetPassword.failedToReset');
		} finally {
			isLoading = false;
		}
	}
</script>

<MetaHead {...PAGE_METADATA.resetPassword} />

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				{t('auth.resetPassword.title')}
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				{t('auth.resetPassword.subtitle')}
			</p>
		</div>

		{#if success}
			<div class="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
				<p class="text-sm">
					{t('auth.resetPassword.success.message')}
				</p>
			</div>
		{:else if !token}
			<div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
				<p class="text-sm">{t('auth.resetPassword.invalidTokenMessage')}</p>
			</div>
			<div class="text-center">
				<a href="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
					{t('auth.resetPassword.backToForgotPassword')}
				</a>
			</div>
		{:else}
			<form class="mt-8 space-y-6 rounded-lg bg-white p-8 shadow" onsubmit={handleSubmit}>
				<FormError message={error} />

				<Input
					type="password"
					id="password"
					name="password"
					label={t('auth.resetPassword.newPasswordLabel')}
					bind:value={password}
					placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
					error={fieldErrors.password}
					disabled={isLoading}
					autocomplete="new-password"
				/>

				<Input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					label={t('auth.resetPassword.confirmPasswordLabel')}
					bind:value={confirmPassword}
					placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
					error={fieldErrors.confirmPassword}
					disabled={isLoading}
					autocomplete="new-password"
				/>

				<div>
					<Button type="submit" variant="primary" fullWidth disabled={isLoading}>
						{isLoading ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submitButton')}
					</Button>
				</div>

				<div class="text-center text-sm">
					<a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
						{t('auth.resetPassword.backToLogin')}
					</a>
				</div>
			</form>
		{/if}
	</div>
</div>
