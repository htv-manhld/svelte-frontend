<script lang="ts">
	import { page } from '$app/stores';
	import { goto, afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { isMobile } from '$lib/utils/breakpoints';
	import { authStore } from '$features/auth/stores/authStore.svelte';
	import { t } from '$lib/i18n';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface SidebarProps {
		isOpen?: boolean;
		onToggle?: () => void;
	}

	let { isOpen = true, onToggle }: SidebarProps = $props();

	let dropdownOpen = $state(false);

	afterNavigate(() => {
		if (browser && isMobile() && isOpen && onToggle) {
			onToggle();
		}
	});

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	async function handleLogout() {
		await authStore.logout();
		goto('/login');
	}

	const menuItems = [
		{
			name: t('layout.sidebar.dashboard'),
			href: '/',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>'
		},
		{
			name: t('layout.sidebar.users'),
			href: '/users',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>'
		},
		{
			name: t('layout.sidebar.analytics'),
			href: '/analytics',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>'
		},
		{
			name: t('layout.sidebar.settings'),
			href: '/settings',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
		}
	];
</script>

<aside
	class="fixed top-0 left-0 h-full w-64 border-r bg-gray-900 text-white transition-transform duration-300 {isOpen
		? 'translate-x-0'
		: '-translate-x-full'}"
>
	<div class="border-b border-gray-700 p-3 md:p-6">
		<a href="/" class="block transition-opacity hover:opacity-80">
			<h1 class="text-2xl font-bold">{t('layout.appName')}</h1>
		</a>
	</div>

	<nav class="p-4">
		<ul class="space-y-2">
			{#each menuItems as item (item.href)}
				{@const isActive = item.href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(item.href)}
				<li>
					<a
						href={item.href}
						class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-800 {isActive
							? 'bg-gray-800 font-semibold'
							: ''}"
					>
						<span class="h-6 w-6">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html item.icon}
						</span>
						<span>{item.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="absolute bottom-0 w-full border-t border-gray-700 p-4">
		{#if authStore.isAuthenticated && authStore.user}
			<div class="relative">
				<!-- User Profile Button -->
				<button
					onclick={toggleDropdown}
					class="flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-800"
				>
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							/>
						</svg>
					</div>
					<div class="flex-1 overflow-hidden text-left text-sm">
						<div class="truncate font-semibold">{authStore.user.name}</div>
						<div class="truncate text-xs text-gray-400">{authStore.user.email}</div>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5 transition-transform {dropdownOpen ? 'rotate-180' : ''}"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
					</svg>
				</button>

				<!-- Dropdown Menu -->
				{#if dropdownOpen}
					<div class="mt-2 space-y-1 overflow-hidden" transition:slide={{ duration: 300, easing: quintOut }}>
						<a
							href="/profile"
							class="flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-gray-800"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-5 w-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							My Profile
						</a>
						<a
							href="/change-password"
							class="flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-gray-800"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-5 w-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
								/>
							</svg>
							Change Password
						</a>
						<button
							onclick={handleLogout}
							class="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-red-400 transition-colors hover:bg-gray-800"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-5 w-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
								/>
							</svg>
							Logout
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</aside>
