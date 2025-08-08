import axios from "axios";

// função para receber os dados (uauário)
export const fetchUsers = async ()=>{
    const response = await axios.get("https://6893f9a8be3700414e11a988.mockapi.io/users")

    return response.data // retorna os dados {uma array de users}
}

// função para enmviar um novo usuário
export const createUser = async (newUser)=>{
    const response =await axios.post("https://6893f9a8be3700414e11a988.mockapi.io/users", newUser)
    return response.data
}