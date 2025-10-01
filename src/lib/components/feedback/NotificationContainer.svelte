<script lang="ts">
	import { notificationStore } from '$lib/stores/notificationStore.svelte';
	import Notification from './Notification.svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
</script>

<div class="pointer-events-none fixed top-0 right-0 z-50 flex flex-col gap-2 p-4">
	{#each notificationStore.notifications as notification (notification.id)}
		<div
			in:fly={{ x: 300, duration: 400, opacity: 0 }}
			out:fly={{ x: 300, duration: 300, opacity: 0 }}
			animate:flip={{ duration: 300 }}
		>
			<Notification {notification} />
		</div>
	{/each}
</div>
