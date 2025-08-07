import {View, Text, StyleSheet, FlatList, ActivityIndicator} from "react-native";
import {useQuery} from '@tanstack/react-query' //hook para fazer queries
import {fetchUsers} from "../api/api.js" // função de requisição

export default function HomeScreen(){
    const{data, isLoading, isError, error} = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers
    })

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
        <FlatList
            data={data}
            renderItem={({item})=>(
                <View style={styles.item}>
                    <Text style={styles.title}>{item.name}</Text>
                </View>
            )}
        />
    )
}