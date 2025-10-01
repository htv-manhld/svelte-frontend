<script lang="ts">
	interface Props {
		onclick: () => void;
		mobileOnly?: boolean;
	}

	let { onclick, mobileOnly = false }: Props = $props();
</script>

<div
	class="fixed inset-0 z-20 bg-black/50"
	class:lg:hidden={mobileOnly}
	{onclick}
	role="button"
	tabindex="-1"
	onkeydown={(e) => e.key === 'Escape' && onclick()}
></div>
