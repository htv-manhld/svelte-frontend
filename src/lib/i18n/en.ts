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
	errors: {
		failedToLoad: 'Failed to load data',
		somethingWentWrong: 'Something went wrong',
		pageNotFound: 'Page Not Found',
		pageNotFoundDescription: "Sorry, we couldn't find the page you're looking for.",
		serverError: 'Server Error',
		serverErrorDescription: 'Something went wrong on our end. Please try again later.',
		goHome: 'Go to Homepage',
		goBack: 'Go Back'
	}
};

export type TranslationKey = typeof en;
