<script lang="ts">
	import StatCard from '$lib/components/cards/StatCard.svelte';
	import { t } from '$lib/i18n';

	interface Props {
		userCount: number;
		activeUsers: number;
		newToday: number;
	}

	let { userCount, activeUsers, newToday }: Props = $props();
</script>

<div class="mb-8 grid gap-6 md:grid-cols-3">
	<StatCard
		title={t('dashboard.stats.totalUsers')}
		value={userCount}
		subtitle={t('dashboard.stats.fromLastMonth')}
		color="blue"
		icon="users"
	/>

	<StatCard
		title={t('dashboard.stats.activeUsers')}
		value={activeUsers}
		subtitle={t('dashboard.stats.allUsersActive')}
		color="green"
		icon="check"
	/>

	<StatCard
		title={t('dashboard.stats.newToday')}
		value={newToday}
		subtitle={t('dashboard.stats.newUsersToday')}
		color="purple"
		icon="plus"
	/>
</div>
