import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';
import { cancelTaskNotification, scheduleTaskNotification } from '../notifications';


const KEY = 'tasks_v1';


export async function loadTasks(): Promise<Task[]> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as Task[];
    } catch {
        return [];
    }
}


export async function saveTasks(tasks: Task[]): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
}


export function parseTaskDateTime(task: Task): Date | null {
// Espera dueDate=YYYY-MM-DD e dueTime=HH:mm
    const iso = `${task.dueDate}T${task.dueTime}:00`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
}


export async function addTask(newTask: Task): Promise<Task[]> {
    const tasks = await loadTasks();
// agenda notificação
    const scheduledNotificationId = await scheduleTaskNotification(newTask);
    const t: Task = { ...newTask, scheduledNotificationId };
    const updated = [t, ...tasks];
    await saveTasks(updated);
    return updated;
}


export async function updateTask(updatedTask: Task): Promise<Task[]> {
    const tasks = await loadTasks();
// reprograma notificação (cancela a antiga e agenda nova)
    if (updatedTask.scheduledNotificationId) {
        await cancelTaskNotification(updatedTask.scheduledNotificationId);
    }
    const newNotifId = await scheduleTaskNotification(updatedTask);
    const mapped = tasks.map((t) => (t.id === updatedTask.id ? { ...updatedTask, scheduledNotificationId: newNotifId } : t));
    await saveTasks(mapped);
    return mapped;
}


export async function removeTask(taskId: string): Promise<Task[]> {
    const tasks = await loadTasks();
    const found = tasks.find((t) => t.id === taskId);
    if (found?.scheduledNotificationId) {
        await cancelTaskNotification(found.scheduledNotificationId);
    }
    const filtered = tasks.filter((t) => t.id !== taskId);
    await saveTasks(filtered);
    return filtered;
}


export async function toggleDone(taskId: string): Promise<Task[]> {
    const tasks = await loadTasks();
    const updated = await Promise.all(
        tasks.map(async (t) => {
            if (t.id !== taskId) return t;
            const done = !t.done;
            if (done && t.scheduledNotificationId) {
// concluída antes do horário: cancela notificação
                await cancelTaskNotification(t.scheduledNotificationId);
                return { ...t, done, scheduledNotificationId: undefined };
            }
// re-agenda se desmarcar concluída
            if (!done) {
                const newId = await scheduleTaskNotification(t);
                return { ...t, done, scheduledNotificationId: newId };
            }
            return { ...t, done };
        })
    );
    await saveTasks(updated);
    return updated;
}