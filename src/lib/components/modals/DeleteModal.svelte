<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { User } from '$lib/api/generated/users/types';

	interface Props {
		isOpen?: boolean;
		user?: User | null;
		onconfirm?: () => void;
		onclose?: () => void;
	}

	let { isOpen = $bindable(false), user = null, onconfirm, onclose }: Props = $props();

	function handleConfirm() {
		if (onconfirm) {
			onconfirm();
		}
	}

	function handleClose() {
		if (onclose) {
			onclose();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}
</script>

{#if isOpen && user}
	<!-- Dark backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="delete-modal-title"
		tabindex="-1"
		transition:fade={{ duration: 300, easing: cubicOut }}
	>
		<!-- Modal container -->
		<div class="mx-4 w-full max-w-md" transition:scale={{ duration: 300, easing: cubicOut, start: 0.8 }}>
			<div class="overflow-hidden rounded-2xl bg-white shadow-2xl">
				<!-- Modal header -->
				<div class="px-8 pt-8 pb-4">
					<div class="mb-4 flex items-center gap-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-6 w-6 text-red-600"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
								/>
							</svg>
						</div>
						<div>
							<h2 id="delete-modal-title" class="text-2xl font-bold text-gray-800">Delete User</h2>
							<p class="text-sm text-gray-600">This action cannot be undone</p>
						</div>
					</div>
				</div>

				<!-- Modal body -->
				<div class="px-8 pb-8">
					<div class="mb-6">
						<p class="mb-4 text-gray-700">
							Are you sure you want to delete <strong>{user.name}</strong>? This will permanently remove the user and
							all associated data.
						</p>
						<div class="rounded-lg bg-gray-50 p-4">
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600"
								>
									{user.name.charAt(0).toUpperCase()}
								</div>
								<div>
									<div class="font-medium text-gray-800">{user.name}</div>
									<div class="text-sm text-gray-600">{user.email}</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Modal footer -->
					<div class="flex justify-end gap-3">
						<button
							type="button"
							onclick={handleClose}
							class="rounded-lg border border-gray-300 bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none"
						>
							Cancel
						</button>
						<button
							type="button"
							onclick={handleConfirm}
							class="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
						>
							Delete User
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
