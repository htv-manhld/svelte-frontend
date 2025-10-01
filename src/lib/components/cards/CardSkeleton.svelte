<script lang="ts">
	interface Props {
		hasHeader?: boolean;
	}

	let { hasHeader = true }: Props = $props();
</script>

<div class="animate-pulse overflow-hidden rounded-xl bg-white shadow-lg">
	{#if hasHeader}
		<div class="border-b border-gray-200 p-6">
			<div class="mb-2 h-6 w-1/3 rounded bg-gray-300"></div>
			<div class="h-4 w-1/2 rounded bg-gray-200"></div>
		</div>
	{/if}
	<div class="space-y-4 p-6">
		<div class="h-4 rounded bg-gray-200"></div>
		<div class="h-4 w-5/6 rounded bg-gray-200"></div>
		<div class="h-4 w-4/6 rounded bg-gray-200"></div>
	</div>
</div>
