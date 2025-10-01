<script lang="ts">
	interface Props {
		title?: string;
		message: string;
		onRetry?: () => void;
		retryText?: string;
	}

	let { title = 'Error', message, onRetry, retryText = 'Try Again' }: Props = $props();
</script>

<div class="rounded-lg bg-red-50 p-6 text-red-800 shadow-sm">
	<div class="mb-2 font-semibold">{title}</div>
	<div class="mb-3">{message}</div>
	{#if onRetry}
		<button onclick={onRetry} class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
			{retryText}
		</button>
	{/if}
</div>
