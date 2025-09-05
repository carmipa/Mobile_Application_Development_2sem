import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword,sendPasswordResetEmail } from 'firebase/auth';
import {auth} from '../services/firebaseConfig'


export default function LoginScreen() {
  // Estados para armazenar os valores digitados

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter()//Hook de navegação..

  const verificarUsuarioLogado = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem("@user")
      if (usuarioSalvo) {
        router.push('/HomeScreen')//Redireciona para tela HomeScreen(usuario logado)
      }

    } catch (error) {
      console.log("Error ao verificar login", error)
    }
  }

  useEffect(() => {
    verificarUsuarioLogado()//Chama a função
  }, [])

  // Função para simular o envio do formulário
  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    //backend do login
    signInWithEmailAndPassword(auth, email, senha)
      .then(async(userCredential) => {
      const user = userCredential.user;
      await AsyncStorage.setItem('@user',JSON.stringify(user))
      router.push('/HomeScreen')
    
  })
      .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error:",errorMessage)
      if(error.code==="auth/invalid-credential"){
        Alert.alert("Atenção","E-mail ou senha incorretos, verifique.")
      }
  });
  };

  const esqueceuSenha = () =>{
    if(!email){
      alert("Digite o e-mail para recuperar a senha")
      return
    }
    sendPasswordResetEmail(auth,email)
      .then(()=>{
        alert("Email de recuperação enviado")
      })
      .catch((error)=>{
        console.log("Error",error.message)
        alert("Erro ao enviar e-mail de reset de senha")
      })

  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Realizar login</Text>


      {/* Campo Email */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão */}
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Login</Text>
      </TouchableOpacity>

      <Link href="CadastrarScreen" style={{ marginTop: 20, color: 'white', marginLeft: 150 }}>Cadastre-se</Link>

      <Text style={{ marginTop: 20, color: 'white', marginLeft: 130 }} onPress={esqueceuSenha}>Esquece a senha</Text>
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
