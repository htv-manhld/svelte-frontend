<script lang="ts">
	import { notificationStore, type Notification as NotificationType } from '$lib/stores/notificationStore.svelte';
	import CheckCircleIcon from '$lib/components/icons/CheckCircleIcon.svelte';
	import XCircleIcon from '$lib/components/icons/XCircleIcon.svelte';
	import ExclamationTriangleIcon from '$lib/components/icons/ExclamationTriangleIcon.svelte';
	import InformationCircleIcon from '$lib/components/icons/InformationCircleIcon.svelte';
	import XMarkIcon from '$lib/components/icons/XMarkIcon.svelte';

	let { notification }: { notification: NotificationType } = $props();

	const IconComponent = $derived(
		notification.type === 'success'
			? CheckCircleIcon
			: notification.type === 'error'
				? XCircleIcon
				: notification.type === 'warning'
					? ExclamationTriangleIcon
					: InformationCircleIcon
	);

	const styles = {
		success: 'bg-green-50 border-green-200 text-green-800',
		error: 'bg-red-50 border-red-200 text-red-800',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		info: 'bg-blue-50 border-blue-200 text-blue-800'
	};

	const iconColors = {
		success: 'text-green-500',
		error: 'text-red-500',
		warning: 'text-yellow-500',
		info: 'text-blue-500'
	};
</script>

<div
	class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all hover:scale-105 hover:shadow-xl {styles[
		notification.type
	]}"
	role="alert"
>
	<div class="relative p-4">
		<!-- Progress bar -->
		{#if notification.duration && notification.duration > 0}
			<div class="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-lg bg-black/10">
				<div
					class="h-full bg-current opacity-30"
					style="animation: progress {notification.duration}ms linear forwards;"
				></div>
			</div>
		{/if}

		<div class="flex items-start gap-3">
			<div
				class="flex-shrink-0 animate-bounce {iconColors[notification.type]}"
				style="animation-iteration-count: 1; animation-duration: 0.5s;"
			>
				<IconComponent class="h-5 w-5" />
			</div>
			<div class="flex-1">
				<p class="text-sm font-medium">{notification.message}</p>
			</div>
			<button
				onclick={() => notificationStore.remove(notification.id)}
				class="group flex-shrink-0 rounded-lg p-1 transition-all hover:rotate-90 hover:bg-white/50 active:scale-90"
				aria-label="Close"
			>
				<XMarkIcon class="h-4 w-4 transition-transform group-hover:scale-110" />
			</button>
		</div>
	</div>
</div>

<style>
	@keyframes progress {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}
</style>
