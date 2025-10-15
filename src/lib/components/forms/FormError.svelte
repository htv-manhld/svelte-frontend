<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		message?: string;
	}

	let { message }: Props = $props();
</script>

{#if message}
	<div
		class="mb-4 flex items-start gap-3 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm"
		role="alert"
		in:fly={{ y: -10, duration: 300, easing: quintOut }}
		out:scale={{ duration: 200 }}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<p class="flex-1 text-sm">{message}</p>
	</div>
{/if}
