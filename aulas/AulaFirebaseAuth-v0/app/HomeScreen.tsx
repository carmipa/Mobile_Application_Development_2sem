import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, View, Modal, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
<<<<<<< HEAD
import { auth } from '../services/firebaseConfig';
import { deleteUser, signOut, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
=======
import ItemLoja from "../components/ItemLoja";

import {Alert} from "react-native";
import { auth} from '../services/firebaseConfig'
import {deleteUser } from "firebase/auth"
>>>>>>> 85c02a77da80d99d06573ae0aca43f0d21280e1c

export default function HomeScreen() {
    const router = useRouter();
    const [senhaAtual, setSenhaAtual] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) router.replace("/");
        });
        return unsub;
    }, [router]);

    async function handleLogout() {
        try {
            await signOut(auth);
            router.replace("/");
        } catch (e) {
            console.log("Erro ao sair:", (e as any)?.code, (e as any)?.message);
            Alert.alert("Erro", "Não foi possível sair.");
        }
    }

    const confirmarExclusao = async () => {
        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                Alert.alert("Sessão expirada", "Faça login novamente.");
                return;
            }
            if (!senhaAtual) {
                Alert.alert("Atenção", "Informe sua senha atual para confirmar.");
                return;
            }
            const cred = EmailAuthProvider.credential(user.email, senhaAtual);
            await reauthenticateWithCredential(user, cred);
            await deleteUser(user);
            Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso!");
            setShowDeleteModal(false);
            router.replace("/");
        } catch (error: any) {
            console.log("Excluir error:", error?.code, error?.message);
            switch (error?.code) {
                case "auth/wrong-password":
                    Alert.alert("Erro", "Senha incorreta.");
                    break;
                case "auth/requires-recent-login":
                    Alert.alert("Segurança", "Faça login novamente.");
                    router.replace("/");
                    break;
                case "auth/network-request-failed":
                    Alert.alert("Sem conexão", "Conecte-se à internet para excluir a conta.");
                    break;
                default:
                    Alert.alert("Erro", "Não foi possível excluir a conta.");
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
            <Text>Seja Bem-Vindo, você está logado!</Text>
            <Button title="Sair" onPress={handleLogout} />
            <Button title="Excluir Conta" color="red" onPress={() => setShowDeleteModal(true)} />
            <Button title="Alterar Senha" color="orange" onPress={() => router.push('/AlterarSenhaScreen')} />

            <Modal visible={showDeleteModal} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                        <Text style={styles.modalMsg}>Digite sua senha atual para confirmar a exclusão definitiva.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Senha atual"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            autoCapitalize="none"
                            value={senhaAtual}
                            onChangeText={setSenhaAtual}
                        />
                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <Button title="Cancelar" onPress={() => { setShowDeleteModal(false); setSenhaAtual(""); }} />
                            <Button title="Excluir" color="red" onPress={confirmarExclusao} />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", padding: 16 },
    modalCard: { width: "100%", backgroundColor: "#1E1E1E", borderRadius: 12, padding: 20 },
    modalTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    modalMsg: { color: "#ddd", marginBottom: 12 },
    input: { backgroundColor: "#2A2A2A", color: "#fff", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#333", marginBottom: 14 },
});
