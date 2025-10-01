<script lang="ts">
	import type { User } from '$lib/types';
	import { t } from '$lib/i18n';

	interface Props {
		users: User[];
	}

	let { users }: Props = $props();
</script>

<div class="rounded-xl bg-white shadow-lg">
	<div class="border-b border-gray-200 p-3 md:p-6">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-xl font-bold text-gray-800">{t('dashboard.recentUsers.title')}</h2>
				<p class="text-sm text-gray-600">{t('dashboard.recentUsers.subtitle')}</p>
			</div>
			<a href="/users" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
				{t('common.viewAll')}
			</a>
		</div>
	</div>
	<div class="p-3 md:p-6">
		{#if users.length === 0}
			<div class="py-12 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mx-auto mb-3 h-16 w-16 text-gray-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
					/>
				</svg>
				<p class="text-gray-500">{t('dashboard.recentUsers.noUsersFound')}</p>
			</div>
		{:else}
			<div class="-mx-3 overflow-x-auto px-3 md:mx-0 md:px-0">
				<table class="w-full min-w-[600px]">
					<thead>
						<tr class="border-b-2 border-gray-200">
							<th class="px-2 py-3 text-left font-semibold whitespace-nowrap text-gray-700">Name</th>
							<th class="px-2 py-3 text-left font-semibold whitespace-nowrap text-gray-700">Email</th>
							<th class="px-2 py-3 text-left font-semibold whitespace-nowrap text-gray-700">Age</th>
							<th class="px-2 py-3 text-left font-semibold whitespace-nowrap text-gray-700">Created At</th>
						</tr>
					</thead>
					<tbody>
						{#each users as user (user.id)}
							<tr class="border-b border-gray-100 transition-colors hover:bg-gray-50">
								<td class="px-2 py-2 md:py-4">
									<div class="flex items-center gap-3">
										<div
											class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600"
										>
											{user.name.charAt(0).toUpperCase()}
										</div>
										<span class="font-medium whitespace-nowrap text-gray-800">{user.name}</span>
									</div>
								</td>
								<td class="px-2 py-2 whitespace-nowrap text-gray-600 md:py-4">{user.email}</td>
								<td class="px-2 py-2 whitespace-nowrap text-gray-600 md:py-4">{user.age}</td>
								<td class="px-2 py-2 whitespace-nowrap text-gray-600 md:py-4"
									>{new Date(user.createdAt).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
