<script lang="ts">
	interface Props {
		title: string;
		value: number;
		subtitle: string;
		color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
		icon: string;
	}

	let { title, value, subtitle, color, icon }: Props = $props();

	const colorClasses = {
		blue: 'from-blue-500 to-blue-600',
		green: 'from-green-500 to-green-600',
		purple: 'from-purple-500 to-purple-600',
		red: 'from-red-500 to-red-600',
		yellow: 'from-yellow-500 to-yellow-600'
	};
</script>

<div class="rounded-xl bg-gradient-to-br {colorClasses[color]} p-3 text-white shadow-lg md:p-6">
	<div class="mb-3 flex items-center justify-between">
		<div class="text-sm font-medium opacity-90">{title}</div>
		<div class="opacity-80">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html icon}
		</div>
	</div>
	<div class="text-4xl font-bold">{value}</div>
	<div class="mt-2 text-sm opacity-80">{subtitle}</div>
</div>
