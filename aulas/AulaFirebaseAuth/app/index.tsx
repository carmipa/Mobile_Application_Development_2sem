import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();


    useEffect(() => {
        const verificarUsuarioLogado = async () => {
            try {
                const usuarioSalvo = await AsyncStorage.getItem("@user");
                if (usuarioSalvo) {
                    router.replace('/HomeScreen'); // já logado -> vai direto pra Home
                }
            } catch (error) {
                console.log("Erro ao verificar o login", error);
            }
        };
        verificarUsuarioLogado();
    }, [router]);

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }
        signInWithEmailAndPassword(auth, email, senha).then(async(userCredential)=>{
            const user = userCredential.user;
            await AsyncStorage.setItem('@user',JSON.stringify(user))
            router.push('/HomeScreen')
        })
            .catch((error) =>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error:", errorMessage)
            })



        // Exemplo simples de login: salve algo representando o usuário logados
        const fakeUser = { email, loggedAt: Date.now() };
        try {
            await AsyncStorage.setItem("@user", JSON.stringify(fakeUser));
            Alert.alert('Sucesso ao logar', 'Usuário logado com sucesso!');
            router.replace('/HomeScreen'); // impede voltar ao login
        } catch (e) {
            console.log('Erro ao salvar usuário:', e);
            Alert.alert('Erro', 'Não foi possível completar o login.');
        }
    };

    const esquceuSenha = () =>{
        if(!email){
            alert("Digite o email para recuperar a senha")
            return
        }
        sendPasswordResetEmail(auth, email)
            .then(()=>{
                alert("Email de recuperação enviado")
            })
            .catch((error)=>{
                console.log("Error",error.message)
                alert("Erro ao enviar email de reset de senha")
            })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Realizar login</Text>

            {/* Email */}
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            {/* Senha com olho mágico */}
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

            {/* Botão Login */}
            <TouchableOpacity style={styles.botao} onPress={handleLogin}>
                <Text style={styles.textoBotao}>Login</Text>
            </TouchableOpacity>

            {/* Cadastre-se centralizado */}
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Link href="/CadastrarScreen" style={styles.link}>
                    Cadastre-se
                </Link>
                <Text style={{marginTop:30, color:'white', marginLeft:10}} onPress={esquceuSenha}>Esqueceu a senha?</Text>
            </View>
        </View>
    );
}

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
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputWithIcon: {
        paddingRight: 48, // espaço para o “olho”
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    eyeText: {
        fontSize: 18,
        color: '#fff',
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
    link: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});
