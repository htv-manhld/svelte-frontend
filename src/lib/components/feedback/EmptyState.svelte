<script lang="ts">
	interface Props {
		title: string;
		description: string;
		icon?: string;
		onAction?: () => void;
		actionText?: string;
	}

	let { title, description, icon = 'users', onAction, actionText = 'Get Started' }: Props = $props();

	const iconMap: Record<string, string> = {
		users:
			'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-3 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>',
		error:
			'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-3 text-red-400"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>',
		loading:
			'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-3 text-blue-400 animate-spin"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>'
	};
</script>

<div class="py-12 text-center">
	<div class="mb-4">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html iconMap[icon] || iconMap.users}
	</div>
	<h3 class="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
	<p class="mb-6 text-gray-500">{description}</p>
	{#if onAction}
		<button
			onclick={onAction}
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
		>
			{actionText}
		</button>
	{/if}
</div>
