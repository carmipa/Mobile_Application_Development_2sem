import { db } from './app';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Task } from '../types';
import { cancelTaskNotification, scheduleTaskNotification } from '../notifications';


const COL = 'tasks';


export async function listTasks(): Promise<Task[]> {
    const snap = await getDocs(collection(db, COL));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Task) }));
}


export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const scheduledNotificationId = await scheduleTaskNotification(data as Task);
    const ref = await addDoc(collection(db, COL), {
        ...data,
        scheduledNotificationId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
}


export async function updateTask(id: string, data: Partial<Task>) {
    if (data.scheduledNotificationId) {
        await cancelTaskNotification(data.scheduledNotificationId);
    }
    await updateDoc(doc(db, COL, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}


export async function removeTask(id: string, scheduledNotificationId?: string) {
    if (scheduledNotificationId) {
        await cancelTaskNotification(scheduledNotificationId);
    }
    await deleteDoc(doc(db, COL, id));
}