import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useRouter } from 'expo-router';

export default function AlterarSenhaScreen() {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAlterarSenha = async () => {
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
            setLoading(true);
            const user = auth.currentUser;
            if (!user || !user.email) {
                Alert.alert('Sessão expirada', 'Faça login novamente.');
                router.replace('/');
                return;
            }

            const credential = EmailAuthProvider.credential(user.email, senhaAtual);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, novaSenha);

            Alert.alert('Sucesso', 'Senha alterada com sucesso!');
            router.back();
        } catch (error: any) {
            const code = error?.code ?? '';
            console.log("Alterar senha error:", code, error?.message);
            switch (code) {
                case 'auth/wrong-password':
                    Alert.alert('Erro', 'Senha atual incorreta.');
                    break;
                case 'auth/too-many-requests':
                    Alert.alert('Erro', 'Muitas tentativas. Tente novamente mais tarde.');
                    break;
                case 'auth/weak-password':
                    Alert.alert('Erro', 'A nova senha é muito fraca.');
                    break;
                case 'auth/requires-recent-login':
                    Alert.alert('Segurança', 'Faça login novamente para alterar a senha.');
                    router.replace('/');
                    break;
                case 'auth/network-request-failed':
                    Alert.alert('Sem conexão', 'Conecte-se à internet para alterar a senha.');
                    break;
                default:
                    Alert.alert('Erro', 'Não foi possível alterar a senha.');
            }
        } finally {
            setLoading(false);
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

            <TouchableOpacity style={styles.botao} onPress={handleAlterarSenha} disabled={loading}>
                <Text style={styles.textoBotao}>{loading ? "Alterando..." : "Alterar Senha"}</Text>
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
