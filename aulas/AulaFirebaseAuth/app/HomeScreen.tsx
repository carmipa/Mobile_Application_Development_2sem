import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const router = useRouter();

    async function handleLogout() {
        console.log("Usuário deslogado");
        await AsyncStorage.removeItem("@user"); // limpa usuário salvo
        router.replace("/"); // volta para index.tsx (Login)
    }

    return (
        <SafeAreaView>
            <Text>Seja Bem-Vindo, você está logado!</Text>
            <Button title="Sair" onPress={handleLogout} />
        </SafeAreaView>
    );
}
