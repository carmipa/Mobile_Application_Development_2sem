export type Task = {
    id: string;
    title: string;
    notes?: string;
    dueDate: string; // formato: YYYY-MM-DD
    dueTime: string; // formato: HH:mm (24h)
    done: boolean;
    scheduledNotificationId?: string; // id retornado pelo Expo Notifications
};