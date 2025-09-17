import React from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


// Exibe alertas no app quando a notificação dispara
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});


const queryClient = new QueryClient();


export default function AppProviders({ children }: { children: React.ReactNode }) {
    React.useEffect(() => {
        (async () => {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.HIGH,
                    vibrationPattern: [0, 250, 250, 250],
                    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                    lightColor: '#FF231F7C',
                    sound: 'default',
                });
            }
        })();
    }, []);


    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}