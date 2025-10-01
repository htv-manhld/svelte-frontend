<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Backdrop from '$lib/components/common/Backdrop.svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
	import NotificationContainer from '$lib/components/feedback/NotificationContainer.svelte';
	import { useSidebar } from '$lib/stores/sidebar.svelte';
	import { t } from '$lib/i18n';

	let { children } = $props();
	const sidebar = useSidebar();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if sidebar.isReady}
	<div class="flex min-h-screen bg-gray-50">
		<!-- Backdrop overlay for mobile -->
		{#if sidebar.isOpen}
			<Backdrop onclick={sidebar.toggle} mobileOnly={true} />
		{/if}

		<!-- Desktop sidebar -->
		<div class="hidden lg:block">
			<Sidebar isOpen={sidebar.isOpen} onToggle={sidebar.toggle} />
		</div>

		<!-- Mobile sidebar -->
		<div class="z-30 lg:hidden">
			<Sidebar isOpen={sidebar.isOpen} onToggle={sidebar.toggle} />
		</div>

		<main
			class="w-full transition-all duration-300"
			class:ml-64={sidebar.isOpen}
			class:lg:ml-64={sidebar.isOpen}
			class:lg:transition-none={sidebar.isOpen}
			class:ml-0={!sidebar.isOpen}
		>
			<!-- Header with menu button -->
			<div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-3 md:p-4">
				<button
					onclick={sidebar.toggle}
					class="rounded-lg p-2 transition-colors hover:bg-gray-100"
					aria-label={sidebar.isOpen ? t('layout.menu.close') : t('layout.menu.open')}
				>
					<MenuIcon />
				</button>
				<a href="/" class="text-lg font-bold text-gray-800 transition-opacity hover:opacity-80 lg:hidden"
					>{t('layout.appName')}</a
				>
				<div class="w-10"></div>
			</div>

			{@render children?.()}
		</main>
	</div>

	<!-- Notification Container -->
	<NotificationContainer />
{/if}
