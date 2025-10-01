// Utility functions

export function formatDate(date: string | Date): string {
	const d = new Date(date);
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatDateTime(date: string | Date): string {
	const d = new Date(date);
	return d.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function getInitials(name: string): string {
	return name
		.split(' ')
		.map((word) => word.charAt(0))
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ');
}

/**
 * Build URLSearchParams from an object, filtering out undefined/null values
 * @param params - Object with key-value pairs
 * @returns URLSearchParams ready to use in fetch requests
 */
export function buildQueryParams(
	params: Record<string, string | number | boolean | undefined | null>
): URLSearchParams {
	const queryParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			queryParams.append(key, value.toString());
		}
	});

	return queryParams;
}
