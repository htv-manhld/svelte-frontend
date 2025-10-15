<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { AutoComplete } from '$lib/types/html';

	interface Props {
		type?: 'text' | 'email' | 'password' | 'date';
		id: string;
		name: string;
		label: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		error?: string;
		disabled?: boolean;
		autocomplete?: AutoComplete;
		onInput?: (value: string) => void;
		class?: string;
	}

	let {
		type = 'text',
		id,
		name,
		label,
		value = $bindable(''),
		placeholder = '',
		required = false,
		error = $bindable(''),
		disabled = false,
		autocomplete,
		onInput,
		class: className = ''
	}: Props = $props();

	let isFocused = $state(false);
	let showPassword = $state(false);

	// Toggle between 'password' and 'text' type
	let inputType = $derived(type === 'password' && showPassword ? 'text' : type);
	let isPasswordField = $derived(type === 'password');

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;

		// Clear error when user starts typing
		if (error) {
			error = '';
		}

		// Call optional onInput callback
		if (onInput) {
			onInput(value);
		}
	}
</script>

<div class="form-group">
	<label
		for={id}
		class="mb-2 block text-sm font-medium transition-colors duration-200"
		class:text-blue-600={isFocused && !error}
		class:text-red-600={error}
		class:text-gray-700={!isFocused && !error}
	>
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
	<div class="relative">
		<input
			type={inputType}
			{id}
			{name}
			{value}
			{placeholder}
			{required}
			{disabled}
			{autocomplete}
			oninput={handleInput}
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			class="input-field {className}"
			class:input-with-icon={isPasswordField}
			class:input-focused={isFocused && !error}
			class:input-error={error}
		/>
		{#if isPasswordField}
			<button
				type="button"
				onclick={togglePasswordVisibility}
				class="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-gray-500 transition-colors hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				tabindex="-1"
				aria-label={showPassword ? 'Hide password' : 'Show password'}
			>
				{#if showPassword}
					<!-- Eye Slash Icon (Hide) -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
						/>
					</svg>
				{:else}
					<!-- Eye Icon (Show) -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
						/>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				{/if}
			</button>
		{/if}
		{#if isFocused && !error}
			<div class="input-glow" transition:slide={{ duration: 200 }}></div>
		{/if}
	</div>
	{#if error}
		<div transition:slide={{ duration: 200 }}>
			<p class="animate-shake mt-2 flex items-center gap-1 text-sm text-red-600">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				{error}
			</p>
		</div>
	{/if}
</div>

<style>
	.form-group {
		margin-bottom: 1.5rem;
	}

	.input-field {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid #d1d5db;
		border-radius: 0.5rem;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		transition: all 0.2s ease;
		outline: none;
		background-color: white;
	}

	.input-with-icon {
		padding-right: 2.75rem;
	}

	.input-field:disabled {
		background-color: #f9fafb;
		cursor: not-allowed;
	}

	.input-field:focus {
		outline: none;
	}

	.input-focused {
		border-color: #3b82f6;
		box-shadow:
			0 0 0 4px rgba(59, 130, 246, 0.1),
			0 10px 15px -3px rgba(0, 0, 0, 0.1);
		transform: scale(1.01);
	}

	.input-error {
		border-color: #ef4444;
	}

	.input-error:focus {
		box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
	}

	.input-glow {
		position: absolute;
		inset: 0;
		z-index: -10;
		background-color: rgba(59, 130, 246, 0.05);
		border-radius: 0.5rem;
		filter: blur(20px);
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translateX(-2px);
		}
		20%,
		40%,
		60%,
		80% {
			transform: translateX(2px);
		}
	}

	.animate-shake {
		animation: shake 0.4s ease-in-out;
	}
</style>
