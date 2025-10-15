<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$features/auth/stores/authStore.svelte';
	import DashboardPage from '$features/dashboard/routes/+page.svelte';
	import MetaHead from '$lib/components/common/MetaHead.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import { t } from '$lib/i18n';

	let isLoading = $state(true);

	onMount(() => {
		// Wait a bit for auth to initialize
		setTimeout(() => {
			isLoading = false;
		}, 100);
	});
</script>

<MetaHead title={t('home.title')} description={t('home.description')} />

{#if isLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
	</div>
{:else if authStore.isAuthenticated}
	<!-- Show Dashboard for authenticated users -->
	<DashboardPage />
{:else}
	<!-- Show welcome page for unauthenticated users -->
	<div
		class="from-primary/10 to-secondary/10 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br px-4"
	>
		<div class="mx-auto max-w-4xl text-center">
			<h1 class="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
				{t('home.welcome')}
			</h1>
			<p class="mb-8 text-xl text-gray-600 md:text-2xl">
				{t('home.subtitle')}
			</p>

			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<Button onclick={() => goto('/login')} variant="primary" size="lg">
					{t('home.login')}
				</Button>
			</div>
		</div>
	</div>
{/if}
