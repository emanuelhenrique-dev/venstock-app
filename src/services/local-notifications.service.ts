import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

const DEFAULT_CHANNEL = 'default';

const NOTIFICATION_IDS = {
  CART_REMINDER: 'cart-reminder'
};

// Configura como as notificações se comportam com o app ABERTO
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true
  })
});

const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL, {
      name: 'Notificações do Venstock',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    });
  }
};

const registerForPushNotifications = async () => {
  await setupNotificationChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Aviso',
      'As notificações estão desativadas. Você pode ativá-las nas configurações do celular para receber alertas importantes.'
    );
    return false;
  }

  return true;
};

interface ScheduleCartReminderInterface {
  productName: string;
  quantity: number;
  delayMinutes: number;
}

const scheduleCartReminder = async ({
  productName,
  quantity,
  delayMinutes
}: ScheduleCartReminderInterface) => {
  // Cancela o lembrete anterior para não acumular
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.CART_REMINDER
  );

  // Monta o texto dependendo de quantos itens adicionais existem
  let notificationBody = `"${productName}" está no carrinho. Volte para finalizar!`;

  if (quantity === 1) {
    notificationBody = `"${productName}" e mais 1 item estão no carrinho. Volte para finalizar!`;
  } else if (quantity > 1) {
    notificationBody = `"${productName}" e mais ${quantity} itens estão no carrinho. Volte para finalizar!`;
  }

  const notification = await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.CART_REMINDER,
    content: {
      title: '🛒 Existem items no seu carrinho!',
      body: notificationBody,
      data: {
        type: 'cart_reminder'
      },
      sound: true
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
      repeats: false
    }
  });

  return notification;
};

// Cancela o lembrete (quando ele esvaziar ou finalizar o carrinho)
const cancelCartReminder = async () => {
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.CART_REMINDER
  );
};

export const localNotificationService = {
  registerForPushNotifications,
  scheduleCartReminder,
  cancelCartReminder
};
