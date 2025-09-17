import { useQuery } from '@tanstack/react-query';


export type WeatherResult = {
    city: string;
    latitude: number;
    longitude: number;
    temperature: number | null; // °C
    windspeed: number | null; // km/h
    timeISO: string | null;
};


async function geocodeCity(city: string): Promise<{ name: string; latitude: number; longitude: number } | null> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.results?.length) return null;
    const r = data.results[0];
    return { name: r.name, latitude: r.latitude, longitude: r.longitude };
}


async function fetchWeather(city: string): Promise<WeatherResult | null> {
    const geo = await geocodeCity(city);
    if (!geo) return null;
    const { latitude, longitude, name } = geo;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const current = data.current || {};
    return {
        city: name,
        latitude,
        longitude,
        temperature: typeof current.temperature_2m === 'number' ? current.temperature_2m : null,
        windspeed: typeof current.wind_speed_10m === 'number' ? current.wind_speed_10m : null,
        timeISO: data?.current?.time ?? null,
    };
}


export function useWeather(city: string) {
    return useQuery({
        queryKey: ['weather', city],
        queryFn: () => fetchWeather(city),
        enabled: city.trim().length > 0,
        staleTime: 1000 * 60 * 5,
    });
}