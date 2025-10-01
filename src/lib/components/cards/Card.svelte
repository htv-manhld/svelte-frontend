<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		subtitle?: string;
		class?: string;
		headerClass?: string;
		bodyClass?: string;
		header?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		subtitle,
		class: className = '',
		headerClass = '',
		bodyClass = '',
		header,
		children,
		...restProps
	}: Props = $props();
</script>

<div class="rounded-xl bg-white shadow-lg {className}" {...restProps}>
	{#if title || subtitle}
		<div class="border-b border-gray-200 p-6 {headerClass}">
			{#if title}
				<h3 class="text-xl font-bold text-gray-800">{title}</h3>
			{/if}
			{#if subtitle}
				<p class="mt-1 text-sm text-gray-600">{subtitle}</p>
			{/if}
		</div>
	{:else if header}
		{@render header()}
	{/if}
	<div class="p-6 {bodyClass}">
		{@render children?.()}
	</div>
</div>
