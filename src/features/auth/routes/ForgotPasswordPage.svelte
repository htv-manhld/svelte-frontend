<script lang="ts">
	import * as authApi from '$lib/api/auth';
	import Input from '$lib/components/forms/Input.svelte';
	import FormError from '$lib/components/forms/FormError.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import MetaHead from '$lib/components/common/MetaHead.svelte';
	import { PAGE_METADATA } from '$lib/constants/metadata';
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { t } from '$lib/i18n';
	import { forgotPasswordSchema } from '$features/auth/validation/schemas';
	import { validate } from '$lib/utils/validation';

	let email = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let mounted = $derived(true);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		success = false;
		fieldErrors = {};

		// Validate using Valibot schema (trim/lowercase handled in schema)
		const validationResult = validate(forgotPasswordSchema, { email });

		if (!validationResult.success) {
			fieldErrors = validationResult.errors;
			return;
		}

		isLoading = true;

		try {
			const resetUrl = `${window.location.origin}/reset-password`;
			await authApi.forgotPassword({ email: validationResult.data.email, resetUrl });
			success = true;
		} catch (err) {
			error = err instanceof Error ? err.message : t('auth.forgotPassword.failedToSend');
		} finally {
			isLoading = false;
		}
	}
</script>

<MetaHead {...PAGE_METADATA.forgotPassword} />

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-teal-50 px-4 py-12 sm:px-6 lg:px-8"
>
	<!-- Animated Background Shapes -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-300 opacity-70 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-300 opacity-70 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animate-blob animation-delay-4000 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-cyan-300 opacity-70 mix-blend-multiply blur-xl filter"
		></div>
	</div>

	{#if mounted}
		<div class="relative z-10 w-full max-w-md" in:fly={{ y: 20, duration: 600, easing: quintOut }}>
			<!-- Logo/Icon -->
			<div class="mb-8 flex justify-center" in:fly={{ y: -20, duration: 600, delay: 200, easing: quintOut }}>
				<div
					class="flex h-16 w-16 transform items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-600 shadow-lg shadow-indigo-500/50 transition-transform duration-300 hover:scale-110"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-10 w-10 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>
			</div>

			<!-- Title -->
			<div class="mb-8 text-center" in:fly={{ y: -20, duration: 600, delay: 300, easing: quintOut }}>
				<h2
					class="mb-2 bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-4xl font-extrabold text-transparent"
				>
					{t('auth.forgotPassword.title')}
				</h2>
				<p class="text-sm text-gray-600">
					{t('auth.forgotPassword.subtitle')}
				</p>
			</div>

			{#if success}
				<!-- Success State -->
				<div class="space-y-6" in:scale={{ duration: 500, easing: quintOut }}>
					<div class="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-lg">
						<div class="flex flex-col items-center space-y-4 text-center">
							<!-- Success Icon -->
							<div
								class="flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-12 w-12 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
									/>
								</svg>
							</div>

							<div>
								<h3 class="mb-2 text-xl font-bold text-gray-900">{t('auth.forgotPassword.success.title')}</h3>
								<p class="text-sm text-gray-600">
									{t('auth.forgotPassword.success.message')} <strong class="text-indigo-600">{email}</strong>
								</p>
							</div>

							<div class="w-full border-t border-gray-200 pt-4">
								<p class="mb-4 text-xs text-gray-500">
									{t('auth.forgotPassword.success.helpText')}
								</p>
								<a
									href="/login"
									class="inline-flex items-center gap-2 font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-500"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10 19l-7-7m0 0l7-7m-7 7h18"
										/>
									</svg>
									{t('auth.forgotPassword.backToLogin')}
								</a>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- Form Card -->
				<div
					class="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-lg"
					in:fly={{ y: 20, duration: 600, delay: 400, easing: quintOut }}
				>
					<form class="space-y-6" onsubmit={handleSubmit}>
						{#if error}
							<div in:fly={{ y: -10, duration: 300 }}>
								<FormError message={error} />
							</div>
						{/if}

						<div in:fly={{ x: -20, duration: 400, delay: 500, easing: quintOut }}>
							<Input
								type="email"
								id="email"
								name="email"
								label={t('auth.forgotPassword.emailLabel')}
								bind:value={email}
								placeholder={t('auth.forgotPassword.emailPlaceholder')}
								error={fieldErrors.email}
								disabled={isLoading}
								autocomplete="email"
							/>
						</div>

						<div in:fly={{ y: 20, duration: 400, delay: 600, easing: quintOut }}>
							<Button
								type="submit"
								variant="primary"
								fullWidth
								disabled={isLoading}
								class="group relative overflow-hidden"
							>
								<span class="relative z-10 flex items-center justify-center gap-2">
									{#if isLoading}
										<svg
											class="h-5 w-5 animate-spin text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										<span>{t('auth.forgotPassword.submitting')}</span>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
										<span>{t('auth.forgotPassword.submitButton')}</span>
									{/if}
								</span>
							</Button>
						</div>

						<div class="text-center" in:fly={{ y: 10, duration: 400, delay: 700, easing: quintOut }}>
							<a
								href="/login"
								class="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors duration-200 hover:text-indigo-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
								{t('auth.forgotPassword.backToLogin')}
							</a>
						</div>
					</form>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	@keyframes blob {
		0% {
			transform: translate(0px, 0px) scale(1);
		}
		33% {
			transform: translate(30px, -50px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		100% {
			transform: translate(0px, 0px) scale(1);
		}
	}

	.animate-blob {
		animation: blob 7s infinite;
	}

	.animation-delay-2000 {
		animation-delay: 2s;
	}

	.animation-delay-4000 {
		animation-delay: 4s;
	}
</style>
