import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AlterarSenhaScreen() {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');

    const router = useRouter();

    const handleAlterarSenha = async () => {
        // validações básicas
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }
        if (novaSenha.length < 6) {
            Alert.alert('Atenção', 'A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            Alert.alert('Atenção', 'A confirmação não confere com a nova senha.');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                Alert.alert('Erro', 'Nenhum usuário está logado.');
                return;
            }

            // Reautenticar com a senha atual
            const credential = EmailAuthProvider.credential(user.email, senhaAtual);
            await reauthenticateWithCredential(user, credential);

            // Atualizar senha
            await updatePassword(user, novaSenha);

            // (Opcional) Guardar um marcador local
            await AsyncStorage.setItem('@lastPasswordChange', new Date().toISOString());

            Alert.alert('Sucesso', 'Senha alterada com sucesso!');
            router.push('/HomeScreen');
        } catch (error: any) {
            // Mapeamento simples de erros comuns do Firebase
            const code = error?.code ?? '';
            let msg = error?.message ?? 'Falha ao alterar a senha.';

            if (code === 'auth/wrong-password') {
                msg = 'Senha atual incorreta.';
            } else if (code === 'auth/too-many-requests') {
                msg = 'Muitas tentativas. Tente novamente mais tarde.';
            } else if (code === 'auth/weak-password') {
                msg = 'A nova senha é muito fraca.';
            } else if (code === 'auth/requires-recent-login') {
                msg = 'Por segurança, faça login novamente e tente de novo.';
            }

            Alert.alert('Erro', msg);
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Alterar Senha</Text>

            <TextInput
                style={styles.input}
                placeholder="Digite a senha atual"
                placeholderTextColor="#aaa"
                secureTextEntry
                autoCapitalize="none"
                value={senhaAtual}
                onChangeText={setSenhaAtual}
            />

            <TextInput
                style={styles.input}
                placeholder="Digite a nova senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                autoCapitalize="none"
                value={novaSenha}
                onChangeText={setNovaSenha}
            />

            <TextInput
                style={styles.input}
                placeholder="Repita a nova senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                autoCapitalize="none"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
            />

            <TouchableOpacity style={styles.botao} onPress={handleAlterarSenha}>
                <Text style={styles.textoBotao}>Confirmar</Text>
            </TouchableOpacity>
        </View>
    );
}

// Estilização
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        padding: 20,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#1E1E1E',
        color: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    botao: {
        backgroundColor: '#00B37E',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    textoBotao: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
