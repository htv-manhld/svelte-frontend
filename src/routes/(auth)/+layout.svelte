<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import NotificationContainer from '$lib/components/feedback/NotificationContainer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta
		http-equiv="content-security-policy"
		content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
	/>
	<meta name="referrer" content="strict-origin-when-cross-origin" />
</svelte:head>

<!-- Auth pages layout: no sidebar, just content -->
{@render children?.()}

<!-- Notification Container -->
<NotificationContainer />
