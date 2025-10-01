<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { User, CreateUserRequest, UpdateUserRequest } from '$lib/types';
	import { t } from '$lib/i18n';
	import { userService } from '$features/users/services/userService';
	import { users, loading, error, pagination } from '$features/users/stores/usersStore';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import TableSkeleton from '$lib/components/tables/TableSkeleton.svelte';
	import ErrorState from '$lib/components/feedback/ErrorState.svelte';
	import EmptyState from '$lib/components/feedback/EmptyState.svelte';
	import UserModal from '$features/users/components/UserModal.svelte';
	import DeleteModal from '$lib/components/modals/DeleteModal.svelte';
	import UsersTable from '$features/users/components/UsersTable.svelte';
	import Pagination from '$lib/components/navigation/Pagination.svelte';

	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
	let editingUser = $state<User | null>(null);
	let deletingUser = $state<User | null>(null);

	onMount(async () => {
		// Read page and size from URL query params
		let urlPage = '0';
		let urlSize = '20';

		if (browser) {
			const params = new URLSearchParams(window.location.search);
			urlPage = params.get('page') || '0';
			urlSize = params.get('size') || '20';
		}

		const pageNum = parseInt(urlPage);
		const pageSize = parseInt(urlSize);

		await userService.loadUsers(pageNum, pageSize);
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

	async function handlePageChange(page: number) {
		await userService.loadUsers(page, $pagination.size);
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

	{#if $loading}
		<TableSkeleton rows={10} columns={6} />
	{:else if $error}
		<ErrorState title={t('users.errorTitle')} message={$error} onRetry={() => userService.loadUsers()} />
	{:else if $users.length === 0}
		<EmptyState
			title={t('users.noUsersTitle')}
			description={t('users.noUsersDescription')}
			icon="users"
			onAction={() => (showCreateModal = true)}
			actionText={t('users.createFirstUser')}
		/>
	{:else}
		<div class="overflow-hidden rounded-xl bg-white shadow-lg">
			<UsersTable users={$users} onEdit={openEditModal} onDelete={openDeleteModal} />
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
