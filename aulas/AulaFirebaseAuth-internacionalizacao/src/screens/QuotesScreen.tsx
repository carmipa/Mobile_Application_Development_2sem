import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRandomQuote } from '../api/quotes';


export default function QuotesScreen() {
    const { data, isFetching, refetch } = useRandomQuote();


    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Frase aleatória (Quotable + TanStack Query)</Text>


            {isFetching ? (
                <ActivityIndicator />
            ) : data ? (
                <View style={styles.card}>
                    <Text style={styles.quote}>“{data.content}”</Text>
                    <Text style={styles.author}>— {data.author}</Text>
                </View>
            ) : (
                <Text style={styles.subtitle}>Sem frases carregadas</Text>
            )}


            <Pressable style={styles.btn} onPress={() => refetch()}>
                <Text style={styles.btnText}>Outra frase</Text>
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    title: { color: '#e7ebff', fontSize: 16, fontWeight: '700', marginVertical: 8, marginLeft: 4 },
    card: { backgroundColor: '#0f1530', borderColor: '#2a315a', borderWidth: 1, borderRadius: 12, padding: 12, gap: 8, marginTop: 8 },
    quote: { color: '#e7ebff', fontSize: 16, fontStyle: 'italic' },
    author: { color: '#b7c2ee', textAlign: 'right' },
    subtitle: { color: '#9aa3c7', marginTop: 12 },
    btn: { backgroundColor: '#3952e3', marginTop: 12, alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
    btnText: { color: '#fff', fontWeight: '700' },
});