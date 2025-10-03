<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import type { User } from '$lib/api/generated/users/types';
	import { dashboardService } from '$features/dashboard/services/dashboardService';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ErrorState from '$lib/components/feedback/ErrorState.svelte';
	import CardSkeleton from '$lib/components/cards/CardSkeleton.svelte';
	import DashboardStats from '$features/dashboard/components/DashboardStats.svelte';
	import RecentUsersTable from '$features/dashboard/components/RecentUsersTable.svelte';

	let userCount = $state(0);
	let activeUsers = $state(0);
	let newToday = $state(0);
	let recentUsers = $state<User[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		await loadDashboardData();
	});

	async function loadDashboardData() {
		loading = true;
		error = null;
		try {
			// Load stats and recent users in parallel
			const [stats, recentData] = await Promise.all([dashboardService.getStats(), dashboardService.getRecentUsers(10)]);

			userCount = stats.userCount;
			activeUsers = stats.activeUsers;
			newToday = stats.newToday;
			recentUsers = recentData.users;
		} catch (e) {
			console.error('API Error:', e);
			error = e instanceof Error ? e.message : t('errors.failedToLoad');
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen p-4 md:p-8">
	<PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

	{#if error}
		<ErrorState title={t('dashboard.errorTitle')} message={error} onRetry={loadDashboardData} />
	{:else if loading}
		<!-- Stats Skeleton -->
		<div class="mb-8 grid gap-6 md:grid-cols-3">
			<CardSkeleton hasHeader={false} />
			<CardSkeleton hasHeader={false} />
			<CardSkeleton hasHeader={false} />
		</div>
		<!-- Recent Users Skeleton -->
		<CardSkeleton />
	{:else}
		<DashboardStats {userCount} {activeUsers} {newToday} />

		<RecentUsersTable users={recentUsers} />
	{/if}
</div>
