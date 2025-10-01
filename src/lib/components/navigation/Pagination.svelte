<script lang="ts">
	import { t } from '$lib/i18n';

	interface Props {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		pageSize: number;
		onPageChange: (page: number) => void;
		onNext: () => void;
		onPrev: () => void;
	}

	let { currentPage, totalPages, totalItems, pageSize, onPageChange, onNext, onPrev }: Props = $props();

	const startItem = $derived(currentPage * pageSize + 1);
	const endItem = $derived(Math.min((currentPage + 1) * pageSize, totalItems));
</script>

<div class="px-6 py-4">
	<div class="flex items-center justify-between">
		<div class="text-sm text-gray-600">
			{t('common.showing')}
			{startItem}
			{t('common.to')}
			{endItem}
			{t('common.of')}
			{totalItems}
			{t('common.items')}
		</div>

		<div class="flex items-center gap-2">
			<button
				onclick={onPrev}
				disabled={currentPage === 0}
				class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				aria-label={t('common.previousPage')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>

			<div class="flex gap-1">
				<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
				{#each Array(totalPages) as _, i (i)}
					{#if i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)}
						<button
							onclick={() => onPageChange(i)}
							class="rounded-lg px-4 py-2 text-sm font-medium {currentPage === i
								? 'bg-blue-600 text-white'
								: 'border border-gray-300 text-gray-700 hover:bg-gray-50'}"
						>
							{i + 1}
						</button>
					{:else if i === currentPage - 2 || i === currentPage + 2}
						<span class="px-2 py-2 text-gray-500">...</span>
					{/if}
				{/each}
			</div>

			<button
				onclick={onNext}
				disabled={currentPage === totalPages - 1}
				class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				aria-label={t('common.nextPage')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</div>
	</div>
</div>
