<script lang="ts">
	interface Props {
		field: string;
		label: string;
		currentSortBy?: string;
		currentSortOrder?: 'asc' | 'desc';
		onSort: (field: string) => void;
		class?: string;
	}

	let { field, label, currentSortBy, currentSortOrder = 'asc', onSort, class: className = '' }: Props = $props();

	const isActive = $derived(currentSortBy === field);
	const isAsc = $derived(isActive && currentSortOrder === 'asc');
	const isDesc = $derived(isActive && currentSortOrder === 'desc');

	function handleClick() {
		onSort(field);
	}
</script>

<th class="px-6 py-3 text-left {className}">
	<button
		type="button"
		onclick={handleClick}
		class="group flex items-center gap-2 text-xs font-medium tracking-wider text-gray-700 uppercase transition-colors hover:text-gray-900"
	>
		<span>{label}</span>
		<span class="flex flex-col">
			<!-- Up Arrow -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-3 w-3 transition-colors {isAsc ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}"
			>
				<path
					fill-rule="evenodd"
					d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
					clip-rule="evenodd"
				/>
			</svg>
			<!-- Down Arrow -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="-mt-1 h-3 w-3 transition-colors {isDesc ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}"
			>
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
	</button>
</th>
