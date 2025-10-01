<script lang="ts">
	interface Props {
		rows?: number;
		columns?: number;
	}

	let { rows = 5, columns = 4 }: Props = $props();
</script>

<div class="overflow-hidden rounded-xl bg-white shadow-lg">
	<div class="-mx-3 overflow-x-auto px-3 md:mx-0 md:px-0">
		<table class="w-full min-w-[900px] table-auto">
			<thead class="bg-gray-200">
				<tr>
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#each Array(columns) as _, i (i)}
						<th class="px-3 py-3 whitespace-nowrap md:px-6 md:py-4">
							<div class="h-4 animate-pulse rounded bg-gray-300"></div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
				{#each Array(rows) as _, rowIndex (rowIndex)}
					<tr class="animate-pulse">
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{#each Array(columns) as _, colIndex (colIndex)}
							<td class="px-3 py-3 whitespace-nowrap md:px-6 md:py-4">
								<div class="h-4 rounded bg-gray-200"></div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
