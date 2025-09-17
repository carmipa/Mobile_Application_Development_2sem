import { Timestamp } from 'firebase/firestore';


export type Task = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string; // ISO: "2025-09-10T14:00:00Z"
    createdAt: Timestamp;
    updatedAt: Timestamp;
    scheduledNotificationId?: string;
};