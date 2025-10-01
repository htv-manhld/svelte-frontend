<script lang="ts">
	interface Props {
		onCreateUser: () => void;
	}

	let { onCreateUser }: Props = $props();
</script>

<div class="mb-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-800">User Management</h1>
			<p class="text-gray-600">Manage all users in your system</p>
		</div>
		<button
			onclick={onCreateUser}
			class="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
			<span>Create User</span>
		</button>
	</div>
</div>
