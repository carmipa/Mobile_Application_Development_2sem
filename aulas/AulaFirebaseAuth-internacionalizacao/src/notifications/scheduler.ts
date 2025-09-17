// src/notifications/scheduler.ts
import * as Notifications from 'expo-notifications';
import type { Task } from '../types';

/** Converte ISO (YYYY-MM-DDTHH:mm:ssZ) para Date com validação */
export function parseISOToDate(iso: string): Date | null {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
}

/** Agenda notificação para a tarefa (usa description em vez de notes) */
export async function scheduleTaskNotification(task: Pick<Task, 'id' | 'title' | 'description' | 'dueDate'>): Promise<string | undefined> {
    const when = parseISOToDate(task.dueDate);
    if (!when) return undefined;
    if (when.getTime() <= Date.now()) return undefined; // não agenda no passado

    // ⚠️ SDK 53: use DateTriggerInput com { date: Date }
    const notifId = await Notifications.scheduleNotificationAsync({
        content: {
            title: `⏰ ${task.title}`,
            body: task.description || 'Tarefa agendada',
            sound: 'default',
            data: { taskId: task.id },
        },
        trigger: { date: when } as Notifications.DateTriggerInput,
    });

    return notifId;
}

/** Reagenda para um novo ISO */
export async function rescheduleNotification(task: Pick<Task, 'id' | 'title' | 'description' | 'dueDate'>, previousNotificationId?: string) {
    if (previousNotificationId) {
        try { await Notifications.cancelScheduledNotificationAsync(previousNotificationId); } catch {}
    }
    return scheduleTaskNotification(task);
}

/** Cancela por id (silencioso) */
export async function cancelTaskNotification(notificationId?: string) {
    if (!notificationId) return;
    try { await Notifications.cancelScheduledNotificationAsync(notificationId); } catch {}
}
