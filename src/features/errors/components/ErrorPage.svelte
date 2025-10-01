<script lang="ts">
	import { t } from '$lib/i18n';
	import ArrowLeftIcon from '$lib/components/icons/ArrowLeftIcon.svelte';
	import HomeIcon from '$lib/components/icons/HomeIcon.svelte';
	import ExclamationTriangleIcon from '$lib/components/icons/ExclamationTriangleIcon.svelte';

	interface Props {
		status: number;
		message?: string;
	}

	let { status, message }: Props = $props();

	const errorTitle = $derived(status === 404 ? t('errors.pageNotFound') : t('errors.serverError'));
	const errorDescription = $derived(
		status === 404 ? t('errors.pageNotFoundDescription') : t('errors.serverErrorDescription')
	);
</script>

<div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
	<!-- Decorative Background Elements -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="animate-float-slow absolute top-20 -left-4 h-72 w-72 rounded-full bg-blue-400 opacity-10 blur-3xl"
		></div>
		<div
			class="animate-float absolute -right-4 bottom-20 h-96 w-96 rounded-full bg-purple-400 opacity-10 blur-3xl"
		></div>
		<div class="absolute top-1/2 left-1/2 h-80 w-80 animate-pulse rounded-full bg-pink-400 opacity-10 blur-3xl"></div>
	</div>

	<div class="relative flex min-h-screen items-center justify-center">
		<div class="h-full w-full max-w-4xl">
			<div class="px-4 py-2 md:px-8 md:py-0">
				{#if status === 500}
					<!-- 500 Error Illustration -->
					<div class="mb-8 flex justify-center">
						<div class="relative h-64 w-64 md:h-80 md:w-80">
							<!-- Broken Server -->
							<svg
								class="animate-float-slow h-full w-full"
								viewBox="0 0 200 200"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<!-- Server Body -->
								<rect x="50" y="60" width="100" height="80" rx="10" fill="#EF4444" opacity="0.2" />
								<rect x="55" y="65" width="90" height="25" rx="5" fill="#EF4444" />
								<rect x="55" y="95" width="90" height="25" rx="5" fill="#EF4444" />
								<rect x="55" y="125" width="90" height="10" rx="3" fill="#EF4444" />

								<!-- Warning Symbol -->
								<circle cx="100" cy="100" r="30" fill="#FEE2E2" />
								<path d="M100 80 L100 100 M100 110 L100 112" stroke="#EF4444" stroke-width="6" stroke-linecap="round" />

								<!-- Lightning Bolts -->
								<path d="M70 50 L60 70 L70 70 L65 85" stroke="#FBBF24" stroke-width="3" stroke-linecap="round" />
								<path d="M130 50 L140 70 L130 70 L135 85" stroke="#FBBF24" stroke-width="3" stroke-linecap="round" />
							</svg>
						</div>
					</div>
				{/if}

				<!-- Error Code with Gradient -->
				<div class="mb-6 text-center">
					<h1
						class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-7xl font-extrabold text-transparent md:text-9xl"
					>
						{status}
					</h1>
				</div>

				<!-- Error Title -->
				<h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:text-3xl">
					{errorTitle}
				</h2>

				<!-- Error Description -->
				<p class="mb-8 text-center text-base text-gray-600 md:text-lg">
					{errorDescription}
				</p>

				<!-- Error Message (if available) -->
				{#if message}
					<div class="mb-8 rounded-xl border border-red-200 bg-red-50 p-4">
						<div class="flex items-start gap-3">
							<ExclamationTriangleIcon class="h-5 w-5 flex-shrink-0 text-red-600" />
							<p class="text-sm text-red-800">{message}</p>
						</div>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						onclick={() => window.history.back()}
						class="group rounded-xl border-2 border-gray-300 px-8 py-3.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
					>
						<div class="flex items-center justify-center gap-2">
							<ArrowLeftIcon class="h-5 w-5 transition-transform group-hover:-translate-x-1" />
							{t('errors.goBack')}
						</div>
					</button>

					<a
						href="/"
						class="group rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
					>
						<div class="flex items-center justify-center gap-2">
							<HomeIcon class="h-5 w-5" />
							{t('errors.goHome')}
						</div>
					</a>
				</div>
			</div>

			<!-- Decorative Elements -->
			<div class="mt-8 text-center text-sm text-gray-700">
				<p>Need help? <a href="/" class="text-blue-600 hover:underline">Contact Support</a></p>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
	}
	@keyframes float-slow {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}
	.animate-float {
		animation: float 3s ease-in-out infinite;
	}
	.animate-float-slow {
		animation: float-slow 4s ease-in-out infinite;
	}
</style>
