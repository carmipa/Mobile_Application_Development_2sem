// Componentes do TanQuery
// é o arquivo que criamos para que a aplicação seja envolvida e tenha acesso ao tanquerry

import {QueryClient, QueryClientProvider as TanstackProvider } from "@tanstack/react-query";

// cria uma instnacia do queryClient (controlar erros, loading )

const queryClient = new QueryClient();

// um componente que ira envolver a aplicação e permitir que qualquer componebte filho acesse o tanquery

export default function queryClientProvider({children}) {
    return (
        <TanstackProvider client={queryClient}>
            {children}
        </TanstackProvider>
    )
}