// Componentes do TanQuery

import {QueryCliente, QueryClientProvider as TanstackProvider } from "./QueryCliente.js";

// cria uma instnacia do queryClient (controlar erros, loading )

const queryClient = new QueryCliente();

// um componente que ira envolver a aplicação e permitir que qualquer componebte filho acesse o tanquery

export default function queryClientProvider({children}) {
    return (
        <TanstackProvider client={queryClient}>
            {children}
        </TanstackProvider>
    )
}