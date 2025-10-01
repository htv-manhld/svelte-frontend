<script lang="ts">
	import { page } from '$app/stores';
	import ErrorPage from '$features/errors/components/ErrorPage.svelte';
</script>

<ErrorPage status={$page.status} message={$page.error?.message} />
