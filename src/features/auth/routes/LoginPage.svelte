<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import * as authApi from '$lib/api/auth';
	import { authStore } from '$features/auth/stores/authStore.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import FormError from '$lib/components/forms/FormError.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import LockIcon from '$lib/components/icons/LockIcon.svelte';
	import SpinnerIcon from '$lib/components/icons/SpinnerIcon.svelte';
	import ArrowRightIcon from '$lib/components/icons/ArrowRightIcon.svelte';
	import MetaHead from '$lib/components/common/MetaHead.svelte';
	import { PAGE_METADATA } from '$lib/constants/metadata';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { t } from '$lib/i18n';
	import { loginSchema } from '$features/auth/validation/schemas';
	import { validate } from '$lib/utils/validation';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let fieldErrors = $state<Record<string, string>>({});
	let mounted = $state(false);

	// Get redirect URL from query params
	let redirectTo = $state('/');

	$effect(() => {
		mounted = true;
		if (browser) {
			const params = new URLSearchParams(window.location.search);
			redirectTo = params.get('redirect') || '/';
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		fieldErrors = {};

		// Validate using Valibot schema
		const validationResult = validate(loginSchema, { email, password });

		if (!validationResult.success) {
			fieldErrors = validationResult.errors;
			return;
		}

		isLoading = true;

		try {
			const result = await authApi.login({
				email: validationResult.data.email,
				password: validationResult.data.password
			});
			authStore.setUser(result.data.user);
			// Redirect to the saved path or home page
			goto(redirectTo);
		} catch (err) {
			error = err instanceof Error ? err.message : t('auth.login.loginFailed');
		} finally {
			isLoading = false;
		}
	}
</script>

<MetaHead {...PAGE_METADATA.login} />

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8"
>
	<!-- Animated Background Shapes -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300 opacity-70 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animate-blob animation-delay-4000 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter"
		></div>
	</div>

	{#if mounted}
		<div class="relative z-10 w-full max-w-md" in:fly={{ y: 20, duration: 600, easing: quintOut }}>
			<!-- Logo/Icon -->
			<div class="mb-8 flex justify-center" in:fly={{ y: -20, duration: 600, delay: 200, easing: quintOut }}>
				<div
					class="flex h-16 w-16 transform items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50 transition-transform duration-300 hover:scale-110"
				>
					<LockIcon class="h-10 w-10 text-white" />
				</div>
			</div>

			<!-- Title -->
			<div class="mb-8 text-center" in:fly={{ y: -20, duration: 600, delay: 300, easing: quintOut }}>
				<h2
					class="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-extrabold text-transparent"
				>
					{t('auth.login.title')}
				</h2>
				<p class="text-sm text-gray-600">{t('auth.login.subtitle')}</p>
			</div>

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
							label={t('auth.login.emailLabel')}
							bind:value={email}
							placeholder={t('auth.login.emailPlaceholder')}
							error={fieldErrors.email}
							disabled={isLoading}
							autocomplete="email"
						/>
					</div>

					<div in:fly={{ x: -20, duration: 400, delay: 600, easing: quintOut }}>
						<Input
							type="password"
							id="password"
							name="password"
							label={t('auth.login.passwordLabel')}
							bind:value={password}
							placeholder={t('auth.login.passwordPlaceholder')}
							error={fieldErrors.password}
							disabled={isLoading}
							autocomplete="current-password"
						/>
					</div>

					<div class="flex items-center justify-end" in:fly={{ x: -20, duration: 400, delay: 700, easing: quintOut }}>
						<div class="text-sm">
							<a
								href="/forgot-password"
								class="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500 hover:underline"
							>
								{t('auth.login.forgotPassword')}
							</a>
						</div>
					</div>

					<div in:fly={{ y: 20, duration: 400, delay: 800, easing: quintOut }}>
						<Button
							type="submit"
							variant="primary"
							fullWidth
							disabled={isLoading}
							class="group relative overflow-hidden"
						>
							<span class="relative z-10 flex items-center justify-center gap-2">
								{#if isLoading}
									<SpinnerIcon class="h-5 w-5 text-white" />
									<span>{t('auth.login.submitting')}</span>
								{:else}
									<span>{t('auth.login.submitButton')}</span>
									<ArrowRightIcon
										class="h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1"
									/>
								{/if}
							</span>
						</Button>
					</div>
				</form>
			</div>
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
