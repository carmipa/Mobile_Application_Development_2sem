import { useQuery } from '@tanstack/react-query';


export type Quote = { content: string; author: string };


async function fetchRandomQuote(): Promise<Quote | null> {
    const res = await fetch('https://api.quotable.io/random');
    if (!res.ok) return null;
    const data = await res.json();
    return { content: data.content, author: data.author };
}


export function useRandomQuote() {
    return useQuery({
        queryKey: ['quote', 'random'],
        queryFn: fetchRandomQuote,
        staleTime: 1000 * 30,
    });
}