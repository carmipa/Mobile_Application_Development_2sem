import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Image } from "react-native";
import { useQuery, useMutation } from '@tanstack/react-query' //hook para fazer queries
import { fetchUsers, createUser } from "./api/api.js" // função de requisição
import { SafeAreaView} from "react-native-safe-area-context";

export default function HomeScreen(){
    const{data, isLoading, isError, error, isFetching, refetch} = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers
    })

    // criando mutation para enviar um novo usuário
    const mutation = useMutation({
        mutationFn:createUser,
        onSuccess:()=>refetch() // atualiza a lista após a criação do usuário
    })

    // usuario a ser enviado
    const newUser = {
        name: "Gundam",
        avatar: "https://upload.wikimedia.org/wikipedia/en/d/d6/RX-78-2_Gundam_illustration.gif"
    }

    //exibe um spinner durante o carregamento dos dados
    if(isLoading){
        return <ActivityIndicator size='large' style={styles.center} />
    }

    // mostra mensagem no cenário de error

    if (isError){
        return(
            <View style={styles.center}>
                <Text>Erro:{error.message}</Text>
            </View>
        )
    }

    return(
       <SafeAreaView>
            <Button
                title={mutation.isPending?"Criando usuário..." : "Criar novo usuário"}
                onPress={()=>mutation.mutate(newUser)} // envio newuser para api
            />
            <FlatList
                data={data}
                refreshing={isFetching} // mostrar o spinner durante o refect
                onRefresh={refetch} // chamada automatica do refct atualização
                renderItem={({item})=>(
                    <View style={styles.item}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <Text style={styles.title}>{item.name}</Text>
                    </View>
                )}
            />
           {console.log(data)}
       </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    center:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item:{
        padding:16,
        borderBottomWidth:1,
        borderBottomColor:`#ccc`
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#eee'
    },
    title:{
        fontWeight:'bold',
        marginBottom:4
    }

})