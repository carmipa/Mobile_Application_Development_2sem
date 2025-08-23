import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setLoading(false);
            if (user) {
                router.replace('/HomeScreen');
            }
        });
        return unsub;
    }, [router]);

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, senha);
            router.replace('/HomeScreen');
        } catch (error: any) {
            console.log("Login error:", error?.code, error?.message);
            switch (error?.code) {
                case "auth/invalid-credential":
                    Alert.alert("Atenção", "Email ou senha incorretos!");
                    break;
                case "auth/network-request-failed":
                    Alert.alert("Sem conexão", "Verifique sua internet e tente novamente.");
                    break;
                case "auth/too-many-requests":
                    Alert.alert("Bloqueado", "Muitas tentativas. Aguarde um pouco e tente novamente.");
                    break;
                default:
                    Alert.alert("Erro", "Não foi possível completar o login.");
            }
        }
    };

    const esquceuSenha = async () => {
        if (!email) {
            Alert.alert("Recuperação", "Digite o e-mail para recuperar a senha.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Recuperação", "Email de recuperação enviado.");
        } catch (error: any) {
            console.log("Reset error:", error?.code, error?.message);
            if (error?.code === "auth/network-request-failed") {
                Alert.alert("Sem conexão", "Conecte-se à internet para enviar o e-mail de recuperação.");
            } else {
                Alert.alert("Erro", "Falha ao enviar email de reset.");
            }
        }
    };

    if (loading) {
        return <View style={styles.container}><Text style={{color:"#fff", textAlign:"center"}}>Carregando...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Realizar login</Text>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <View style={styles.inputWrapper}>
                <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    placeholder="Senha"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    value={senha}
                    onChangeText={setSenha}
                />
                <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(v => !v)}
                    accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                    <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.botao} onPress={handleLogin}>
                <Text style={styles.textoBotao}>Login</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Link href="/CadastrarScreen" style={styles.link}>
                    Cadastre-se
                </Link>
                <Text style={{ marginTop: 30, color: 'white' }} onPress={esquceuSenha}>
                    Esqueceu a senha?
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
    titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 30, textAlign: 'center' },
    input: { backgroundColor: '#1E1E1E', color: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#333' },
    inputWrapper: { position: 'relative', justifyContent: 'center' },
    inputWithIcon: { paddingRight: 48 },
    eyeButton: { position: 'absolute', right: 12, height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
    eyeText: { fontSize: 18, color: '#fff' },
    botao: { backgroundColor: '#00B37E', padding: 15, borderRadius: 10, alignItems: 'center' },
    textoBotao: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    link: { color: 'white', textAlign: 'center', fontSize: 16 },
});
