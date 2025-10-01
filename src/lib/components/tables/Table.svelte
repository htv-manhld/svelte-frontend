<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		headers: string[];
		class?: string;
		headerClass?: string;
		bodyClass?: string;
		children?: Snippet;
	}

	let { headers, class: className = '', headerClass = '', bodyClass = '', children }: Props = $props();
</script>

<div class="overflow-hidden rounded-xl bg-white shadow-lg {className}">
	<div class="-mx-0 overflow-x-auto px-0">
		<table class="w-full min-w-[900px] table-auto">
			<thead class="bg-gray-200 {headerClass}">
				<tr>
					{#each headers as header (header)}
						<th class="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-700 md:px-6 md:py-4"
							>{header}</th
						>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 {bodyClass}">
				{@render children?.()}
			</tbody>
		</table>
	</div>
</div>
