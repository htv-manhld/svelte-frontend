export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
	id: string;
	type: NotificationType;
	message: string;
	duration?: number;
}

class NotificationStore {
	notifications = $state<Notification[]>([]);

	show(message: string, type: NotificationType = 'info', duration: number = 3000) {
		const id = Math.random().toString(36).substring(2, 9);
		const notification: Notification = { id, message, type, duration };

		this.notifications.push(notification);

		if (duration > 0) {
			setTimeout(() => {
				this.remove(id);
			}, duration);
		}
	}

	success(message: string, duration?: number) {
		this.show(message, 'success', duration);
	}

	error(message: string, duration?: number) {
		this.show(message, 'error', duration);
	}

	info(message: string, duration?: number) {
		this.show(message, 'info', duration);
	}

	warning(message: string, duration?: number) {
		this.show(message, 'warning', duration);
	}

	remove(id: string) {
		this.notifications = this.notifications.filter((n) => n.id !== id);
	}

	clear() {
		this.notifications = [];
	}
}

export const notificationStore = new NotificationStore();
