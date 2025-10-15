// Translation keys for the application
export const en = {
	common: {
		loading: 'Loading...',
		error: 'Error',
		retry: 'Retry',
		cancel: 'Cancel',
		confirm: 'Confirm',
		delete: 'Delete',
		edit: 'Edit',
		create: 'Create',
		save: 'Save',
		close: 'Close',
		viewAll: 'View All',
		actions: 'Actions',
		previousPage: 'Previous page',
		nextPage: 'Next page',
		showing: 'Showing',
		to: 'to',
		of: 'of',
		items: 'items'
	},
	layout: {
		appName: 'Admin Panel',
		sidebar: {
			dashboard: 'Dashboard',
			users: 'Users',
			analytics: 'Analytics',
			settings: 'Settings'
		},
		userInfo: {
			name: 'Admin User',
			email: 'admin@example.com'
		},
		menu: {
			open: 'Open menu',
			close: 'Close menu'
		}
	},
	dashboard: {
		title: 'Dashboard',
		subtitle: "Welcome back! Here's what's happening today.",
		loadingMessage: 'Loading dashboard...',
		errorTitle: 'Error loading dashboard',
		stats: {
			totalUsers: 'Total Users',
			activeUsers: 'Active Users',
			newToday: 'New Today',
			fromLastMonth: '+12% from last month',
			allUsersActive: 'All users active',
			newUsersToday: 'New users today'
		},
		recentUsers: {
			title: 'Recent Users',
			subtitle: 'Latest registered users',
			noUsersFound: 'No users found'
		}
	},
	users: {
		title: 'User Management',
		subtitle: 'Manage all users in your system',
		createUser: 'Create User',
		loadingMessage: 'Loading users...',
		errorTitle: 'Error loading users',
		noUsersTitle: 'No users found',
		noUsersDescription: 'Get started by creating your first user.',
		createFirstUser: 'Create First User',
		table: {
			id: 'ID',
			user: 'User',
			email: 'Email',
			age: 'Age',
			createdAt: 'Created At',
			years: 'years'
		},
		modal: {
			createTitle: 'Create New User',
			editTitle: 'Edit User',
			name: 'Name',
			namePlaceholder: 'Enter user name',
			email: 'Email',
			emailPlaceholder: 'Enter email address',
			age: 'Age',
			agePlaceholder: 'Enter age'
		},
		deleteModal: {
			title: 'Delete User',
			message: 'Are you sure you want to delete',
			warning: 'This action cannot be undone.',
			confirmButton: 'Delete User'
		},
		messages: {
			createSuccess: 'User created successfully',
			createError: 'Failed to create user',
			updateSuccess: 'User updated successfully',
			updateError: 'Failed to update user',
			deleteSuccess: 'User deleted successfully',
			deleteError: 'Failed to delete user'
		}
	},
	auth: {
		login: {
			title: 'Welcome Back',
			subtitle: 'Sign in to continue to your account',
			emailLabel: 'Email address',
			emailPlaceholder: 'you@example.com',
			passwordLabel: 'Password',
			passwordPlaceholder: '••••••••',
			forgotPassword: 'Forgot your password?',
			submitButton: 'Sign in',
			submitting: 'Signing in...',
			loginFailed: 'Login failed',
			validation: {
				emailRequired: 'Email is required',
				emailInvalid: 'Invalid email format',
				passwordRequired: 'Password is required',
				passwordMinLength: 'Password must be at least 6 characters'
			}
		},
		forgotPassword: {
			title: 'Reset Password',
			subtitle: "Enter your email and we'll send you reset instructions",
			emailLabel: 'Email address',
			emailPlaceholder: 'you@example.com',
			submitButton: 'Send reset link',
			submitting: 'Sending...',
			backToLogin: 'Back to login',
			failedToSend: 'Failed to send reset email',
			success: {
				title: 'Check Your Email!',
				message: "We've sent password reset instructions to",
				helpText: "Didn't receive the email? Check your spam folder or try again."
			},
			validation: {
				emailRequired: 'Email is required',
				emailInvalid: 'Invalid email format'
			}
		},
		resetPassword: {
			title: 'Create New Password',
			subtitle: 'Enter your new password below',
			newPasswordLabel: 'New Password',
			newPasswordPlaceholder: '••••••••',
			confirmPasswordLabel: 'Confirm Password',
			confirmPasswordPlaceholder: '••••••••',
			submitButton: 'Reset password',
			submitting: 'Resetting...',
			backToLogin: 'Back to login',
			failedToReset: 'Failed to reset password',
			invalidToken: 'Invalid or missing reset token',
			invalidTokenMessage: 'Invalid or missing reset token. Please request a new password reset.',
			backToForgotPassword: 'Back to forgot password',
			success: {
				title: 'Password Reset Successfully!',
				message: 'Your password has been reset. You can now sign in with your new password.',
				loginButton: 'Go to login'
			},
			validation: {
				passwordRequired: 'Password is required',
				passwordMinLength: 'Password must be at least 6 characters',
				confirmPasswordRequired: 'Please confirm your password',
				passwordMismatch: 'Passwords do not match'
			}
		},
		changePassword: {
			title: 'Change Password',
			subtitle: 'Update your account password',
			currentPasswordLabel: 'Current Password',
			currentPasswordPlaceholder: '••••••••',
			newPasswordLabel: 'New Password',
			newPasswordPlaceholder: '••••••••',
			confirmPasswordLabel: 'Confirm New Password',
			confirmPasswordPlaceholder: '••••••••',
			submitButton: 'Update password',
			submitting: 'Updating...',
			backToDashboard: 'Back to dashboard',
			failedToChange: 'Failed to change password',
			success: {
				title: 'Password Changed Successfully!',
				message: 'Your password has been updated. Please use your new password for future logins.',
				dashboardButton: 'Go to dashboard'
			},
			validation: {
				currentPasswordRequired: 'Current password is required',
				newPasswordRequired: 'New password is required',
				newPasswordMinLength: 'Password must be at least 6 characters',
				newPasswordDifferent: 'New password must be different from current password',
				confirmPasswordRequired: 'Please confirm your new password',
				passwordMismatch: 'Passwords do not match'
			}
		}
	},
	errors: {
		failedToLoad: 'Failed to load data',
		somethingWentWrong: 'Something went wrong',
		pageNotFound: 'Page Not Found',
		pageNotFoundDescription: "Sorry, we couldn't find the page you're looking for.",
		serverError: 'Server Error',
		serverErrorDescription: 'Something went wrong on our end. Please try again later.',
		goHome: 'Go to Homepage',
		goBack: 'Go Back'
	},
	home: {
		title: 'Home',
		description: 'Welcome to the application',
		welcome: 'Welcome to Admin Panel',
		subtitle: 'Manage your users and system with ease',
		welcomeBack: 'Welcome back',
		goToUsers: 'Go to Users',
		logout: 'Logout',
		login: 'Login'
	}
};

export type TranslationKey = typeof en;
