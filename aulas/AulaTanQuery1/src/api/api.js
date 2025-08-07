import axios from "axios";

export const fetchUsers = async ()=>{
    const response = await axios.get("https://6893f9a8be3700414e11a988.mockapi.io/users")

    return response.data // retorna os dados {uma array de users}
}