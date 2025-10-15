<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		onSearch?: (value: string) => void;
		onInput?: (value: string) => void;
		onClear?: () => void;
		class?: string;
		disabled?: boolean;
		hint?: string;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search by ID, name or email...',
		onSearch,
		onInput,
		onClear,
		class: className = '',
		disabled = false,
		hint = ''
	}: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		if (onInput) {
			onInput(value);
		}
	}

	function handleClear() {
		value = '';
		if (onClear) {
			onClear();
		} else if (onSearch) {
			onSearch('');
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClear();
		} else if (e.key === 'Enter' && onSearch) {
			onSearch(value);
		}
	}
</script>

<div class="relative {className}">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-5 w-5 text-gray-400"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
			/>
		</svg>
	</div>
	<input
		type="text"
		bind:value
		oninput={handleInput}
		onkeydown={handleKeydown}
		{placeholder}
		{disabled}
		class="block w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-10 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
	/>
	{#if value}
		<button
			type="button"
			onclick={handleClear}
			{disabled}
			class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
			aria-label="Clear search"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	{/if}
	{#if hint}
		<p class="mt-1 text-xs text-gray-500">{hint}</p>
	{/if}
</div>
