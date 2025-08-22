import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import ItemLoja from "../components/ItemLoja";

import {Alert} from "react-native";
import { auth} from '../services/firebaseConfig'
import {deleteUser } from "firebase/auth"

export default function HomeScreen() {
    const router = useRouter();

    async function handleLogout() {
        console.log("Usuário deslogado");
        await AsyncStorage.removeItem("@user"); // limpa usuário salvo
        router.replace("/"); // volta para index.tsx (Login)
    }

    const excluirConta =() =>{
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita!",
            [
                {
                    text:"Cancelar",
                    style:"cancel"
                },
                {
                    text:"Excluir", style:"destructive",
                    onPress:async()=>{
                        try{
                            const user = auth.currentUser
                            if(user){
                                await deleteUser(user)
                                await AsyncStorage.removeItem("@user")
                                Alert.alert("Conta excluida", "Sua conta foi excluida com sucesso!")
                                router.replace("/") // redireciona opara liogin

                            }else{
                                Alert.alert("Nenhum usuário logado")
                            }
                        }catch(error){
                            console.log("Erro ao exluir a conta!")
                            Alert.alert("Error", "Não foi possível excluir a conta")
                        }
                    }
                }

            ]
        )
    }

    return (
        <SafeAreaView>
            <Text>Seja Bem-Vindo, você está logado!</Text>
            <Button title="Sair" onPress={handleLogout} />
            <Button title="excluirConta" color="red" onPress={excluirConta} />
        </SafeAreaView>
    );
}
