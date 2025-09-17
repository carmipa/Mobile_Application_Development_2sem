import React from 'react';
} as any;


const id = await createTask(newTask);
const updated = await listTasks();
setTasks(updated);
setTitle('');
setDescription('');
setDueDate('');
}


async function onToggleCompleted(task: Task) {
    await updateTask(task.id, { completed: !task.completed });
    setTasks(await listTasks());
}


async function onDelete(task: Task) {
    await removeTask(task.id, task.scheduledNotificationId);
    setTasks(await listTasks());
}


return (
    <View style={styles.wrapper}>
        <Text style={styles.title}>Nova tarefa</Text>
        <View style={styles.card}>
            <TextInput value={title} onChangeText={setTitle} placeholder="Título" placeholderTextColor="#9aa3c7" style={styles.input} />
            <TextInput value={description} onChangeText={setDescription} placeholder="Descrição" placeholderTextColor="#9aa3c7" style={styles.input} />
            <TextInput value={dueDate} onChangeText={setDueDate} placeholder="Data ISO (2025-09-10T14:00:00Z)" placeholderTextColor="#9aa3c7" style={styles.input} />
            <Pressable style={styles.primaryBtn} onPress={onAdd}>
                <Text style={styles.primaryBtnText}>Salvar</Text>
            </Pressable>
        </View>


        <Text style={styles.title}>Minhas tarefas</Text>
        <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.task}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <Text style={styles.taskDesc}>{item.description}</Text>
                    <Text style={styles.taskDate}>Vencimento: {item.dueDate}</Text>
                    <View style={styles.row}>
                        <Pressable style={styles.btn} onPress={() => onToggleCompleted(item)}>
                            <Text style={styles.btnText}>{item.completed ? 'Reabrir' : 'Concluir'}</Text>
                        </Pressable>
                        <Pressable style={[styles.btn, styles.danger]} onPress={() => onDelete(item)}>
                            <Text style={styles.btnText}>Excluir</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        />
    </View>
);
}


const styles = StyleSheet.create({
    wrapper: { flex: 1, padding: 12 },
    title: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
    card: { backgroundColor: '#0f1530', padding: 12, borderRadius: 12, gap: 8 },
    input: { backgroundColor: '#12193a', color: '#fff', padding: 10, borderRadius: 8 },
    primaryBtn: { backgroundColor: '#3952e3', padding: 12, borderRadius: 8, alignItems: 'center' },
    primaryBtnText: { color: '#fff', fontWeight: '700' },
    task: { backgroundColor: '#1a1f3d', padding: 12, borderRadius: 10, marginBottom: 8 },
    taskTitle: { color: '#fff', fontWeight: '700' },
    taskDesc: { color: '#b7c2ee' },
    taskDate: { color: '#9aa3c7', marginBottom: 4 },
    row: { flexDirection: 'row', gap: 8 },
    btn: { backgroundColor: '#3952e3', padding: 8, borderRadius: 8 },
    btnText: { color: '#fff' },
    danger: { backgroundColor: '#6a2f42' },
});