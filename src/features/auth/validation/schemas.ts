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
 * Password validation schema
 */
const passwordSchema = v.pipe(
	v.string('Password is required'),
	v.minLength(6, 'auth.changePassword.validation.newPasswordMinLength'),
	v.maxLength(100, 'Password must be at most 100 characters')
);

/**
 * Strong password validation schema (for create/reset)
 */
const strongPasswordSchema = v.pipe(
	v.string('Password is required'),
	v.minLength(8, 'Password must be at least 8 characters'),
	v.maxLength(100, 'Password must be at most 100 characters'),
	v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
	v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
	v.regex(/[0-9]/, 'Password must contain at least one number'),
	v.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
);

/**
 * Change Password Schema
 */
export const changePasswordSchema = v.pipe(
	v.object({
		oldPassword: v.pipe(v.string(), v.nonEmpty('auth.changePassword.validation.currentPasswordRequired')),
		newPassword: passwordSchema,
		confirmPassword: v.pipe(v.string(), v.nonEmpty('auth.changePassword.validation.confirmPasswordRequired'))
	}),
	v.forward(
		v.partialCheck(
			[['newPassword'], ['oldPassword']],
			(input) => input.newPassword !== input.oldPassword,
			'auth.changePassword.validation.newPasswordDifferent'
		),
		['newPassword']
	),
	v.forward(
		v.partialCheck(
			[['newPassword'], ['confirmPassword']],
			(input) => input.newPassword === input.confirmPassword,
			'auth.changePassword.validation.passwordMismatch'
		),
		['confirmPassword']
	)
);

/**
 * Login Schema
 */
export const loginSchema = v.object({
	email: emailSchema,
	password: v.pipe(v.string(), v.nonEmpty('Password is required'))
});

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = v.object({
	email: emailSchema
});

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = v.pipe(
	v.object({
		password: strongPasswordSchema,
		confirmPassword: v.pipe(v.string(), v.nonEmpty('Please confirm your password'))
	}),
	v.forward(
		v.partialCheck(
			[['password'], ['confirmPassword']],
			(input) => input.password === input.confirmPassword,
			'Passwords do not match'
		),
		['confirmPassword']
	)
);

// Export types
export type ChangePasswordInput = v.InferOutput<typeof changePasswordSchema>;
export type LoginInput = v.InferOutput<typeof loginSchema>;
export type ForgotPasswordInput = v.InferOutput<typeof forgotPasswordSchema>;
export type ResetPasswordInput = v.InferOutput<typeof resetPasswordSchema>;
