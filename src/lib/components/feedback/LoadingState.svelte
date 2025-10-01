<script lang="ts">
	interface Props {
		message?: string;
	}

	let { message = 'Loading...' }: Props = $props();
</script>

<div class="flex items-center justify-center py-20">
	<div class="text-center">
		<div class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
		<div class="text-lg text-gray-600">{message}</div>
	</div>
</div>
