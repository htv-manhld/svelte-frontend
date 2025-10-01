<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/buttons/Button.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		action?: {
			text: string;
			onclick: () => void;
			variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		};
		class?: string;
		actionIcon?: Snippet;
	}

	let { title, subtitle, action, class: className = '', actionIcon }: Props = $props();
</script>

<div class="mb-4 md:mb-8 {className}">
	<div class="flex items-center justify-between gap-3">
		<div class="min-w-0 flex-1">
			<h1 class="text-xl font-bold text-gray-800 md:text-3xl">{title}</h1>
			{#if subtitle}
				<p class="mt-1 text-sm text-gray-600 md:text-base">{subtitle}</p>
			{/if}
		</div>
		{#if action}
			<Button
				variant={action.variant || 'primary'}
				onclick={action.onclick}
				size="sm"
				class="flex-shrink-0 md:px-6 md:py-3"
			>
				<div class="flex items-center gap-1 md:gap-2">
					{#if actionIcon}
						<span class="flex-shrink-0">
							{@render actionIcon()}
						</span>
					{/if}
					<span class="hidden md:inline">{action.text}</span>
				</div>
			</Button>
		{/if}
	</div>
</div>
