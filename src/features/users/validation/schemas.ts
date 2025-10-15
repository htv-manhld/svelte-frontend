import * as v from 'valibot';

/**
 * Email validation schema
 */
const emailSchema = v.pipe(
	v.string('Email is required'),
	v.trim(),
	v.nonEmpty('Email is required'),
	v.email('Invalid email address'),
	v.maxLength(255, 'Email must be at most 255 characters'),
	v.toLowerCase()
);

/**
 * Name validation schema
 */
const nameSchema = v.pipe(
	v.string('Name is required'),
	v.trim(),
	v.minLength(2, 'Name must be at least 2 characters'),
	v.maxLength(100, 'Name must be at most 100 characters'),
	v.regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
);

/**
 * Password validation schema (strong)
 */
const passwordSchema = v.pipe(
	v.string('Password is required'),
	v.minLength(8, 'Password must be at least 8 characters'),
	v.maxLength(100, 'Password must be at most 100 characters'),
	v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
	v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
	v.regex(/[0-9]/, 'Password must contain at least one number'),
	v.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
);

/**
 * Birthdate validation schema
 * Date format: YYYY-MM-DD
 */
const birthdateSchema = v.pipe(
	v.optional(v.nullable(v.string()), null),
	v.transform((val) => {
		if (!val || val === '') return null;
		return val;
	}),
	v.check((val) => {
		if (val === null) return true;
		// Check format YYYY-MM-DD
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(val)) return false;

		const date = new Date(val);
		if (isNaN(date.getTime())) return false;

		// Check date range
		const today = new Date();
		const minDate = new Date('1900-01-01');
		return date >= minDate && date <= today;
	}, 'Invalid birthdate. Must be YYYY-MM-DD format between 1900 and today')
);

/**
 * Create User Schema
 */
export const createUserSchema = v.object({
	email: emailSchema,
	name: nameSchema,
	password: v.optional(v.nullable(passwordSchema), null),
	birthdate: birthdateSchema
});

/**
 * Update User Schema
 */
export const updateUserSchema = v.object({
	name: nameSchema,
	birthdate: birthdateSchema
});

/**
 * Change Email Schema
 */
export const changeEmailSchema = v.object({
	email: emailSchema
});

// Export types
export type CreateUserInput = v.InferOutput<typeof createUserSchema>;
export type UpdateUserInput = v.InferOutput<typeof updateUserSchema>;
export type ChangeEmailInput = v.InferOutput<typeof changeEmailSchema>;
