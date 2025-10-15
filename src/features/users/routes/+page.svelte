<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { User, CreateUserRequest, UpdateUserRequest } from '$lib/api/generated/users/types';
	import { t } from '$lib/i18n';
	import { userService } from '$features/users/services/userService';
	import { users, loading, error, pagination } from '$features/users/stores/usersStore';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import TableSkeleton from '$lib/components/tables/TableSkeleton.svelte';
	import ErrorState from '$lib/components/feedback/ErrorState.svelte';
	import UserModal from '$features/users/components/UserModal.svelte';
	import DeleteModal from '$lib/components/modals/DeleteModal.svelte';
	import UsersTable from '$features/users/components/UsersTable.svelte';
	import Pagination from '$lib/components/navigation/Pagination.svelte';
	import SearchFilter from '$lib/components/forms/SearchFilter.svelte';

	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
	let editingUser = $state<User | null>(null);
	let deletingUser = $state<User | null>(null);
	let orderBy = $state<'id' | 'name' | 'email' | 'status' | 'createdAt' | 'updatedAt'>('createdAt');
	let orderDirection = $state<'asc' | 'desc'>('desc');
	let searchQuery = $state('');
	let statusFilter = $state<0 | 1 | undefined>(undefined);
	let createdFromFilter = $state('');
	let createdToFilter = $state('');
	let showAdvancedFilters = $state(false);

	let pendingSearchQuery = $state('');
	let pendingStatusFilter = $state<0 | 1 | undefined>(undefined);
	let pendingCreatedFromFilter = $state('');
	let pendingCreatedToFilter = $state('');

	// Helper function to build URL with query params
	function buildUrl(params: Record<string, string | number | undefined>) {
		const queryParts: string[] = [];
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== '') {
				queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
			}
		});
		return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
	}

	// Watch URL changes and reload data
	$effect(() => {
		if (browser) {
			// Access page.url.searchParams to trigger reactivity
			const searchParams = $page.url.searchParams;

			// Check if URL has any params - if not, reset to default state
			const hasParams = searchParams.toString().length > 0;

			if (!hasParams) {
				// Reset to default state when no params in URL
				orderBy = 'createdAt';
				orderDirection = 'desc';
				searchQuery = '';
				pendingSearchQuery = '';
				statusFilter = undefined;
				pendingStatusFilter = undefined;
				createdFromFilter = '';
				pendingCreatedFromFilter = '';
				createdToFilter = '';
				pendingCreatedToFilter = '';

				userService.loadUsers(0, 20, true, orderBy, orderDirection);
			} else {
				// Load from URL params
				const urlPage = searchParams.get('page') || '0';
				const urlSize = searchParams.get('size') || '20';
				const urlOrderBy = (searchParams.get('orderBy') || 'createdAt') as
					| 'id'
					| 'name'
					| 'email'
					| 'status'
					| 'createdAt'
					| 'updatedAt';
				const urlOrderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc';
				const urlSearch = searchParams.get('search') || '';
				const urlStatus = searchParams.get('status');
				const urlCreatedFrom = searchParams.get('createdFrom') || '';
				const urlCreatedTo = searchParams.get('createdTo') || '';

				const pageNum = parseInt(urlPage);
				const pageSize = parseInt(urlSize);
				orderBy = urlOrderBy;
				orderDirection = urlOrderDirection;
				searchQuery = urlSearch;
				pendingSearchQuery = urlSearch; // Sync with pending search
				statusFilter = urlStatus ? (parseInt(urlStatus) as 0 | 1) : undefined;
				pendingStatusFilter = statusFilter; // Sync with pending status
				createdFromFilter = urlCreatedFrom;
				pendingCreatedFromFilter = urlCreatedFrom; // Sync with pending
				createdToFilter = urlCreatedTo;
				pendingCreatedToFilter = urlCreatedTo; // Sync with pending

				userService.loadUsers(
					pageNum,
					pageSize,
					true,
					orderBy,
					orderDirection,
					searchQuery,
					statusFilter,
					createdFromFilter || undefined,
					createdToFilter || undefined
				);
			}
		}
	});

	async function handleModalSubmit(event: CustomEvent) {
		const { mode, data } = event.detail;

		try {
			if (mode === 'create') {
				await userService.createUser(data as CreateUserRequest);
				showCreateModal = false;
			} else if (mode === 'edit' && editingUser) {
				await userService.updateUser(editingUser.id, data as UpdateUserRequest);
				showEditModal = false;
				editingUser = null;
			}
		} catch {
			// Error is already handled by the service with notification
		}
	}

	function handleModalClose() {
		showCreateModal = false;
		showEditModal = false;
		showDeleteModal = false;
		editingUser = null;
		deletingUser = null;
	}

	async function handleDeleteUser() {
		if (!deletingUser) return;
		try {
			await userService.deleteUser(deletingUser.id);
			showDeleteModal = false;
			deletingUser = null;
		} catch {
			// Error is already handled by the service with notification
		}
	}

	function openEditModal(user: User) {
		editingUser = user;
		showEditModal = true;
	}

	function openDeleteModal(user: User) {
		deletingUser = user;
		showDeleteModal = true;
	}

	async function handleSearch(query: string) {
		searchQuery = query;

		// Reset to first page when searching
		const page = 0;

		// Update URL with search param (maintain other filters)
		if (browser) {
			const url = buildUrl({
				page: page.toString(),
				size: $pagination.size.toString(),
				orderBy,
				orderDirection,
				search: query || undefined,
				status: statusFilter,
				createdFrom: createdFromFilter || undefined,
				createdTo: createdToFilter || undefined
			});
			goto(url, { replaceState: true, noScroll: true, keepFocus: true });
		}

		// Reload with search and filters
		await userService.loadUsers(
			page,
			$pagination.size,
			true,
			orderBy,
			orderDirection,
			searchQuery,
			statusFilter,
			createdFromFilter || undefined,
			createdToFilter || undefined
		);
	}

	function handleSearchInput(query: string) {
		pendingSearchQuery = query;
		// Only called when Enter is pressed (from SearchFilter component)
		// Will trigger the search
	}

	function handleSearchButtonClick() {
		// Apply all pending filters
		searchQuery = pendingSearchQuery.trim();
		statusFilter = pendingStatusFilter;
		createdFromFilter = pendingCreatedFromFilter;
		createdToFilter = pendingCreatedToFilter;

		// Execute search with all filters
		performSearch();
	}

	async function performSearch() {
		// Reset to first page when searching
		const page = 0;

		// Update URL with all params
		if (browser) {
			const url = buildUrl({
				page: page.toString(),
				size: $pagination.size.toString(),
				orderBy,
				orderDirection,
				search: searchQuery || undefined,
				status: statusFilter,
				createdFrom: createdFromFilter || undefined,
				createdTo: createdToFilter || undefined
			});
			goto(url, { replaceState: true, noScroll: true, keepFocus: true });
		}

		// Reload with search and filters
		await userService.loadUsers(
			page,
			$pagination.size,
			true,
			orderBy,
			orderDirection,
			searchQuery,
			statusFilter,
			createdFromFilter || undefined,
			createdToFilter || undefined
		);
	}

	function handleClearSearch() {
		searchQuery = '';
		pendingSearchQuery = '';
		handleSearch('');
	}

	function handleClearAllFilters() {
		searchQuery = '';
		pendingSearchQuery = '';
		statusFilter = undefined;
		pendingStatusFilter = undefined;
		createdFromFilter = '';
		pendingCreatedFromFilter = '';
		createdToFilter = '';
		pendingCreatedToFilter = '';
		performSearch();
	}

	async function handleSort(field: string) {
		// Toggle sort direction if clicking the same field
		if (orderBy === field) {
			orderDirection = orderDirection === 'asc' ? 'desc' : 'asc';
		} else {
			orderBy = field as 'id' | 'name' | 'email' | 'status' | 'createdAt' | 'updatedAt';
			orderDirection = 'asc';
		}

		// Update URL with sort params (maintain all filters)
		if (browser) {
			const url = buildUrl({
				page: $pagination.page.toString(),
				size: $pagination.size.toString(),
				orderBy,
				orderDirection,
				search: searchQuery || undefined,
				status: statusFilter,
				createdFrom: createdFromFilter || undefined,
				createdTo: createdToFilter || undefined
			});
			goto(url, { replaceState: true, noScroll: true, keepFocus: true });
		}

		// Reload with new sort (maintain all filters)
		await userService.loadUsers(
			$pagination.page,
			$pagination.size,
			true,
			orderBy,
			orderDirection,
			searchQuery,
			statusFilter,
			createdFromFilter || undefined,
			createdToFilter || undefined
		);
	}

	async function handlePageChange(page: number) {
		await userService.loadUsers(
			page,
			$pagination.size,
			true,
			orderBy,
			orderDirection,
			searchQuery,
			statusFilter,
			createdFromFilter || undefined,
			createdToFilter || undefined
		);

		// Update URL with page param (maintain all other params)
		if (browser) {
			const url = buildUrl({
				page: page.toString(),
				size: $pagination.size.toString(),
				orderBy,
				orderDirection,
				search: searchQuery || undefined,
				status: statusFilter,
				createdFrom: createdFromFilter || undefined,
				createdTo: createdToFilter || undefined
			});
			goto(url, { replaceState: true, noScroll: true, keepFocus: true });
		}
	}

	async function handleNextPage() {
		if ($pagination.page < $pagination.totalPages - 1) {
			await handlePageChange($pagination.page + 1);
		}
	}

	async function handlePrevPage() {
		if ($pagination.page > 0) {
			await handlePageChange($pagination.page - 1);
		}
	}
</script>

<div class="min-h-screen p-4 md:p-8">
	<PageHeader
		title={t('users.title')}
		subtitle={t('users.subtitle')}
		action={{
			text: t('users.createUser'),
			onclick: () => (showCreateModal = true)
		}}
	>
		{#snippet actionIcon()}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
		{/snippet}
	</PageHeader>

	<!-- Filters Card -->
	<div class="mb-6">
		<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
			<div class="space-y-4 p-6">
				<!-- Search Section -->
				<div class="flex items-center gap-3">
					<div class="w-full max-w-md">
						<SearchFilter
							bind:value={pendingSearchQuery}
							placeholder="Search by ID, name or email..."
							onInput={handleSearchInput}
							onSearch={handleSearchButtonClick}
							onClear={handleClearSearch}
							disabled={$loading}
						/>
					</div>
					<button
						type="button"
						onclick={handleSearchButtonClick}
						disabled={$loading || !pendingSearchQuery.trim()}
						class="flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:opacity-50"
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
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
							/>
						</svg>
						<span>Search</span>
					</button>
					<button
						type="button"
						onclick={() => (showAdvancedFilters = !showAdvancedFilters)}
						class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
								d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
							/>
						</svg>
						<span>Filters</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-4 w-4 transition-transform {showAdvancedFilters ? 'rotate-180' : ''}"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
						</svg>
						{#if pendingStatusFilter !== undefined || pendingCreatedFromFilter || pendingCreatedToFilter}
							<span
								class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"
							>
								{(pendingStatusFilter !== undefined ? 1 : 0) +
									(pendingCreatedFromFilter ? 1 : 0) +
									(pendingCreatedToFilter ? 1 : 0)}
							</span>
						{/if}
					</button>
					<div class="flex-1"></div>
					{#if statusFilter !== undefined || createdFromFilter || createdToFilter || searchQuery}
						<button
							type="button"
							onclick={handleClearAllFilters}
							disabled={$loading}
							class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<svg
								class="h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
							Reset
						</button>
					{/if}
				</div>

				<!-- Advanced Filters Section (Collapsible) -->
				{#if showAdvancedFilters}
					<div class="animate-in slide-in-from-top-2 border-t border-gray-200 pt-4">
						<h3 class="mb-3 text-sm font-semibold text-gray-900">Advanced Filters</h3>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
							<!-- Status Filter -->
							<div>
								<label for="status-filter" class="mb-2 block text-sm font-medium text-gray-700"> Status </label>
								<div class="relative">
									<select
										id="status-filter"
										bind:value={pendingStatusFilter}
										disabled={$loading}
										class="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
									>
										<option value={undefined}>All Status</option>
										<option value={1}>Active</option>
										<option value={0}>Inactive</option>
									</select>
									<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
										<svg
											class="h-4 w-4 text-gray-400"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
										</svg>
									</div>
								</div>
							</div>

							<!-- Created From Filter -->
							<div>
								<label for="created-from" class="mb-2 block text-sm font-medium text-gray-700"> Created From </label>
								<input
									type="date"
									id="created-from"
									bind:value={pendingCreatedFromFilter}
									disabled={$loading}
									class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
								/>
							</div>

							<!-- Created To Filter -->
							<div>
								<label for="created-to" class="mb-2 block text-sm font-medium text-gray-700"> Created To </label>
								<input
									type="date"
									id="created-to"
									bind:value={pendingCreatedToFilter}
									disabled={$loading}
									class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
								/>
							</div>
						</div>

						<!-- Active Filters Display -->
						{#if statusFilter !== undefined || createdFromFilter || createdToFilter}
							<div class="mt-4 border-t border-gray-200 pt-4">
								<p class="mb-2 text-xs font-medium text-gray-500">Active Filters:</p>
								<div class="flex flex-wrap gap-2">
									{#if statusFilter !== undefined}
										<span
											class="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"
										>
											<svg
												class="h-4 w-4"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											Status: {statusFilter === 1 ? 'Active' : 'Inactive'}
										</span>
									{/if}
									{#if createdFromFilter}
										<span
											class="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700"
										>
											<svg
												class="h-4 w-4"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
												/>
											</svg>
											From: {createdFromFilter}
										</span>
									{/if}
									{#if createdToFilter}
										<span
											class="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700"
										>
											<svg
												class="h-4 w-4"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
												/>
											</svg>
											To: {createdToFilter}
										</span>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if $loading}
		<TableSkeleton rows={10} columns={6} />
	{:else if $error}
		<ErrorState title={t('users.errorTitle')} message={$error} onRetry={() => userService.loadUsers()} />
	{:else if $users.length === 0}
		<!-- Empty state with message -->
		<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
			<div class="p-12 text-center">
				<svg
					class="mx-auto h-16 w-16 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
					/>
				</svg>
				<h3 class="mt-4 text-lg font-semibold text-gray-900">
					{searchQuery || statusFilter !== undefined || createdFromFilter || createdToFilter
						? 'No users found'
						: t('users.noUsersTitle')}
				</h3>
				<p class="mt-2 text-sm text-gray-500">
					{searchQuery || statusFilter !== undefined || createdFromFilter || createdToFilter
						? "Try adjusting your search or filter criteria to find what you're looking for."
						: t('users.noUsersDescription')}
				</p>
				{#if !searchQuery && statusFilter === undefined && !createdFromFilter && !createdToFilter}
					<button
						type="button"
						onclick={() => (showCreateModal = true)}
						class="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 focus:outline-none"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-5 w-5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						{t('users.createFirstUser')}
					</button>
				{/if}
			</div>
		</div>
	{:else}
		<div class="overflow-hidden rounded-xl bg-white shadow-lg">
			<UsersTable
				users={$users}
				sortBy={orderBy}
				sortOrder={orderDirection}
				onSort={handleSort}
				onEdit={openEditModal}
				onDelete={openDeleteModal}
			/>
		</div>
		{#if $pagination.total > $pagination.size}
			<Pagination
				currentPage={$pagination.page}
				totalPages={$pagination.totalPages}
				totalItems={$pagination.total}
				pageSize={$pagination.size}
				onPageChange={handlePageChange}
				onNext={handleNextPage}
				onPrev={handlePrevPage}
			/>
		{/if}
	{/if}
</div>

<!-- Create User Modal -->
<UserModal bind:isOpen={showCreateModal} mode="create" onsubmit={handleModalSubmit} onclose={handleModalClose} />

<!-- Edit User Modal -->
<UserModal
	bind:isOpen={showEditModal}
	mode="edit"
	user={editingUser}
	onsubmit={handleModalSubmit}
	onclose={handleModalClose}
/>

<!-- Delete User Modal -->
<DeleteModal
	bind:isOpen={showDeleteModal}
	user={deletingUser}
	onconfirm={handleDeleteUser}
	onclose={handleModalClose}
/>
