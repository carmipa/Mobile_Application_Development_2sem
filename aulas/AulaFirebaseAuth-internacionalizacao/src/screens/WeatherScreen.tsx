import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useWeather } from '../api/weather';


export default function WeatherScreen() {
    const [city, setCity] = React.useState('São Paulo');
    const { data, isFetching, refetch } = useWeather(city);


    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Clima (Open‑Meteo via TanStack Query)</Text>


            <View style={styles.row}>
                <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Cidade" placeholderTextColor="#9aa3c7" />
                <Pressable style={styles.btn} onPress={() => refetch()}>
                    <Text style={styles.btnText}>Buscar</Text>
                </Pressable>
            </View>


            {isFetching ? (
                <ActivityIndicator />
            ) : data ? (
                <View style={styles.card}>
                    <Text style={styles.city}>{data.city}</Text>
                    <Text style={styles.line}>Temperatura: {data.temperature ?? '—'} °C</Text>
                    <Text style={styles.line}>Vento: {data.windspeed ?? '—'} km/h</Text>
                    <Text style={styles.line}>Atualizado: {data.timeISO ?? '—'}</Text>
                </View>
            ) : (
                <Text style={styles.subtitle}>Nenhum dado</Text>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    title: { color: '#e7ebff', fontSize: 16, fontWeight: '700', marginVertical: 8, marginLeft: 4 },
    row: { flexDirection: 'row', gap: 8 },
    input: { flex: 1, backgroundColor: '#12193a', color: '#e7ebff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#26305f' },
    btn: { backgroundColor: '#3952e3', borderRadius: 10, paddingHorizontal: 12, justifyContent: 'center' },
    btnText: { color: '#fff', fontWeight: '700' },
    card: { backgroundColor: '#0f1530', borderColor: '#2a315a', borderWidth: 1, borderRadius: 12, padding: 12, gap: 4, marginTop: 12 },
    city: { color: '#e7ebff', fontWeight: '800', fontSize: 16 },
    line: { color: '#cdd6ff' },
    subtitle: { color: '#9aa3c7', marginTop: 12 },
});