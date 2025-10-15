import * as v from 'valibot';

/**
 * Validation result type
 */
export type ValidationResult<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			errors: Record<string, string>;
	  };

/**
 * Validate data against a Valibot schema
 * Returns either validated data or field errors
 */
export function validate<T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
	schema: T,
	data: unknown
): ValidationResult<v.InferOutput<T>> {
	const result = v.safeParse(schema, data);

	if (result.success) {
		return {
			success: true,
			data: result.output
		};
	}

	// Transform Valibot errors into field errors
	const errors: Record<string, string> = {};
	if (result.issues) {
		result.issues.forEach((issue) => {
			const path = issue.path?.map((p) => p.key).join('.') || 'root';
			if (path && path !== 'root') {
				errors[path] = issue.message;
			}
		});
	}

	return {
		success: false,
		errors
	};
}
