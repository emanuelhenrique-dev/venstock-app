import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { localNotificationService } from '@/services/local-notifications.service';

export const useNotifications = () => {
  useEffect(() => {
    // 1. Inicializa as permissões e canais de forma limpa
    localNotificationService.registerForPushNotifications();

    // 2. Trata o clique caso o app tenha sido aberto do zero através da notificação (App "frio")

    const lastResponse = Notifications.getLastNotificationResponse();

    if (lastResponse) {
      const deepLink = lastResponse.notification.request.content.data?.deepLink;

      if (deepLink && typeof deepLink === 'string') {
        Linking.openURL(deepLink);
      }
    }

    // 3. Monitora o clique na notificação enquanto o app está aberto ou em segundo plano
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const deepLink = response.notification.request.content.data?.deepLink;

        if (deepLink && typeof deepLink === 'string') {
          Linking.openURL(deepLink);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return {};
};
