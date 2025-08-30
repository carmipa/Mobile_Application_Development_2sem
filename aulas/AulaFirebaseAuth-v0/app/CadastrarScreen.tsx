import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useRouter } from 'expo-router';

export default function CadastroScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) router.replace('/HomeScreen');
        });
        return unsub;
    }, [router]);

    const handleCadastro = async () => {
        if (!nome || !email || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, senha);
            Alert.alert("Sucesso", "Usuário cadastrado!");
            router.replace('/HomeScreen');
        } catch (error: any) {
            console.log("Cadastro error:", error?.code, error?.message);
            switch (error?.code) {
                case "auth/email-already-in-use":
                    Alert.alert("Erro", "E-mail já está em uso.");
                    break;
                case "auth/invalid-email":
                    Alert.alert("Erro", "E-mail inválido.");
                    break;
                case "auth/weak-password":
                    Alert.alert("Erro", "Senha muito fraca (mín. 6 caracteres).");
                    break;
                case "auth/network-request-failed":
                    Alert.alert("Sem conexão", "Verifique sua internet e tente novamente.");
                    break;
                default:
                    Alert.alert("Erro", "Usuário não cadastrado.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Criar Conta</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#aaa"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />

            <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
                <Text style={styles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
    titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 30, textAlign: 'center' },
    input: { backgroundColor: '#1E1E1E', color: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#333' },
    botao: { backgroundColor: '#00B37E', padding: 15, borderRadius: 10, alignItems: 'center' },
    textoBotao: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
