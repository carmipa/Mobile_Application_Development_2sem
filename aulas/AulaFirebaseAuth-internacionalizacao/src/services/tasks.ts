// src/services/tasks.ts
import { db } from '../firebase/app';
import { Task, TaskDoc } from '../types';
import {
    collection,
    addDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    doc,
    deleteDoc,
} from 'firebase/firestore';

import {
    scheduleTaskNotification,
    cancelTaskNotification,
    rescheduleNotification,
} from '../notifications/scheduler';

import { getNotif, setNotif } from './taskNotifMap';

const COL = 'tasks';

/**
 * Lista tarefas ordenadas por criação (desc).
 */
export async function listTasks(): Promise<Task[]> {
    const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as TaskDoc) }));
}

/**
 * Cria tarefa no Firestore (schema exigido) e agenda notificação local
 * para o dueDate (ISO). O id da notificação é salvo localmente (AsyncStorage).
 */
export async function createTask(input: {
    title: string;
    description: string;
    dueDate: string; // ISO: 'YYYY-MM-DDTHH:mm:ssZ'
}): Promise<string> {
    const base: TaskDoc = {
        title: input.title,
        description: input.description,
        completed: false,
        dueDate: input.dueDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, COL), base);

    // agenda notificação local e persiste o id dela no mapa (somente local)
    const notifId = await scheduleTaskNotification({
        id: ref.id,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
    });
    await setNotif(ref.id, notifId);

    return ref.id;
}

/**
 * Atualiza a tarefa e reprograma a notificação (se aplicável).
 */
export async function updateTask(task: Task): Promise<void> {
    const ref = doc(db, COL, task.id);

    await updateDoc(ref, {
        title: task.title,
        description: task.description,
        completed: task.completed,
        dueDate: task.dueDate,
        updatedAt: serverTimestamp(),
    });

    // reprograma notificação com novo dueDate
    const prev = await getNotif(task.id);
    const next = await rescheduleNotification(
        { id: task.id, title: task.title, description: task.description, dueDate: task.dueDate },
        prev
    );
    await setNotif(task.id, next);
}

/**
 * Alterna completed e cancela/agenda notificação conforme o novo estado.
 */
export async function toggleComplete(task: Task): Promise<void> {
    const ref = doc(db, COL, task.id);
    const completed = !task.completed;

    await updateDoc(ref, { completed, updatedAt: serverTimestamp() });

    const prev = await getNotif(task.id);

    if (completed) {
        // concluída → cancela notificação pendente
        if (prev) await cancelTaskNotification(prev);
        await setNotif(task.id, undefined);
    } else {
        // reaberta → agenda novamente
        const next = await scheduleTaskNotification({
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
        });
        await setNotif(task.id, next);
    }
}

/**
 * Remove tarefa e cancela notificação associada (se houver).
 */
export async function removeTask(id: string): Promise<void> {
    await deleteDoc(doc(db, COL, id));
    const prev = await getNotif(id);
    if (prev) await cancelTaskNotification(prev);
    await setNotif(id, undefined);
}
