import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';
import { useTheme } from '../src/context/ThemeContext';
import ThemeToggleButton from '../src/components/ThemeToggleButton';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
    // Hook que fornece a função 't' para tradução e 'i18n' para manipulação do idioma
    const { t, i18n } = useTranslation();

    // Estado para rastrear o idioma atual e atualizar a UI dos botões
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    // Função para mudar o idioma
    const mudarIdioma = (lang: string) => {
        i18n.changeLanguage(lang);
        setCurrentLanguage(lang); // Atualiza o estado para refletir a mudança na UI
    };

    // Cores do nosso ThemeContext
    const { colors } = useTheme();

    // Estados para armazenar os valores digitados
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const router = useRouter(); // Hook de navegação..

    const verificarUsuarioLogado = async () => {
        try {
            const usuarioSalvo = await AsyncStorage.getItem('@user');
            if (usuarioSalvo) {
                router.push('/HomeScreen'); // Redireciona para tela HomeScreen(usuario logado)
            }
        } catch (error) {
            console.log('Error ao verificar login', error);
        }
    };

    useEffect(() => {
        verificarUsuarioLogado(); // Chama a função
    }, []);

    // Função para simular o envio do formulário
    const handleLogin = () => {
        if (!email || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }
        // backend do login
        signInWithEmailAndPassword(auth, email, senha)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await AsyncStorage.setItem('@user', JSON.stringify(user));
                router.push('/HomeScreen');
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log('Error:', errorMessage);
                if (error.code === 'auth/invalid-credential') {
                    Alert.alert('Atenção', 'E-mail ou senha incorretos, verifique.');
                }
            });
    };

    const esqueceuSenha = () => {
        if (!email) {
            alert('Digite o e-mail para recuperar a senha');
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Email de recuperação enviado');
            })
            .catch((error) => {
                console.log('Error', error.message);
                alert('Erro ao enviar e-mail de reset de senha');
            });
    };

    // Array de idiomas com cores específicas para cada um
    const languages = [
        { code: 'en', label: 'EN', color: '#4285F4' }, // Azul Padrão
        { code: 'pt', label: 'PT', color: '#0F9D58' }, // Verde
        { code: 'es', label: 'ES', color: '#DB4437' }, // Vermelho
        { code: 'it', label: 'IT', color: '#F4B400' }, // Amarelo
        { code: 'lt', label: 'LT', color: '#E91E63' }, // Rosa / Magenta
        { code: 'pl', label: 'PL', color: '#9C27B0' }, // Roxo
        { code: 'ru', label: 'RU', color: '#FF5722' }, // Laranja Forte
        { code: 'de', label: 'DE', color: '#009688' }, // Ciano Escuro
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.titulo, { color: colors.text }]}>{t('login')}</Text>

            {/* Campo Email */}
            <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.text }]}
                placeholder="E-mail"
                placeholderTextColor={colors.text}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            {/* Campo Senha */}
            <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.text }]}
                placeholder={t('password')}
                placeholderTextColor={colors.text}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />

            {/* Botão de Login */}
            <TouchableOpacity style={styles.botao} onPress={handleLogin}>
                <Text style={styles.textoBotao}>Login</Text>
            </TouchableOpacity>

            {/* Botões de Idioma Estilizados com Cores Dinâmicas */}
            <View style={styles.languageContainer}>
                {languages.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        onPress={() => mudarIdioma(lang.code)}
                        style={[
                            styles.languageButton,
                            { borderColor: colors.text }, // Borda padrão baseada no tema
                            currentLanguage === lang.code && {
                                backgroundColor: lang.color,
                                borderColor: lang.color,
                            }, // Estilo ativo com cor específica
                        ]}
                    >
                        <Text
                            style={[
                                styles.languageButtonText,
                                { color: colors.text },
                                currentLanguage === lang.code && styles.activeLanguageButtonText,
                            ]}
                        >
                            {lang.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ThemeToggleButton />

            <Link href="CadastrarScreen" style={[styles.link, { color: colors.text }]}>
                Cadastre-se
            </Link>

            <Text style={[styles.link, { color: colors.text }]} onPress={esqueceuSenha}>
                Esqueceu a senha?
            </Text>
        </View>
    );
}

// Estilização
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
    },
    botao: {
        backgroundColor: '#00B37E',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    languageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        // ADICIONADO PARA PERMITIR A QUEBRA DE LINHA
        flexWrap: 'wrap',
    },
    languageButton: {
        // AJUSTES NO TAMANHO E ESPAÇAMENTO
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        margin: 4, // Usar margin para espaçamento uniforme
    },
    languageButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeLanguageButtonText: {
        color: '#fff',
    },
    link: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
    },
});

