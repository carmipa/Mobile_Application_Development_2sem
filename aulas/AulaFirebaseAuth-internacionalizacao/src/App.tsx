import React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native';
import AppProviders from './src/AppProviders';
import TasksScreen from './src/screens/TasksScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import QuotesScreen from './src/screens/QuotesScreen';


export default function App() {
    const [tab, setTab] = React.useState<'tasks' | 'weather' | 'quotes'>('tasks');


    return (
        <AppProviders>
            <SafeAreaView style={styles.container}>
                <Text style={styles.header}>Demo — Tarefas + Notificações & TanStack Query</Text>


                <View style={styles.tabs}>
                    <TabButton label="Tarefas" active={tab === 'tasks'} onPress={() => setTab('tasks')} />
                    <TabButton label="Clima" active={tab === 'weather'} onPress={() => setTab('weather')} />
                    <TabButton label="Frases" active={tab === 'quotes'} onPress={() => setTab('quotes')} />
                </View>


                <View style={styles.content}>
                    {tab === 'tasks' && <TasksScreen />}
                    {tab === 'weather' && <WeatherScreen />}
                    {tab === 'quotes' && <QuotesScreen />}
                </View>
            </SafeAreaView>
        </AppProviders>
    );
}


function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0b1020' },
    header: { color: '#fff', fontSize: 18, fontWeight: '700', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
    tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
    tabBtn: { flex: 1, backgroundColor: '#161b2e', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#1f2540' },
    tabBtnActive: { backgroundColor: '#2a315a', borderColor: '#3d4582' },
    tabText: { color: '#9aa3c7', fontWeight: '600' },
    tabTextActive: { color: '#e7ebff' },
    content: { flex: 1, padding: 12 },
});