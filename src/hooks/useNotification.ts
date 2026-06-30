import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { localNotificationService } from '@/services/local-notifications.service';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { notificationsEnabled, toggleNotifications } = useAuth();

  useEffect(() => {
    async function setupNotifications() {
      if (!notificationsEnabled) {
        await localNotificationService.cancelAllNotifications();
        return;
      }

      // 1. Executa a permissão e guarda a resposta (true/false) que seu service retorna
      const hasPermission =
        await localNotificationService.registerForPushNotifications();

      // Se o usuário clicou em RECUSAR na caixinha nativa do celular, Sincroniza o contexto e desliga o switch do perfil na hora!
      if (!hasPermission) {
        await toggleNotifications(false);
        return;
      }

      // 2. Trata o clique caso o app tenha sido aberto do zero através da notificação (App "frio")
      const lastResponse = Notifications.getLastNotificationResponse();

      if (lastResponse) {
        const deepLink =
          lastResponse.notification.request.content.data?.deepLink;

        if (deepLink && typeof deepLink === 'string') {
          Linking.openURL(deepLink);
        }
      }
    }

    // Executa a inicialização de forma limpa
    setupNotifications();

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
  }, [notificationsEnabled]); // Monitora alterações do estado do switch

  return {};
};
