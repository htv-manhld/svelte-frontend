/**
 * Page Metadata Configuration
 *
 * Centralized metadata for all pages in the application.
 * Used with the MetaHead component for consistent SEO and meta tags.
 */

export interface PageMetadata {
	title: string;
	description: string;
	noIndex?: boolean;
	keywords?: string;
}

export const PAGE_METADATA = {
	login: {
		title: 'Login',
		description: 'Login to your account',
		noIndex: true
	},
	forgotPassword: {
		title: 'Forgot Password',
		description: 'Reset your password via email',
		noIndex: true
	},
	resetPassword: {
		title: 'Reset Password',
		description: 'Reset your password securely',
		noIndex: true
	},
	changePassword: {
		title: 'Change Password',
		description: 'Change your account password',
		noIndex: true
	},
	home: {
		title: 'Home',
		description: 'Welcome to our application',
		noIndex: false
	},
	users: {
		title: 'Users',
		description: 'Manage users in your application',
		noIndex: true
	}
} as const satisfies Record<string, PageMetadata>;

export type PageMetadataKey = keyof typeof PAGE_METADATA;
